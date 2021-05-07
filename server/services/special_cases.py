from collections import defaultdict
from utilities.singleton import singleton

@singleton
class SpecialCase:
	"""
		Modified class for handling SocketIO 
		resevered cases with blueprints.
	"""
	def __init__(self):
		self._wrappedFunctions = defaultdict(lambda:list())
		self._cases = {"connect", "disconnect"}

	def add(self, key, func):
		self._wrappedFunctions[key].append(func)

	def buildRunner(self, key):
		def run(*args, **kwargs):
			results = list()

			for f in self._wrappedFunctions[key]:
				result = f(*args, **kwargs)
				results.append(result)

			return results

		return run
		
	def inCases(self, key):
		return key in self._cases