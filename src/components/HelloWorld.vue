<template>
  <b-container>
    <div class="row justify-content-evenly">
      <h1>All of your tasks</h1>

      <!--BUTTONS-->
      <b-row class="mb-3 border-bottom pb-3">
        <b-col>
          <div class="d-flex justify-content-between">
            <b-button variant="outline-success" @click="openCreateModal">Create a new ToDo</b-button>

            <b-button variant="outline-danger" @click="logOutFunction">Log Out</b-button>
          </div>
        </b-col>
      </b-row>
      <!--END OF BUTTONS-->

      <!--TASKS-->
      <b-row>
        <!-- OPEN TASKS -->
        <b-col>
          <b-list-group>
            <h3>Uncompleted Tasks</h3>
            <b-list-group-item class="" v-for="(constructedItem) in uncompleted" :key="constructedItem.id">
              <b-row>
                <b-col class="d-flex justify-content-start pl-2">
                  <b-form-checkbox
                      class=""
                      v-model="constructedItem.status"
                      name="check-button" switch
                      @change="updateToDo(constructedItem)"
                  ></b-form-checkbox>
                </b-col>
                <b-col>
                  <span>{{ constructedItem.name }}</span>
                </b-col>

                <b-col class="d-flex justify-content-end">
                  <b-link v-if="constructedItem.originalTodo.attributes.attachment" :href="constructedItem.originalTodo.attributes.attachment._url">
                    <b-icon-link45deg class="pl-1 pr-2"></b-icon-link45deg>
                  </b-link>
                  <b-link @click="openEditModal(constructedItem)">
                    <b-icon-pencil-square class=""></b-icon-pencil-square>
                  </b-link>
                  <b-link @click="openDeleteModal(constructedItem.originalTodo)">
                    <b-icon-trash class="pl-1 pr-2"></b-icon-trash>
                  </b-link>
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <!-- Completed TASKS -->
        <b-col>
          <b-list-group>
            <h3>Completed tasks</h3>
            <b-list-group-item v-for="(constructedItem) in completed" :key="constructedItem.id">
              <b-row>
                <b-col class="d-flex justify-content-start pl-2">
                  <b-form-checkbox
                      class=""
                      v-model="constructedItem.status"
                      name="check-button" switch
                      @change="updateToDo(constructedItem)"
                  ></b-form-checkbox>
                </b-col>
                <b-col>
                  <span>{{ constructedItem.name }}</span>
                </b-col>
                <b-col class="d-flex justify-content-end">

                  <b-link v-if="constructedItem.originalTodo.attributes.attachment" :href="constructedItem.originalTodo.attributes.attachment._url">
                    <b-icon-link45deg class="pl-1 pr-2"></b-icon-link45deg>
                  </b-link>
                  <b-link @click="openEditModal(constructedItem)">
                    <b-icon-pencil-square class=""></b-icon-pencil-square>
                  </b-link>
                  <b-link @click="openDeleteModal(constructedItem.originalTodo)">
                    <b-icon-trash class="pl-1 pr-2"></b-icon-trash>
                  </b-link>

                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
      <!--END OF TASKS-->

    </div>

    <!--START OF MODAL EDIT-CREATE TASK-->
    <b-modal
        centered
        hide-header
        id="edit-create-modal"
        :ok-title="this.modalSuccessButtonText"
        :cancel-variant="'danger'"
        @ok="saveToDo"
        @cancel="clearToDoInfo"
    >
      <b-form-group label="Tittle" class="mb-3">
        <b-form-input v-model="editObjectName" placeholder="Task tittle goes here"></b-form-input>
      </b-form-group>

      <b-form-group label="Content" class="mb-3">
        <b-form-input v-model="editObjectContent" placeholder="Task content goes here"></b-form-input>
      </b-form-group>
<!--.originalTodo.attachment-->

