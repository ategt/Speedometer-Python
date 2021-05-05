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
        lines = [line for line in data.split("\r\n") if len(line.strip()) > 0]

        for _ in range(250):
            random_line = lines[random.randint(0, len(lines) - 1)]

            try:
                random_reading = LINE_REGEX.search(random_line).groupdict()
            except AttributeError:
                print("Problem parsing the following line:")
                print(lines.index(random_line), random_line)
                raise

            sio_client.emit("speedometer update", {"data":random_reading})

            recieved = sio_client.get_received()[0]
            payload = recieved['args'][0]['data']

            self.assertEqual('speedometer update broadcast', recieved['name'], recieved)
            self.assertTrue(int(payload['currentRevsPerMin']) >= 0, payload)
            self.assertTrue(int(payload['currentRevsPerMin']) < 65000, payload)

    def test_recorderDirectives(self):
        sio_client = self.sio_client

        # Clear whatever connection alerts are sent.
        _ = sio_client.get_received()

        sio_client.emit("recorder directive", {"directive":"shutdown"})

        recieved = sio_client.get_received()[0]
        payload = recieved['args'][0]

        self.assertEqual('recorder directive broadcast', recieved['name'])
        self.assertEqual("shutdown", payload['directive'])

        sio_client.emit("recorder action", {"data":"Shutdown Order Received"})

        recieved = sio_client.get_received()[0]
        payload = recieved['args'][0]

        self.assertEqual('recorder action broadcast', recieved['name'])
        self.assertEqual('Shutdown Order Received', payload['data'])

    def test_timerDirectives(self):
        sio_client = self.sio_client

        # Clear whatever connection alerts are sent.
        _ = sio_client.get_received()

        def buildSimulatedSchedule():
            items = list()

            for i in range(1, random.randint(3,15)):
                items.append({'id': i,
                              "activity": uuid.uuid4().hex[:random.randint(0, 32)],
                              "interval": random.randint(5, 900)})

            return items

        sim_schedule = buildSimulatedSchedule()

        sio_client.emit('tabata timer action', {'data':"STOP"})

        sio_client.emit('tabata timer action', {'data':"START", 'schedule': sim_schedule})
        sio_client.emit('tabata timer action', {'data':"PULSE"})

        _responses = sio_client.get_received()

        sio_client.emit('tabata timer action', {'data':"SCHEDULE"})

        recieved = sio_client.get_received()[0]
        payload = recieved['args'][0]

        self.assertEqual('tabata timer action broadcast', recieved['name'])
        self.assertEqual("SCHEDULE", payload['type'])
        self.assertEqual(sim_schedule, payload['data'])

if __name__ == '__main__':
    unittest.main()