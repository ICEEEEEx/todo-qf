<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h3>Hello there</h3>
    <div class="form-box">
      <b-form inline>
        <label class="sr-only" for="input-username">Userame</label>
        <b-form-input
            id="input-username"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="'Joe'"
        ></b-form-input>

        <label class="sr-only" for="input-password">Password</label>
<!--        <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">-->
          <b-form-input type="password" id="input-password" placeholder="Password"></b-form-input>
<!--        </b-input-group>-->

        <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>

        <b-button variant="primary" onclick="loginFunction()">Log In</b-button>
      </b-form>
    </div>
  </div>

</template>


<script>
import Parse from 'parse';

// let username = new Parse.Query('username')
// let password = new Parse.Query('password')
// //
// let inputUsername = document.getElementById('input-username')
// let inputPassword = document.getElementById('input-password')

export default {
  name: 'App',
  components: {

  },


  created(){
      this.fetchToDos();
      this.fetchUserInfo()
      // this.loginFunction();
  },
  methods: {
    fetchToDos() {
      let toDoQuery = new Parse.Query('ToDo');
      toDoQuery.find().then((data) => {
        console.log("My todos", data);
        data.forEach((oneTodo) => {
          console.log("Name: ", oneTodo.get('name'));
        })
      });
    },

    fetchUserInfo() {
      let userDataQuery = new Parse.Query('User');
      userDataQuery.find().then((data) => {
        console.log("Login Data", data);
        data.forEach((logininfo) => {
          console.log("Name: ", logininfo.get('user'));
        })
      });
    }
    // },
    // loginFunction(){
    //   if (username === inputUsername && password === inputPassword){
    //     window.location.href = "/#";
    //   } else {
    //     console.log("nothingÍ")
    //   }
    // }
    //

  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.form-box{
  margin: auto;
  padding: 15px;
  width: 80vw;

  border-style: solid;
  border-color: grey;
  border-width: 1px;
  border-radius: 5px;
}
</style>
