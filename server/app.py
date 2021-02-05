from flask import Flask, render_template, send_from_directory, Request
from flask_socketio import SocketIO, emit
from speed_log_file import SpeedLogFile
from tabata_timer import TabataTimer
import flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True

speedLogFile = SpeedLogFile("..\\data\\speed-log.txt")
timer = TabataTimer()
socketio = SocketIO(app)

@app.route('/')
def index():
    return send_from_directory(".","index.html", as_attachment=False)

@app.route('/d3')
def graph():
    return send_from_directory(".","d3.html", as_attachment=False)

@app.route('/send/<path:filename>')
def send_file(filename):
    if 'cdn-' in filename:
        return send_from_directory("..\\cdn", filename.replace("cdn-",""), as_attachment=False)
    else:
        return send_from_directory("..\\client", filename, as_attachment=False)

@app.route('/readings')
def reading_update():
    pairs = speedLogFile.getLastTwoHours()
    return flask.jsonify(result=pairs)

@app.route('/clusters')
def clusters():
    clusters = speedLogFile.getClusters()
    return flask.jsonify(result=clusters)

@socketio.on('speedometer update')
def speedometer_update(message):
    emit('speedometer update broadcast', {'data': message['data']}, broadcast=True)

@socketio.on('tabata timer update')
def tabata_timer_update(message):
    emit('tabata timer update broadcast', {'data': message['data']}, broadcast=True)

@socketio.on('tabata timer action')
def tabata_timer_action(message):
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

@socketio.on('connect')
def connect():
    emit('information', {'data': 'Connected'})

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')
    emit('tabata timer update broadcast', {'data': {"activity":"-Timer Stopped-","timeRemaining":" - "}}, broadcast=True)

@app.after_request
def add_header(response):
  response.headers['Access-Control-Allow-Origin'] = "*"
  response.headers['Access-Control-Allow-Headers'] = "*"

  return response

@app.teardown_appcontext
def shutdown_session(exception=None):
    pass

if __name__ == '__main__':
    socketio.run(app)