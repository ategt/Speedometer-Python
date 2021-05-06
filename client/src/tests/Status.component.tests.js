import { shallowMount, mount } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';
import sinon from 'sinon';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Status from '../components/Status.vue';

const expect = chai.expect;

describe('Status Test', function () {
  const cleanText = function ( text ) {
    return text.replaceAll("\t",'').replaceAll("\r",'').replaceAll("\n",'').replaceAll("  ",'').replaceAll("  ",'');
  };

  it('play some data', () => {
    const wrapper = shallowMount(Status, {propsData: { timerRemaining: null, activity: null, speed: null}});

    //equal(wrapper.vm.schedules.length, 0);
    expect(wrapper.text()).contains("-");
    expect(wrapper.text()).not.contains("undefined");
    expect(wrapper.text()).not.contains("null");

    console.log(wrapper.html());
  });

  // it('default changes reflected in delete and set default buttons', (done) => {
  //   const scheduleItems = [{name:"Start", duration:10}, {name:"Stop", duration: 20}];
  //   const scheduleFixtures = [{id:5, name:"Test Schedule", items: scheduleItems}, {id:10, name:"Test Schedule", items: scheduleItems}];
  //   let defaultScheduleId = 10;

  //   const wrapper = shallowMount(ScheduleList, {propsData: { schedules: scheduleFixtures, defaultScheduleId }});

  //   const scheduleRows = wrapper.findAll('tr.schedule-row');

  //   equal(scheduleRows.length, 2);

  //   expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase().replaceAll("set default", "")).not.contains("default");
  //   expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase().replaceAll("set default", "")).contains("default");

  //   expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase()).contains("set default");
  //   expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase()).not.contains("set default");

  //   expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase()).contains("delete");
  //   expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase()).not.contains("delete");

  //   const setDefaultButtons = wrapper.findAll('span.set-default-button');

  //   equal(setDefaultButtons.length, 1);

  //   setDefaultButtons.at(0).trigger('click').then(() => {
  //     const emittedScheduleId = wrapper.emitted()["set-default-schedule"][0][0];
  //     equal( emittedScheduleId == 5, true);

  //     done();
  //   });
  // });
});

mocha.run();
