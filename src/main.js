import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

const Parse = require('parse');
Parse.initialize(`${process.env.VUE_APP_PARSE_APP_ID}`, `${process.env.VUE_APP_PARSE_SECRET}`);
Parse.serverURL = `${process.env.VUE_APP_PARSE_URL}`;

new Vue({
  render: h => h(App),
}).$mount('#app')
