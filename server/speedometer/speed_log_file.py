from collections import defaultdict
import json
import re
import os

class SpeedLogFile(object):
	"""docstring for SpeedLogFile"""
	def __init__(self, path):
		super(SpeedLogFile, self).__init__()
		self._path = path
		self._LINE_REGEX = re.compile(r"(?P<timestamp>[0-9\.]+)\,(?P<currentSpeedKmh>[0-9\.]+)\,(?P<currentAccelMss>[0-9\.\-]+)\,(?P<currentRevsPerMin>[0-9\.]+)\,(?P<totalDistanceMetres>[0-9\.]+)\,(?P<totalTimeSeconds>[0-9\.]+)\,(?P<tripDistanceMetres>[0-9\.]+)\,(?P<tripTimeSeconds>[0-9\.]+)\,(?P<tripMaxSpeedKmh>[0-9\.]+)")
		
	def _read(self):
		with open(self._path, 'rb') as handle:
			try:
				return handle.read().decode("utf-8")
			except UnicodeDecodeError:
				return ""

	def _readNearEof(self):
		" Uses the knowledge that the average line of the log file is about 64 bytes to seek near the end. "
		bytes_position_near_eof = os.path.getsize(self._path) - (65 * 3)

		with open(self._path, 'rb') as handle:
			handle.seek(bytes_position_near_eof)
			_ = handle.readline()

			try:
				return handle.read().decode("utf-8")
			except UnicodeDecodeError:
				return ""

	def getLastTwoHoursInRevolutions(self):
		pairs = self.getLastTwoHours()
		revs, _timecodes = list(zip(*pairs))

		return revs

	def _parseLogFile(self):
		" Return lines from log file as a list of dicts. "
		data = self._read()

		lines = data.split("\r\n")
		return [self._LINE_REGEX.search(line).groupdict() for line in lines if self._LINE_REGEX.search(line)]

	def getLastTwoHours(self):
		" Returns a list of tuples, revolution reading, then timecode. "
		dxs = self._parseLogFile()
		pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))) for dx in dxs]
		lowest_ts = min(list(zip(*pairs))[1])
		highest_ts = max(list(zip(*pairs))[1])
		last_two_hours_timecode = highest_ts - (60 * 60 * 2)
		pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))-lowest_ts) for dx in dxs if float(dx['timestamp']) > last_two_hours_timecode]

		return pairs

	def getLastTimecode(self):
		" Returns most recently recorded timecode. "
		data = self._readNearEof()

		lines = data.split("\r\n")
		nearEndingEntries = [self._LINE_REGEX.search(line).groupdict() for line in lines if self._LINE_REGEX.search(line)]

		return int(float(nearEndingEntries[-1]['timestamp']))

	def getReadingRange(self, startTimestamp, stopTimestamp):
		" Returns a list of tuples, revolution reading, then timecode. "
		dxs = self._parseLogFile()
		pairs = [(int(dx['currentRevsPerMin']), int(float(dx['timestamp']))) for dx in dxs if int(float(dx['timestamp'])) >= startTimestamp and int(float(dx['timestamp'])) <= stopTimestamp]

		return pairs

	def getClusters(self, gapping_seconds = 10):
		"""
			Returns readings clustered by timecode.

			- gapping_seconds - Seconds of inactivity needed to delimit a cluster.
		"""
		dxs = self._parseLogFile()
		reading_clusters = defaultdict(lambda: list())
		starting_timestamp = 0
		previous_timestamp = 0

		for reading in dxs:
			if float(reading['timestamp']) < previous_timestamp + gapping_seconds:
				reading_clusters[starting_timestamp].append(reading)
			else:
				starting_timestamp = float(reading['timestamp'])
				reading_clusters[starting_timestamp].append(reading)

			previous_timestamp = float(reading['timestamp'])

		return [{"starting_timestamp":k, "readings":v} for k, v in reading_clusters.items()]