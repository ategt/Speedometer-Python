import utils.log_decorator

from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit
from importlib import import_module

from speed_log_file import SpeedLogFile
from tabata_timer import TabataTimer
from recorder import Recorder
import flask
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True

speedLogFile = SpeedLogFile(os.getenv("LOG_FILE_PATH"))
socketio = SocketIO(app, cors_allowed_origins="*")  # or socketio.init_app()
timer = TabataTimer()

@app.route('/')
def index():
    return send_from_directory("..\\client","index.html", as_attachment=False)

@app.route('/d3')
def graph():
    return send_from_directory("..\\client","d3.html", as_attachment=False)

# @app.route('/', defaults={'path1':'', 'path2':''})
@app.route('/summary', defaults={'path':''})
@app.route('/summary/', defaults={'path':''})
@app.route('/summary/<path:path>')
@app.route('/summary/<path:path>/text')
@app.route('/summary/<path:path>/graph')
@app.route('/graph', defaults={'path':''})
@app.route('/graph/', defaults={'path':''})
@app.route('/graph/<path:path>')
def spa(path):
    return send_from_directory("..\\client\\public","index.html", as_attachment=False)

@app.route('/info')
def info():
    return send_from_directory("..\\client","reports.html", as_attachment=False)

@app.route('/send/<path:filename>')
def send_file(filename):
    if 'cdn-' in filename:
        return send_from_directory("..\\cdn", filename.replace("cdn-",""), as_attachment=False)
    else:
        return send_from_directory("..\\client", filename, as_attachment=False)

@app.route('/dist/<path:filename>')
def build_endpoint(filename):
    return send_from_directory("..\\client\\dist", filename, as_attachment=False)

@app.route('/test-js/<path:filename>')
def test_js_endpoint(filename):
    return send_from_directory("..\\client\\dist", filename, as_attachment=False)

@app.route('/test/<path:filename>')
def test_html_endpoint(filename):
    return send_from_directory("..\\client\\dist\\tests", filename, as_attachment=False)

@app.route('/public/<path:filename>')
def public_endpoint(filename):
    return send_from_directory("..\\client\\public", filename, as_attachment=False)

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

# @app.route('/', defaults={'path1':'', 'path2':''})
# @app.route('/<path:path1>', defaults={'path2':''})
# @app.route('/<path:path1>/<path:path2>')
# def catch_all(path1, path2):
#     return flask.redirect("/")

# @app.errorhandler(404)
# def handle_404(e):
#     return flask.redirect("/")

@app.after_request
def add_header(response):
  response.headers['Access-Control-Allow-Origin'] = "*"
  response.headers['Access-Control-Allow-Headers'] = "*"

  return response

@app.teardown_appcontext
def shutdown_session(exception=None):
    pass

modules = [{"module":"schedule_controller", "controller":"schedulesController"},
           {"module":"schedule_controller", "controller":"scheduleController"},
           {"module":"report_controller", "controller":"reportController"}]

# Import modules
for module in modules:
    controller = import_module(module['module'])
    mod = getattr(controller, module['controller'])
    app.register_blueprint(mod)

if __name__ == '__main__':
    socketio.run(app)