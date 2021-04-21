import unittest

import random
import uuid
import os

from tabata_dao import TabataDao

class TestTabataDao(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(TestTabataDao, self).__init__(*args, **kwargs)

    def setUp(self):
        self.tempFile = uuid.uuid4().hex

    def tearDown(self):
        self.tabataDao.close()
        os.remove(self.tempFile)

    def test_actionRecorder(self):
        self.tabataDao = TabataDao(self.tempFile)
        self.tabataDao.recordDirective(uuid.uuid4().hex, random.randint(-2**31, 2**31))
        self.tabataDao.recordDirective(uuid.uuid4().hex, random.randint(-2**31, 2**31))
        self.tabataDao.recordDirective(uuid.uuid4().hex, random.randint(-2**31, 2**31))

        tabataDao2 = TabataDao(self.tempFile)
        everything = tabataDao2.getAll()
        self.assertTrue(len(everything) > 1)
        self.assertEqual(len(everything),  3)

if __name__ == '__main__':
    unittest.main()