<!--      ATTACHMENT MANAGEMENT IN MODAL-->
      <b-form-group label="Attachment" v-if="this.originalTodo && this.originalTodo.attributes && this.originalTodo.attributes.attachment">
<!--          MAKE FILE MANAGEMENT HERE-->
        <b-link :href="this.originalTodo.attributes.attachment._url">
          {{this.originalTodo.attributes.attachment._name}}
        </b-link>
        <b-link>
        <!--insert an @click here VVVV to delete the attachemnt of object-->
          <b-icon-x-lg class="pl-1 pr-2" variant="danger" @click="openDeleteAttachmentModal(originalTodo)"></b-icon-x-lg>
        </b-link>
      </b-form-group>

      <b-form-group v-else label="input file here">
        <!--insert a v model here and make it work VVVV-->
        <b-form-file v-model="newAttachment" class="" id="profilePhotoFileUpload">

        </b-form-file>
      </b-form-group>


      <b-form-group>
        <b-form-checkbox v-model="editObjectStatus">
          <span class="pl-2">Check this if the task is done</span>
        </b-form-checkbox>
      </b-form-group>
    </b-modal>
    <!--END OF MODAL EDIT-CREATE TASK-->

    <!--START OF MODAL DELETE TASK-->
    <b-modal
        centered
        hide-header
        id="delete-todo-modal"
        :ok-title="`Delete`"
        :ok-variant="'danger'"
        @ok="deleteToDoPermanently()"
        size="sm"
        :cancel-variant="'success'"
    >
      <h4>Are you sure you want to delete this task?</h4>
    </b-modal>
    <!--END OF MODAL DELETE TASK-->

    <!--START OF MODAL DELETE ATTACHMENT-->
    <b-modal
        centered
        hide-header
        id="delete-attachment-modal"
        :ok-title="`Delete`"
        :ok-variant="'danger'"
        @ok="deleteAttachment()"
        size="sm"
        :cancel-variant="'success'"
    >
      <h4>Are you sure you want to delete the attachment?</h4>
    </b-modal>
    <!--END OF MODAL DELETE ATTACHMENT-->

  </b-container>

</template>

<script>
import Parse from "parse";

