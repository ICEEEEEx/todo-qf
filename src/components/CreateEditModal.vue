<template>
  <div>
    <b-modal
        centered
        hide-header
        id="edit-create-modal"
        :ok-title="modalSuccessButtonText"
        :cancel-variant="'danger'"
        @ok="saveToDo"
        @cancel="clearToDoInfo"
    >
      <b-form-group label="Title" class="mb-3">
        <b-form-input v-model="localEditObject.name" placeholder="Task title goes here"></b-form-input>
      </b-form-group>

      <b-form-group label="Content" class="mb-3">
        <b-form-input v-model="localEditObject.content" placeholder="Task content goes here"></b-form-input>
      </b-form-group>

      <b-form-group label="Due Date" class="mb-3">
        <b-form-datepicker v-model="localEditObject.dueDate" class="mb-2" value-as-date></b-form-datepicker>
      </b-form-group>

      <b-form-group label="Attachment" v-if="localEditObject.attachment">
        <b-link :href="localEditObject.attachment._url">
          {{ localEditObject.attachment._name | splitAtUnderscore}}
        </b-link>
        <b-link>
          <b-icon-x-lg class="pl-1 pr-2" variant="danger" @click="openDeleteAttachmentModal(localEditObject)"></b-icon-x-lg>
        </b-link>
      </b-form-group>

      <b-form-group v-else label="Upload file here">
        <b-form-file v-model="localEditObject.attachment" id="attachmentUpload"></b-form-file>
      </b-form-group>

      <b-form-group>
        <b-form-checkbox v-model="localEditObject.status">
          <span class="pl-2">Check this if the task is done</span>
        </b-form-checkbox>
      </b-form-group>
    </b-modal>

  </div>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
moment().format();

export default {
  data() {
    return {
      localEditObject: {
        name: '',
        content: '',
        status: false,
        dueDate: null,
        id: null,
        attachment: null,
      },

      attachmentToDelete: {},
      originalTodo: {},
    };
  },
  computed: {
    modalSuccessButtonText(){
      return this.localEditObject.id ? 'Edit ToDo' : 'Save ToDo';
    }
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    editObject: {
      type: Object,
      default() {
        return {
          name: '',
          content: '',
          status: false,
          dueDate: null,
          id: null,
        };
      },
    },
  },
  watch: {
    editObject: {
      immediate: true,
      deep: true,
      handler(newValue) {
        // Sync the props to the local data
        this.localEditObject = { ...newValue };
        console.log("Passed object to edit to Modal: ", newValue);
      },
    },
  },
  methods: {
    saveToDo() {
      const ToDo = Parse.Object.extend('ToDo');
      const newTask = new ToDo();

      if (this.localEditObject.id) {
        newTask.set('id', this.localEditObject.id);
      }

      let userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: this.userId,
      };
      newTask.set('owner', userPointer);
      newTask.set('name', this.localEditObject.name);
      newTask.set('content', this.localEditObject.content);
      newTask.set('dueDate', new Date(this.localEditObject.dueDate));

      newTask.set('status', this.localEditObject.status ? true : false);

      if (this.localEditObject.attachment) {
        let parseFile = new Parse.File('todoFile', this.localEditObject.attachment);
        newTask.set('attachment', parseFile);
      }

      newTask
          .save()
          .then((response) => {
            console.log('Task saved successfully!', response);
            this.clearToDoInfo();
            // this.fetchToDos();
            this.$bvModal.hide('edit-create-modal');
            this.$toast.success('New task created successfully', {
              position: 'top-right',
              timeout: 2500,
            });


            this.$emit('saved', newTask);


          })
          .catch((error) => {
            this.$toast.error('Error while creating task', {
              position: 'top-right',
              timeout: 2500,
            });
            console.error('Error while saving task', error);
          });
    },
    openDeleteAttachmentModal(attachmentObj){
      // pass current object through () to know what to delete.
      this.attachmentToDelete = attachmentObj
      this.$bvModal.show("delete-attachment-modal");
      console.log(this.attachmentToDelete)
    },
    deleteAttachment(){
      console.log('"deleting"')

      let deletion = this.attachmentToDelete;
      deletion.set("attachment", null)
      deletion.save().then(() => {
        this.fetchToDos();
        this.$toast("Attachment deleted successfully.", {
          position: "top-right",
          timeout: 2500,
        });
        deletion = null;
        this.attachmentToDelete = null;


      }).catch((error) => {
        this.$toast.error("Error while deleting attachment ", {
          position: "top-right",
          timeout: 2500,
        });
        console.error("Error while deleting task", error);

      });
    },


    clearToDoInfo() {
      this.localEditObject = {
        name: '',
        content: '',
        dueDate: null,
        status: false,
        id: null,
        attachment: null,
      };
      this.originalTodo = {};
    },


  },
};
</script>
