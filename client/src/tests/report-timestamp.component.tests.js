import { shallowMount } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import ReportTimestamp from '../components/partials/ReportTimestamp.vue';

const expect = chai.expect;

describe('Reports Timestamp Test', function () {
  beforeEach(() => {
  })

  afterEach(() => {
  })
  
  it('shallow mount', () => {
    const wrapper = shallowMount(ReportTimestamp, {propsData:{report:{'startTime': 1618450753}}}) // Wednesday April 14, 2021 9:39:13 PM

    expect(wrapper.text()).contains('Wed')
    expect(wrapper.text()).contains('April')
    expect(wrapper.text()).contains('14')
  })
})

mocha.run();
