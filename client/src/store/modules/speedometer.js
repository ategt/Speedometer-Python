// initial state
const state = () => ({
  speed: 0,
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
const actions = {}

// mutations
const mutations = {
  SOCKET_SPEEDOMETER_UPDATE_BROADCAST (state, payload) {
    state.speed = payload.data['currentRevsPerMin'];
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
