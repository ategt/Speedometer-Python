from .timer_already_started_error import TimerAlreadyStartedError
from .base_timer import serialize_args
from os import path
import subprocess

class TabataTimer(object):
    """docstring for TabataTimer"""
    def _start(self):
        relative_directory = path.dirname(path.relpath(__file__))

        self._proc = subprocess.Popen(['python3', path.join('.', relative_directory, 'base_timer.py'), self._getArguments()],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)

    def start(self):
        if '_proc' in dir(self) and self.getReturnCode() != 1:
            print('_proc' in dir(self), self.getReturnCode())
            raise TimerAlreadyStartedError()
        else:
            self._start()

    def stop(self):
        if '_proc' in dir(self):
            self._proc.terminate()
            self._proc.wait()
            _ = self.getReturnCode()

    def getPid(self):
        if '_proc' in dir(self):
            return self._proc.pid

    def pulse(self):
        try:
            self._proc.communicate(timeout=0.01)
        except subprocess.TimeoutExpired:
            pass
        finally:
            return "1"

    def getReturnCode(self):
        _outs, _ = self._proc.communicate(timeout=0.2)
        return self._proc.returncode

    def setSchedule(self, schedule):
        self._schedule = schedule

    def setUri(self, uri):
        self._uri = uri

    def getSchedule(self):
        return self._schedule

    def getUri(self):
        return self._uri

    def _getArguments(self):
        return serialize_args(uri = self._uri if "_uri" in dir(self) else None, 
                                schedule = self._schedule if "_schedule" in dir(self) else None)