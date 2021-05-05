from flask import Blueprint, send_from_directory, request, jsonify

bp = Blueprint("main", __name__)

@bp.route('/summary', defaults={'path':''})
@bp.route('/summary/', defaults={'path':''})
@bp.route('/summary/<path:path>')
@bp.route('/summary/<path:path>/text')
@bp.route('/summary/<path:path>/graph')
@bp.route('/graph', defaults={'path':''})
@bp.route('/graph/', defaults={'path':''})
@bp.route('/graph/<path:path>')
@bp.route('/steve', defaults={'path':''})
@bp.route('/steve/', defaults={'path':''})
@bp.route('/steve/<path:path>')
@bp.route('/bill', defaults={'path':''})
@bp.route('/bill/', defaults={'path':''})
@bp.route('/bill/<path:path>')
@bp.route('/ted/', defaults={'path':''})
@bp.route('/ted/<path:path>')
@bp.route('/public-info', defaults={'path':''})
@bp.route('/public-info/', defaults={'path':''})
@bp.route('/public-schedule', defaults={'path':''})
@bp.route('/public-schedule/', defaults={'path':''})
def spa(path):
    return send_from_directory("..\\..\\client\\public","index.html", as_attachment=False)

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
    return flask.jsonify(error=error)
    #return flask.redirect("/")

@bp.after_request
def add_header(response):
  response.headers['Access-Control-Allow-Origin'] = "*"
  response.headers['Access-Control-Allow-Headers'] = "*"

  return response