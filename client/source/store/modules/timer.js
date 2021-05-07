// initial state
const state = () => ({
  timeRemaining: '-',
  activity: '-',
  clockStarted: false,
  errors: [],
  loading: false,
});

// getters
const getters = {
  getTimeRemaining: (state, getters, rootState) => {
    return state.timeRemaining;
  },
  getActivity: (state, getters, rootState) => {
    return state.activity;
  },
  hasClockStarted: (state, getters, rootState) => {
    return state.clockStarted;
  },
}

// actions
const actions = {
  triggerTimerStart ({ state, commit, getters }, vm) {
    vm.$socket.emit('tabata timer action', {data:"START", schedule: vm.$store.getters["schedules/makeSchedule"]});
    commit("triggeredClock");
  },
  triggerTimerStop ({ state, commit, getters }, vm) {
    vm.$socket.emit('tabata timer action', {data:"STOP"});
  },
};

// mutations
const mutations = {
  SOCKET_TABATA_TIMER_UPDATE_BROADCAST (state, payload) {
    const data = payload.data;
    state.timeRemaining = data.timeRemaining;
    state.activity = data.activity;

    // If timer is running, mark variable as running.
    if (state.clockStarted && data.timeRemaining !== " - ") {
      state.clockStarted = true;
    }
  },
  resetClock (state) {
    state.clockStarted = false;
  },
  triggeredClock (state) {
    state.clockStarted = true;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
