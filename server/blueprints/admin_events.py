from flask import request, jsonify
import logging

from .io_blueprint import IOBlueprint
from .socket_client import SocketClient

logger = logging.getLogger(__name__)
bp = IOBlueprint('admin', __name__)

@bp.on('send message')
def recoder_directive(data):
    if 'to' in data.keys():
        bp.emit('client message', data, to=data.get('to'))
    elif 'room' in data.keys():
        bp.emit('client message room', data, room=data.get('room'))
    else:
        bp.emit('admin message', {"message": "delivery failed", "data":data})

@bp.on('connect')
def connect():
    bp.emit('admin event', {"type":"connection", "sid": request.sid})

@bp.on('disconnect')
def disconnect():
    bp.emit('admin event', {"type":"disconnection", "sid": request.sid})