from functools import wraps
from flask import abort
import jwt

def authorize(f):
	@wraps
	def decorated_function(*args, **kwargs):
		if not 'Authorization' in request.headers:
			abort(401)

		user = None
		data = request.headers['Authorization'].encode("ascii", "ignore")
		token = str.replace(str(data), "Bearer", "")
		try:
			user = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])['sub']
		except:
			abort(401)
		
		return f(user, *args, **kwargs)

	return decorated_function

# To use this decorator:
@app.route("/api/game", methods=["POST"])
@authorize
def create(user):
	data = json.loads(request.data)
	...