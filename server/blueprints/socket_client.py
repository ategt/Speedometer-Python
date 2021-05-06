class SocketClient:
    "Object to represent a socket connection."  

    def __init__(self, sid, sio):
        self.sid = sid
        self.connected = True
        self._sio = sio

    def __hash__(self):
        return hash(self.sid)

    def __str__(self):
        return str(self.sid)

    def __eq__(self, other):
        return isinstance(other, type(self)) and self.sid == other.sid

    def toJson(self):
        return self.sid

    def emit(self, event, data):
        "Emits data to a socket's unique room."
        self._sio.emit(event, data, room=self.sid)