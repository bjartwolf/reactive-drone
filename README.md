Nodecopter-stuff
================
For now this is pretty random stuff I make when playing with the NodeCopter. No modules in here...

The logNavdataToFile will log data from the choppper to a file.
You can fly with a phone as remote while connected and record whatever you are doing. It should, when finished, only stream a zipped file, but for now it streams both. The zip files sometimes get corrupted when interrupted, so better to keep a standard text file as well.

The timeFileReader will read the log file line by line with a timedelay and stream it out, this allows for simulation of code without using the AR Drone.


