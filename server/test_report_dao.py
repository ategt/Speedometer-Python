import unittest

from report_dao import ReportDao
from time import sleep
import random
import uuid
import os

class TestReportDao(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        os.remove("FakeReportPath")

    def test_write_and_read_report(self):
        "For now, report handling is only two things."
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

        reports.update({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})

if __name__ == '__main__':
    unittest.main()