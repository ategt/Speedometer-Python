import sys

import app as application

if __name__ == '__main__':
    socketio = application.socketio
    app = application.app

    socketio.run(app, port=int(sys.argv[1]))