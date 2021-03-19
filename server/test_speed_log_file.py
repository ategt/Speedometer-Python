import unittest

from speed_log_file import SpeedLogFile
from time import sleep

class TestSpeedLogFile(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_lastcodes(self):
        """ 
            Get last timecode and get range of timecodes
            should be able to return the results of get
            last two hours.
        """
        speedLogFile = SpeedLogFile("./data/speed-log.txt")

        lastTwoHours = speedLogFile.getLastTwoHours()
        mostRecentTimecode = speedLogFile.getLastTimecode()

        stop = mostRecentTimecode
        start = mostRecentTimecode - (2 * 60 * 60)  # Two hours ago

        readingRange = speedLogFile.getReadingRange(start, stop)

        revs_lastTwoHours, adjustedTimecodes = zip(lastTwoHours)
        revs_readingRange, rawTimecodes      = zip(readingRange)

        self.assertEqual(len(lastTwoHours), len(readingRange))

        for reading1, reading2 in zip(*revs_readingRange, *revs_lastTwoHours):
            self.assertEqual(reading1, reading2)

        
if __name__ == '__main__':
    unittest.main()