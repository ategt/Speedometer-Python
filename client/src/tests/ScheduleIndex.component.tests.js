import { shallowMount, mount } from '@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import ScheduleIndex from '../components/ScheduleIndex.vue';

const expect = chai.expect;

describe('ScheduleIndex Shell Test', function () {
  it('loads empty', () => {
    const scheduleFixtures = [];

    const wrapper = shallowMount(ScheduleIndex, {propsData: { schedules: scheduleFixtures, defaultScheduleId: 0 }});

    equal(wrapper.vm.schedules.length, 0);
  });
});