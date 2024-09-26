import Vue from 'vue'
import App from './App.vue'
import router from './router';


Vue.config.productionTip = false

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/styles/custom_styles.css'
import moment from 'moment';


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


//toastification
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

Vue.filter('splitAtUnderscore', function (fileName) {
  const parts = fileName.split('_');

  // If there's more than one part, return everything after the first underscore
  // Otherwise, return the original filename
  return parts.length > 1 ? parts.slice(1).join('_') : fileName;

})
Vue.filter('niceDate', function (date) {
  return moment(date).format('DD/MM/YYYY');
})



const Parse = require('parse');
Parse.initialize(`${process.env.VUE_APP_PARSE_APP_ID}`, `${process.env.VUE_APP_PARSE_SECRET}`);
Parse.serverURL = `${process.env.VUE_APP_PARSE_URL}`;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

