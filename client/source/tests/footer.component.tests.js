import { shallowMount, mount, RouterLinkStub, createLocalVue } from '@vue/test-utils/dist/vue-test-utils.js';
import VueRouter from 'vue-router';
import { mockGet } from './helpers.js';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Footer from '../components/partials/Footer.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);

import router from '../router';

const expect = chai.expect;

describe('Footer Shell Test', function () {
  it('shallow mount', () => {
    const wrapper = shallowMount(Footer, {stubs: {RouterLink: RouterLinkStub}})

    expect(wrapper.text()).contains('Home')
    expect(wrapper.text()).contains('Info')
    expect(wrapper.text()).contains('Graph')
  });

  it('mount with actual routes', () => {
    const wrapper = mount(Footer, {localVue, router})

    expect(wrapper.text()).contains('Home')
    expect(wrapper.text()).contains('Info')
    expect(wrapper.text()).contains('Graph')
  });
});