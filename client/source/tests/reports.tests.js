import { equal } from 'assert';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import { generate_report, prepare_report, sort_readings } from '../shared/reports';
import { convertTimestampToClient, convertTimestampToServer } from '../shared/server_adaption';

import { REALTIME_SPEED_DATA, RECORED_SPEED_DATA, DEFAULT_SCHEDULE, REALTIME_SLOW_SPEED_DATA } from './FIXTURES';

const expect = chai.expect;

describe('Report Shared Script Test', function () {

  const tempDate = new Date();
  tempDate.setFullYear( 2015 );

  const beginingOfService = +tempDate;

  tempDate.setFullYear( 2040 );

  const endOfService = +tempDate;

  const serviceSpan = endOfService - beginingOfService;

  const updateCorrector = reading => Object.assign({}, reading, { recieved: Math.floor((Math.random() * serviceSpan) + beginingOfService) });

  describe('sort recorded readings', function () {
    it('handle one report', () => {
      const result = sort_readings([RECORED_SPEED_DATA[0]]);

      expect(result[0].currentRevsPerMin).equal(RECORED_SPEED_DATA[0].currentRevsPerMin);
    });

    it('sequence reports', () => {
      const timecodes = RECORED_SPEED_DATA.map(item => item.timestamp);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      const result = sort_readings(RECORED_SPEED_DATA);

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });

    it('sequence reversed reports', () => {
      const timecodes = RECORED_SPEED_DATA.map(item => item.timestamp);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      const reversedRecoredSpeedData = Array.from(RECORED_SPEED_DATA).reverse();

      const result = sort_readings(reversedRecoredSpeedData);

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });
  });

  describe('sort realtime readings', function () {
    it('handle one report', () => {
      const result = sort_readings([REALTIME_SPEED_DATA[0]]);

      expect(result[0].currentRevsPerMin).equal(REALTIME_SPEED_DATA[0].currentRevsPerMin);
    });

    const mapToRecord = item => Object.assign({}, item, {timestamp: convertTimestampToServer(item.recieved)});
    const corrected_RealtimeSpeedData = REALTIME_SPEED_DATA.map(updateCorrector).map(mapToRecord)

    it('sequence reports', () => {
      const timecodes = corrected_RealtimeSpeedData.map(item => convertTimestampToServer(item.recieved));

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);


      const result = sort_readings(corrected_RealtimeSpeedData);

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });

    it('sequence reversed reports', () => {
      const timecodes = corrected_RealtimeSpeedData.map(item => convertTimestampToServer(item.recieved));

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      const reversedRecoredSpeedData = Array.from(corrected_RealtimeSpeedData).reverse();

      const result = sort_readings(corrected_RealtimeSpeedData);

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });
  });

  describe('sort slow realtime readings', function () {
    it('handle one report', () => {
      const result = sort_readings([REALTIME_SLOW_SPEED_DATA[0]]);

      expect(result[0].currentRevsPerMin).equal(REALTIME_SLOW_SPEED_DATA[0].currentRevsPerMin);
    });

    const mapToRecord = item => Object.assign({}, item, {timestamp: convertTimestampToServer(item.recieved)});

    it('sequence reports', () => {
      const timecodes = REALTIME_SLOW_SPEED_DATA.map(item => convertTimestampToServer(item.recieved));

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);


      const result = sort_readings(REALTIME_SLOW_SPEED_DATA.map(mapToRecord));

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });

    it('sequence reversed reports', () => {
      const timecodes = REALTIME_SLOW_SPEED_DATA.map(item => convertTimestampToServer(item.recieved));

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      const reversedRecoredSpeedData = Array.from(REALTIME_SLOW_SPEED_DATA).reverse();

      const result = sort_readings(reversedRecoredSpeedData.map(mapToRecord));

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });
  });

  describe('Prepare Report', function () {
    it('using recorded data', () => {
      const report = prepare_report(RECORED_SPEED_DATA, DEFAULT_SCHEDULE);

      const timecodes = RECORED_SPEED_DATA.map(item => item.timestamp);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      equal(report.scheduleId, DEFAULT_SCHEDULE.id);
      equal(report.scheduleName, DEFAULT_SCHEDULE.name);

      equal(Number.isFinite(report.startTime), true);
      equal(Number.isFinite(report.stopTime),  true);

      const startDate = new Date(convertTimestampToClient(report.startTime));
      const stopDate = new Date(convertTimestampToClient(report.stopTime));

      equal( startDate.getFullYear() < 2050, true);
      equal( startDate.getFullYear() > 2010, true);

      equal( stopDate.getFullYear() < 2050, true);
      equal( stopDate.getFullYear() > 2010, true);
    });

    it('using realtime data', () => {
      const correction_for_code_change = REALTIME_SPEED_DATA.map(updateCorrector);
      const report = prepare_report(correction_for_code_change, DEFAULT_SCHEDULE);

      const timecodes = correction_for_code_change.map(item => convertTimestampToServer(item.recieved));

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      equal(report.scheduleId, DEFAULT_SCHEDULE.id);
      equal(report.scheduleName, DEFAULT_SCHEDULE.name);

      equal(Number.isFinite(report.startTime), true);
      equal(Number.isFinite(report.stopTime),  true);

      const startDate = new Date(convertTimestampToClient(report.startTime));
      const stopDate = new Date(convertTimestampToClient(report.stopTime));

      equal( startDate.getFullYear() < 2050, true);
      equal( startDate.getFullYear() > 2010, true);

      equal( stopDate.getFullYear() < 2050, true);
      equal( stopDate.getFullYear() > 2010, true);
    });

    it('using slow realtime data', () => {
      const report = prepare_report(REALTIME_SLOW_SPEED_DATA, DEFAULT_SCHEDULE);

      const timecodes = REALTIME_SLOW_SPEED_DATA.map(item => convertTimestampToServer(item.recieved));

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      equal(report.scheduleId, DEFAULT_SCHEDULE.id);
      equal(report.scheduleName, DEFAULT_SCHEDULE.name);

      equal(Number.isFinite(report.startTime), true);
      equal(Number.isFinite(report.stopTime),  true);

      const startDate = new Date(convertTimestampToClient(report.startTime));
      const stopDate = new Date(convertTimestampToClient(report.stopTime));

      equal( startDate.getFullYear() < 2050, true);
      equal( startDate.getFullYear() > 2010, true);
      
      equal( stopDate.getFullYear() < 2050, true);
      equal( stopDate.getFullYear() > 2010, true);
    });
  });
});