import logging

from .io_blueprint import IOBlueprint

logger = logging.getLogger(__name__)
bp = IOBlueprint('events', __name__)

@bp.on('connect')
def connect():
    bp.emit('information', {'data': 'Connected'})

@bp.on('disconnect')
def disconnect():
	pass