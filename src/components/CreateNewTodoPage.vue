<template>
  <div>
    <h1>New ToDo</h1>

    <br>
    <b-container>

      <b-button
          variant="success"
          @click="goToMainPage"
      >
        All ToDo's
      </b-button>

      <!--        <b-form>-->
      <!--          <b-form-input-->
      <!--              id="inline-form-input1"-->
      <!--              class="mb-2 mr-sm-2 mb-sm-0"-->
      <!--              placeholder="Task name"-->
      <!--          >-->
      <!--          </b-form-input>-->

      <!--          <b-form-input-->
      <!--              id="inline-form-input2"-->
      <!--              placeholder="content"-->
      <!--          >-->
      <!--          </b-form-input>-->

      <!--          <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">(if the task is done check this)</b-form-checkbox>-->

      <!--          <b-button variant="primary" @click="createNewToDo">Save</b-button>-->
      <!--        </b-form>-->


      <b-form @submit.prevent="createNewToDo">
        <b-form-group label="tittle">
          <b-form-input v-model="newToDo.tittle" placeholder="Enter task tittle"></b-form-input>
        </b-form-group>

        <b-form-group label="content">
          <b-form-input v-model="newToDo.content" placeholder="Enter tasks content"></b-form-input>
        </b-form-group>

<!--        <b-form-group label="Due Date">-->
<!--          <b-form-datepicker id="datepicker" v-model="newToDo.dueDate" class="mb-2"></b-form-datepicker>-->
<!--          <p>{{ newToDo.dueDate }}</p>-->
<!--        </b-form-group>-->

        <b-form-group>
          <b-form-checkbox v-model="newToDo.status">
            (check this if the task is done)
          </b-form-checkbox>
        </b-form-group>

        <b-button type="submit" variant="primary">Create Task</b-button>
      </b-form>



      </b-container>
  </div>
</template>

<script>
import Parse from 'parse';

export default {
  name: 'todoCreator',
  components: {},
  // data() {
  // },
  created(){
    this.isUserLoggedIn();
  },

  methods: {
    newToDo: [],
    createNewToDo() {


      // Step 1: Create a new Parse object for the "to do"
      const ToDo = Parse.Object.extend('ToDo'); // Assuming your class is called "To Do"
      const newTask = new ToDo();

      // Step 2: Set the task's attributes from the form data
      newTask.set("name", this.newToDo.tittle);
      newTask.set("status", this.newToDo.status);
      newTask.set("content", this.newToDo.content);
      newTask.set("owner", Parse.User.current);
      //figure out how to get user id to automatically put it in to the table
      // console.log(Parse.User.current)

      //figure out how to put date in to table
      // console.log(this.dueDate)
      // newTask.set("dueDate", this.dueDate);


      newTask.save().then(
          (response) => {
            console.log("Task saved successfully!", response);
            this.newToDo.tittle = '';
            this.newToDo.status = false;
            this.newToDo.content = '';



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




    isUserLoggedIn() {
      let curUser = Parse.User.current();
      if (curUser && curUser.id) {
        console.log("currently logged in")
      } else {
        this.$router.push({name: 'login'});
      }
    },
    goToMainPage(){
      this.$router.push({name: 'home'}).then(()=>{

        this.$toast("Succesfully went to the main page!, ", {
          position: "top-right",
          timeout: 2500,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: "button",
          icon: true,
        });
      });

    }
  },




}




</script>
<style scoped>

</style>