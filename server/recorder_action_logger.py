from datetime import datetime
import json

from tabata_dao import TabataDao

class ActionLogger(object):
	"""docstring for ActionLogger"""
	def __init__(self, path):
		super(ActionLogger, self).__init__()
		self.path = path

	def log(self, data):
		with TabataDao(self.path) as tabataDao:
			tabataDao.recordDirective(json.dumps(data), datetime.now().timestamp())