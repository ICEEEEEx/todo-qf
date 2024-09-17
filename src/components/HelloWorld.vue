<template>
  <div>

    <h1>Main page</h1>
    <b-container>
      <br>
      <b-list-group>
        <b-list-group-item v-for="(constructedItem) in uncompleted" :key="constructedItem.id">

            <b-form-checkbox
                v-model="constructedItem.status"
                name="check-button" switch
                @change="updateToDo(constructedItem)"
            >

              <span class="pl-2">{{constructedItem.name}}</span>
<!--              <b>(Checked: {{ constructedItem.status }})</b>-->

            </b-form-checkbox>
          </b-list-group-item>

        <br>

        <b-list-group-item v-for="(constructedItem) in completed" :key="constructedItem.id">

          <b-form-checkbox
              v-model="constructedItem.status"
              name="check-button" switch
              @change="updateToDo(constructedItem)"
          >

            <span class="pl-2">{{constructedItem.name}}</span>
<!--            <b>(Checked: {{ constructedItem.status }})</b>-->

          </b-form-checkbox>
        </b-list-group-item>

      </b-list-group>
      <b-button variant="success" @click="$router.push({name: 'todoCreator'});">Create new</b-button>
      <br>
      <b-button variant="outline-danger" @click="logOutFunction">Log Out</b-button>





    </b-container>



  </div>
</template>

<script>
import Parse from "parse";

export default {
  name: 'HelloWorld',
  components: {

  },

  data(){
    return {
      completed: [],
      uncompleted: [],
      items: []
    }
  },

  created(){
    this.isUserLoggedIn();
  },

  methods: {
    isUserLoggedIn(){
      let curUser = Parse.User.current();
      // console.log(curUser)
      if(curUser && curUser.id) {
        console.log("currently logged in")
        this.fetchToDos();
      }else{
        this.$router.push({name: 'login'});
      }
    },
    fetchToDos() {
      let toDoQuery = new Parse.Query('ToDo');
      toDoQuery.find().then((data) => {
        console.log("My todos", data);
        // this.items = data;

        this.items = data.map((todo) =>  {
          return  {
            status: todo.get('status'),
            name: todo.get('name'),
            content: todo.get('content'),
            dueDate: todo.get('dueDate'),
            id: todo.id,
            originalTodo: todo
          }
        });

        this.completed = this.items.filter((oneToDo)=> oneToDo.status);
        // console.log("completed: ", this.completed)

        this.uncompleted = this.items.filter((oneToDo) => !oneToDo.status);
        // console.log("uncompleted: ", this.uncompleted)
      });

    },

    updateToDo(constructedItem){
      console.log(constructedItem);

      constructedItem.originalTodo.set("status", constructedItem.status)

      constructedItem.originalTodo.save().then(() => {
        this.fetchToDos();
        this.$toast("Updated successfully.",{
          position: "top-right",
          timeout: 2500,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: "button",
          icon: true,
        });
      })


    },

    logOutFunction(){

      Parse.User.logOut().then( ()=>{
        this.$router.push({name: 'login'});

        // debugger;
        //I haven't gotten the toasts to work properly. Do it tomorrow
        this.$toast("Logged out successfully.",{
          position: "top-right",
          timeout: 2500,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: "button",
          icon: true,
        });

      }).catch((error)=> {
        console.log("The error on logout is: ", error.message);
      })

    }
  },



}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
