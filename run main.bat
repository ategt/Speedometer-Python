CD /D %~dp0

@SET LOG_FILE_PATH=./data/speed-log.txt
@SET REPORT_FILE_PATH=./data/reports.json
@SET SCHEDULE_FILE_PATH=./data/schedules.json

start "" "cmd.exe" "/c" "python.exe" "./server/app.py"
start "" "cmd.exe" "/c" "python.exe" "./server/serial_recorder.py" "true"
start "" "cmd.exe" "/c" "python.exe" "./server/open_browser.py"

IF %ERRORLEVEL% NEQ 0 ECHO SCRIPT ENDED WITH CODE %ERRORLEVEL%
IF %ERRORLEVEL% NEQ 0 PAUSE