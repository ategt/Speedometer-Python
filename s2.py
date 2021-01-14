from time import sleep
from random import randint

import time

from serial_interactor import Speedometer

speedometer = Speedometer("COM4", 9600)

comma = ",".encode()
previous_revs = '0'

with open("speed-log.txt", 'ab') as handle:
    for _ in range(9000):
        result = speedometer.getData()
        
        if result['currentRevsPerMin'] is not '0' or previous_revs is not '0':
            handle.write(str(time.time()).encode())
            handle.write(comma)
            handle.write(speedometer.getLastLine())
            previous_revs = result['currentRevsPerMin']

        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), end='')
        sleep(0.9)
        
speedometer.close()

import json
import re

def read(path):
    with open(path, 'rb') as handle:
        try:
            return handle.read().decode("utf-8")
        except UnicodeDecodeError:
            return ""
        
data = read("speed-log.txt")

LINE_REGEX = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")

lines = data.split("\r\n")
dxs = [LINE_REGEX.search(line).groupdict() for line in lines if LINE_REGEX.search(line)]
pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))) for dx in dxs]
lowest_ts = min(list(zip(*pairs))[1])
highest_ts = max(list(zip(*pairs))[1])
last_two_hours_timecode = highest_ts - (60 * 60 * 2)
pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))-lowest_ts) for dx in dxs if float(dx['timestamp']) > last_two_hours_timecode]
revs, timecodes = list(zip(*pairs))
json.dumps(revs)

import matplotlib.pyplot as plt

plt.title('Revolutions')

revs, timecodes = list(zip(*pairs))

plt.plot(timecodes, revs, color='blue')

plt.show()
