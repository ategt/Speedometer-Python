CD /D %~dp0

IF '%1'=='' (
	@ECHO Running as Main
	@SET CONTEXT=main
) ELSE (
	@ECHO Running as Remote
	@SET CONTEXT=%1
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