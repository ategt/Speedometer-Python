import * as scheduleApi from '../../api/schedules';
import { loadScheduleFromStorage, defaultSchedule, saveScheduleLocally, isScheduleInStorage, newSchedule, isScheduleRemote, saveSchedule, saveAsSchedule, sortByUpdated, sortByCreated, sortByName, sortById } from '../../shared/schedule';

// initial state
const state = () => ({
  schedules: [],
  errors: [],
  loading: false,
  default: 0,
  activeSchedule: loadScheduleFromStorage(),
  sortingFunction: sortByName,
});

// getters
const getters = {
  getSchedule: (state, getters, rootState) => (id) => {
    return state.schedules.find(schedule => schedule.id === id);
  },
  getDefaultScheduleId: (state, getters, rootState) => {
    return state.default;
  },
  getDefaultSchedule: (state, getters, rootState) => {
    const defaultId = getters.getDefaultScheduleId;
    return state.schedules.find(schedule => schedule.id == defaultId);
  },
  getActiveSchedule: (state, getters, rootState) => {
    return state.activeSchedule;
  },
  getSchedules: (state, getters, rootState) => {
    return state.schedules;
  },
  makeSchedule: (state, getters, rootState) => {  // This was buildSchedule.  Not sure why we need it, looked unused.
    return state.activeSchedule.items;
  },
  getSortedSchedules: (state, getters, rootState) => {
    return Array.from(state.schedules).sort(state.sortingFunction);
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
    scheduleApi.getSchedules().then(function (data) {
      commit('setSchedules', data.schedules);
      commit('setDefault', data.default.id);

      if ( !isScheduleInStorage() ) {
        commit("setActiveSchedule", data.default);
      }
    }).catch(function (error) {
      commit('addError', error);
    }).finally(function (not_sure) {
      commit('setLoading', false);
    });
  },

  retireSchedule ({ state, commit, getters }, scheduleIdString) {
    const id = parseInt(scheduleIdString);
    const schedule = getters.getSchedule(id);
    commit("removeSchedule", id);

    scheduleApi.retireSchedule(scheduleIdString).catch((error) => {
      commit("addError", error);
      commit("addSchedule", schedule);
    });
  },

  updateSchedule ({ commit }, schedule ) {
    commit('mergeSchedule', schedule);
    scheduleApi.updateSchedule(schedule).catch((error) => commit("addError", error));
  },

  createSchedule ({ commit }, schedule ) {
    scheduleApi.createSchedule(schedule).then((responseSchedule) => {
      commit("addSchedule", responseSchedule);

      if ( responseSchedule.default ) {
        commit("setDefault", responseSchedule.id);
      }
    });
  },

  putDefault ({ commit, getters }, id ) {
    const oldDefaultId = getters.getDefaultScheduleId;
    commit("setDefault", id);
    scheduleApi.setDefault(id).catch((error) => {
      commit("addError", error);
      commit("setDefault", oldDefaultId);
    });
  },

  //saveActiveSchedule ({ commit, dispatch, getters }) {
  saveActiveSchedule ({ commit, dispatch, getters }) {
    const schedule = getters.getActiveSchedule;
    saveScheduleLocally(schedule);

    if (isScheduleRemote(schedule)) {
      dispatch("updateSchedule", schedule);
    } else {
      dispatch("createSchedule", schedule);
    }
  },

  createActiveSchedule ({ commit, dispatch, getters }) {
    const schedule = getters.getActiveSchedule;
    saveScheduleLocally(schedule);

    dispatch("createSchedule", schedule);
  },
};

// mutations
const mutations = {
  setSchedules (state, schedules) {
    state.schedules = schedules.map(schedule => Object.assign({}, schedule, {default: false}));
  },  

  setDefault (state, id) {
    state.default = id;
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

  addSchedule (state, schedule) {
    state.schedules.push(schedule);
  },

  newSchedule (state) {
    state.activeSchedule = newSchedule();
  },

  removeSchedule (state, id) {
    state.schedules = state.schedules.filter(schedule => schedule.id != id);
  },

  switchActiveSchedule (state, id) {
    state.activeSchedule = JSON.parse(JSON.stringify(state.schedules.find(itm => itm.id == id)));
  },

  setActiveSchedule (state, schedule) {
    state.activeSchedule = schedule;
  },

  addActiveScheduleItem (state) {
    const new_id = state.activeSchedule.items.map(item => item.id).reduce((itm, acc) => itm > acc ? itm : acc, 0) + 1;
    state.activeSchedule.items.push({id:new_id, activity:"Activity", interval: 5});
  },

  removeActiveScheduleItem (state, id) {
    state.activeSchedule.items = state.activeSchedule.items.filter(item => item.id != id);
  },

  updateActiveScheduleItemInterval (state, {id, value}) {
    state.activeSchedule.items.find(item => item.id == id).interval = value;
  },

  replaceItems (state, newScheduleItems) {
    state.activeSchedule.items = newScheduleItems;
  },

  updateActiveScheduleName (state, name) {
    state.activeSchedule.name = name;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
