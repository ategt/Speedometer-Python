import unittest

from schedule_dao import ScheduleDao
from time import sleep
import random
import json
import uuid
import os

class TestScheduleDao(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        if os.path.exists("FakeSchedulePath"):
            os.remove("FakeSchedulePath")

    def test_readScheduleLiveData(self):
        "Confirm that the current schedule file can be loaded."
        schedules = ScheduleDao("data\\schedules.json")

        _ = schedules.getAll()['schedules']

    def test_write_and_read_schedule(self):
        "Verify basic schedule handling."
        schedules = ScheduleDao("FakeSchedulePath")

        try:
            before = schedules.getAll()['schedules']
        except FileNotFoundError:
            before = list()

        some_number = random.randint(0, 2**32)

        schedules.create({"item1": some_number, "item2": "Some Data", "item3": uuid.uuid4().hex, "date":99999999999})

        after = schedules.getAll()['schedules']

        self.assertEqual(len(before) + 1, len(after), str(before) + "\n\n" + str(after))
        self.assertEqual(after[-1]["item1"], some_number)

    def test_write_more_than_one(self):
        "Check that schedule creation does not remove old schedules."
        schedules = ScheduleDao("FakeSchedulePath")

        try:
            before = schedules.getAll()['schedules']
        except FileNotFoundError:
            before = list()

        some_number = random.randint(0, 2**32)
        starting_date = 99999999999

        schedules.create({"item1": some_number, "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        schedules.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1
        schedules.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after = schedules.getAll()['schedules']

        self.assertEqual(len(before) + 3, len(after))
        self.assertEqual(after[-3]["item1"], some_number)

    def test_write_with_update(self):
        "Create a schedule, then update it with a comment."
        schedules = ScheduleDao("FakeSchedulePath")

        try:
            before = schedules.getAll()['schedules']
        except FileNotFoundError:
            before = list()

        some_number = random.randint(0, 2**32)
        starting_date = 99999999999

        schedules.create({"item1": some_number, "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        schedules.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        schedules.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after = schedules.getAll()['schedules']

        self.assertEqual(len(before) + 3, len(after))
        self.assertEqual(after[-3]["item1"], some_number)
        self.assertEqual(len(after), len({i['id'] for i in after}))

        random_schedule = after[random.randint(0, len(after)-1)]
        schedule_id = random_schedule['id']

        retrieved_schedule = schedules.get(schedule_id)

        self.assertDictEqual(random_schedule, retrieved_schedule)

        schedules.update({**random_schedule, "item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after_update = schedules.getAll()['schedules']

        self.assertEqual(len(after), len(after_update))

        for schedule in after_update:
            self.assertNotEqual(json.dumps(schedule), json.dumps(retrieved_schedule))

        updated_schedule = [r for r in after_update if r['id'] == schedule_id][0]

        self.assertDictEqual(updated_schedule, schedules.get(schedule_id))
        self.assertNotEqual(json.dumps(retrieved_schedule), json.dumps(updated_schedule))

        schedules.patch({"id":schedule_id, "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after_patch = schedules.getAll()['schedules']

        self.assertEqual(len(after), len(after_patch))

        for schedule in after_patch:
            self.assertNotEqual(json.dumps(schedule), json.dumps(retrieved_schedule))
            self.assertNotEqual(json.dumps(schedule), json.dumps(updated_schedule))

        patched_schedule = [r for r in after_patch if r['id'] == schedule_id][0]

        self.assertDictEqual(patched_schedule, schedules.get(schedule_id))
        self.assertNotEqual(json.dumps(patched_schedule), json.dumps(updated_schedule))

        self.assertEqual(retrieved_schedule['item2'], updated_schedule['item2'])
        self.assertEqual(patched_schedule['item2'], updated_schedule['item2'])

        self.assertNotEqual(patched_schedule['item3'], updated_schedule['item3'])
        self.assertNotEqual(patched_schedule['item3'], retrieved_schedule['item3'])

        self.assertEqual(patched_schedule['item1'], updated_schedule['item1'])
        self.assertNotEqual(patched_schedule['item1'], retrieved_schedule['item1'])

        schedules.retire(schedule_id)

        after_delete = schedules.getAll()['schedules']

        self.assertEqual(len(after), len(after_delete) + 1)

        for schedule in after_delete:
            self.assertNotEqual(json.dumps(schedule), json.dumps(patched_schedule))

        with self.assertRaises(Exception):
            _deleted_schedule = schedules.get(schedule_id)

    def test_setDefaultSchedule(self):
        "Create a schedule, then set it as the default."
        schedules = ScheduleDao("FakeSchedulePath")

        try:
            before = schedules.getAll()
        except FileNotFoundError:
            before = {"schedules": list(), "default": {"item1": 252000}}

        some_number = random.randint(0, 2**32)
        starting_date = 99999999999

        schedules.create({"item1": some_number, "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        schedules.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        schedules.create({"item1": random.randint(0, 2**32), "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        starting_date+=1

        after = schedules.getAll()
        some_schedules = after['schedules']

        self.assertEqual(len(before['schedules']) + 3, len(some_schedules))

        random_schedule = some_schedules[random.randint(0, len(some_schedules)-1)]
        schedule_id = random_schedule['id']

        retrieved_schedule = schedules.get(schedule_id)

        schedules.setDefault(schedule_id)

        self.assertDictEqual(random_schedule, retrieved_schedule)

        first_default_schedule = schedules.getAll()['default']

        _ = retrieved_schedule.pop("default", None)
        _ = first_default_schedule.pop("default", None)

        self.assertDictEqual(first_default_schedule, retrieved_schedule)

        filtered_schedules = [s for s in some_schedules if s['id'] != schedule_id]
        self.assertTrue(len(filtered_schedules) > 0)
        random_schedule = filtered_schedules[random.randint(0, len(filtered_schedules)-1)]
        schedule_id = random_schedule['id']

        different_retrieved_schedule = schedules.get(schedule_id)

        schedules.setDefault(schedule_id)

        after_default_change = schedules.getAll()
        after_default_change_schedules = after_default_change['schedules']
        second_default_schedule = after_default_change['default']

        _ = different_retrieved_schedule.pop("default", None)
        _ = first_default_schedule.pop("default", None)
        _ = second_default_schedule.pop("default", None)

        self.assertNotEqual(first_default_schedule, second_default_schedule)
        self.assertDictEqual(second_default_schedule, different_retrieved_schedule)

        self.assertEqual(len(after_default_change_schedules), len(some_schedules))

    def test_onlyOneScheduleNameAllowed(self):
        "Create two schedules with the same name, and see what happens."
        schedules = ScheduleDao("FakeSchedulePath")

        try:
            before = schedules.getAll()
        except FileNotFoundError:
            before = {"schedules": list(), "default": {"item1": 252000}}

        some_number = random.randint(0, 2**32)
        starting_date = 99999999999

        schedules.create({"item1": some_number, "name": "Name One", "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})
        schedules.create({"item1": some_number, "name": "Name One", "item2": "Some Data", "item3": uuid.uuid4().hex, "date":starting_date})

        retrieved_schedules = schedules.getAll()['schedules']

        self.assertNotEqual(retrieved_schedules[-1]['name'], retrieved_schedules[-2]['name'])

if __name__ == '__main__':
    unittest.main()