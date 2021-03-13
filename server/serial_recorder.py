from serial_interactor import Speedometer
from random import randint
from time import sleep
import threading
import socketio
import time
import sys
import re
import os

def main():
  comma = ",".encode()
  previous_revs = '0'

  try:
    sio = socketio.Client()
    speedometer = Speedometer("COM4", 9600)

    event = threading.Event()
    
    if "true" in {s.strip().lower() for s in sys.argv[1:]}:
        sleep(0.5)
        print("Waiting for server to start...", end='')
        sleep(5)
        print("\rConnecting..." + " " * 20, end='')

    if sio:
        @sio.on("recorder directive broadcast")
        def directive_handler(data):
            if data['directive'] == 'shutdown':
                sio.emit("recorder action", {"data":"Shutdown Order Received"})
                event.set()
            else:
                sio.emit("recorder action", {"message":"Unknown Request Received", "data":data})

        sio.connect("ws://127.0.0.1:5000/")

    with open(os.getenv("LOG_FILE_PATH"), 'ab') as handle:
      for _ in range(90000):
        result = speedometer.getData()

        if result['currentRevsPerMin'] is not '0' or previous_revs is not '0':
          handle.write(str(time.time()).encode())
          handle.write(comma)
          handle.write(speedometer.getLastLine())

          previous_revs = result['currentRevsPerMin']

        try:
          sio.emit("speedometer update", {"data":result})
          if event.is_set():
            quit(0)
        except socketio.exceptions.BadNamespaceError as ex:
          pass

        print("\r", result['currentRevsPerMin'], " - ", randint(0, 250), " " * 25, end='')
        sleep(0.9)

  except KeyboardInterrupt:
    print("")
    quit(0)
  finally:
    speedometer.close()
    sio.disconnect()

if __name__ == '__main__':
  main()