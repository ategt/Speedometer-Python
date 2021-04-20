import { shallowMount, mount, RouterLinkStub, createLocalVue } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
//import VueRouter from 'vue-router';
import { mockGet } from './helpers.js';

import axios from 'axios';
//import moxios from 'moxios';
import sinon from 'sinon';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Reports from '../views/Reports.vue';

// const localVue = createLocalVue();
// localVue.use(VueRouter);

// import router from '../router';

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
  
  it('shallow mount', () => {
    //const wrapper = shallowMount(Footer, stubs: ["router-link"])
    const wrapper = shallowMount(Reports, {stubs: {RouterLink: RouterLinkStub}})

    expect(wrapper.text()).contains('Home')
    expect(wrapper.text()).contains('Info')
    expect(wrapper.text()).contains('Graph')

    // wrapper.vm.$nextTick().then(function () {
    //   expect(wrapper.text()).contains('Pending List')
    //   expect(wrapper.findAll('.mot-parent').length > 1).equal(true)
    //   expect(wrapper.findAll('.mot-parent').length > 1).equals(true)
    //   //expect(wrapper.findAll('.mot-parent').length > 1).same(true)

    //   // click one of the mot buttons
    //   wrapper.findAll('.mot-parent').at(0).trigger('click').then(() => {
    //     console.log(wrapper.vm.currentMot)
    //     done()
    //   })
    // })
  })

  it('mount with actual routes', () => {
  //   const wrapper = mount(Reports, {localVue, router})

  //   expect(wrapper.text()).contains('Home')
  //   expect(wrapper.text()).contains('Info')
  //   expect(wrapper.text()).contains('Graph')
  })
})

mocha.run();
