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

        self.app = app
        self.sio = sio

    def tearDown(self):
        self.app_client = None
        self.sio_client = None

    def test_clients(self):
        sio_client = self.sio_client

        # Clear whatever connection alerts are sent.
        _ = sio_client.get_received()

        response = self.app_client.get("/clients")

        clients = response.json['clients']

        self.assertEqual(len(clients), 1)

        second_client = self.sio.test_client(self.app)

        second_clients = self.app_client.get("/clients").json['clients']
        self.assertEqual(len(second_clients), 2)

        sio_client.disconnect()

        third_clients = self.app_client.get("/clients").json['clients']
        self.assertEqual(len(third_clients), 1)

        second_client.disconnect()

        fourth_clients = self.app_client.get("/clients").json['clients']
        self.assertEqual(len(fourth_clients), 0)

if __name__ == '__main__':
    unittest.main()