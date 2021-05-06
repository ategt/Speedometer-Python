import { shallowMount, mount } from '@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';
import sinon from 'sinon';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import ScheduleList from '../components/ScheduleList.vue';

const expect = chai.expect;

let sandbox;
let spyAlert;

describe('ScheduleList Shell Test', function () {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    spyAlert = sandbox.stub(window, 'alert');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const cleanText = function ( text ) {
    return text.replaceAll("\t",'').replaceAll("\r",'').replaceAll("\n",'').replaceAll("  ",'').replaceAll("  ",'');
  };

  it('loads empty', () => {
    const scheduleFixtures = [];

    const wrapper = shallowMount(ScheduleList, {propsData: { schedules: scheduleFixtures, defaultScheduleId: 0 }});

    equal(wrapper.vm.schedules.length, 0);
    expect(wrapper.text()).contains("No");
    expect(wrapper.text()).not.contains("Name");
    expect(wrapper.text()).not.contains("Default");
    expect(wrapper.text()).not.contains("DEFAULT");
    expect(wrapper.text()).not.contains("Delete");
    expect(wrapper.text()).not.contains("DELETE");
  });

  it('loads one as default', () => {
    const scheduleItems = [{name:"Start", duration:10}, {name:"Stop", duration: 20}];
    const scheduleFixtures = [{id:0, name:"Test Schedule", items: scheduleItems}];

    const wrapper = shallowMount(ScheduleList, {propsData: { schedules: scheduleFixtures, defaultScheduleId: 0 }});

    equal(wrapper.vm.schedules.length, 1);
    expect(wrapper.text()).not.contains("No");
    expect(wrapper.text()).contains("Name");
    expect(wrapper.text().toLowerCase()).contains("default");
    expect(wrapper.text().toLowerCase()).not.contains("delete");
  });

  it('loads two with same name', (done) => {
    const scheduleItems = [{name:"Start", duration:10}, {name:"Stop", duration: 20}];
    const scheduleFixtures = [{id:0, name:"Test Schedule", items: scheduleItems}, {id:1, name:"Test Schedule", items: scheduleItems}];

    const wrapper = shallowMount(ScheduleList, {propsData: { schedules: scheduleFixtures, defaultScheduleId: 0 }});

    equal(wrapper.vm.schedules.length, 2);
    expect(wrapper.text()).not.contains("No");
    expect(wrapper.text()).contains("Name");
    expect(wrapper.text().toLowerCase()).contains("default");
    expect(wrapper.text().toLowerCase()).contains("delete");

    const scheduleRows = wrapper.findAll('tr.schedule-row');

    equal(scheduleRows.length, 2);

    expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase().replaceAll("set default", "")).contains("default");
    expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase().replaceAll("set default", "")).not.contains("default");

    expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase()).not.contains("set default");
    expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase()).contains("set default");

    expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase()).not.contains("delete");
    expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase()).contains("delete");

    const retireButtons = wrapper.findAll('td.retire-schedule-button');

    retireButtons.at(0).trigger('click').then(() => {
      equal(spyAlert.called, true);
      done();
    });
  });

  it('default changes reflected in delete and set default buttons', (done) => {
    const scheduleItems = [{name:"Start", duration:10}, {name:"Stop", duration: 20}];
    const scheduleFixtures = [{id:5, name:"Test Schedule", items: scheduleItems}, {id:10, name:"Test Schedule", items: scheduleItems}];
    let defaultScheduleId = 10;

    const wrapper = shallowMount(ScheduleList, {propsData: { schedules: scheduleFixtures, defaultScheduleId }});

    const scheduleRows = wrapper.findAll('tr.schedule-row');

    equal(scheduleRows.length, 2);

    expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase().replaceAll("set default", "")).not.contains("default");
    expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase().replaceAll("set default", "")).contains("default");

    expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase()).contains("set default");
    expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase()).not.contains("set default");

    expect(cleanText(scheduleRows.at(0).element.innerText).toLowerCase()).contains("delete");
    expect(cleanText(scheduleRows.at(1).element.innerText).toLowerCase()).not.contains("delete");

    const setDefaultButtons = wrapper.findAll('span.set-default-button');

    equal(setDefaultButtons.length, 1);

    setDefaultButtons.at(0).trigger('click').then(() => {
      const emittedEvent = wrapper.emitted()["set-default-schedule"][0][0];
      const emittedScheduleId = parseInt( emittedEvent.currentTarget.dataset['id'] );
      equal( emittedScheduleId == 5, true);

      done();
    });
  });
});