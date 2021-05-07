import logging
import os

from flask import Flask
from flask_socketio import SocketIO

from importlib import import_module

def create_app(test_config: dict = None) -> (SocketIO, Flask):
    # Application instance
    app = Flask(__name__)

    # SocketIO extension
    socketio = SocketIO(app, cors_allowed_origins="*")

    # Load blueprints
    blueprints = [".main", 
                  ".schedule", 
                  ".report", 
                  ".timecode", 
                  ".reading", 
                  ".events", 
                  ".tabata_events", 
                  ".recorder_events", 
                  ".speedometer_events", 
                  ".client_events", 
                  ".admin_events"]

    for blueprint_name in blueprints:
        module = import_module(blueprint_name, package="blueprints")
        blueprint = getattr(module, "bp")
        app.register_blueprint(blueprint)

    return socketio, app
