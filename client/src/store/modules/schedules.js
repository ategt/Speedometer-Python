import * as scheduleApi from '../../api/schedules';

// initial state
const state = () => ({
  schedules: [],
  errors: [],
  loading: false,
  default: 0,
})

// getters
const getters = {
  getSchedule: (state, getters, rootState) => (id) => {
    return state.schedules.find(schedule => schedule.id === id);
  },
  getDefaultScheduleId: (state, getters, rootState) => {
    return state.default;
  },
  getSchedules: (state, getters, rootState) => {
    return state.schedules;
  },
};

// actions
const actions = {
  populateSchedules ({ commit, state }) {
    if ( state.schedules.length === 0 && state.loading == false ) {
      this.dispatch("schedules/loadAllSchedules");
    }
  },

  loadAllSchedules ({ commit }) {
    commit('setLoading', true);
    scheduleApi.getSchedules().then(function (schedules) {
      commit('setSchedules', schedules);
    }).catch(function (error) {
      commit('addError', error);
    }).finally(function (not_sure) {
      commit('setLoading', false);
    });
  },

  retireSchedule ({ state, commit }, scheduleIdString) {
    scheduleApi.retireSchedule(scheduleIdString).then(() => commit("removeSchedule", parseInt(scheduleIdString))).catch((error) => commit("addError", error));
  },

  updateSchedule ({ commit }, schedule ) {
    // commit('mergeSchedule', schedule);
    scheduleApi.updateSchedule(schedule).catch((error) => commit("addError", error));
  },
};

// mutations
const mutations = {
  setSchedules (state, schedules) {
    state.schedules = schedules;
  },

  addError (state, error) {
    state.errors.push(error);
  },

  setLoading (state, loadingValue) {
    state.loading = loadingValue;
  },

  mergeSchedule (state, newSchedule) {
    const oldSchedule = state.schedules.find(schedule => schedule.id == newSchedule.id);
    const mergedSchedule = {...oldSchedule, ...newSchedule};
    state.schedules = [...state.schedules.filter(schedule => schedule.id != newSchedule.id), mergedSchedule];
  },

  removeSchedule (state, id) {
    state.schedules = state.schedules.filter(schedule => schedule.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
