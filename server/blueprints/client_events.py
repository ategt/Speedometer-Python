from flask import request, jsonify
import logging

from .io_blueprint import IOBlueprint
from .socket_client import SocketClient

logger = logging.getLogger(__name__)
bp = IOBlueprint('clients', __name__)

connected = set()

@bp.route('/clients')
def clients_getAll():
    return jsonify(clients=[client.toJson() for client in connected])

@bp.on('send message')
def recoder_directive(data):
    bp.emit('client message', data, to=data.get('to'))
    bp.emit('client message room', data, room=data.get('to'))

@bp.on('connect')
def connect():
    logger.info(request.sid, " ==> Connected")

    socket = SocketClient(request.sid, bp.getSocketIO())
    connected.add(socket)

@bp.on('disconnect')
def disconnect():
    logger.info(request.sid, " ==> Disconnected")

    socket = SocketClient(request.sid, bp.getSocketIO())
    connected.remove(socket)