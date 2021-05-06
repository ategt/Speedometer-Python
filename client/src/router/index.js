import Vue from 'vue'
import Router from 'vue-router'
//import { authGuard } from "../auth/authGuard";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Dashboard.vue'),
    },
    {
      path: '/public/:place',
      name: "Sumplace",
      component: () => import('../components/Summary.vue')
    },
    {
      path: '/public-info',
      name: "Reports",
      component: () => import('../views/Reports.vue')
    },
    {
      path: '/public-schedule',
      name: "Schedule",
      component: () => import('../views/Schedule.vue')
    },
    {
      path: '/graph/:id(\\d+)?',
      name: "Graph",
      component: () => import('../views/ReportDetail.vue')
    },
    {
      path: '/ted',
      name: "Ted",
      component: () => import('../components/Calendar.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue')
    },
    {
      path: '/reciever',
      alias: '/public-reciever',
      name: 'Reciever',
      component: () => import('../views/Reciever.vue'),
    },
    {
      path: '/status',
      alias: '/public-status',
      name: 'StatusView',
      component: () => import('../views/Status.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
    },
    // {
    //   path: '/event/:id',
    //   name: 'eventSingle',
    //   component: () => import('../views/EventSingle.vue'),
    //   beforeEnter: authGuard
    // }
  ]
})