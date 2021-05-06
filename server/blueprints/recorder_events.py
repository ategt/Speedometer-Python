import logging
import os

from .io_blueprint import IOBlueprint

from services.recorder_action_logger import ActionLogger

logger = logging.getLogger(__name__)
bp = IOBlueprint('recorder_events', __name__)

actionLogger = ActionLogger(os.getenv("DB_FILE_PATH"))

@bp.on('recorder directive')
def recoder_directive(data):
    bp.emit('recorder directive broadcast', data, broadcast=True)
    actionLogger.log(data)

@bp.on('recorder action')
def recoder_action(data):
    bp.emit('recorder action broadcast', data, broadcast=True)
    actionLogger.log(data)