from timer_already_started_error import TimerAlreadyStartedError
import subprocess

class TabataTimer(object):
	"""docstring for TabataTimer"""
	def __init__(self):
		super(TabataTimer, self).__init__()

	def _start(self):
		self._proc = subprocess.Popen(['python3', 'base_timer.py'],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)

	def start(self):
		if '_proc' in dir(self) and self.getReturnCode() != 1:
			raise TimerAlreadyStartedError()
		else:
			self._start()

	def stop(self):
		self._proc.terminate()
		self._proc.wait()
		_ = self.getReturnCode()

	def getPid(self):
		if '_proc' in dir(self):
			return self._proc.pid

	def getReturnCode(self):
		_outs, _ = self._proc.communicate(timeout=0.2)
		return self._proc.returncode