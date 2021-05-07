import Vue from 'vue'
import Vuex from 'vuex'
import timer from './modules/timer';
import clients from './modules/clients';
import reports from './modules/reports';
import readings from './modules/readings';
import schedules from './modules/schedules';
import admin_info from './modules/admin_info';
import speedometer from './modules/speedometer';
//import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
  	timer,
    clients,
    reports,
    readings,
    schedules,
    admin_info,
    speedometer,
  },
  strict: debug,
  plugins: [] //debug ? [createLogger()] : []
})
