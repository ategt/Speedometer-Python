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
import os

if not os.path.exists("log"):
    os.mkdir("log")

formatter = logging.Formatter('%(asctime)s %(levelname)s: %(funcName)s:%(lineno)d %(message)s')

logger = logging.getLogger(__name__)
#handler = logging.StreamHandler(stream = sys.stdout)

# Log errors to a file
file_handler = logging.FileHandler("log/main.log")
file_handler.setLevel(logging.DEBUG)
#file_handler.setLevel(logging.INFO)
file_handler.setFormatter(formatter)

# Just so the console can see what is going on in stdout/stderr
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.WARN)
#stream_handler.setFormatter(formatter)

# Add the handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(stream_handler)

logger.debug("Debug log message")
logger.info("Info log message")
logger.warn("Warn log message")

# with open("log/main.log", "r") as f:
#     print(r.read())

#logger.addHander(handler)

def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return

    logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))       

sys.excepthook = handle_exception

# if __name__ == "__main__":
#     raise RuntimeError("Test handler")

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

sio.emit("speedometer update", {"data":"Some Data Here"})

with open("file.txt", "a") as handle:
    handle.write("sio emition sent\n")

with open("file.txt", "a") as handle:
    handle.write("thingy completed\n")

quit()