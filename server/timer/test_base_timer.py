import unittest

from time import sleep
import timer.base_timer as base_timer

class FakeSys:
    def __init__(self, input):
        self.argv = ["python.exe", input]

class TestBaseTimer(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_argumentParser(self):
        pickled_string = "gAN9cQAoWAMAAAB1cmlxAVgUAAAAd3M6Ly8xMjcuMC4wLjE6NTAwMC9xAlgIAAAAc2NoZWR1bGVx\nA11xBCh9cQUoWAgAAABhY3Rpdml0eXEGWAYAAABXYXJtdXBxB1gIAAAAaW50ZXJ2YWxxCEt4dX1x\nCShoBlgHAAAAU3ByaW50IXEKaAhLHnV9cQsoaAZYBwAAAFJlY292ZXJxDGgIS7R1fXENKGgGaApo\nCEsedX1xDihoBmgMaAhLtHV9cQ8oaAZoCmgISx51fXEQKGgGaAxoCEu0dX1xEShoBmgKaAhLHnV9\ncRIoaAZoDGgIS7R1fXETKGgGaApoCEsedX1xFChoBlgJAAAAQ29vbCBEb3ducRVoCEu0dWV1Lg=="

        fakeSys = FakeSys(pickled_string)

        result = base_timer.parse_args(fakeSys)

        self.assertTrue('uri' in result.keys())
        self.assertTrue('schedule' in result.keys())

        self.assertEqual(type(result['schedule']), list)

    def test_argumentSerializer(self):
        uri = "ws://127.0.0.1:5000/"

        schedule = [{"activity":"Warmup",    "interval": 2*60},
                    {"activity":"Sprint!",   "interval": 30},
                    {"activity":"Cool Down", "interval": 3*60}]

        argument_string = base_timer.serialize_args(uri, schedule)

        fakeSys = FakeSys(argument_string)

        result = base_timer.parse_args(fakeSys)

        self.assertTrue('uri' in result.keys())
        self.assertTrue('schedule' in result.keys())

        self.assertEqual(type(result['schedule']), list)

if __name__ == '__main__':
    unittest.main()