import json
import os

class ScheduleDao(object):
	"""
		ScheduleDao for handling schedule data created in HIIT MON schedule editor.
		Dao might be quite the stretch.  This just dumps data into a file and then 
			pulls the whole file when asked.
	"""
	def __init__(self, path):
		super(ScheduleDao, self).__init__()
		self._path = path
		self._nextId = self._determineNextId()

	def _determineNextId(self):
		if os.path.exists(self._path):
			with open(self._path, 'r+') as handle:
				return len(handle.read().strip().split("\n"))
		else:
			return 0

	def _getNextId(self):
		self._nextId += 1
		return self._nextId

	def create(self, data):
		schedule = {**data, "id": self._getNextId()}
		with open(self._path, 'a') as handle:
			json.dump(schedule, handle)
			handle.write("\n")

		return schedule			

	def update(self, data):
		with open(self._path, 'a') as handle:
			json.dump(data, handle)
			handle.write("\n")

	def patch(self, data):
		schedule = self.get(data['id'])
		self.update({**schedule, **data})

	def getAll(self):
		with open(self._path, 'r+') as handle:
			items = [json.loads(line) for line in handle.read().split("\n") if len(line.strip()) > 1]
			schedule_dict = dict((item['id'], item) for item in items)
			default_schedule = dict((item.get('default', False), item) for item in items).get(True, None)
			schedule_set = schedule_dict.values()

			filtered_schedule_set = filter(lambda schedule: len(schedule.values()) > 1, schedule_set)

			return {"schedules": sorted(filtered_schedule_set, key=lambda schedule:schedule['id']),
					"default": default_schedule}

	def get(self, id):
		schedules = self.getAll()['schedules']
		return [r for r in schedules if r['id'] == id][0]

	def retire(self, id):
		self.update({"id": id})

	def setDefault(self, id):
		schedule = self.get(id)
		self.patch({**schedule, "default":True})