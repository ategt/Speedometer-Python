import blueprints

if __name__ == '__main__':
    socketio, app = blueprints.create_app()
    app.debug = True
    socketio.run(app)