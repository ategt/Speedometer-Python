with open("file.txt", "a") as handle:
    handle.write("In thingy file:")
    handle.write(__name__)
    handle.write("\n")
