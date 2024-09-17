<template>
  <div>
    <h1>Hello from Login</h1>



    <div class="form-box">
      <b-form inline>

        <b-form-group label="Your username">
          <b-form-input
              id="input-username"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="'Joe'"
              v-model="username"
          ></b-form-input>
        </b-form-group>


        <b-form-group label="Password">
          <b-form-input
              type="password" id="input-password" placeholder="Password"
              v-model="pass"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0">Remember me</b-form-checkbox>

        <b-button variant="primary" @click="loginFunction">Log In</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import Parse from 'parse';

export default {
  name: 'login',
  components: {

  },
  data(){
    return {
      username: 'Donatas',
      pass: 'cool'
    }
  },

  created(){
    // this.fetchToDos();
    let curUser = Parse.User.current();
    if(curUser && curUser.id) {
      this.$router.push({name: 'home'});
    }
    // this.loginFunction();
  },
  methods: {
    // fetchToDos() {
    //   let toDoQuery = new Parse.Query('ToDo');
    //   toDoQuery.find().then((data) => {
    //     console.log("My todos", data);
    //     data.forEach((oneTodo) => {
    //       console.log("Name: ", oneTodo.get('name'));
    //     })
    //   });
    // },
    loginFunction(){
      // console.log(this.pass, this.username);
      Parse.User.logIn(this.username, this.pass).then( (responseData)=>{
        console.log("Response data is: ", responseData);

        this.$toast("Logged in!, ", {
          position: "top-right",
          timeout: 2500,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: "button",
          icon: true,
        });

        this.$router.push({name: 'home'});

      }).catch((error)=> {
        console.log("The error on login is: ", error.message);
      })

    },
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

</style>