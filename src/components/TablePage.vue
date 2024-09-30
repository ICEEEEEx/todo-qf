<template>
  <b-container>

      <b-row class="mb-3 border-bottom pb-3">
          <b-col>
            <b-button variant="outline-success" @click="openCreateModal">New Task</b-button>
          </b-col>
          <b-col>
            <b-button variant="outline-success" @click="$router.push({name: 'home'})">Home</b-button>
          </b-col>
          <b-col>
            <b-button variant="outline-danger" @click="logOutFunction">Log Out</b-button>
          </b-col>
      </b-row>

    <table-filters></table-filters>

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
                <span class="text-muted" role="button" @click="openTodoModal(data.item)">{{data.item.name}}

                </span>
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
              <b-icon-trash role="button" class="" @click="openDeleteModal(data.item.originalTodo)"> </b-icon-trash>
            </template>

          </b-table>

      <todo-modal :todo-info="itemToEdit"/>
      <create-edit-modal :edit-object="itemToEdit" :user-id="curUserId" @saved="handleSaved" />
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
import todoModal from "@/components/todoModal.vue";
import TableFilters from "@/components/TableFilters.vue";
moment().format();


export default {
  name: 'TablePage',
  components: {
    todoModal,
    CreateEditModal,
    TableFilters
  },


  data() {
    return{
      itemToEdit: null,
      originalTodo: {},

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
  },

  computed: {
    curUserId() {
      let curUser = Parse.User.current();
      return curUser ? curUser.id : null;
    },

    items() {
      return this.$store.state.availableToDos;
    }

  },
  methods: {
    isUserLoggedIn() {
      let curUser = Parse.User.current();
      if (curUser && curUser.id) {
        this.$store.commit('setUserId', curUser.id)

        this.$store.dispatch('fetchToDos', {userId: curUser.id})
      } else {
        this.$router.push({name: 'login'});
      }
    },

    updateToDoStatus(constructedItem) {
      constructedItem.originalTodo.set("status", !!constructedItem.status)
      constructedItem.originalTodo.save().then(() => {
        this.$store.dispatch("fetchToDos")
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
      this.$store.dispatch("fetchToDos")

    },

    openTodoModal(item){
      this.itemToEdit = {};
      this.itemToEdit = item;
      this.$bvModal.show('todo-info-modal')

    },


    clearToDoInfo(){
      this.editObjectName = '';
      this.editObjectContent = '';
      this.editObjectDueDate = null;
      this.editObjectStatus = false;
      this.editObjectId = null;
      this.originalTodo = {};
    },

    openDeleteModal(item) {
      this.itemToDelete = item
      this.$bvModal.show("delete-todo-modal");
    },
    deleteToDoPermanently() {
      this.itemToDelete.destroy().then(() => {
        this.$store.dispatch("fetchToDos")
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
  },
  watch: {}

}

</script>
