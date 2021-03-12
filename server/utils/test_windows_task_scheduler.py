import unittest

from time import sleep 
import threading
import random
import os

#import utils.windows_task_scheduler as wts
import windows_task_scheduler as wts

class TestWindowsTaskScheduler(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(TestWindowsTaskScheduler, self).__init__(*args, **kwargs)

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_run(self):
        wts.list_task()
        # wts.run_task(task_name="Cycle Logger")

        # signatures = base.loadSignatures()
        # self.assertTrue(len(signatures) >= 0)
        # self.assertTrue(len(signatures[(65, 65)]) >= 5)

        # self.assertNotEqual(pages[0], pages[1])

if __name__ == '__main__':
    unittest.main()