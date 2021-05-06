import Vue from 'vue'
import Vuex from 'vuex'
import timer from './modules/timer';
import speedometer from './modules/speedometer';
import reports from './modules/reports';
import readings from './modules/readings';
import schedules from './modules/schedules';
//import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
  	timer,
    reports,
    readings,
    schedules,
    speedometer,
  },
  strict: debug,
  plugins: [] //debug ? [createLogger()] : []
})
