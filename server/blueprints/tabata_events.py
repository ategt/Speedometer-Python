import logging

from flask import request
from flask_socketio import emit, ConnectionRefusedError, disconnect

from .io_blueprint import IOBlueprint

from tabata_timer import TabataTimer

logger = logging.getLogger(__name__)
bp = IOBlueprint('tabata_events', __name__)

timer = TabataTimer()

@bp.on('tabata timer update')
def tabata_timer_update(message):
    emit('tabata timer update broadcast', {'data': message['data']}, broadcast=True)

@bp.on('tabata timer action')
def tabata_timer_action(message):
    if message.get("schedule"):
        timer.setSchedule(message['schedule'])

    if message['data'] == "START":
        timer.start()
    elif message['data'] == "STOP":
        timer.stop()
    elif message['data'] == "CODE":
        emit('tabata timer action broadcast', {'data': timer.getReturnCode()}, broadcast=True)
    elif message['data'] == "PID":
        emit('tabata timer action broadcast', {'data': timer.getPid()}, broadcast=True)
    elif message['data'] == "PULSE":
        emit('tabata timer action broadcast', {'data': timer.pulse()}, broadcast=True)
    elif message['data'] == "SCHEDULE":
        emit('tabata timer action broadcast', {'type': 'SCHEDULE', 'data': timer.getSchedule()}, broadcast=True)
    elif message['data'] == "INFO":
        print(dir(bp.getSocketIO()))

@bp.on('disconnect')
def disconnect():
    bp.emit('tabata timer update broadcast', {'data': {"activity":"-Timer Stopped-","timeRemaining":" - "}}, broadcast=True)