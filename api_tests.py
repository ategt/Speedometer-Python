# coding: utf-8

import requests
schedule_info = requests.get("http://localhost:5000/schedule").json()
schedule_response = requests.get("http://localhost:5000/schedule")
readings_response = requests.get("http://localhost:5000/readings")
_ = readings_response.json()
_ = schedule_response.json()
schedule_response.content[:500]
schedule_response.content[:2500]
schedule_response.status_code
import flask
import importlib
app = flask.Flask(__name__)
controller = importlib.import_module("schedule_controller")
schedule_response = requests.get("http://localhost:5000/schedule")
schedule_response = requests.get("http://localhost:5000/schedules")
schedule_response.json()
schedule_response.json()['default']
schedule_response.json()['schedules']
len(schedule_response.json()['schedules'])
schedule_response = requests.get("http://localhost:5000/schedules")
assert len(schedule_response.json()['schedules']) > 0
assert len(schedule_response.json()['default']) > 0
schedule_response = requests.get("http://localhost:5000/schedules")
assert len(schedule_response.json()['schedules']) > 1
assert len(schedule_response.json()['default']) > 0
schedule_response = requests.get("http://localhost:5000/schedules")
assert len(schedule_response.json()['schedules']) ==4 1
assert len(schedule_response.json()['default']) > 0
schedule_response = requests.get("http://localhost:5000/schedules")
assert len(schedule_response.json()['schedules']) == 1
assert len(schedule_response.json()['default']) > 0
len(schedule_response.json()['schedules'])
schedule_response = requests.get("http://localhost:5000/schedules")
assert len(schedule_response.json()['schedules']) == 4
assert len(schedule_response.json()['default']) > 0
readings_response = requests.get("http://localhost:5000/readings")
reading_results = readings_response.json()['result']
len(reading_results)
assert len(reading_results) == 1550
schedule_response = requests.get("http://localhost:5000/schedules")
assert len(schedule_response.json()['schedules']) == 4
assert len(schedule_response.json()['default']) > 0

readings_response = requests.get("http://localhost:5000/readings")
reading_results = readings_response.json()['result']
assert len(reading_results) == 1550
reports_response = requests.get("http://localhost:5000/report")
reports = reports_response.json()['reports']
len(reports)
assert len(reports) == 31
import random
report = reports[random.randint(0, len(reports))]
report = reports[random.randint(0, len(reports) - 1)]
report
reading_response = requests.get(f"http://localhost:5000/readings?start={report['startTime']}&stop={report['stopTime']}")
reading_results = readings_response.json()['result']
assert len(reading_results) != 1550
reading_response = requests.get(f"http://localhost:5000/readings?start={report['startTime']}&stop={report['stopTime']}")
reading_results = reading_response.json()['result']
assert len(reading_results) != 1550
len(reading_results)
requests.get("http://localhost:5000/last-timecode").json()['result']
type(requests.get("http://localhost:5000/last-timecode").json()['result'])
assert isinstance(requests.get("http://localhost:5000/last-timecode").json()['result'], int)
get_ipython().run_line_magic('save', 'api_tests 0-45')
