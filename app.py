from flask import Flask, render_template, send_from_directory, Request
from flask_socketio import SocketIO, emit
from speed_log_file import SpeedLogFile
import flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True

speedLogFile = SpeedLogFile("speed-log.txt")
socketio = SocketIO(app)

@app.route('/')
def index():
    return send_from_directory(".","index.html", as_attachment=False)

@app.route('/d3')
def graph():
    return send_from_directory(".","d3.html", as_attachment=False)

@app.route('/send/<path:filename>')
def send_file(filename):
    return send_from_directory(".", filename, as_attachment=False)  

@app.route('/readings')
def reading_update():
    pairs = speedLogFile.getLastTwoHours()
    return flask.jsonify(result=pairs)

@socketio.on('speedometer update')
def speedometer_update(message):
    emit('speedometer update broadcast', {'data': message['data']}, broadcast=True)

@socketio.on('tabata timer update')
def tabata_timer_update(message):
    emit('tabata timer update broadcast', {'data': message['data']}, broadcast=True)

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