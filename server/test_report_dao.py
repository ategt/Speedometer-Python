import unittest

from report_dao import ReportDao
from time import sleep
import random
import json
import uuid
import os

class TestReportDao(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        if os.path.exists("FakeReportPath"):
            os.remove("FakeReportPath")

    def test_read_report_live_data(self):
        "Confirm that the current live reports can be loaded."
        reports = ReportDao("data\\reports.json")

        _ = reports.getAll()

    def test_write_and_read_report(self):
        "Verify basic report handling."
        reports = ReportDao("FakeReportPath")

        try:
            before = reports.getAll()
        except FileNotFoundError:
            before = list()

        some_number = random.randint(0, 2**32)

        reports.create({"item1": some_number, "item2": "Some Data", "item3": uuid.uuid4().hex, "date":99999999999})

        after = reports.getAll()

        self.assertEqual(len(before) + 1, len(after))
        self.assertEqual(after[-1]["item1"], some_number)

    def test_write_more_than_one(self):
        "Check that report creation does not remove old reports."
        reports = ReportDao("FakeReportPath")

        try:
            before = reports.getAll()
        except FileNotFoundError:
            before = list()

        some_number = random.randint(0, 2**32)
        starting_date = 99999999999

        reports.create({"item1": some_number, "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        reports.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1
        reports.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after = reports.getAll()

        self.assertEqual(len(before) + 3, len(after))
        self.assertEqual(after[-3]["item1"], some_number)

    def test_write_with_update(self):
        "Create a report, then update it with a comment."
        reports = ReportDao("FakeReportPath")

        try:
            before = reports.getAll()
        except FileNotFoundError:
            before = list()

        some_number = random.randint(0, 2**32)
        starting_date = 99999999999

        reports.create({"item1": some_number, "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        reports.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        reports.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after = reports.getAll()

        self.assertEqual(len(before) + 3, len(after))
        self.assertEqual(after[-3]["item1"], some_number)
        self.assertEqual(len(after), len({i['id'] for i in after}))

        random_report = after[random.randint(0, len(after)-1)]
        report_id = random_report['id']

        retrieved_report = reports.get(report_id)

        self.assertDictEqual(random_report, retrieved_report)

        reports.update({**random_report, "item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after_update = reports.getAll()

        self.assertEqual(len(after), len(after_update))

        for report in after_update:
            self.assertNotEqual(json.dumps(report), json.dumps(retrieved_report))

        updated_report = [r for r in after_update if r['id'] == report_id][0]

        self.assertDictEqual(updated_report, reports.get(report_id))
        self.assertNotEqual(json.dumps(retrieved_report), json.dumps(updated_report))

        reports.patch({**random_report, "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after_patch = reports.getAll()

        self.assertEqual(len(after), len(after_patch))

        for report in after_patch:
            self.assertNotEqual(json.dumps(report), json.dumps(retrieved_report))
            self.assertNotEqual(json.dumps(report), json.dumps(updated_report))

        patched_report = [r for r in after_patch if r['id'] == report_id][0]

        self.assertDictEqual(patched_report, reports.get(report_id))
        self.assertNotEqual(json.dumps(patched_report), json.dumps(updated_report))

if __name__ == '__main__':
    unittest.main()