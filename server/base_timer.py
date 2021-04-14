from time import sleep
import socketio
import pickle
import base64
import json
import sys

def broadcast_update(sio, result):
    try:
        sio.emit("tabata timer update", {"data": result})
    except socketio.exceptions.BadNamespaceError as ex:
        pass

def parse_args(system):
  result = dict()

  if len(system.argv) > 1:
    result = pickle.loads(base64.decodebytes(bytes(system.argv[1], "utf-8")))

  return result

def serialize_args(uri = None, schedule = None):
  " Build an argument string for use with parse_args. "
  arguments = dict()

  if uri:
    arguments["uri"] = uri

  if schedule:
    arguments["schedule"] = schedule

  return base64.encodebytes(pickle.dumps(arguments)).decode().strip()

def main():
  """
    When run from console, script accepts one argument.  Argument should be base64 
    pickled dict of configuration arguments for run function.  Any omited dict key 
    will result in the default value being used.

    Script may be run without arguments, in which case, defaults will be used.
  """
  uri = "ws://127.0.0.1:5000/"

  schedule = [{"activity":"Warmup",    "interval": 2*60},
              {"activity":"Sprint!",   "interval": 30},
              {"activity":"Recover",   "interval": 3*60},
              {"activity":"Sprint!",   "interval": 30},
              {"activity":"Recover",   "interval": 3*60},
              {"activity":"Sprint!",   "interval": 30},
              {"activity":"Recover",   "interval": 3*60},
              {"activity":"Sprint!",   "interval": 30},
              {"activity":"Recover",   "interval": 3*60},
              {"activity":"Sprint!",   "interval": 30},
              {"activity":"Cool Down", "interval": 3*60}]

  arguments = {"uri": uri, "schedule": schedule, **parse_args(sys)}
  run(**arguments)

def run(uri, schedule):
  sio = socketio.Client()

  sio.connect(uri)

  try:
    for segment in schedule:
      for i in range(segment['interval'], 0, -1):
        print(f"\r {segment['activity']} - \t{i}    ", end="")
        broadcast_update(sio, {**segment, "activity":segment['activity'], "timeRemaining":i})
        sleep(1)

    print("\rDone!                                      ")
    broadcast_update(sio, {"activity":"Done!", "timeRemaining":0})
  finally:
    sio.disconnect()

if __name__ == '__main__':
  main()