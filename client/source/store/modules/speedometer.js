import Vue from "Vue";

// initial state
const state = () => ({
  speed: 0,
  speedHistory: new Set(),
  errors: [],
  loading: false,
})

// getters
const getters = {
  getSpeed: (state, getters, rootState) => {
    return state.speed;
  },
}

// actions
const actions = {
  stopRecorder (context) {
    Vue.$socket.emit("recorder directive", {directive:"shutdown"});
  },
}

// mutations
const mutations = {
  SOCKET_SPEEDOMETER_UPDATE_BROADCAST (state, payload) {
    state.speed = payload.data['currentRevsPerMin'];
    state.speedHistory.add(payload.data);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