export default {
  name: 'HelloWorld',
  components: {},

  data() {
    return {
      completed: [],
      uncompleted: [],
      items: [],
      itemToDelete: null,
      attachmentToDelete: null,

      editObjectName: '',
      editObjectContent: '',
      editObjectStatus: false,
      attachment: null,
      newAttachment: null,
      originalTodo: {},

      constructedItem: {},
      isAttachmentSaved: false,

      modalSuccessButtonText: '',
    }
  },

  created() {
    this.isUserLoggedIn();
  },

  computed: {
    curUserId() {
      let curUser = Parse.User.current();
      return curUser ? curUser.id : null;
    }
  },
  methods: {
    isUserLoggedIn() {
      let curUser = Parse.User.current();
      if (curUser && curUser.id) {
        console.log("currently logged in")
        this.fetchToDos();
      } else {
        this.$router.push({name: 'login'});
      }
    },
    fetchToDos() {
      let toDoQuery = new Parse.Query('ToDo');
      let userPointer = {"__type": "Pointer", className: '_User', objectId: this.curUserId,}

      toDoQuery.equalTo('owner', userPointer);
      toDoQuery.descending('createdAt');

      toDoQuery.find().then((data) => {
        console.log("My todos", data);
        this.items = data.map((todo) => {
          return {
            status: todo.get('status'),
            name: todo.get('name'),
            content: todo.get('content'),
            dueDate: todo.get('dueDate'),
            attachment: todo.get('attachment'),

            id: todo.id,
            originalTodo: todo
          }

        });
        for(let i = this.items.count; i > 0; --i) {
          console.log(this.item[i].dueDate)
        }


        this.completed = this.items.filter((oneToDo) => oneToDo.status);
        this.uncompleted = this.items.filter((oneToDo) => !oneToDo.status);
      });
    },

    updateToDo(constructedItem) {
      constructedItem.originalTodo.set("status", constructedItem.status)
      constructedItem.originalTodo.save().then(() => {
        this.fetchToDos();
        this.$toast("Updated successfully.", {
          position: "top-right",
          timeout: 1500,
        });
      })
    },

    openCreateModal(){
      this.clearToDoInfo()

      this.$bvModal.show("edit-create-modal")
      this.modalSuccessButtonText = "Create Task"
    },
    openEditModal(item) {
      this.editObjectName = item.name;
      this.editObjectContent = item.content;
      this.editObjectStatus = item.status;
      this.editObjectId = item.originalTodo.id;
      this.originalTodo = item.originalTodo;


      this.$bvModal.show('edit-create-modal');
      this.modalSuccessButtonText = "Edit Task"
    },
    openDeleteModal(item) {
      this.itemToDelete = item
      this.$bvModal.show("delete-todo-modal");
    },
    deleteToDoPermanently() {
      this.itemToDelete.destroy().then(() => {
        this.fetchToDos();
        this.$toast("Task deleted successfully.", {
          position: "top-right",
          timeout: 2500,
        });
      }).catch((error) => {
        this.$toast.error("Error while deleting task", {
          position: "top-right",
          timeout: 2500,
        });
        console.error("Error while saving task", error);
      });
    },

    openDeleteAttachmentModal(attachment){
      // pass current object through () to know what to delete.
      this.attachmentToDelete = attachment
      this.$bvModal.show("delete-attachment-modal");
    },
    deleteAttachment(){
      console.log('"deleting"')
      let deletion = this.attachmentToDelete.get("attachment");

// what's up with this
      deletion.destroy({ useMasterKey: true}).then(() => {
        this.fetchToDos();
        this.$toast("Attachment deleted successfully.", {
          position: "top-right",
          timeout: 2500,
        });
        deletion = null;

      }).catch((error) => {
            this.$toast.error("Error while deleting attachment ", {
              position: "top-right",
              timeout: 2500,
            });
            console.error("Error while deleting task", error);
            
          });

      this.fetchToDos();
      // "deleting" will be done here

    },

    saveToDo() {
      const ToDo = Parse.Object.extend('ToDo');
      const newTask = new ToDo();

      if (this.editObjectId) {
        newTask.set("id", this.editObjectId);
      }

      let userPointer = {"__type": "Pointer", className: '_User', objectId: this.curUserId,}
      newTask.set("owner", userPointer);
      newTask.set("name", this.editObjectName);
      newTask.set("content", this.editObjectContent);
      newTask.set("status", this.editObjectStatus);

      if(this.newAttachment) {
        let parseFile = new Parse.File('todoFile', this.newAttachment);
        newTask.set("attachment", parseFile);
      }

      newTask.save().then(
          (response) => {
            console.log("Task saved successfully!", response);
            this.editObjectName = '';
            this.editObjectContent = '';
            this.editObjectStatus = false;
            this.editObjectId = null;
            this.newAttachment = null;

            this.fetchToDos();
            this.$bvModal.hide('edit-create-modal');

            this.$toast.success("New task created successfully", {
              position: "top-right",
              timeout: 2500,
            });
          }).catch((error) => {
        this.$toast.error("Error while creating task", {
          position: "top-right",
          timeout: 2500,
        });
        console.error("Error while saving task", error);
      });
    },
    clearToDoInfo(){
      this.editObjectName = '';
      this.editObjectContent = '';
      this.editObjectStatus = false;
      this.editObjectId = null; //!!!

      this.originalTodo = {};

    },

    logOutFunction() {
      Parse.User.logOut().then(() => {
        this.$router.push({name: 'login'});
        this.$toast("Logged out.", {
          position: "top-right",
          timeout: 2500,
        });

      }).catch((error) => {
        console.log("The error on logout is: ", error.message);
      })
    }
  },

}
</script>