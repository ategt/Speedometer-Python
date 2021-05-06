from flask import Blueprint
import flask
import os

from datastore.report_dao import ReportDao

reports = ReportDao(os.getenv("REPORT_FILE_PATH"))

bp = Blueprint("report", __name__)

@bp.route('/report', methods={"POST"})
def endpointReportPost():
    createdReport = reports.create(flask.request.get_json())

    return flask.jsonify(createdReport)

@bp.route('/report', methods={"PATCH"})
def endpointReportPatch():
    reports.patch(flask.request.get_json())

    return flask.make_response()

@bp.route('/report/<path:id>', methods={"DELETE"})
def endpointReportDelete(id):
    reports.retire(int(id))

    return flask.make_response()

@bp.route('/report')
def endpointReportRead():
    return flask.jsonify(reports=reports.getAll())
