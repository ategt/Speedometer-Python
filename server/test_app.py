import unittest
import random
import sys
import os

from time import sleep

import blueprints

class TestApp(unittest.TestCase):
    def setUp(self):
        os.environ['SCHEDULE_FILE_PATH'] = "../test-data/schedules.json"
        os.environ['REPORT_FILE_PATH'] = "../test-data/reports.json"
        os.environ['LOG_FILE_PATH'] = "../test-data/speed-log.txt"
        os.environ['DB_FILE_PATH'] = "../test-data/database.sqlite3"

        sio, app = blueprints.create_app()
        self.app_client = app.test_client()

    def tearDown(self):
        self.app_client = None

    def test_schedules(self):
        app_client = self.app_client
        response = app_client.get("/schedules")

        schedules_response = response.json

        self.assertTrue(len(schedules_response['schedules']) > 4)
        self.assertTrue(len(schedules_response['default']) > 0)

    def test_readings(self):
        app_client = self.app_client
        readings_response = app_client.get("/readings")

        reading_results = readings_response.json['result']

        self.assertTrue(len(reading_results) > 100, len(reading_results))
        self.assertTrue(len(reading_results) < 50000)

    def test_customReadings(self):
        app_client = self.app_client

        reports_response = app_client.get("/report")
        reports = reports_response.json['reports']

        self.assertTrue(len(reports) >= 31)

        report = reports[random.randint(0, len(reports) - 2)]

        reading_response = app_client.get(f"/readings?start={report['startTime']}&stop={report['stopTime']}")
        reading_results = reading_response.json['result']

        self.assertTrue(len(reading_results) > 50)
        self.assertTrue(len(reading_results) < 90000)

        
if __name__ == '__main__':
    unittest.main()