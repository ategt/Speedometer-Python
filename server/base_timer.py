from time import sleep
import socketio

def broadcast_update(sio, result):
    try:
        sio.emit("tabata timer update", {"data": result})
    except socketio.exceptions.BadNamespaceError as ex:
        pass

def main():
  sio = socketio.Client()

  sio.connect("ws://127.0.0.1:5000/")

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

  try:
    for segment in schedule:
      for i in range(segment['interval'], 0, -1):
        print(f"\r {segment['activity']} - \t{i}    ", end="")
        broadcast_update(sio, {"activity":segment['activity'], "timeRemaining":i})
        sleep(1)

    print("\rDone!                                      ")
    broadcast_update(sio, {"activity":"Done!", "timeRemaining":0})
  finally:
    sio.disconnect()

if __name__ == '__main__':
  main()