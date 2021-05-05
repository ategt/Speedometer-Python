import unittest
import random
import uuid
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

    def test_customReadings(self):
        app_client = self.app_client

        reports_response = app_client.get("/report")
        reports = reports_response.json['reports']

        last_timecode = app_client.get("/last-timecode").json['result']

        self.assertTrue( isinstance(last_timecode, int) )
        self.assertEqual( reports[-1]['stopTime'], last_timecode, reports[-1]['id'] )
        
    def test_reportsCrud(self):
        app_client = self.app_client

        reports_response = app_client.get("/report")
        starting_reports = reports_response.json['reports']

        number_keys = ['date', 'startTime', 'stopTime', 'lengthOfWorkout', 'averageSpeedDuringSprint', 'cooldownTime', 'faultyReadingCount', 'sprintCount', 'avgSprintLength', 'topSpeed', 'scheduleId']
        text_keys = ['scheduleName', 'remarks']

        new_report = dict()

        for key in number_keys:
            new_report[key] = random.randint(0, 2**32)

        new_report[text_keys[0]] = uuid.uuid4().hex
        new_report[text_keys[1]] = " ".join(uuid.uuid4().hex for _ in range(20))

        report_creation_response = app_client.post("/report", content_type=r"application/json", json=new_report)
        created_report = report_creation_response.json

        new_report['id'] = created_report['id']

        for k, v in created_report.items():
            self.assertEqual(created_report[k], new_report[k])

        after_creation_reports = app_client.get("/report").json['reports']

        self.assertEqual(len(starting_reports) + 1, len(after_creation_reports))

        report_from_all_reports = [report for report in after_creation_reports if report['id'] == created_report['id']][0]

        for k, v in created_report.items():
            self.assertEqual(created_report[k], report_from_all_reports[k])

        altered_report = {**created_report, 'remarks': " ".join(uuid.uuid4().hex for _ in range(25)) }

        _report_update_response = app_client.patch("/report", json=altered_report)

        after_update_reports = app_client.get("/report").json['reports']

        self.assertEqual(len(after_update_reports), len(after_creation_reports))

        updated_report = [report for report in after_update_reports if report['id'] == created_report['id']][0]

        self.assertEqual( updated_report['remarks'], altered_report['remarks'] )

        for k, v in updated_report.items():
            self.assertEqual(altered_report[k], updated_report[k])

        _delete_response = app_client.delete(f"/report/{created_report['id']}")

        after_delete_reports = app_client.get("/report").json['reports']

        self.assertEqual(len(after_update_reports) - 1, len(after_delete_reports))

        self.assertEqual(len([report for report in after_delete_reports if report['id'] == created_report['id']]), 0)

    def test_scheduleCrud(self):
        app_client = self.app_client

        schedules_response = app_client.get("/schedules")
        starting_schedules = schedules_response.json['schedules']
        starting_default_schedule = schedules_response.json['default']

        items = list()

        for i in range(1, random.randint(3,15)):
            items.append({'id': i,
                          "activity": uuid.uuid4().hex,
                          "interval": random.randint(5, 900)})

        new_schedule = {"name": uuid.uuid4().hex,
                         "default": False,
                         "items": items,
                         "created": random.randint(0, 2**64), 
                         "updated": random.randint(0, 2**64)}

        schedule_creation_response = app_client.post("/schedules", content_type=r"application/json", json=new_schedule)
        created_schedule = schedule_creation_response.json

        new_schedule['id'] = created_schedule['id']

        for key in created_schedule.keys():
            self.assertEqual(new_schedule[key], created_schedule[key])

        schedules_json = app_client.get("/schedules").json
        after_creation_schedules = schedules_json['schedules']
        after_creation_default_schedule = schedules_json['default']

        self.assertEqual(starting_default_schedule, after_creation_default_schedule)

        self.assertEqual(len(starting_schedules) + 1, len(after_creation_schedules))

        schedule_from_all_schedules = [schedule for schedule in after_creation_schedules if schedule['id'] == created_schedule['id']][0]

        for key in created_schedule.keys():
            self.assertEqual(created_schedule[key], schedule_from_all_schedules[key])

        altered_schedule = {"id": created_schedule['id'],
                            "name": uuid.uuid4().hex,
                            "default": False,
                            "items": items,
                            "created": random.randint(0, 2**64), 
                            "updated": random.randint(0, 2**64)}

        _schedule_update_response = app_client.patch("/schedules", json=altered_schedule)

        schedules_json = app_client.get("/schedules").json
        after_update_schedules = schedules_json['schedules']
        after_update_default_schedule = schedules_json['default']

        self.assertEqual(starting_default_schedule, after_update_default_schedule)

        self.assertEqual(len(after_update_schedules), len(after_creation_schedules))

        updated_schedule = [schedule for schedule in after_update_schedules if schedule['id'] == created_schedule['id']][0]

        for key in updated_schedule.keys():
            self.assertEqual(altered_schedule[key], updated_schedule[key])

        _delete_response = app_client.delete(f"/schedules/{created_schedule['id']}")

        schedules_json = app_client.get("/schedules").json
        after_delete_schedules = schedules_json['schedules']
        after_delete_default_schedule = schedules_json['default']

        self.assertEqual(starting_default_schedule, after_delete_default_schedule)

        self.assertEqual(len(after_creation_schedules) - 1, len(after_delete_schedules))
        self.assertEqual(len(after_update_schedules) - 1, len(after_delete_schedules))

        self.assertEqual(len([schedule for schedule in after_delete_schedules if schedule['id'] == created_schedule['id']]), 0)

if __name__ == '__main__':
    unittest.main()