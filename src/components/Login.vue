<template>
  <div>
    <h1>Hello from Login</h1>

    <b-container class="w-25">
          <b-form>

            <b-form-group label="Username" class="mb-1">
              <b-form-input
                  id="input-username"
                  placeholder="'Joe'"
                  v-model="username"
              ></b-form-input>
            </b-form-group>


            <b-form-group label="Password" class="mb-1">
              <b-form-input
                  type="password"
                  id="input-password"

                  placeholder="Password"
                  v-model="pass"
              ></b-form-input>


            </b-form-group>

            <b-form-checkbox class="mb-2">Remember me</b-form-checkbox>
            <b-button variant="primary" @click="loginFunction">Log In</b-button>
<!--            mr-sm-2 mb-sm-0-->

          </b-form>
    </b-container>
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
    let curUser = Parse.User.current();
    if(curUser && curUser.id) {
      this.$router.push({name: 'home'});
    }
  },

  methods: {
    loginFunction(){
      // console.log(this.pass, this.username);
      Parse.User.logIn(this.username, this.pass).then( (responseData)=>{
        console.log("Response data is: ", responseData);

        this.$toast("Logged in.", {
          position: "top-right",
          timeout: 2500,
        });

        this.$router.push({name: 'home'});

      }).catch((error)=> {
        console.log("The error on login is: ", error.message);
      })
    }



  }
}
</script>