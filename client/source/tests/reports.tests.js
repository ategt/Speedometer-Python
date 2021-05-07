import { equal } from 'assert';

import chai from './lib/chai.js';
import './lib/mocha.js';

mocha.setup('bdd');

import { generate_report, prepare_report, sort_readings } from '../shared/reports';

const expect = chai.expect;

const speedHistory = JSON.parse("[{\"timestamp\":\"1620099135.433309\",\"currentSpeedKmh\":\"1.52\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"26\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42119\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42119\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099134.47662\",\"currentSpeedKmh\":\"1.52\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"26\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42118\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42118\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099133.5091333\",\"currentSpeedKmh\":\"1.52\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"26\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42117\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42117\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099132.554293\",\"currentSpeedKmh\":\"1.62\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"28\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42116\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42116\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099131.5983946\",\"currentSpeedKmh\":\"1.62\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"28\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42115\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42115\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099127.7767515\",\"currentSpeedKmh\":\"0.00\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"0\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42115\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42115\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099126.8115504\",\"currentSpeedKmh\":\"1.60\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"28\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42115\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42115\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099125.856559\",\"currentSpeedKmh\":\"1.60\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"28\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42114\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42114\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099124.9016316\",\"currentSpeedKmh\":\"1.60\",\"currentAccelMss\":\"-2.00\",\"currentRevsPerMin\":\"28\",\"totalDistanceMetres\":\"95186\",\"totalTimeSeconds\":\"42113\",\"tripDistanceMetres\":\"95186\",\"tripTimeSeconds\":\"42113\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099123.9478767\",\"currentSpeedKmh\":\"2.32\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"41\",\"totalDistanceMetres\":\"95185\",\"totalTimeSeconds\":\"42112\",\"tripDistanceMetres\":\"95185\",\"tripTimeSeconds\":\"42112\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099122.9941897\",\"currentSpeedKmh\":\"2.32\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"41\",\"totalDistanceMetres\":\"95184\",\"totalTimeSeconds\":\"42111\",\"tripDistanceMetres\":\"95184\",\"tripTimeSeconds\":\"42111\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099122.0393677\",\"currentSpeedKmh\":\"1.77\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"31\",\"totalDistanceMetres\":\"95184\",\"totalTimeSeconds\":\"42110\",\"tripDistanceMetres\":\"95184\",\"tripTimeSeconds\":\"42110\",\"tripMaxSpeedKmh\":\"3384.00\"},{\"timestamp\":\"1620099121.0800207\",\"currentSpeedKmh\":\"2.74\",\"currentAccelMss\":\"0.00\",\"currentRevsPerMin\":\"48\",\"totalDistanceMetres\":\"95184\",\"totalTimeSeconds\":\"42109\",\"tripDistanceMetres\":\"95184\",\"tripTimeSeconds\":\"42109\",\"tripMaxSpeedKmh\":\"3384.00\"}]");
const activeSchedule = JSON.parse("{\"name\":\"Default\",\"default\":true,\"id\":0,\"items\":[{\"id\":1,\"activity\":\"Warmup\",\"interval\":120},{\"id\":2,\"activity\":\"Sprint!\",\"interval\":30},{\"id\":3,\"activity\":\"Recover\",\"interval\":180},{\"id\":4,\"activity\":\"Sprint!\",\"interval\":30},{\"id\":5,\"activity\":\"Recover\",\"interval\":180},{\"id\":6,\"activity\":\"Sprint!\",\"interval\":30},{\"id\":7,\"activity\":\"Recover\",\"interval\":180},{\"id\":8,\"activity\":\"Sprint!\",\"interval\":30},{\"id\":9,\"activity\":\"Recover\",\"interval\":180},{\"id\":10,\"activity\":\"Sprint!\",\"interval\":30},{\"id\":11,\"activity\":\"Cool Down\",\"interval\":180}]}");

describe('Report Shared Script Test', function () {
  describe('sort readings', function () {
    it('handle one report', () => {
      const result = sort_readings([speedHistory[0]]);

      expect(result[0].currentRevsPerMin).equal(speedHistory[0].currentRevsPerMin);
    });

    it('sequence reports', () => {
      const timecodes = speedHistory.map(item => item.timestamp);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      const result = sort_readings(speedHistory);

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });

    it('sequence reversed reports', () => {
      const timecodes = speedHistory.map(item => item.timestamp);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      const reversedSpeedHistory = Array.from(speedHistory).reverse();

      const result = sort_readings(reversedSpeedHistory);

      expect(parseFloat(result[0].timestamp)).equal(start_time);
      expect(parseFloat(result[result.length - 1].timestamp)).equal(stop_time);
    });
  });

  describe('Prepare Report', function () {
    it('build a report', () => {
      const report = prepare_report(speedHistory, activeSchedule);

      const timecodes = speedHistory.map(item => item.timestamp);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);

      equal(report.scheduleId, activeSchedule.id);
      equal(report.scheduleName, activeSchedule.name);
    });
  });
});