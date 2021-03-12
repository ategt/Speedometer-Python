with open("file.txt", "a") as handle:
    handle.write("In thingy file:")
    handle.write(__name__)
    handle.write("\n")

def main():        
    with open("file.txt", "a") as handle:
        handle.write("thingy method running\n")

if __name__ == '__main__':
    main()

import socketio

with open("file.txt", "a") as handle:
	handle.write("socketio loaded\n")

sio = socketio.Client()

with open("file.txt", "a") as handle:
	handle.write("sio client created\n")

uri = "ws://127.0.0.1:5000/"
sio.connect(uri)

with open("file.txt", "a") as handle:
	handle.write("sio client connected\n")

sio.emit("speedometer update", {"data":result})

with open("file.txt", "a") as handle:
	handle.write("sio emition sent\n")

with open("file.txt", "a") as handle:
    handle.write("thingy completed\n")
