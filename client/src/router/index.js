//import Vue from '../../node_modules/vue/dist/vue.js';
import Vue from 'vue'
import Router from 'vue-router'
//import Graph from '../views/Graph.vue'
//import { authGuard } from "../auth/authGuard";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/public/info',
      name: 'public-info',
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/public/:place',
      name: "Sumplace",
      component: () => import('../components/Summary.vue')
    },
    {
      path: '/summary/:id/:spec(text|graph)?',
      //path: '/summary/:id',
      name: 'Summary',
      component: () => import('../components/Summary.vue')
      //component: () => import('../views/Graph.vue')
    },
    {
      path: '/public/info',
      name: "Reports",
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/public/schedule',
      name: "Schedule",
      component: () => import('../views/Schedule.vue')
    },
    {
      path: '/graph/:id(\\d+)?',
      name: "Graph",
      component: () => import('../views/ReportDetail.vue')
    },
    {
      path: '/steve',
      name: "Steve",
      component: () => import('../views/Test.vue')
      //component: () => import('../views/ReportDetail.vue')
      //component: () => import('../components/XSummary.vue')
    },
    // {
    //   path: '/public/graph',
    //   name: "Graph",
    //   component: Graph
    // },
    // {
    //   path: '/public/d3.html',
    //   name: 'specific',
    //   component: Graph
    // }
    // // ,
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