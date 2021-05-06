from datetime import datetime
import json

from datastore.directive_dao import DirectiveDao

class ActionLogger(object):
	"""docstring for ActionLogger"""
	def __init__(self, path):
		super(ActionLogger, self).__init__()
		self.path = path

	def log(self, data):
		with DirectiveDao(self.path) as directiveDao:
			directiveDao.recordDirective(json.dumps(data), datetime.now().timestamp())