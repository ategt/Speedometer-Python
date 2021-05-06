import utils.windows_task_scheduler as wts

from time import sleep
import threading
import socketio

class Recorder(object):
    """Recorder"""
    def __init__(self, uri = "ws://127.0.0.1:5000/"):
        super(Recorder, self).__init__()

        self.uri = uri
        self.sio = socketio.Client()
        self.event = threading.Event()

        @self.sio.on("connect")
        def connected():
            self.event.set()

        @self.sio.on("disconnect")
        def disconnected():
            self.event.clear()

    def __enter__(self):
        self.sio.connect(self.uri)

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.sio.disconnect()
        sleep(1)
        self.sio.wait()

    def start(self):
        wts.run_task(task_name='Fake Cycle Logger')

    def stop(self):
        for _ in range(25):
            if self.sio.connected and self.event.is_set():
                break
            sleep(1)

        self.sio.emit("recorder directive", {"directive":"shutdown"})

    def isRunning(self):
        return [(t['taskname'], t['status']) for t in wts.list_tasks()][:15][6][1] == 'Running'