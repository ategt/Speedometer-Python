import Vue from 'vue'
import SocketIO from 'socket.io-client'
import VueAuth from 'vue-auth';

import VueSocketIO from './dependencies/vue-socket.io/src/Main'
import router from './router';
import store from './store';
import App from './App.vue';
// import './../node_modules/bulma/css/bulma.css';var VueAuth = require('vue-auth')


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

Vue.use(VueSocketIO, SocketIO(), store)
Vue.use(VueAuth)

window.addEventListener("load", function (event) {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
});