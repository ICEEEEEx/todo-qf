<template>
    <b-container >
      <div class="row justify-content-evenly">
        <h1>All of your tasks</h1>

        <b-row class="mb-3 border-bottom pb-3">
          <b-col>

            <div class="d-flex justify-content-between">
              <b-button variant="outline-success" v-b-modal.my-modal>Create a new ToDo</b-button>

              <b-button variant="outline-danger" @click="logOutFunction">Log Out</b-button>
            </div>

          </b-col>
        </b-row>

        <b-row>
          <!-- OPEN TASKS -->
          <b-col>
            <b-list-group >
              <h3>Uncompleted Tasks</h3>
              <b-list-group-item class="" v-for="(constructedItem) in uncompleted" :key="constructedItem.id">
                <b-row>
                  <b-col>
                    <b-form-checkbox
                        class=""
                        v-model="constructedItem.status"
                        name="check-button" switch
                        @change="updateToDo(constructedItem)"
                    ></b-form-checkbox>
                  </b-col>
                  <b-col>
                    <span class="">{{constructedItem.name}}</span>
                  </b-col>
                  <b-col class="">
                    <b-icon-pencil-square class=""></b-icon-pencil-square>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
          </b-col>

          <!-- Completed TASKS -->
          <b-col>
            <b-list-group>
              <h3>Completed tasks</h3>
              <b-list-group-item class="" v-for="(constructedItem) in completed" :key="constructedItem.id">
                <b-row>
                  <b-col>
                    <b-form-checkbox
                        class=""
                        v-model="constructedItem.status"
                        name="check-button" switch
                        @change="updateToDo(constructedItem)"
                    ></b-form-checkbox>
                  </b-col>
                  <b-col>
                    <span class="">{{constructedItem.name}}</span>
                  </b-col>
                  <b-col class="">
                    <b-icon-pencil-square class=""></b-icon-pencil-square>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>

  <!--start of modal-->


  <!--end of modal (pop-up)-->
      </div>
      <b-modal
          id="my-modal"
          :ok-title="`Create tasks`"
          @ok="createNewToDo"
      >
        <b-form-group label="Tittle" class="mb-3">
          <b-form-input v-model="newToDo.newTittle" placeholder="Task tittle goes here"></b-form-input>
        </b-form-group>

        <b-form-group label="Content"  class="mb-3">
          <b-form-input v-model="newToDo.newContent" placeholder="Task content goes here"></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox v-model="newToDo.newStatus">
            <span class="pl-2">Check this if the task is done</span>
          </b-form-checkbox>
        </b-form-group>

      </b-modal>
    </b-container>

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
  computed:{
    curUserId(){
      let curUser = Parse.User.current();
      return curUser ? curUser.id : null;
    }

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

      // console.log(this.curUserId);

      let userPointer = {"__type": "Pointer", className:'_User', objectId:this.curUserId, }

      toDoQuery.equalTo('owner', userPointer);
      //
      toDoQuery.descending('createdAt');

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
          timeout: 1500,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: "button",
          icon: true,
        });
      })
    },


    newToDo: [],
    createNewToDo() {

      // Step 1: Create a new Parse object for the "to do"
      const ToDo = Parse.Object.extend('ToDo');
      const newTask = new ToDo();

      let userPointer = {"__type": "Pointer", className:'_User', objectId:this.curUserId, }

      newTask.set("name", this.newToDo.newTittle);
      newTask.set("status", this.newToDo.newStatus);
      newTask.set("content", this.newToDo.newContent);
      newTask.set("owner", userPointer);
      //figure out how to get user id to automatically put it in to the table
      // console.log(Parse.User.current)

      //figure out how to put date in to table
      // console.log(this.dueDate)
      // newTask.set("dueDate", this.dueDate);

      newTask.save().then(
          (response) => {
            console.log("Task saved successfully!", response);
            this.newToDo.newTittle = '';
            this.newToDo.newStatus = false;
            this.newToDo.newContent = '';

            this.fetchToDos();
            this.$bvModal.hide('my-modal');

            this.$toast.success("New task created successfully", {
              position: "top-right",
              timeout: 2500,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
              draggable: true,
              closeButton: "button",
              icon: true,
            });


          },
          (error) => {
            this.$toast.error("Error while creating task", {
              position: "top-right",
              timeout: 2500,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
              draggable: true,
              draggablePercent: 0.6,
              showCloseButtonOnHover: false,
              hideProgressBar: true,
              closeButton: "button",
              icon: true,
              rtl: false
            });

            console.error("Error while saving task", error);
          }
      );
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
<style>
a {
  color: #42b983;
}
</style>
