import logging
import os

from flask import Flask
from flask_socketio import SocketIO

from importlib import import_module

def create_app(test_config: dict = None) -> SocketIO:
    # Application instance
    app = Flask(__name__)

    # SocketIO extension
    socketio = SocketIO()
    socketio.init_app(app)

    # # Functionality via blueprints
    # from . import auth, events
    # app.register_blueprint(auth.bp)
    # app.register_blueprint(events.bp)

    blueprints = ["schedule", "report"]

    for blueprint_name in blueprints:
        module = import_module(blueprint_name)
        blueprint = getattr(module, "bp")
        app.register_blueprint(blueprint)

    return app
