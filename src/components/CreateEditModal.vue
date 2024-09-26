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

      <b-form-group label="Attachment" v-if="this.originalAttachment">
        <b-link :href="localEditObject.attachment._url">
          {{ localEditObject.attachment.name() | splitAtUnderscore}}
        </b-link>
        <b-link>
          <b-icon-x-lg class="pl-1 pr-2" variant="danger" @click="deleteAttachment(localEditObject)"></b-icon-x-lg>
        </b-link>
      </b-form-group>

      <b-form-group v-else label="Upload file here">
        <b-form-file v-model="modalFile"></b-form-file>
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
      originalTodo: {},
      attachmentToDelete: {},
      originalAttachment: null,

      modalFile: null,

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
          attachment: null,
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
        this.originalAttachment = this.localEditObject.attachment; // set original attachment (later check if it is set or not)
        // if (this.originalAttachment === undefined){
        //   this.originalAttachment = null;
        // }
            console.log("Passed object to edit to Modal: ", newValue,);
            console.log("passed attachment: ", this.originalAttachment)
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

      if (this.originalAttachment === null || this.originalAttachment === undefined ) {
        let parseFile = new Parse.File('todoFile', this.modalFile);
        newTask.set('attachment', parseFile);

      }

      newTask.save().then((response) => {
            console.log('Task saved successfully!', response);
            this.clearToDoInfo();
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

    deleteAttachment(object) {
      const ToDo = Parse.Object.extend('ToDo');
      const query = new Parse.Query(ToDo);

      query.get(object.id).then((objDelete) => {
        let isConfirmed;

        this.$bvModal.msgBoxConfirm("Are you sure you want to delete the attachment?")
            .then((value) => {
              isConfirmed = value;

              if (isConfirmed === true) {
                console.log('"deleting"');
                objDelete.set('attachment', null); // Set the attachment field to null

                objDelete.save().then(() => {
                  this.$toast("Attachment deleted successfully.", {
                    position: "top-right",
                    timeout: 2500,
                  });
                  this.$emit('saved');
                }).catch((error) => {
                  this.$toast.error("Error while deleting attachment", {
                    position: "top-right",
                    timeout: 2500,
                  });
                  console.error("Error while deleting attachment", error);
                });
              }
            });
      }).catch((error) => {
        console.error('Error retrieving the task object:', error);
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
      this.originalAttachment = null;
      this.modalFile = null;
    },


  },
};
</script>
