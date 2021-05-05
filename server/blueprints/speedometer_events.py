import logging

from .io_blueprint import IOBlueprint

logger = logging.getLogger(__name__)
bp = IOBlueprint('speedometer_events', __name__)

@bp.on('speedometer update')
def speedometer_update(message):
    bp.emit('speedometer update broadcast', {'data': message['data']}, broadcast=True)