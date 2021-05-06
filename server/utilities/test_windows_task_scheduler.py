import unittest

from time import sleep 
import threading
import random
import os

import windows_task_scheduler as wts

class TestWindowsTaskScheduler(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(TestWindowsTaskScheduler, self).__init__(*args, **kwargs)

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_run(self):
        tags_to_check = ['taskname', 'status', 'logon_mode', 'next_run_time']
        tasks = wts.list_tasks()

        self.assertTrue(len(tasks) > 20)

        for task in tasks[:18]:
            task_infos = wts.query_task(task_name = task['taskname'])

            for tag in tags_to_check:
                self.assertIn(task[tag], [t[tag] for t in task_infos], f"{task['taskname']} - {tag}")

if __name__ == '__main__':
    unittest.main()