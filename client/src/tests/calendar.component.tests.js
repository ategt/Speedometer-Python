import { shallowMount, mount, RouterLinkStub, createLocalVue } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Calendar from '../components/Calendar.vue';

const expect = chai.expect;

describe('Calendar Shell Test', function () {
  // beforeEach(() => {})

  // afterEach(() => {})
  
  it('shallow mount with nothing', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: [reportFixtures], month: 1, year: 2021 }});

    console.log(wrapper.html());
    console.log(wrapper.text());

    for ( let date = 1 ; date <= 31 ; date += 1 ) {
        expect(wrapper.text()).contains(String(date));
    }

    expect(wrapper.text()).not.contains("32");
    expect(wrapper.text()).not.contains("0");
  });

  it('shallow mount with data', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: [reportFixtures], month: 1, year: 2021 }});

    //equal();
  });

    // expect(wrapper.text()).contains('Home')
    // expect(wrapper.text()).contains('Info')
    // expect(wrapper.text()).contains('Graph')

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
  // });
});

mocha.run();
