Nodecopter-stuff
================
For now this is pretty random stuff.

The logNavdataToFile will log data from the choppper to a file.
You can fly with a phone as remote while connected and record whatever you are doing. 

The readLogSlowly will read the log file line by line with a timedelay and stream it out, this allows for simulation of code without using the AR Drone.

The logging-function obviously require you to have your own drone so you can log data from it. The readLogSlowly file will work, with some hacks to the linestream module (the checked in file in the repo has the hacks in it). 

Just do 
npm install 
(replace the linestream file with the one that comes from the npm package)
node readLogSlowly.js 

also, there seems to be something wrong in requiring modules in rx.node.js so I have commented out some stuff there
