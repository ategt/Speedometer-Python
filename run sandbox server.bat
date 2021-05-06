CD /D %~dp0

@SET LOG_FILE_PATH=./fake-data/speed-log.txt
@SET REPORT_FILE_PATH=./fake-data/reports.json
@SET SCHEDULE_FILE_PATH=./fake-data/schedules.json
@SET DB_FILE_PATH=./fake-data/database.sqlite3

python ./server/demo_app.py 5002

PAUSE