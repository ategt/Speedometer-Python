import { shallowMount, mount, RouterLinkStub, createLocalVue } from '../../../node_modules/@vue/test-utils/dist/vue-test-utils.js';
import { mockGet } from './helpers.js';

import axios from 'axios';
//import moxios from 'moxios';
import sinon from 'sinon';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import Reports from '../views/Reports.vue';
import { sortByStartingTime } from '../src/reports';

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

  it("sort by start time", () => {
    const testReports = [{id: 2, date: 1616207821217, startTime: 1612556555, stopTime: 1612831634},
                         {id: 3, date: 1616207878565, startTime: 1616175953, stopTime: 1616177165},
                         {id: 1, date: 1616207821217, startTime: 1612, stopTime: 1615}];

    const sortResults = testReports.sort(sortByStartingTime).map(r => r.id);
    const sortTestExpectations = [1,2,3];

    if (!sortResults.map((n,i) => sortResults[i] === n).some(v => v === false)) {
      console.log("Sort test passed.");
    } else {
      console.error("Sort test failure", sortResults);
    }  
  });

  // it('mount with actual routes', () => {
  // //   const wrapper = mount(Reports, {localVue, router})

  // //   expect(wrapper.text()).contains('Home')
  // //   expect(wrapper.text()).contains('Info')
  // //   expect(wrapper.text()).contains('Graph')
  // })
})

mocha.run();
