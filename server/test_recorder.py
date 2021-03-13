import unittest

from time import sleep 
import threading
import random
import psutil
import os

from recorder import Recorder

class TimerClass(threading.Thread):
    def __init__(self, timeout, error_message, pid=None):
        threading.Thread.__init__(self)
        self.event = threading.Event()
        self.timeout = timeout
        self.error_message = error_message
        self.pid = pid
        
    def run(self):
        self.event.wait(self.timeout)

        if not self.event.is_set():
            if self.pid:
                print("\nTimeout exceeded - Forcing shutdown")
                thisSystem = psutil.Process(self.pid)
                thisSystem.terminate()
            raise TestTimeout(self.error_message)

class TestTimeout(Exception):
    pass

class test_timeout:
    def __init__(self, seconds, error_message=None):
        if error_message is None:
            error_message = f"Test timed out after {seconds} seconds."
        self.seconds = seconds
        self.error_message = error_message
        self.pid = os.getpid()
        
    def handle_timeout(self):
        raise TestTimeout(self.error_message)
    
    def __enter__(self):
        self._thread = TimerClass(timeout=self.seconds, error_message=self.error_message, pid=self.pid)
        self._thread.start()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._thread.event.set()

class TestRecorder(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(TestRecorder, self).__init__(*args, **kwargs)

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_theTimeouter(self):
        with test_timeout(10):
            sleep(1)

        # with test_timeout(1):
        #     sleep(2)

    def test_run(self):
        with test_timeout(10):
            with Recorder() as recorder:
                self.assertFalse(recorder.isRunning())
                recorder.start()
                sleep(1)
                self.assertTrue(recorder.isRunning())
                recorder.stop()
                sleep(1)
                self.assertFalse(recorder.isRunning())

if __name__ == '__main__':
    unittest.main()