<template>
  <b-container>
    <div class="row justify-content-evenly">

      <b-row class="mb-3 border-bottom pb-3">
        <div class="d-flex justify-content-between">

<!--          <b-col>-->
<!--            <b-button variant="outline-success">Create a new ToDo</b-button>-->
<!--          </b-col>-->
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
          <b-table striped hover :items="items" :fields="fields"></b-table>
        </div>
      </template>



    </div>
  </b-container>
</template>

<script>
import Parse from "parse";
import moment from 'moment';
moment().format();


export default {
  name: 'TablePage',
  components: {},


  data() {
    return{
      originalTodo: {},
      constructedItem: {},

      items: [],

      fields: ['name', 'content', 'dueDate', 'status', 'attachment'],
    }
  },

  created() {
    this.isUserLoggedIn();
    this.fetchToDos()
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
        // this.fetchToDos();
      } else {
        this.$router.push({name: 'login'});
      }
    },



    fetchToDos() {
      let toDoQuery = new Parse.Query('ToDo');
      let userPointer = {"__type": "Pointer", className: '_User', objectId: this.curUserId,}

      toDoQuery.equalTo('owner', userPointer);

      toDoQuery.find().then((data) => {
        console.log("My todos", data);
        this.items = data.map((todo) => {
          return {
            status: todo.get('status'),
            name: todo.get('name'),
            content: todo.get('content'),
            dueDate: moment(todo.get('dueDate')).format('YYYY/MM/DD'),

            attachment: todo.get('attachment') ? todo.get('attachment').name() : null,

            // attachmentName: attachment.name(),

            id: todo.id,
            originalTodo: todo
          }
          // fields: ['name', 'content', 'dueDate', 'status', 'attachment'],
        });
        console.log(moment())
        this.completed = this.items.filter((oneToDo) => oneToDo.status);
        this.uncompleted = this.items.filter((oneToDo) => !oneToDo.status);


      });
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
  }
}

</script>
