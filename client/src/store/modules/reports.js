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
const getters = {
  getReport: (state, getters, rootState) => (id) => {
    return state.reports.find(report => report.id === id);
  }
  // cartProducts: ({state, getters, rootState}, id) => {
  //   return state; 
     //}//.items.map(({ id, quantity }) => {
  //     const product = rootState.products.all.find(product => product.id === id)
  //     return {
  //       title: product.title,
  //       price: product.price,
  //       quantity
  //     }
  //   })
  // },
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
