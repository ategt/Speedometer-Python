from flask import Blueprint, send_from_directory, request, jsonify

bp = Blueprint("main", __name__)

@bp.route('/')
def index():
    return send_from_directory("..\\..\\client\\public","index.html", as_attachment=False)

@bp.route('/tests', strict_slashes=False, endpoint='tests_all', defaults={'path':''})
@bp.route('/tests/<path:path>', endpoint='tests')
def run_tests(path):
    return send_from_directory("..\\..\\client\\public","tests.html", as_attachment=False)

@bp.route('/graph', strict_slashes=False, endpoint='graphsource_clean', defaults={'path':''})
@bp.route('/status', strict_slashes=False, endpoint='status', defaults={'path':''})
@bp.route('/public-status', strict_slashes=False, endpoint='publicStatus', defaults={'path':''})
@bp.route('/graph/<path:path>', endpoint='graph')
@bp.route('/public-schedule/', endpoint='schedule', defaults={'path':''})
@bp.route('/reciever/', endpoint='reciever', defaults={'path':''})
@bp.route('/public-reciever/', endpoint='publicReciever', defaults={'path':''})
@bp.route('/public-info/', endpoint='info', defaults={'path':''})
@bp.route('/about', endpoint='about', defaults={'path':''})
@bp.route('/admin', endpoint='admin', defaults={'path':''})
@bp.route('/admin-panel', endpoint='adminPanel', defaults={'path':''})
def spa(path):
    return send_from_directory("..\\..\\client\\public","index.html", as_attachment=False), 200

@bp.route('/public/<path:filename>')
def public_endpoint(filename):
    print(request)
    return send_from_directory("..\\..\\client\\public", filename, as_attachment=False)

@bp.route('/dist/<path:filename>')
def build_endpoint(filename):
    return send_from_directory("..\\..\\client\\dist", filename, as_attachment=False)

@bp.route('/dist-test/<path:filename>')
def build_test_endpoint(filename):
    return send_from_directory("..\\..\\client\\dist\\test", filename, as_attachment=False)

@bp.route('/send/<path:filename>')
def send_file(filename):
        return send_from_directory("..\\..\\client", filename, as_attachment=False)

@bp.errorhandler(500)
def handle_500(error):
    print("Error handled: ", error)
    return flask.jsonify(error=error)
    #return flask.redirect("/")

@bp.after_request
def add_header(response):
  response.headers['Access-Control-Allow-Origin'] = "*"
  response.headers['Access-Control-Allow-Headers'] = "*"
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  response.headers['Access-Control-Allow-Credentials'] = True

  return response