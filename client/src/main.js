import Vue from 'vue'
//import * as io from 'socket.io-client'
import { io } from 'socket.io-client'
//import { io } from '../../node_modules/socket.io-client/dist/socket.io'
//import VueSocketIO from 'vue-socket.io'
import VueSocketIO from '../../cdn/build'
//import Vue from '../../node_modules/vue/dist/vue.js';
//import Graph from './views/Graph.vue';
import router from './router';
import store from './store';
import App from './App.vue';
// import './../node_modules/bulma/css/bulma.css';

// // Import the Auth0 configuration
// import { domain, clientId } from "../auth_config.json";

// // Import the plugin here
// import { Auth0Plugin } from "./auth";

// // Install the authentication plugin here
// Vue.use(Auth0Plugin, {
//   domain,
//   clientId,
//   onRedirectCallback: appState => {
//     router.push(
//       appState && appState.targetUrl
//         ? appState.targetUrl
//         : window.location.pathname
//     );
//   }
// });

Vue.config.productionTip = false

Vue.use(VueSocketIO, io(), store)

window.addEventListener("load", function (event) {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
});