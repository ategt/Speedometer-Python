// initial state
const state = () => ({
  timeRemaining: '-',
  activity: '-',
  errors: [],
  loading: false,
})

// getters
const getters = {
  getTimeRemaining: (state, getters, rootState) => {
    return state.timeRemaining;
  },
  getActivity: (state, getters, rootState) => {
    return state.activity;
  },
}

// actions
const actions = {}

// mutations
const mutations = {
  SOCKET_TABATA_TIMER_UPDATE_BROADCAST (state, payload) {
    const data = payload.data;
    state.timeRemaining = data.timeRemaining;
    state.activity = data.activity;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
