import Vue from 'vue'
import Vuex from 'vuex'
import reports from './modules/reports';
import readings from './modules/readings';
//import products from './modules/products'
//import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    reports,
    readings,
  },
  strict: debug,
  plugins: [] //debug ? [createLogger()] : []
})
