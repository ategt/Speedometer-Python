# coding: utf-8

from random import randint
from time import sleep
import serial
import re

class Speedometer(object):
    """Speedometer object for use with Arduino-Speedometer
        
        Examples:
        speedometer = Speedometer("COM4", 9600)
        speedometer.writeConfig( 0.9, 50)
        speedometer.writeConfig(30, 50)
        speedometer.getData()
        speedometer.getConfig()

        for _ in range(90):
            result = speedometer.getData()
            print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), end='')
            sleep(0.9)
    """
    def __init__(self, port, baudrate):
        super(Speedometer, self).__init__()
        self.DATA_REGEX = re.compile(r"(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")
        self.CONFIG_REGEX = re.compile(r"(?P<wheelDiameterMm>[0-9\.]+)\,(?P<speedLimitKmh>[0-9\.]+)")

        self.port = port
        self.baudrate = baudrate
        
        self._serial = serial.Serial(self.port, self.baudrate)

        sleep(2)

        print("connected to: " + self._serial.portstr)

    def getData(self):
        _ = self._serial.write(b"readdata\n\r")
        
        self.line = self._serial.readline()
        response = self.line.decode("utf-8").strip()
        
        return self.DATA_REGEX.search(response).groupdict()

    def resetTrip(self):
        _ = self._serial.write(b"rstrip\n\r")
        
        line = self._serial.readline()
        response = line.decode("utf-8").strip()
       
        return response == 'ok'

    def getConfig(self):
        _ = self._serial.write(b"readconf\n\r")
        
        line = self._serial.readline()
        response = line.decode("utf-8").strip()
       
        return self.CONFIG_REGEX.search(response).groupdict()

    def writeConfig(self, wheelDiameterMm, speedLimitKmh):
        _ = self._serial.write("writeconf {},{}\n\r".format(wheelDiameterMm, speedLimitKmh).encode())
        
        line = self._serial.readline()
        response = line.decode("utf-8").strip()
       
        return response == 'ok'

    def getLastLine(self):
        return self.line

    def close(self):
        return self._serial.close()