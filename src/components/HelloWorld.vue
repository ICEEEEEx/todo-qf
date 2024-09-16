<template>
  <div>
    <h1>Main page</h1>
    <b-button variant="primary" @click="logOutFunction">Log Out</b-button>


    <div v-for="value in object" v-bind:key="value.id">
      <!-- content -->
    </div>

  </div>
</template>

<script>
import Parse from "parse";
import Vue from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

//the time was spent doing research and debugging (aimlessly going in circles)
//looked at vue documentation and tried a bunch of thing (I am probably blind since it is probably very obvious)

// Tried to do something using v-for but failed miserably..., Thought that the issue might be the vue version (me using wrong documentation) but after checking it was all fine,... basically even the basic info is not being outputted trough the div (static)... ( and now as I am coming to the end of this reporting in my comment I remember that I haven't pushed the project to github in quite a long time and that it will be not well documented. oopsie.. :P)

// new Vue({
//   el: '#v-for-object',
//   data: {
//     object: {
//       title: 'How to do lists in Vue',
//       author: 'Jane Doe',
//       publishedAt: '2016-04-10'
//     }
//   }
// })
export default {
  name: 'HelloWorld',
  components: {

  },


  created(){
    this.isUserLoggedIn();
    // this.fetchToDos();

  },



  methods: {
    isUserLoggedIn(){
      let curUser = Parse.User.current();
      // console.log(curUser)
      if(curUser && curUser.id) {
        console.log("currently logged in")
        this.fetchToDos(); // put fetchToDos() here so no leak..
      }else{
        this.$router.push({name: 'login'});
      }
    },
    fetchToDos() {
      let toDoQuery = new Parse.Query('ToDo');
      toDoQuery.find().then((data) => {
        console.log("My todos", data);
        data.forEach((oneTodo) => {
          console.log("Name: ", oneTodo.get('name'));
        })
      });

    },


    logOutFunction(){
      debugger;
      Parse.User.logOut().then( ()=>{
        this.$router.push({name: 'login'});


        //I haven't gotten the toasts to work properly.. Do it tmrw
        Vue.use(Toast, {
          transition: "Vue-Toastification__bounce",
          maxToasts: 20,
          newestOnTop: true //FIX THIS OHMYGOD!

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
