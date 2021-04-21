CD /D %~dp0

@SET LOG_FILE_PATH=./data/speed-log.txt
@SET REPORT_FILE_PATH=./data/reports.json
@SET SCHEDULE_FILE_PATH=./data/schedules.json
@SET DB_FILE_PATH=./data/database.sqlite3

python ./server/app.py

PAUSE