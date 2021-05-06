import { shallowMount, mount, RouterLinkStub, createLocalVue } from '@vue/test-utils/dist/vue-test-utils.js';
import { equal } from 'assert';

import chai from './lib/chai.js';

mocha.setup('bdd');

import Calendar from '../components/Calendar.vue';

const expect = chai.expect;

describe('Calendar Shell Test', function () {
  // beforeEach(() => {})

  // afterEach(() => {})

  const buildModifiedHtml = function (html) {
    return html.replaceAll("\n","").replaceAll(" ","").replaceAll(/class=\"([^\"]*)\"/g, "").replaceAll(/data\-report\-id=\"([^\"]*)\"/g, "");
  };

  const leadingBlankSpaces = function (spaces) {
    let result = "<tr>";

    for ( let i = 0 ; i < spaces ; i += 1 ) {
      result += `<td></td>`;
    }

    result += `<td>1</td>`;

    return result;
  };
  
  const trailingBlankSpaces = function (lastDate, spaces) {
    let result = `<td>${lastDate}</td>`;

    for ( let i = 0 ; i < spaces ; i += 1 ) {
      result += `<td></td>`;
    }

    result += `</tr>`;

    return result;
  };
  
  it('leading blank space', () => {
    const one_blank_space = `<tr><td>1</td>`;
    equal(one_blank_space, leadingBlankSpaces(0));

    const two_blank_spaces = `<tr><td></td><td>1</td>`;
    equal(two_blank_spaces, leadingBlankSpaces(1));

    const three_blank_spaces = `<tr><td></td><td></td><td>1</td>`;
    equal(three_blank_spaces, leadingBlankSpaces(2));

    const four_blank_spaces = `<tr><td></td><td></td><td></td><td>1</td>`;
    equal(four_blank_spaces, leadingBlankSpaces(3));

    const five_blank_spaces = `<tr><td></td><td></td><td></td><td></td><td>1</td>`;
    equal(five_blank_spaces, leadingBlankSpaces(4));

    const six_blank_spaces = `<tr><td></td><td></td><td></td><td></td><td></td><td>1</td>`;
    equal(six_blank_spaces, leadingBlankSpaces(5));

    const seven_blank_spaces = `<tr><td></td><td></td><td></td><td></td><td></td><td></td><td>1</td>`;
    equal(seven_blank_spaces, leadingBlankSpaces(6));

    const eight_blank_spaces = `<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>1</td>`;
    equal(eight_blank_spaces, leadingBlankSpaces(7));
  });

  it('trailing blank space', () => {
    const one_blank_space = `<td>35</td></tr>`;
    equal(one_blank_space, trailingBlankSpaces(35, 0));

    const two_blank_spaces = `<td>35</td><td></td></tr>`;
    equal(two_blank_spaces, trailingBlankSpaces(35, 1));

    const three_blank_spaces = `<td>35</td><td></td><td></td></tr>`;
    equal(three_blank_spaces, trailingBlankSpaces(35, 2));

    const four_blank_spaces = `<td>35</td><td></td><td></td><td></td></tr>`;
    equal(four_blank_spaces, trailingBlankSpaces(35, 3));

    const five_blank_spaces = `<td>35</td><td></td><td></td><td></td><td></td></tr>`;
    equal(five_blank_spaces, trailingBlankSpaces(35, 4));

    const six_blank_spaces = `<td>35</td><td></td><td></td><td></td><td></td><td></td></tr>`;
    equal(six_blank_spaces, trailingBlankSpaces(35, 5));

    const seven_blank_spaces = `<td>35</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    equal(seven_blank_spaces, trailingBlankSpaces(35, 6));

    const eight_blank_spaces = `<td>35</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    equal(eight_blank_spaces, trailingBlankSpaces(35, 7));
  });

  it('get first day of month', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: reportFixtures, month: 1, year: 2021 }});

    equal(wrapper.vm.month, 1);
    equal(wrapper.vm.year, 2021);

    const firstDayOfMonth = wrapper.vm.getFirstDayOfMonth(wrapper.vm.month, wrapper.vm.year);

    equal(firstDayOfMonth, 1);

    const getFirstDayOfMonth = wrapper.vm.getFirstDayOfMonth;

    equal(getFirstDayOfMonth(3, 2021), 4);
    equal(getFirstDayOfMonth(1, 2020), 6);
  });

  it('get day of month', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: reportFixtures, month: 1, year: 2021 }});

    const firstCellInCalendar = wrapper.vm.dayOfMonth(0, 0);

    equal(firstCellInCalendar, "");

    const secondCellInCalendar = wrapper.vm.dayOfMonth(0, 1);

    equal(secondCellInCalendar, 1);
  });

  it('get leap februrary day of month', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: reportFixtures, month: 1, year: 2020 }});

    const getFirstDayOfMonth = wrapper.vm.getFirstDayOfMonth;
    const dayOfMonth = wrapper.vm.dayOfMonth;

    equal(getFirstDayOfMonth(1, 2020), 6);

    const secondCellInCalendar = wrapper.vm.dayOfMonth(0, 1);

    equal(secondCellInCalendar, "");
  });

  it('shallow mount february with nothing', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: reportFixtures, month: 1, year: 2021 }});

    for ( let date = 1 ; date <= 28 ; date += 1 ) {
        expect(wrapper.text()).contains(String(date));
    }

    expect(wrapper.text()).not.contains("29");
    expect(wrapper.text()).not.contains("32");
    expect(wrapper.text()).not.contains("\n0\n");
    expect(wrapper.text()).not.contains("\n0\t");
    expect(wrapper.text()).not.contains("\t0\n");
    expect(wrapper.text()).not.contains("\t0\t");

    equal(wrapper.vm.dayOfMonth(0,0), "");
    equal(wrapper.vm.dayOfMonth(0,1), 1);

    const modifiedHtml = buildModifiedHtml(wrapper.html());

    expect(modifiedHtml).contains(leadingBlankSpaces(1)); // First space on calendar should be blank.
    expect(modifiedHtml).contains(trailingBlankSpaces(28, 6)); // Last six spaces on calendar should be blank.
  });

  it('shallow mount leap february with nothing', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: reportFixtures, month: 1, year: 2020 }});

    for ( let date = 1 ; date <= 29 ; date += 1 ) {
        expect(wrapper.text()).contains(String(date));
    }

    expect(wrapper.text()).not.contains("30");
    expect(wrapper.text()).not.contains("32");
    expect(wrapper.text()).not.contains("\n0\n");
    expect(wrapper.text()).not.contains("\n0\t");
    expect(wrapper.text()).not.contains("\t0\n");
    expect(wrapper.text()).not.contains("\t0\t");

    const modifiedHtml = buildModifiedHtml(wrapper.html());

    equal(wrapper.vm.dayOfMonth(0,0), "", `wrapper.vm.dayOfMonth(0,0) should be '' but was ${wrapper.vm.dayOfMonth(0,0)}`);
    equal(wrapper.vm.dayOfMonth(0,1), "", `wrapper.vm.dayOfMonth(0,1) should be '' but was ${wrapper.vm.dayOfMonth(0,1)}`);
    equal(wrapper.vm.dayOfMonth(0,2), "", `wrapper.vm.dayOfMonth(0,2) should be '' but was ${wrapper.vm.dayOfMonth(0,2)}`);
    equal(wrapper.vm.dayOfMonth(0,3), "", `wrapper.vm.dayOfMonth(0,3) should be '' but was ${wrapper.vm.dayOfMonth(0,3)}`);
    equal(wrapper.vm.dayOfMonth(0,4), "", `wrapper.vm.dayOfMonth(0,4) should be '' but was ${wrapper.vm.dayOfMonth(0,4)}`);
    equal(wrapper.vm.dayOfMonth(0,5), "", `wrapper.vm.dayOfMonth(0,5) should be '' but was ${wrapper.vm.dayOfMonth(0,5)}`);
    equal(wrapper.vm.dayOfMonth(0,6), 1, `wrapper.vm.dayOfMonth(0,6) should be 1 but was ${wrapper.vm.dayOfMonth(0,6)}`);

    expect(modifiedHtml).contains(leadingBlankSpaces(6));
    expect(modifiedHtml).contains(trailingBlankSpaces(29, 0));
  });

  it('shallow mount january with nothing', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: reportFixtures, month: 0, year: 2020 }});

    for ( let date = 1 ; date <= 31 ; date += 1 ) {
        expect(wrapper.text()).contains(String(date));
    }

    expect(wrapper.text()).not.contains("32");
    expect(wrapper.text()).not.contains("\n0\n");
    expect(wrapper.text()).not.contains("\n0\t");
    expect(wrapper.text()).not.contains("\t0\n");
    expect(wrapper.text()).not.contains("\t0\t");

    const modifiedHtml = buildModifiedHtml(wrapper.html());

    expect(modifiedHtml).contains(leadingBlankSpaces(3));
    expect(modifiedHtml).contains(trailingBlankSpaces(31, 1));
  });

  it('shallow mount december with nothing', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: [reportFixtures], month: 11, year: 2020 }});

    for ( let date = 1 ; date <= 31 ; date += 1 ) {
        expect(wrapper.text()).contains(String(date));
    }

    expect(wrapper.text()).not.contains("32");
    expect(wrapper.text()).not.contains("\n0\n");
    expect(wrapper.text()).not.contains("\n0\t");
    expect(wrapper.text()).not.contains("\t0\n");
    expect(wrapper.text()).not.contains("\t0\t");

    const modifiedHtml = buildModifiedHtml(wrapper.html());

    expect(modifiedHtml).contains(leadingBlankSpaces(2));
    expect(modifiedHtml).contains(trailingBlankSpaces(31, 2));
  });

  it('shallow mount november with nothing', () => {
    const reportFixtures = [];

    const wrapper = shallowMount(Calendar, {propsData: { reports: [reportFixtures], month: 10, year: 2020 }});

    for ( let date = 1 ; date <= 30 ; date += 1 ) {
        expect(wrapper.text()).contains(String(date));
    }

    expect(wrapper.text()).not.contains("31");
    expect(wrapper.text()).not.contains("\n0\n");
    expect(wrapper.text()).not.contains("\n0\t");
    expect(wrapper.text()).not.contains("\t0\n");
    expect(wrapper.text()).not.contains("\t0\t");

    const modifiedHtml = buildModifiedHtml(wrapper.html());

    expect(modifiedHtml).contains(leadingBlankSpaces(0));
    expect(modifiedHtml).contains(trailingBlankSpaces(30, 5));
  });
});

