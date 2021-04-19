//import Vue from '../../node_modules/vue/dist/vue.js';
import Vue from 'vue'
import Router from 'vue-router'
import Graph from '../views/Graph.vue'
//import { authGuard } from "../auth/authGuard";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Graph
    },
    {
      path: '/:place',
      name: 'home',
      component: Graph
    },
    {
      path: '/public/:place',
      name: 'home',
      component: Graph
    },
    {
      path: '/public/d3/html.html',
      name: 'home',
      component: Graph
    }
    // ,
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/About.vue')
    // },
    // {
    //   path: '/event/:id',
    //   name: 'eventSingle',
    //   component: () => import('../views/EventSingle.vue'),
    //   beforeEnter: authGuard
    // }
  ]
})