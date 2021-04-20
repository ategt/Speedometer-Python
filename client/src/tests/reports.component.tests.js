import { shallowMount, mount, RouterLinkStub, createLocalVue } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
import { mockGet } from './helpers.js';

import axios from 'axios';
//import moxios from 'moxios';
import sinon from 'sinon';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Reports from '../views/Reports.vue';

const expect = chai.expect;

let axiosGet;

describe('Reports Shell Test', function () {
  beforeEach(() => {
      axiosGet = axios.get;
      axios.get = mockGet;
  })

  afterEach(() => {
      axios.get = axiosGet;
  })
  
  it('shallow mount x', (done) => {
    const wrapper = shallowMount(Reports, {stubs: {RouterLink: RouterLinkStub}})

    expect(wrapper.text()).contains('Loading')

    wrapper.vm.$nextTick().then(function () {    
      wrapper.vm.$nextTick().then(function () {
        expect(wrapper.text()).contains('A comment goes here.')
        expect(wrapper.findAll('.report-item').length > 1).equal(true)
        expect(wrapper.findAll('.report-item').length > 1).equals(true)

        console.log(wrapper.html())
        //expect(wrapper.html()).contains("start=1618450753&stop=1618452042&id=83")

        // click one of the mot buttons
        wrapper.findAll('.report-item').at(0).trigger('click').then(() => {
          console.log(wrapper.vm.currentMot)
          done()
        })
      })
    })
  }).timeout(9000)

  // it('mount with actual routes', () => {
  // //   const wrapper = mount(Reports, {localVue, router})

  // //   expect(wrapper.text()).contains('Home')
  // //   expect(wrapper.text()).contains('Info')
  // //   expect(wrapper.text()).contains('Graph')
  // })
})

mocha.run();
