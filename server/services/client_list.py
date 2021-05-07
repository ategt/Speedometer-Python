#######################################
# Singleton example using a metaclass #
#######################################
class Singleton(type):
	_instances = {}

	def __call__(cls, *args, **kwargs):
		if cls not in cls._instances:
			cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
		else:
			cls._instances[cls].__init__(*args, **kwargs)

		return cls._instances[cls]

class Logger(metaclass=Singleton):
	pass

#######################################

#######################################
# Singleton example using a decorator #
#######################################
def singleton(class_):
	instances = {}

	def getinstance(*args, **kwargs):
		if class_ not in instances:
			instances[class_] = class_(*args, **kwargs)

		return instances[class_]

	return getinstance

@singleton
class MyClass:
	pass

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