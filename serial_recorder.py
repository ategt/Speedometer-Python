from serial_interactor import Speedometer
from random import randint
from time import sleep
import socketio
import time
import re

def main():
  comma = ",".encode()
  previous_revs = '0'

  try:
    sio = socketio.Client()
    speedometer = Speedometer("COM4", 9600)

    if sio:
        sio.connect("ws://127.0.0.1:5000/")

    with open("speed-log.txt", 'ab') as handle:
      for _ in range(90000):
        result = speedometer.getData()
        
        if result['currentRevsPerMin'] is not '0' or previous_revs is not '0':
          handle.write(str(time.time()).encode())
          handle.write(comma)
          handle.write(speedometer.getLastLine())

          previous_revs = result['currentRevsPerMin']
              
        try:
          sio.emit("speedometer update", {"data":str(result)})
        except socketio.exceptions.BadNamespaceError as ex:
          pass                

        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)

  finally:            
    speedometer.close()
    sio.disconnect()

if __name__ == '__main__':
  main()