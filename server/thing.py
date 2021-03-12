with open("file.txt", "a") as handle:
    handle.write("In thingy file:")
    handle.write(__name__)
    handle.write("\n")

def main():        
    with open("file.txt", "a") as handle:
        handle.write("thingy method running\n")

if __name__ == '__main__':
    main()

import logging
import sys

logger = logging.getLogger(__name__)
handler = logging.StreamHandler(stream = sys.stdout)
logger.addHander(handler)

def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return

    logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))       

sys.excepthook = handle_exception

if __name__ == "__main__":
    raise RuntimeError("Test handler")

# logger = logging.getLogger("myLogger")
# # Configure logger to write to a file...

# def my_handler(type, value, tb):
#   logger.exception("Uncaught exception: {0}".format(str(value)))

# # Install exception handler
# sys.excepthook = my_handler

# # Run your main script

import socketio

with open("file.txt", "a") as handle:
    handle.write("socketio loaded\n")

sio = socketio.Client()

with open("file.txt", "a") as handle:
    handle.write("sio client created\n")

uri = "ws://127.0.0.1:5000/"
sio.connect(uri)

with open("file.txt", "a") as handle:
    handle.write("sio client connected\n")

sio.emit("speedometer update", {"data":})

with open("file.txt", "a") as handle:
    handle.write("sio emition sent\n")

with open("file.txt", "a") as handle:
    handle.write("thingy completed\n")
