from flask import Blueprint
import flask
import os

from report_dao import ReportDao

reports = ReportDao(os.getenv("REPORT_FILE_PATH"))

reportController = Blueprint("report", __name__)

@reportController.route('/report', methods={"POST"})
def endpointReportPost():
    reports.create(flask.request.get_json())

    return flask.make_response()

@reportController.route('/report', methods={"PATCH"})
def endpointReportPatch():
    reports.patch(flask.request.get_json())

    return flask.make_response()

@reportController.route('/report/<path:id>', methods={"DELETE"})
def endpointReportDelete(id):
    reports.retire(int(id))

    return flask.make_response()

@reportController.route('/report')
def endpointReportRead():
    return flask.jsonify(reports=reports.getAll())