describe('Calendar Data/Reports Test', function () {
  it('shallow mount with data', (done) => {
    const reportFixtures = [{
      "averageSpeedDuringSprint": 750.3551401869158, 
      "avgSprintLength": 35.666666666666664, 
      "cooldownTime": 650, 
      "date": 1616010834052, 
      "faultyReadingCount": 0, 
      "id": 1, 
      "lengthOfWorkout": 1256, 
      "sprintCount": 3, 
      "startTime": 1616009560, 
      "stopTime": 1616010814, 
      "topSpeed": 1000
    }, {
      "averageSpeedDuringSprint": 751.3551401869158, 
      "avgSprintLength": 35.666666666666664, 
      "cooldownTime": 653, 
      "date": 1616010834052, 
      "faultyReadingCount": 0, 
      "id": 2, 
      "lengthOfWorkout": 1256, 
      "sprintCount": 3, 
      "startTime": 1616009560, 
      "stopTime": 1616010814, 
      "topSpeed": 1000
    }, {
      "averageSpeedDuringSprint": 751.3551401869158, 
      "avgSprintLength": 35.666666666666664, 
      "cooldownTime": 653, 
      "date": 1616010834052, 
      "faultyReadingCount": 0, 
      "id": 3, 
      "lengthOfWorkout": 1256, 
      "sprintCount": 3, 
      "startTime": 1617504154, 
      "stopTime": 1616010814, 
      "topSpeed": 1000
    }, {
      "averageSpeedDuringSprint": 751.3551401869158, 
      "avgSprintLength": 35.666666666666664, 
      "cooldownTime": 653, 
      "date": 1616010834052, 
      "faultyReadingCount": 0, 
      "id": 5, 
      "lengthOfWorkout": 1256, 
      "sprintCount": 4, 
      "startTime": 1619405837, 
      "stopTime": 1616010814, 
      "topSpeed": 1000
    }];

    const wrapper = shallowMount(Calendar, {propsData: { reports: reportFixtures, month: 3, year: 2021 }});

    const report_tds = wrapper.findAll(".has-report");

    equal(report_tds.length, 2);

    const reportIds = report_tds.wrappers.map(w => w.element.dataset.reportId);

    equal(reportIds.includes("3"), true, `${reportIds}`);
    equal(reportIds.includes("5"), true, `${reportIds}`);

    const randomReportCellWrapper = report_tds.wrappers[Math.floor(Math.random()*report_tds.length)];

    const clickPromise = randomReportCellWrapper.trigger('click');
    clickPromise.then(() => {
      const emittedReportId = wrapper.emitted()["report-clicked"][0][0].id;
      equal( emittedReportId == 5 || emittedReportId == 3, true);
      done();
    });
  });
});
