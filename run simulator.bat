CD /D %~dp0

ECHO %time% >> runlog.txt
ECHO %cd% >> runlog.txt

python3 -c "f=open('file.txt','a');f.write('text here\n');f.close()"

python3 "./server/thing.py"

python3 -c "f=open('file.txt','a');f.write('Midpoint.\n');f.close()"

python3 ./server/thing.py

python3 -c "f=open('file.txt','a');f.write('Made it past thingys.\n');f.close()"

python3 ./server/demo.py

PAUSE