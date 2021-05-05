import unittest
import random
import uuid
import sys
import os

from time import sleep

from demo import read, LINE_REGEX
import blueprints

class TestSockets(unittest.TestCase):
    def setUp(self):
        os.environ['SCHEDULE_FILE_PATH'] = "../test-data/schedules.json"
        os.environ['REPORT_FILE_PATH'] = "../test-data/reports.json"
        os.environ['LOG_FILE_PATH'] = "../test-data/speed-log.txt"
        os.environ['DB_FILE_PATH'] = "../test-data/database.sqlite3"

        sio, app = blueprints.create_app()
        self.app_client = app.test_client()
        self.sio_client = sio.test_client(app)

    def tearDown(self):
        self.app_client = None
        self.sio_client = None

    def test_timer(self):
        sio_client = self.sio_client

        # Clear whatever connection alerts are sent.
        _ = sio_client.get_received()

        sio_client.emit("tabata timer update", {"data": {"activity":"Some Text", "timeRemaining":10}})

        recieved = sio_client.get_received()[0]
        payload = recieved['args'][0]['data']

        self.assertEqual('tabata timer update broadcast', recieved['name'])
        self.assertEqual('Some Text', payload['activity'])
        self.assertEqual(10, payload['timeRemaining'])

        sio_client.emit("tabata timer update", {"data": {"activity":"Other Text", "timeRemaining":-1}})

        recieved = sio_client.get_received()[0]
        payload = recieved['args'][0]['data']

        self.assertEqual('tabata timer update broadcast', recieved['name'])
        self.assertEqual('Other Text', payload['activity'])
        self.assertEqual(-1, payload['timeRemaining'])

    def test_speedometer(self):
        sio_client = self.sio_client

        # Clear whatever connection alerts are sent.
        _ = sio_client.get_received()

        data = read(os.environ['LOG_FILE_PATH'])
        lines = data.split("\r\n")

        random_line = lines[random.randint(0, len(lines) - 1)]

        random_reading = LINE_REGEX.search(random_line).groupdict()

        sio_client.emit("speedometer update", {"data":random_reading})

        recieved = sio_client.get_received()[0]
        payload = recieved['args'][0]['data']

        self.assertEqual('speedometer update broadcast', recieved['name'])
        self.assertTrue(int(payload['currentRevsPerMin']) >= 0)
        self.assertTrue(int(payload['currentRevsPerMin']) < 25000)

if __name__ == '__main__':
    unittest.main()