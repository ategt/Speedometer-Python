import { shallowMount, mount } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import ScheduleEditor from '../components/ScheduleEditor.vue';

const expect = chai.expect;

describe('ScheduleEditor Shell Test', function () {
  it('loads empty', () => {
  	const scheduleItems = [];
    const scheduleFixture = {id:5, name:"Test Schedule", items: scheduleItems};

    const wrapper = shallowMount(ScheduleEditor, {propsData: { scheduleEdit: scheduleFixture }});

    equal(wrapper.vm.schedule.items.length, 0);
    equal(wrapper.find(".nothing-yet").isVisible(), true);
  });

  it('load with items', () => {
  	const scheduleItems = [{name:"Start", duration:10}, {name:"Stop", duration: 20}];
    const scheduleFixture = {id:5, name:"Test Schedule", items: scheduleItems};

    const wrapper = shallowMount(ScheduleEditor, {propsData: { scheduleEdit: scheduleFixture }});

    equal(wrapper.vm.schedule.items.length, 2);
    equal(wrapper.findAll(".nothing-yet").length, 0);
  });

  it('handle schedule edit', (done) => {
  	const scheduleItems = [{name:"Start", duration:10}, {name:"Stop", duration: 20}];
    const scheduleFixture = {id:5, name:"Test Schedule", items: scheduleItems};

    let updatedValue;

    const mockComputation = {scheduleName: {
      get () {
        return "Mock Name";
      },
      set (value) {
        updatedValue = value;
      }
    },};

    const wrapper = shallowMount(ScheduleEditor, {propsData: { scheduleEdit: scheduleFixture }, computed: mockComputation});

	const scheduleNameField = wrapper.find("#schedule-name");
	scheduleNameField.element.focus();
	scheduleNameField.element.value = "Other Name";
	scheduleNameField.element.blur();

	equal(wrapper.find("#schedule-name").element.value, "Other Name");

	scheduleNameField.trigger('input').then(() => {
	  // const svms = expect(wrapper.vm.schedule.name);
	  // svms.true();
	  // svms.ok();
	  equal(updatedValue, "Other Name");
	  done();
	});
  });
});

mocha.run();
