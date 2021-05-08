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
  populateClients ({ commit, state, dispatch }) {
    if ( state.connections.size <= 1) {
      dispatch("getAllClients");
    }
  },
  getAllClients ({ commit, state }) {
    clientsApi.getAllClients().then((clients) => commit("replaceClients", clients));
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
    state.events.push(Object.assign({}, payload, {recieved: (+new Date())}));
  },
  SOCKET_ADMIN_MESSAGE (state, payload) {
    state.messages.push(Object.assign({}, payload, {recieved: (+new Date())}));
  },
  SOCKET_ADMIN_EVENT (state, payload) {
    state.events.push(Object.assign({}, payload, {recieved: (+new Date())}));

    if ( payload.type ) {
      const temp_connections = new Set(state.connections.values());
      if ( payload.type == "connection" ) {
        temp_connections.add(payload.sid);
      } else if ( payload.type == "disconnection" ) {
        temp_connections.delete(payload.sid);
      }
      state.connections = new Set(temp_connections.values());
    } else if ( payload.data && payload.data === "Connected" ) {
      this._watcherVM.$socket.dispatch("getAllClients");
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
