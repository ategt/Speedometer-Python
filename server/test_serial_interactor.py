import unittest

from serial_interactor import Speedometer
from time import sleep

class TestSpeedometer(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_speedometer(self):
        speedometer = Speedometer("COM4", 9600)
        speedometer.writeConfig( 0.9, 50)
        speedometer.writeConfig(30, 50)
        speedometer.getData()
        speedometer.getConfig()
        speedometer.close()

if __name__ == '__main__':
    unittest.main()