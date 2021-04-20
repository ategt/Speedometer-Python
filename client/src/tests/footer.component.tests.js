import { shallowMount, mount, RouterLinkStub } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
import axios from 'axios';
import { mockGet } from './helpers.js';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Footer from '../components/partials/Footer.vue';

const expect = chai.expect;

let axiosGet;

describe('Footer Shell Test', function () {
  beforeEach(() => {
      axiosGet = axios.get;
      axios.get = mockGet;
  })

  afterEach(() => {
      axios.get = axiosGet;
  })
  
  it('initializes with data', () => {
    //const wrapper = shallowMount(Footer, stubs: ["router-link"])
    const wrapper = shallowMount(Footer, {stubs: {RouterLink: RouterLinkStub}})

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
})

mocha.run();
