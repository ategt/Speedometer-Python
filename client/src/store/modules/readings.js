import * as readingsApi from '../../api/readings';
//import { sortByStartingTime } from '../../src/reports';

// initial state
const state = () => ({
  readings: [],
  errors: [],
  loading: false,
})

// getters
const getters = {
  // getReadings: (state, getters, rootState) => (id) => {
  //   return state.reports.find(report => report.id === id);
  // }
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
  getReadings ({ commit }, report) {
    commit('setLoading', true);
    readingsApi.getReadings(report.startTime, report.stopTime).then(function (readings) {
      commit('setReadings', readings);
    }).catch(function (error) {
      commit('addError', error);
    }).finally(function (not_sure) {
      commit('setLoading', false);
    });
  },
}

// mutations
const mutations = {
  setReadings (state, readings) {
    state.readings = readings;
  },

  addError (state, error) {
    state.errors.push(error);
  },

  setLoading (state, loadingValue) {
    state.loading = loadingValue;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
