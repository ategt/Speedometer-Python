from flask import request, jsonify
import logging

from .io_blueprint import IOBlueprint
from .socket import SocketClient

logger = logging.getLogger(__name__)
bp = IOBlueprint('events', __name__)

connected = set()

@bp.route('/clients')
def clients_getAll():
    return jsonify(clients=[client.toJson() for client in connected])

@bp.on('connect')
def connect():
    bp.emit('information', {'data': 'Connected'})

    logger.info(request.sid, " ==> Connected")

    socket = SocketClient(request.sid, bp.getSocketIO())
    connected.add(socket)

@bp.on('disconnect')
def disconnect():
    logger.info(request.sid, " ==> Disconnected")

    socket = SocketClient(request.sid, bp.getSocketIO())
    connected.remove(socket)