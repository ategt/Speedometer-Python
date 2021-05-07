import { shallowMount, mount } from '@vue/test-utils'
import axios from '../axios.min'
import App from '../App.vue'
import { mockGet } from './helpers.js'

import chai from './lib/chai.js'
import './lib/mocha.js'


mocha.setup('bdd');

const expect = chai.expect;

let axiosGet;

describe('App Shell Test', function () {
  beforeEach(() => {
      axiosGet = axios.get;
      axios.get = mockGet;
  })

  afterEach(() => {
      axios.get = axiosGet;
  })
  
  it('initializes with data', (done) => {
    const wrapper = shallowMount(App)

    expect(wrapper.text()).contains('Cool loading screen...')

    wrapper.vm.$nextTick().then(function () {
      expect(wrapper.text()).contains('Pending List')
      expect(wrapper.findAll('.mot-parent').length > 1).equal(true)
      expect(wrapper.findAll('.mot-parent').length > 1).equals(true)
      //expect(wrapper.findAll('.mot-parent').length > 1).same(true)

      // click one of the mot buttons
      wrapper.findAll('.mot-parent').at(0).trigger('click').then(() => {
        console.log(wrapper.vm.currentMot)
        done()
      })
    })
  })
})

mocha.run();
