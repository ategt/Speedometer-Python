from flask import Blueprint
import flask
import os

from schedule_dao import ScheduleDao

scheduleDao = ScheduleDao(os.getenv("SCHEDULE_FILE_PATH"))

scheduleController = Blueprint("schedule", __name__)
schedulesController = Blueprint("schedules", __name__)

@schedulesController.route('/schedules', defaults={'schedule_id':None})
@scheduleController.route('/schedule', defaults={'schedule_id':None})
@scheduleController.route('/schedule/<path:schedule_id>')
def get_schedule(schedule_id):
    schedule_info = scheduleDao.getAll()
    return flask.jsonify(schedule_info)

@schedulesController.route('/schedules', methods={"POST"})
def endpointSchedulesPost():
    schedule = scheduleDao.create(flask.request.get_json())

    if schedule['default']:
        scheduleDao.setDefault(schedule['id'])

    return flask.jsonify(schedule)

@schedulesController.route('/schedules', methods={"PATCH"})
def endpointSchedulesPatch():
    scheduleDao.patch(flask.request.get_json())

    return flask.make_response()

@scheduleController.route('/schedule', methods={"PUT"})
@schedulesController.route('/schedules', methods={"PUT"})
def endpointSchedulesPut():
    scheduleDao.setDefault(flask.request.get_json()["id"])

    return flask.make_response()

@scheduleController.route('/schedule/<path:id>', methods={"DELETE"})
@schedulesController.route('/schedules/<path:id>', methods={"DELETE"})
def endpointSchedulesDelete(id):
    scheduleDao.retire(int(id))

    return flask.make_response()
