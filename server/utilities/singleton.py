#######################################
# Singleton example using a decorator #
#######################################
def singleton(class_):
	"""
		Decorator that makes any class
		into a function that returns 
		a singleton instance of that
		class.

		More notes in the code.

		Example:
			@singleton
			class MyClass:
				pass
	"""
	instances = {}

	def getinstance(*args, **kwargs):
		if class_ not in instances:
			instances[class_] = class_(*args, **kwargs)

		return instances[class_]

	return getinstance


########################################
# Above decorator converts MyClass into a
# function that returns a class so 
# class methods are not possible.
#
# Also, for:
# `	x = MyClass()
# `	y = MyClass()
# `	t = type(n)()
#
# then `x == y` but `x != t && y != t`