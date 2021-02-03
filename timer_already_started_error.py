class TimerAlreadyStartedError(Exception):
    """Exception for error raised by Starting A Tabata Timer Twice"""
    def __init__(self):
        super(TimerAlreadyStartedError, self).__init__("Timer Already Running")