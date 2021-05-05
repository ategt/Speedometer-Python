import unittest
import random
import uuid
import sys
import os

from time import sleep

import blueprints

class TestClientsApi(unittest.TestCase):
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

    def test_(self):
        sio_client = self.sio_client

        # Clear whatever connection alerts are sent.
        _ = sio_client.get_received()

        response = self.app_client.get("/clients")

        clients = response.json

        self.assertEqual(len(clients), 1)

if __name__ == '__main__':
    unittest.main()