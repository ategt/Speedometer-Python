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
      name: 'graph',
      component: Graph
    },
    {
      path: '/public/info',
      name: 'public-info',
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/:place',
      name: 'any-placeVar',
      component: Graph
    },
    {
      path: '/public/:place',
      name: 'public-placeVar',
      component: Graph
    },
    {
      path: '/public/d3.html',
      name: 'specific',
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