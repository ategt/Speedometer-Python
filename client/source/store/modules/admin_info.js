import * as clientsApi from '../../api/clients';

// initial state
const state = () => ({
  messages: new Array(),
  events: new Array(),
  connections: new Set(),
});

// getters
const getters = {
  getConnections ( state, getters, rootState) {
      return state.connections;
  },
  allClients ( state, getters, rootState) {
      return state.connections;
  },
};

// actions
const actions = {
  getAllClients ({ commit, state }) {
    if ( state.connections.length < 1) {
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
    state.connections = payload;
  },
  SOCKET_INFORMATION (state, payload) {
    state.events.push(payload);
  },
  SOCKET_ADMIN_MESSAGE (state, payload) {
    state.messages.push(payload);
  },
  SOCKET_ADMIN_EVENT (state, payload) {
    state.events.push(payload);

    if ( payload.type ) {
      if ( payload.type == "connection" ) {
        state.connections.add(payload.sid);
      } else if ( payload.type == "disconnection" ) {
        state.connections.delete(payload.sid);
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
