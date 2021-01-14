# coding: utf-8

def read(path):
    with open(path, 'rb') as handle:
        try:
            return handle.read().decode("utf-8")
        except UnicodeDecodeError:
            return ""
        
import re
DATA_REGEX = re.compile(r"(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")
data = read("speed-log.txt")

import re
line_regex = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")

lines = data.split("\r\n")
dxs = [line_regex.search(line).groupdict() for line in lines if line_regex.search(line)]
dxs[-3]
from random import randint
from time import sleep
import socketio
import time
import re
sio = socketio.Client("ws://127.0.0.1:5000/")
backward_readings = reversed(dxs)

try:
    if sio:
        sio.connect()
        
    for result in range(backward_readings):
        try:
            sio.emit("speedometer update", {"data":str(result)})
        except socketio.exceptions.BadNamespaceError as ex:
            pass
        
        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)
        
finally:
    sio.disconnect()
                                    
uri = "ws://127.0.0.1:5000/"
backward_readings = reversed(dxs)

try:
    if sio:
        sio.connect(uri)
        
    for result in range(backward_readings):
        try:
            sio.emit("speedometer update", {"data":str(result)})
        except socketio.exceptions.BadNamespaceError as ex:
            pass
        
        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)
        
finally:
    sio.disconnect()
uri = "ws://127.0.0.1:5000/"
backward_readings = reversed(dxs)

try:
    if sio:
        sio.connect(uri)
        
    for result in backward_readings:
        try:
            sio.emit("speedometer update", {"data":str(result)})
        except socketio.exceptions.BadNamespaceError as ex:
            pass
        
        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)
        
finally:
    sio.disconnect()
uri = "ws://127.0.0.1:5000/"
backward_readings = reversed(dxs)

try:
    if sio:
        sio.connect(uri)
        
    for result in backward_readings:
        try:
            sio.emit("speedometer update", {"data":result})
        except socketio.exceptions.BadNamespaceError as ex:
            pass
        
        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)
        
finally:
    sio.disconnect()
uri = "ws://127.0.0.1:5000/"
backward_readings = reversed(dxs)

try:
    if sio:
        sio.connect(uri)
        
    for result in backward_readings:
        try:
            sio.emit("speedometer update", {"data":result})
        except socketio.exceptions.BadNamespaceError as ex:
            pass
        
        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)
        
finally:
    sio.disconnect()
uri = "ws://127.0.0.1:5000/"
backward_readings = reversed(dxs)

try:
    if sio:
        sio.connect(uri)
        
    for result in backward_readings:
        try:
            sio.emit("speedometer update", {"data":result})
        except socketio.exceptions.BadNamespaceError as ex:
            pass
        
        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)
        
finally:
    sio.disconnect()
get_ipython().run_line_magic('save', 'demo 0-14')
