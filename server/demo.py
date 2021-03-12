from random import randint
from time import sleep
import socketio
import time
import re

DATA_REGEX = re.compile(r"(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")
LINE_REGEX = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")

def read(path):
    with open(path, 'rb') as handle:
        try:
            return handle.read().decode("utf-8")
        except UnicodeDecodeError:
            return ""

def main():        
    with open("file.txt", "a") as handle:
        handle.write("demo file running\n")

    data = read("./data/speed-log.txt")
    lines = data.split("\r\n")

    sio = socketio.Client()

    uri = "ws://127.0.0.1:5000/"
    backward_readings = reversed([LINE_REGEX.search(line).groupdict() for line in lines if LINE_REGEX.search(line)])

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
            with open("file.txt", "a") as handle:
                handle.write("finally exit triggered\n")

@sio.on('recorder broadcast')
def direction_handler(data):
    #sio.emit("recorder directive", {"data":"Received"})
    if data['directive'] == 'close':
        quit()

with open("file.txt", "a") as handle:
    handle.write("In demo file:")
    handle.write(__name__)
    handle.write(", ")
    handle.write(__name__ == '__main__')
    handle.write(" newest ")
    handle.write("\n")

if __name__ == '__main__':
    main()