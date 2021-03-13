CD /D %~dp0

IF DEFINED 1 (
	@ECHO Running as Remote
	@SET CONTEXT=%1
) ELSE (
	@ECHO Running as Main
	@SET CONTEXT=main
)

ECHO Logging context set to %CONTEXT% >> runlog.txt
ECHO %TIME% >> runlog.txt

python3 ./server/demo.py

IF '%CONTEXT%'=='main' (
	IF %ERRORLEVEL% NEQ 0 (
		@ECHO ErrorLevel: %ERRORLEVEL%
		PAUSE
	)
)