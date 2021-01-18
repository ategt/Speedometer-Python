# HIIT MON

### Purpose

A combination Tabata Timer and Stationary Bicycle Monitor.

### Background

I had been reading about the benefits of High Intesity Interval Training, and wanted to get a Tabata timing app for my phone so that I could try it.  The articles that I liked referenced a Wingate Ergometer.  And so, when the display on my stationary bike went out, I decided to build my own Ergometer thing.  Having no idea what one of those really was, or what it was supposed to look like, I made an application with Arduino and Python.

### Prerequisits

This project is a desktop companion to [Speedometer-Arduino](-). An Arduino, running that sketch, a computer with python 3, a stationary excercise bike with a reed switch based speedometer, and a USB cable are all needed to use this project.

### Requirements

I am using Python 3.6, but I think any version above 3.5 should work.
From there, this repository also requires:

		- Flask
		- Flask-SocketIO
		- pySerial
		- SocketIO

The client webpage uses the following javascript libraries:

		- D3.v6.js
		- Axios.js
		- SocketIO.js

These javascript libraries should be place in the root folder. (Until I seperate out the concerns better.)

### Usage

Once the requirements are met, the web server can be launched with app.py, which is also launchable with `run server.bat` on Windows.  The Arduino serial interface is powered by `serial_recorder.py`, and `run recorder.bat` on Windows.  My Tabata timer is started by `base_timer.py`, which is `run timer.bat` in the Bill Gates operating system.

While each aspect of this project can be used as a standalone option, most with command line support, it is meant to be accessed collectively by a web client.  Using the default settings, the web client is availible at [http://localhost:5000](http://localhost:5000).

My default settings are "speed-log.txt" as the text file where speed recordings are stored, and port COM4 to access the Arduino serial line at 9600 baud.

Finally, when wishing to display mock exercise data, `run demonstration.bat` which is just running the demo.py python script will broadcast readings that have already been logged in the default log file, "speed-log.txt".

### Future Plans

Still planned are client side starting and stopping of the recorder and timer scripts, viewing previous exercises, and building custom Tabata intervals/workouts from the web client.

### Final Thoughts

I tried using a canvas based graphical speedometer of some kind, but found that all the versions I tried updated too slowly to be useful.  From the distance that I find my computer set up at, the existing three lines seem to be all that the screen can hold.  For now, a few new themes might be useful, but no additional live displays or graphic animations are planned.