from flask import Blueprint
import flask
import os

from serial.speed_log_file import SpeedLogFile

speedLogFile = SpeedLogFile(os.getenv("LOG_FILE_PATH"))

bp = Blueprint("timecode", __name__)

@bp.route('/last-timecode')
def get_last_timecode():
    tc = speedLogFile.getLastTimecode()
    return flask.jsonify(result=tc)