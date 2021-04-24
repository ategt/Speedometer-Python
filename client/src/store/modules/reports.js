import * as reportApi from '../../api/reports';
import { sortByStartingTime } from '../../src/reports';

// initial state
const state = () => ({
  reports: [],
  errors: [],
  loading: false,
  sortFunction: sortByStartingTime,
})

// getters
const getters = {}

// actions
const actions = {
  getAllReports ({ commit }) {
    commit('setLoading', true);
    reportApi.getReports().then(function (reports) {
      commit('setReports', reports);
    }).catch(function (error) {
      commit('addError', error);
    }).finally(function (not_sure) {
      commit('setLoading', false);
    });
  },

  retireReport ({ state, commit }, event) {
      const reportIdString = event.target.dataset.report;
      reportApi.retireReport(reportIdString).then(() => commit("removeReport", parseInt(reportIdString))).catch((error) => commit("addError", error))
  },
}

// mutations
const mutations = {
  setReports (state, reports) {
    state.reports = reports;
  },

  addError (state, error) {
    state.errors.push(error);
  },

  setLoading (state, loadingValue) {
    state.loading = loadingValue;
  },

  removeReport (state, id) {
    state.reports = state.reports.filter(report => report.id !== id);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
