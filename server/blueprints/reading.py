from flask import Blueprint
import flask
import os

from serial.speed_log_file import SpeedLogFile

speedLogFile = SpeedLogFile(os.getenv("LOG_FILE_PATH"))

bp = Blueprint("reading", __name__)

@bp.route('/readings')
def reading_get():
    args = flask.request.args

    if 'start' in args.keys() and 'stop' in args.keys():
        pairs = speedLogFile.getReadingRange(startTimestamp = int(args['start']), stopTimestamp = int(args['stop']))
        return flask.jsonify(result=pairs)
    else:
        pairs = speedLogFile.getLastTwoHours()
        return flask.jsonify(result=pairs)