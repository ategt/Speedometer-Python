# coding: utf-8

from time import sleep
import socketio

def broadcast_update(sio, result):
    try:
        sio.emit("tabata timer update", {"data": result})
    except socketio.exceptions.BadNamespaceError as ex:
        pass

sio = socketio.Client()

sio.connect("ws://127.0.0.1:5000/")

try:
  for i in range(2*60, 0, -1):
    print(f"\r Warmup - \t{i}    ", end="")
    broadcast_update(sio, {"activity":"Warmup", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Cool Down - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Cool Down", "timeRemaining":i})
    sleep(1)
    
  print("\rDone!                                      ")
  broadcast_update(sio, {"activity":"Done!", "timeRemaining":0})
finally:
    sio.disconnect()
    
from time import sleep
import socketio

def broadcast_update(sio, result):
    try:
        sio.emit("tabata timer update", {"data": result})
    except socketio.exceptions.BadNamespaceError as ex:
        pass

sio = socketio.Client()

sio.connect("ws://127.0.0.1:5000/")

try:
  for i in range(2*60, 0, -1):
    print(f"\r Warmup - \t{i}    ", end="")
    broadcast_update(sio, {"activity":"Warmup", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Recover - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Recover", "timeRemaining":i})
    sleep(1)
    
  for i in range(30, 0, -1):
    print(f"\r Sprint! - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Sprint!", "timeRemaining":i})
    sleep(1)
    
  for i in range(3*60, 0, -1):
    print(f"\r Cool Down - \t{i}   ", end="")
    broadcast_update(sio, {"activity":"Cool Down", "timeRemaining":i})
    sleep(1)
    
  print("\rDone!                                      ")
  broadcast_update(sio, {"activity":"Done!", "timeRemaining":0})
finally:
    sio.disconnect()
    
get_ipython().run_line_magic('save', 'base_timer 0-3')
