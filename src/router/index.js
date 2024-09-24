import Vue from 'vue'
import VueRouter from 'vue-router'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
};


Vue.use(Toast, options);

class Router extends VueRouter {
    resolve(to, current, append) {
        const route = { ...to };
        route.params = { ...route.params, language: 'en' };
        return super.resolve(route, current, append);
    }
}

Vue.use(Router);


const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/components/HelloWorld.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/Login.vue'),
    },
    {
        path: '/table',
        name: 'TablePage',
        component: () => import('@/components/TablePage.vue'),
    },
];


const router = new Router({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes
});

export default router
