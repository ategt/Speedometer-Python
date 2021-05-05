from flask import Blueprint, send_from_directory, request, jsonify

bp = Blueprint("main", __name__)

@bp.route('/')
def index():
    return send_from_directory("..\\..\\client","index.html", as_attachment=False)

@bp.route('/d3')
def raw_graph():
    return send_from_directory("..\\..\\client","d3.html", as_attachment=False)

# @bp.route('/graph', defaults={'path':''})
# @bp.route('/graph/', defaults={'path':''})
# @bp.route('/graph/<path:path>')
# @bp.route('/public-info', defaults={'path':''})
# @bp.route('/public-info/', defaults={'path':''})
# @bp.route('/public-schedule', defaults={'path':''})
# @bp.route('/public-schedule/', defaults={'path':''})
#@bp.route('/graph/', strict_slashes=True, endpoint='graphsource', defaults={'path':''})
# strict_slashes=True,

@bp.route('/graph', endpoint='graphsource_clean', defaults={'path':''})
@bp.route('/graph/<path:path>', endpoint='graph')
@bp.route('/public-schedule/', endpoint='schedule', defaults={'path':''})
@bp.route('/public-reciever/', endpoint='reciever', defaults={'path':''})
@bp.route('/public-info/', endpoint='info', defaults={'path':''})
@bp.route('/about', endpoint='about', defaults={'path':''})
def spa(path):
    print("\n\n", request.endpoint, "\n\n")
    return send_from_directory("..\\..\\client\\public","index.html", as_attachment=False), 200

@bp.route('/public/<path:filename>')
def public_endpoint(filename):
    print(request)
    return send_from_directory("..\\..\\client\\public", filename, as_attachment=False)

@bp.route('/dist/<path:filename>')
def build_endpoint(filename):
    return send_from_directory("..\\..\\client\\dist", filename, as_attachment=False)

@bp.route('/send/<path:filename>')
def send_file(filename):
    if 'cdn-' in filename:
        return send_from_directory("..\\..\\cdn", filename.replace("cdn-",""), as_attachment=False)
    else:
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

  return response