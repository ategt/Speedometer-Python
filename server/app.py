import utils.log_decorator

from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit
from importlib import import_module

from speed_log_file import SpeedLogFile
from tabata_timer import TabataTimer
from report_dao import ReportDao
from recorder import Recorder
import flask
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True

scheduleDao = ScheduleDao(os.getenv("SCHEDULE_FILE_PATH"))
speedLogFile = SpeedLogFile(os.getenv("LOG_FILE_PATH"))
reports = ReportDao(os.getenv("REPORT_FILE_PATH"))
socketio = SocketIO(app)
timer = TabataTimer()

@app.route('/')
def index():
    return send_from_directory("..\\client","index.html", as_attachment=False)

@app.route('/d3')
def graph():
    return send_from_directory("..\\client","d3.html", as_attachment=False)

@app.route('/info')
def info():
    return send_from_directory("..\\client","reports.html", as_attachment=False)

@app.route('/send/<path:filename>')
def send_file(filename):
    if 'cdn-' in filename:
        return send_from_directory("..\\cdn", filename.replace("cdn-",""), as_attachment=False)
    else:
        return send_from_directory("..\\client", filename, as_attachment=False)

@app.route('/readings')
def reading_get():
    args = flask.request.args

    if 'start' in args.keys() and 'stop' in args.keys():
        pairs = speedLogFile.getReadingRange(startTimestamp = int(args['start']), stopTimestamp = int(args['stop']))
        return flask.jsonify(result=pairs)
    else:
        pairs = speedLogFile.getLastTwoHours()
        return flask.jsonify(result=pairs)

@app.route('/last-timecode')
def get_last_timecode():
    tc = speedLogFile.getLastTimecode()
    return flask.jsonify(result=tc)

@app.route('/report', methods={"POST"})
def endpointReportPost():
    reports.create(flask.request.get_json())

    return flask.make_response()

@app.route('/report', methods={"PATCH"})
def endpointReportPatch():
    reports.patch(flask.request.get_json())

    return flask.make_response()

@app.route('/report/<path:id>', methods={"DELETE"})
def endpointReportDelete(id):
    reports.retire(int(id))

    return flask.make_response()

@app.route('/report')
def endpointReportRead():
    return flask.jsonify(reports=reports.getAll())

@socketio.on('speedometer update')
def speedometer_update(message):
    emit('speedometer update broadcast', {'data': message['data']}, broadcast=True)

@socketio.on('tabata timer update')
def tabata_timer_update(message):
    emit('tabata timer update broadcast', {'data': message['data']}, broadcast=True)

@socketio.on('tabata timer action')
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

@socketio.on('recorder directive')
def recoder_directive(data):
    emit('recorder directive broadcast', data, broadcast=True)

@socketio.on('recorder action')
def recoder_action(data):
    emit('recorder action broadcast', data, broadcast=True)

@socketio.on('connect')
def connect():
    emit('information', {'data': 'Connected'})

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')
    emit('tabata timer update broadcast', {'data': {"activity":"-Timer Stopped-","timeRemaining":" - "}}, broadcast=True)

@app.route('/', defaults={'path1':'', 'path2':''})
@app.route('/<path:path1>', defaults={'path2':''})
@app.route('/<path:path1>/<path:path2>')
def catch_all(path1, path2):
    return flask.redirect("/")

@app.errorhandler(404)
def handle_404(e):
    return flask.redirect("/")

@app.after_request
def add_header(response):
  response.headers['Access-Control-Allow-Origin'] = "*"
  response.headers['Access-Control-Allow-Headers'] = "*"

  return response

@app.teardown_appcontext
def shutdown_session(exception=None):
    pass

modules = [{"url":"/schedules", }]

# Import modules
for module in modules:
    # Get module name from 'url' setting, exclude leading slash
    modname = module['url'][1:]

    # from project.controllers.<modname> import <modname>
    mod = __import__(modname,None,None,modname)
    mod = getattr(mod, modname) # Get blueprint from module
    app.register_blueprint(mod, url_prefix=module['url'])

if __name__ == '__main__':
    socketio.run(app)