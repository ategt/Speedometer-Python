from flask import Blueprint
import flask
import os

from datastore.schedule_dao import ScheduleDao

scheduleDao = ScheduleDao(os.getenv("SCHEDULE_FILE_PATH"))

bp = Blueprint("schedules", __name__)

@bp.route('/schedules')
def get_schedule():
    schedule_info = scheduleDao.getAll()
    return flask.jsonify(schedule_info)

@bp.route('/schedules', methods={"POST"})
def endpointSchedulesPost():
    schedule = scheduleDao.create(flask.request.get_json())

    if schedule['default']:
        scheduleDao.setDefault(schedule['id'])

    return flask.jsonify(schedule)

@bp.route('/schedules', methods={"PATCH"})
def endpointSchedulesPatch():
    scheduleDao.patch(flask.request.get_json())

    return flask.make_response()

@bp.route('/schedules', methods={"PUT"})
def endpointSchedulesPut():
    scheduleDao.setDefault(flask.request.get_json()["id"])

    return flask.make_response()

@bp.route('/schedules/<path:id>', methods={"DELETE"})
def endpointSchedulesDelete(id):
    scheduleDao.retire(int(id))

    return flask.make_response()
