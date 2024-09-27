<template>
  <div>
    <b-modal
        centered
        id="todo-info-modal"
        hide-footer
        hide-header

    >
      <div class="card text-left">
        <div class="card-header">
          Your to-do
        </div>
        <div class="card-body">
          <h5 class="card-title">
            {{this.localTodoObject.name}}
            <b-icon-check-lg v-if="this.localTodoObject.status === 1" variant="success"></b-icon-check-lg>
            <b-icon-x-lg v-else variant="danger"></b-icon-x-lg>
          </h5>

          <p class="card-text">{{this.localTodoObject.content}}</p>
          <a v-if="todoInfo.attachment" :href="todoInfo.attachment.url()" class="btn btn-primary">{{ todoInfo.attachment.name() | splitAtUnderscore }}</a>
        </div>
        <div class="card-footer text-body-secondary">
          <p v-if="this.localTodoObject.dueDate <= this.today" class="text-danger">
            {{this.localTodoObject.dueDate | niceDate}}
          </p>

          <p v-else class="text-success">
            {{this.localTodoObject.dueDate | niceDate}}
          </p>

        </div>
      </div>

<!--      MAKE DATA LOCAL!!!! (done) -->
<!--      MAKE IT LOOK NICER!!! (kinda done)-->


<!--      ASK WHY DO I HAVE TO DOUBLE CLICK THE OBJECT FIRST TIME CLICKING!!!!!-->

    </b-modal>

  </div>
</template>

<script>

  export default {
    props: {
      todoInfo: {
        type: Object,
        default() {
          return {
            name: '',
            content: '',
            status: false,
            dueDate: null,
            id: null,
            attachment: null,
          };
        }
      },
    },
    data() {
      return {
        localTodoObject: {
          name: '',
          content: '',
          status: false,
          dueDate: null,
          id: null,
          attachment: null,
        },
        today: new Date(),

      }
    },
    mounted() {


    },
    watch: {
      todoInfo: {
        immediate: true,
        deep: true,
        handler(newValue) {
          // Sync the props to the local data
          this.localTodoObject = {...newValue};
          console.log("Passed object to todo Modal: ", newValue,);

        }
      }

    },
    methods: {

    }
  };
</script>
