"""
A Flask Blueprint class to be used with Flask-SocketIO.

This class inherits from the Flask Blueprint class so that
 we can use the standard Blueprint interface.

Derived from https://github.com/m-housh/io-blueprint
Original work by Michael Housh, mhoush@houshhomeenergy.com
Modified by Brian Wojtczak

@author Brian Wojtczak
"""

# noinspection PyPackageRequirements
import socketio

from flask import Blueprint

from services.special_cases import SpecialCase

class IOBlueprint(Blueprint):

    def __init__(self, *args, **kwargs):
        super().__init__(self, *args, **kwargs)
        self.namespace = self.url_prefix or '/'
        self._socketio_handlers = []
        self.socketio = None
        self.record_once(self.init_socketio)
        self._specialCases = SpecialCase()

    def init_socketio(self, state):
        self.socketio: socketio.Client = state.app.extensions['socketio']
        for f in self._socketio_handlers:
            f(self.socketio)

        return self.socketio

    def on(self, key):
        """ A decorator to add a handler to a blueprint. """

        def wrapper(f):
            # f is the function being wrapped

            if self._specialCases.inCases(key):
                self._specialCases.add(key, f)

                def wrap(sio):
                    print(sio)
                    # wrap is the function that replaces or
                    # monkey patches the decorated source function
                    combinedFunction = self._specialCases.buildRunner(key)

                    @sio.on(key, namespace=self.namespace)
                    def wrapped(*args, **kwargs):
                        return combinedFunction(*args, **kwargs)
                        #return f(*args, **kwargs)

                    return sio
            else:                
                def wrap(sio):
                    # wrap is the function that replaces or
                    # monkey patches the decorated source function
                    @sio.on(key, namespace=self.namespace)
                    def wrapped(*args, **kwargs):
                        return f(*args, **kwargs)

                    return sio

            self._socketio_handlers.append(wrap)
            # this code runs at import time

        return wrapper

    def emit(self, *args, **kwargs):
        self.socketio.emit(*args, **kwargs)

    def getSocketIO(self):
        return self.socketio