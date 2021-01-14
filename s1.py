# coding: utf-8

def read(path):
    with open(path, 'rb') as handle:
        try:
            return handle.read().decode("utf-8")
        except UnicodeDecodeError:
            return ""
        
data = read("speed-log.txt")
import re
line_regex = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")

lines = data.split("\r\n")
dxs = [line_regex.search(line).groupdict() for line in lines if line_regex.search(line)]
pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))) for dx in dxs]
lowest_ts = min(list(zip(*pairs))[1])
pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))-lowest_ts) for dx in dxs]
import json
revs, timecodes = list(zip(*pairs))
json.dumps(revs)
import matplotlib.pyplot as plt

plt.title('Revolutions')

revs, timecodes = list(zip(*pairs))

plt.plot(timecodes, revs, color='orange')

plt.show()
import matplotlib.pyplot as plt

plt.title('Revolutions')

revs, timecodes = list(zip(*pairs))
indexes = [i for i in range(len(revs))]

plt.plot(indexes, revs, color='orange')

plt.show()
import matplotlib.pyplot as plt

plt.title('Revolutions')

revs, timecodes = list(zip(*pairs))
indexes = [i for i in range(len(revs))]

plt.plot(indexes, revs, color='orange')

plt.show()
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
        
from time import sleep
from random import randint

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
def read(path):
    with open(path, 'rb') as handle:
        try:
            return handle.read().decode("utf-8")
        except UnicodeDecodeError:
            return ""
        
data = read("speed-log.txt")

import re
line_regex = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")

lines = data.split("\r\n")
dxs = [line_regex.search(line).groupdict() for line in lines if line_regex.search(line)]
pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))-lowest_ts) for dx in dxs]
import matplotlib.pyplot as plt

plt.title('Revolutions')

revs, timecodes = list(zip(*pairs))
indexes = [i for i in range(len(revs))]

plt.plot(indexes, revs, color='orange')

plt.show()
json.dumps(revs)
data = read("speed-log.txt")

import re
line_regex = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")

lines = data.split("\r\n")
dxs = [line_regex.search(line).groupdict() for line in lines if line_regex.search(line)]
pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))-lowest_ts) for dx in dxs]
import matplotlib.pyplot as plt

plt.title('Revolutions')

revs, timecodes = list(zip(*pairs))
indexes = [i for i in range(len(revs))]

plt.plot(indexes, revs, color='orange')

plt.show()
time.time()
time.time()
time.time()
time.time()
time.time()sleep(1)
print(time.time())
sleep(1)
print(time.time())
60*60
60*60*24
60*60*2
speedometer.close()
speedometer.close()
pairs[-1]
170094-7200
json.dumps([(tx,rx) for tx, rx in pairs if tx > 162894])
[(tx,rx) for tx, rx in pairs if tx > 162894]
json.dumps([rx for rx, tx in pairs if tx > 162894])
max([rx for rx, tx in pairs if tx > 162894])
speedometer.close()
get_ipython().run_line_magic('save', 's1 0-47')
