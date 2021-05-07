import Vue from "Vue";

import * as clientsApi from '../../api/clients';

// initial state
const state = () => ({
  clients: new Array(),
  messages: new Array(),
})

// getters
const getters = {}

// actions
const actions = {
  getAllClients ({ commit }) {
    clientsApi.getAllClients().then((clients) => commit("replaceClients", clients));
  },
  sendMessage ({ state, commit }, data) {
    this._watcherVM.$socket.emit('send message', data);
    //this.$socket.emit('send message', data);
    //Vue.$socket.emit('send message', data);
  },
}

// mutations
const mutations = {
  replaceClients (state, payload) {
    state.clients = payload;
  },
  SOCKET_CLIENT_MESSAGE (state, payload) {
    state.messages.push(payload);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
