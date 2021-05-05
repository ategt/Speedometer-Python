import unittest
from unittest.mock import patch
import random
import sys
import os

from time import sleep

import blueprints

class TestApp(unittest.TestCase):
    #@patch.dict('file.os.environ', {'DB': 'Dummy'})
    def setUp(self):
        pass
        #self.class = MyClass()

    def tearDown(self):
        pass

    #@patch.object(file.MyClass, 'connection_url', 'Dummy')
    #@patch.dict('blueprints.schedule.os.getenv', {'SCHEDULE_FILE_PATH':'asdfasdfasdf'})
    #@patch.object('blueprints.schedule.scheduleDao', 'getAll', new_callable=lambda:"asdfsdfasdf")
    #@patch.dict('blueprints.schedule.scheduleDao', 'getAll', {'SCHEDULE_FILE_PATH':'asdfasdfasdf'})
    #@patch('blueprints.schedule.os.getenv', return_value="asdf")
    #@patch.object('blueprints.schedule','scheduleDao', '_determineNextId', return_value=9)
    #@patch.object('blueprints.schedule','scheduleDao', return_value=9)
    #@patch.object(sys.modules['blueprints.schedule'],'scheduleDao')
    #@patch.object(sys.modules['schedule_dao'],'ScheduleDao')
    #@patch.object('schedule_dao','ScheduleDao')
    #mockScheduleDao
    def test_schedules(self):
        #mockScheduleDao().getAll.return_value = 7
        # print(os.getcwd())
        # print(sys.modules.keys())
        # mod = sys.modules['blueprints']
        # print(mod)
        os.environ['SCHEDULE_FILE_PATH'] = "../test-data/schedules.json"
        os.environ['REPORT_FILE_PATH'] = "../test-data/reports.json"
        os.environ['LOG_FILE_PATH'] = "../test-data/speed-log.txt"
        os.environ['DB_FILE_PATH'] = "../test-data/database.sqlite3"

        sio, app = blueprints.create_app()
        app_client = app.test_client()
        response = app_client.get("/schedules")

        schedules_response = response.json

        self.assertTrue(len(schedules_response['schedules']) > 4)
        self.assertTrue(len(schedules_response['default']) > 0)

    def test_readings(self):
        os.environ['SCHEDULE_FILE_PATH'] = "../test-data/schedules.json"
        os.environ['REPORT_FILE_PATH'] = "../test-data/reports.json"
        os.environ['LOG_FILE_PATH'] = "../test-data/speed-log.txt"
        os.environ['DB_FILE_PATH'] = "../test-data/database.sqlite3"

        sio, app = blueprints.create_app()
        app_client = app.test_client()
        readings_response = app_client.get("/readings")

        reading_results = readings_response.json['result']

        self.assertTrue(len(reading_results) > 100, len(reading_results))
        self.assertTrue(len(reading_results) < 50000)

    def test_customReadings(self):
        os.environ['SCHEDULE_FILE_PATH'] = "../test-data/schedules.json"
        os.environ['REPORT_FILE_PATH'] = "../test-data/reports.json"
        os.environ['LOG_FILE_PATH'] = "../test-data/speed-log.txt"
        os.environ['DB_FILE_PATH'] = "../test-data/database.sqlite3"

        sio, app = blueprints.create_app()
        app_client = app.test_client()

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