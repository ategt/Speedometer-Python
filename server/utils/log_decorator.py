import logging
import sys
import os

if not os.path.exists("log"):
    os.mkdir("log")

logging_context = os.environ.get("CONTEXT", "main")

formatter = logging.Formatter('%(asctime)s %(levelname)s: %(funcName)s:%(lineno)d %(message)s')

logger = logging.getLogger(__name__)

# Log errors to a file
file_handler = logging.FileHandler(f"log/{logging_context}.log")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)

# Just so the console can see what is going on in stdout/stderr
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.WARN)

# Add the handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(stream_handler)

logger.setLevel(logging.DEBUG)

# logger.debug("Debug log message")
logger.info("Starting Log To File")
# logger.warn("Warn log message")

def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return

    logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))

sys.excepthook = handle_exception