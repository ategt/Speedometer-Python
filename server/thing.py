import logging
import sys
import os

from time import sleep

if not os.path.exists("log"):
    os.mkdir("log")

formatter = logging.Formatter('%(asctime)s %(levelname)s: %(funcName)s:%(lineno)d %(message)s')

logger = logging.getLogger(__name__)

# Log errors to a file
file_handler = logging.FileHandler("log/main.log")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)

# Just so the console can see what is going on in stdout/stderr
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.WARN)

# Add the handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(stream_handler)

logger.setLevel(logging.DEBUG)

logger.debug("Debug log message")
logger.info("Info log message")
logger.warn("Warn log message")

def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return

    logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))

sys.excepthook = handle_exception

import socketio

def connect():
    print("Connected to server")

def disconnect():
    print("Disconnected from server")

def main():
    print("Starting thingy")
    sio = socketio.Client()

    sio.on("connect", connect)
    sio.on("disconnect", disconnect)

    uri = "ws://127.0.0.1:5000/"

    try:
        sio.connect(uri)

        #sio.emit("speedometer update", {"data":"Some Data Here"})
        sleep(5)
        
        sio.emit("recorder directive", {"data":"Some data"})
    finally:
        sio.disconnect()

if __name__ == '__main__':
    main()