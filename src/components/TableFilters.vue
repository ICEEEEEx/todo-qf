<template>
  <div>
    <b-row class="mb-2">
        <b-col cols="4">
          <b-form-group label="Task status">
            <b-form-select
                class=""
                v-model="filterStatus"
                :options="[{value: undefined, text: '-'},{value: true, text: 'Finished'}, {value: false, text: 'Unfinished'}]"
            >
            </b-form-select>
          </b-form-group>

        </b-col>
        <b-col cols="4">
          <b-form-group label="Deadline after">
            <b-form-datepicker
                v-model="filterDateAfter"
            ></b-form-datepicker>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group class="pt-4">
            <b-form-checkbox  v-model="filterAttachments" size="lg" name="check-button" switch>
              Show only items with attachments
            </b-form-checkbox>
          </b-form-group>

        </b-col>
    </b-row>

    <b-row>
      <b-col>
        <h4>Attachments only: {{storeAttachmentFilter}}</h4>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: 'TableFilters',
  data(){
    return {
      filterAttachments: false,
      filterStatus: null,
      filterDateAfter: undefined,

    }
  },
  computed: {
      storeAttachmentFilter() {
        return this.$store.state.filters.attachmentsOnly;
      }

  },
  watch: {
    filterAttachments(newValue){
      this.$store.commit('setFilterAttach', newValue);
      this.$store.dispatch('fetchToDos');
    },
    filterStatus(newValue){
      this.$store.commit('setFilterStatus', newValue);
      this.$store.dispatch("fetchToDos");
    },
    filterDueDate(newValue){
      this.$store.commit('setFilterDueDate', newValue);
      this.$store.dispatch('fetchToDos');
    }
  }

}

</script>

<style scoped>

</style>