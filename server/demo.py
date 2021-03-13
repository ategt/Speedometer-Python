import workaround

workaround.setup_thread_exception_hook()

import logging

logging.basicConfig(filename="logfile.log", level=logging.DEBUG)

from random import randint
from time import sleep
import socketio
import time
import re

import sys
import os

if not os.path.exists("log"):
    os.mkdir("log")

logging_context = os.environ.get("CONTEXT", "main")

formatter = logging.Formatter('%(asctime)s %(levelname)s: %(funcName)s:%(lineno)d %(message)s')

logger = logging.getLogger(__name__)

# Log errors to a file
file_handler = logging.FileHandler(f"log/{logging_context}.log")
file_handler.setLevel(logging.WARN)
file_handler.setFormatter(formatter)

# Just so the console can see what is going on in stdout/stderr
stream_handler = logging.StreamHandler()
# stream_handler.setLevel(logging.WARN)

# Add the handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(stream_handler)

# logger.setLevel(logging.DEBUG)

# logger.debug("Debug log message")
logger.info("Starting Log To File")
# logger.warn("Warn log message")

def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return

    logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))

sys.excepthook = handle_exception
#import utils.log_decorator

DATA_REGEX = re.compile(r"(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")
LINE_REGEX = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")

def read(path):
    with open(path, 'rb') as handle:
        try:
            return handle.read().decode("utf-8")
        except UnicodeDecodeError:
            return ""

def directive_handler(data):
    sys.excepthook = handle_exception
    if data['directive'] == 'shutdown':
        try:
            sio.emit("recorder action", {"data":"Shutdown Order Received"})
            quit(0)
        except NameError:
            logger.error("Uncaught exception")
            raise RuntimeException("This exception.")
    else:
        sio.emit("recorder action", {"message":"Unknown Request Received", "data":data})

def main():        
    data = read("./data/speed-log.txt")
    lines = data.split("\r\n")

    root_logger = logging.getLogger()
    root_logger.addHandler(file_handler)
    # root_logger.setLevel(logging.DEBUG)

    sio = socketio.Client(logger=True)
    sio.eio.logger.addHandler(file_handler)

    sio.logger.addHandler(file_handler)

    print(sio.eio.logger.handlers)

    # sio.eio.logger.handlers[0].setLevel(logging.DEBUG)

    print(sio.logger.handlers)

    # sio.logger.handlers[1].setLevel(logging.DEBUG)

    sio.on("recorder directive broadcast", directive_handler)

    print(sio.eio.logger.handlers, sio.eio.logger.filters)
    print(sio.logger.handlers, sio.logger.filters)

    sio.eio.logger.root.addHandler(file_handler)
    sio.logger.root.addHandler(file_handler)

    h = logging.getLogger("socketio")
    # h.setLevel(logging.DEBUG)
    h.addHandler(file_handler)

    h = logging.getLogger("engineio")
    # h.setLevel(logging.DEBUG)
    h.addHandler(file_handler)

    gewsh = logging.getLogger("geventwebsocket.handler")

    gewsh.addHandler(file_handler)
    gewsh.root.addHandler(file_handler)
    # gewsh.setLevel(logging.DEBUG)
    # gewsh.root.setLevel(logging.DEBUG)


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

    except KeyboardInterrupt:
        print("")
        quit(0)
    finally:
        sio.disconnect()

if __name__ == '__main__':
    main()