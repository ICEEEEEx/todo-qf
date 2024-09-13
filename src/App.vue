<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h3>Hello there</h3>



  </div>
</template>

<script>
import Parse from 'parse';

export default {
  name: 'App',
  components: {

  },
  created(){
      this.fetchToDos();
  },
  methods: {
    fetchToDos(){
      let toDoQuery = new Parse.Query('ToDo');
      toDoQuery.find().then((data)=>{
        console.log("My todos", data);
        data.forEach( (oneTodo) => {
          console.log("Name: ", oneTodo.get('name'));
        })
      });
    }
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
</style>
