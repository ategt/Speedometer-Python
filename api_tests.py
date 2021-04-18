# coding: utf-8

import requests
import random

schedule_info = requests.get("http://localhost:5000/schedule").json()
schedule_response = requests.get("http://localhost:5000/schedule")

schedule_response = requests.get("http://localhost:5000/schedules")
assert len(schedule_response.json()['schedules']) == 4
assert len(schedule_response.json()['default']) > 0

readings_response = requests.get("http://localhost:5000/readings")
reading_results = readings_response.json()['result']
assert len(reading_results) == 1550

reports_response = requests.get("http://localhost:5000/report")
reports = reports_response.json()['reports']
assert len(reports) == 31

report = reports[random.randint(0, len(reports) - 2)]

reading_response = requests.get(f"http://localhost:5000/readings?start={report['startTime']}&stop={report['stopTime']}")
reading_results = reading_response.json()['result']

assert len(reading_results) != 1550
assert len(reading_results) > 50
assert len(reading_results) < 90000

last_timecode = requests.get("http://localhost:5000/last-timecode").json()['result']

assert isinstance(last_timecode, int)
assert reports[-1]['stopTime'] == last_timecode