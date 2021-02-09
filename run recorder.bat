CD /D %~dp0

@SET LOG_FILE_PATH=./data/speed-log.txt

python ./server/serial_recorder.py

PAUSE