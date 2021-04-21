import sqlite3
import json
import os

class TabataDao(object):
	"""Record Actions directed at timer"""
	def __init__(self, path = None):
		super(TabataDao, self).__init__()
		self.sqliteFile = os.path.join(os.getcwd(), 'data', 'database.sqlite3') if path is None else path
		self._setupDb()

	def _setupDb(self):
	    self.conn = sqlite3.connect(self.sqliteFile)	    
	    c = self.conn.cursor()
	    c.execute('CREATE TABLE IF NOT EXISTS recorder_directives (action TEXT, time TIMESTAMP, pytime INTEGER)')

	    def dict_factory(cursor, row):
		    d = {}
		    for idx, col in enumerate(cursor.description):
		        d[col[0]] = row[idx]

		    return d

	    self.conn.row_factory = dict_factory

	def recordDirective(self, action, pytime):
	    _thiscursor = self.conn.cursor().execute('INSERT INTO recorder_directives (action, time, pytime) VALUES( ?, DATETIME("NOW"), ?)', (action, pytime))
	    self.conn.commit()

	def close(self):
		self.conn.close()

	def getAll(self):		
		return self.conn.cursor().execute('SELECT * FROM recorder_directives').fetchall()