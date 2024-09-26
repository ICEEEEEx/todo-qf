<template>
  <b-container>
    <div class="row justify-content-evenly">

      <b-row class="mb-3 border-bottom pb-3">
        <div class="d-flex justify-content-between">

          <b-col>
            <b-button variant="outline-success" @click="openCreateModal">New Task</b-button>
          </b-col>
          <b-col>
            <b-button variant="outline-success" @click="$router.push({name: 'home'})">Home</b-button>
          </b-col>
          <b-col>
            <b-button variant="outline-danger" @click="logOutFunction">Log Out</b-button>
          </b-col>

        </div>
      </b-row>

      <template>
        <div>
          <b-table
              striped hover
              :items="items"
              :fields="fields"
          >

            <template #cell(status)="data">
              <div>
                <b-form-checkbox
                    v-model="data.item.status"
                    :value="1"
                    @change="updateToDoStatus(data.item)"
                    role="button"
                >
                </b-form-checkbox>
              </div>
            </template>

            <template #cell(name)="data">
              <div class="text-left">
                <span class="text-muted">{{data.item.name}}</span>
              </div>
            </template>

            <template #cell(dueDate)="data">
              <div class="">
                <span>{{data.item.dueDate | niceDate}}</span>
              </div>
            </template>

            <template #cell(attachment)="data">
              <div v-if="data.item.attachment">
                <b-link :href="data.item.attachment.url()">
                  {{ data.item.attachment.name() | splitAtUnderscore}}
                </b-link>
              </div>
            </template>

            <template #cell(actions)="data">
              <b-icon-pencil role="button" class="" @click="openEditModal(data.item)"></b-icon-pencil>
              <b-icon-trash role="button" class="pl-1 pr-2" @click="openDeleteModal(data.item.originalTodo)"> </b-icon-trash>
            </template>

          </b-table>
        </div>
      </template>

    </div>

    <create-edit-modal :edit-object="itemToEdit" :user-id="curUserId" @saved="handleSaved" ></create-edit-modal>

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

  </b-container>
</template>

<script>
import Parse from "parse";
import moment from 'moment';
import CreateEditModal from "@/components/CreateEditModal.vue";
moment().format();


export default {
  name: 'TablePage',
  components: {
    CreateEditModal
  },


  data() {
    return{
      itemToEdit: null,
      originalTodo: {},

      items: [],

      fields: [
        {

          key: 'status',
          label: 'Task Status',
          sortable: true,

        },
        {
          key: 'name',
          label: 'Task name',
          sortable: true,
        },

        'content',

        {
          key: 'dueDate',
          label: 'Due Date',
          sortable: true,
        },
        {
          key: 'attachment',
          label: 'Attachment',

        },

        {
          key: 'actions',
          label: 'Actions',
          sortable: false,
        },

      ],
    }
  },

  created() {
    this.isUserLoggedIn();
    // this.fetchToDos()
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
      toDoQuery.descending('status');

      toDoQuery.find().then((data) => {
        console.log("My todos", data);
        this.items = data.map((todo) => {
          return {
            status: todo.get('status') ? 1 : 0,
            name: todo.get('name'),
            content: todo.get('content'),
            dueDate: todo.get('dueDate'),
            attachment: todo.get('attachment'),

            id: todo.id,
            originalTodo: todo
          }
        });

      });
    },

    updateToDoStatus(constructedItem) {
      constructedItem.originalTodo.set("status", !!constructedItem.status)
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
      this.itemToEdit = {};
      this.$bvModal.show("edit-create-modal")
    },
    openEditModal(item) {
      this.itemToEdit = item;
      this.$bvModal.show('edit-create-modal');
    },
    handleSaved(){
      this.fetchToDos()

    },


    clearToDoInfo(){
      this.editObjectName = '';
      this.editObjectContent = '';
      this.editObjectDueDate = null;
      this.editObjectStatus = false;
      this.editObjectId = null; //!!!
      this.originalTodo = {};
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


      logOutFunction() {
      Parse.User.logOut().then(() => {
        this.$router.push({name: 'login'});
        this.$toast("Logged out.",{
          position: "top-right",
          timeout: 2500,
        });
      }).catch((error) => {
        console.log("The error on logout is: ", error.message);
      })
    }
  }
}

</script>
