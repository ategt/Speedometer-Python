import utils.windows_task_scheduler as wts

import socketio

class Recorder(object):
    """Recorder"""
    def __init__(self, uri = "ws://127.0.0.1:5000/"):
        super(Recorder, self).__init__()
        print("Recorder init-ing")
        self.uri = uri
        self.sio = socketio.Client()

        @self.sio.on("recorder action broadcast")
        def recorder_action(directive):
            print(directive)

    def __enter__(self):
        self.sio.connect(self.uri)

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.sio.disconnect()

    def start(self):
        wts.run_task(task_name='Fake Cycle Logger')

    def stop(self):
        self.sio.emit("recorder directive", {"directive":"shutdown"})

    def isRunning(self):
        return [(t['taskname'], t['status']) for t in wts.list_tasks()][:15][6][1] == 'Running'