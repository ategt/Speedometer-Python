import Vue from "vue";
import * as readingsApi from '../../api/readings';

// initial state
const state = () => ({
  readings: new Object(),
  errors: [],
  loading: false,
  outstanding: new Set(),
})

// getters
const getters = {};

// actions
const actions = {
  getReadings ({ commit, state }, report) {
    if ( !Object.keys(state.readings).map(reportId => parseInt(reportId)).includes(report.id) && !state.outstanding.has(report.id) ) {
      commit('setLoading', true);
      commit('addOutstanding', report.id);

      readingsApi.getReadings(report.startTime, report.stopTime).then(function (readings) {
        commit('setReadings', {readings, report});
      }).catch(function (error) {
        commit('addError', error);
      }).finally(function (not_sure) {
        commit('setLoading', false);
        commit('removeOutstanding', report.id);
      });
    }
  },
}

// mutations
const mutations = {
  setReadings (state, {readings, report}) {
    Vue.set(state.readings, report.id, readings);
  },

  addError (state, error) {
    state.errors.push(error);
  },

  setLoading (state, loadingValue) {
    state.loading = loadingValue;
  },

  addOutstanding (state, reportId) {
    state.outstanding.add(reportId);
  },

  removeOutstanding (state, reportId) {
    state.outstanding.delete(reportId);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
