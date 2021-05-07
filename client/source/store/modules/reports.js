import * as reportApi from '../../api/reports';
import { sortByStartingTime } from '../../shared/reports';

// initial state
const state = () => ({
  reports: [],
  errors: [],
  loading: false,
  sortFunction: sortByStartingTime,
})

// getters
const getters = {
  getReport: (state, getters, rootState) => (id) => {
    return state.reports.find(report => report.id === id);
  }
}

// actions
const actions = {
  populateReports ({ commit, state }) {
    if ( state.reports.length === 0 && state.loading == false ) {
      this.dispatch("reports/getAllReports");
    }
  },

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

  retireReport ({ state, commit }, reportIdString) {
      reportApi.retireReport(reportIdString).then(() => commit("removeReport", parseInt(reportIdString))).catch((error) => commit("addError", error))
  },

  updateRemarks ({ commit }, report ) {
    reportApi.updateRemarks(report.id, report.remarks).catch((error) => commit("addError", error));
  },

  submitReport ({ commit }, report ) {
    reportApi.createReport(report).catch((error) => commit("addError", error))
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

  setRemarks (state, {reportId, comment}) {
    state.reports.find(_report => _report.id == reportId).remarks = comment;
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
