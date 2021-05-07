import * as clientsApi from '../../api/clients';

// initial state
const state = () => ({
  messages: new Array(),
  events: new Array(),
  clients: new Set(),
});

// getters
const getters = {}

// actions
const actions = {
  getAllClients ({ commit, state }) {
    if ( state.clients.length < 1) {
      clientsApi.getAllClients().then((clients) => commit("replaceClients", clients));
    }
  },
  sendMessage ({ state, commit }, data) {
    this._watcherVM.$socket.emit('send message', data);
  },
}

// mutations
const mutations = {
  replaceClients (state, payload) {
    state.clients = payload;
  },
  SOCKET_ADMIN_MESSAGE (state, payload) {
    state.messages.push(payload);
  },
  SOCKET_ADMIN_EVENT (state, payload) {
    state.events.push(payload);

    if ( payload.type ) {
      if ( payload.type == "connection" ) {
        state.clients.add(payload.sid);
      } else if ( payload.type == "disconnection" ) {
        state.clients.delete(payload.sid);
      }
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
