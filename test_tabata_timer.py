import unittest

from tabata_timer import TabataTimer
from time import sleep

class TestSpeedometer(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        self.timer.stop()

    def test_start_many_timers(self):
        self.timer = TabataTimer()

        self.timer.start()

        with self.assertRaises(Exception):
            self.timer.start()

        self.timer.stop()
        self.timer.start()

        with self.assertRaises(Exception):
            self.timer.start()

if __name__ == '__main__':
    unittest.main()