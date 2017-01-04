//based on:
//https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
const spawn = require('child_process').spawn;

/*
//Run the hex task the first time to install hex
const spawnSync = require('child_process').spawnSync;
const hex = spawnSync('mix', ['local.hex', '--force'], {cwd: __dirname});
*/

const phoenix = spawn('mix', ['phoenix.server'], {cwd: __dirname});

/*
//check stdout for info on hex needing to be installed
phoenix.stdout.on('data', (data) => {
  console.log(`bookmarker.js output: ${data}`);
});
*/

phoenix.stderr.on('data', (data) => {
          console.log(`bookmarker.js error: ${data}`);
});

//based on: http://stackoverflow.com/questions/15833047/how-to-kill-all-child-processes-on-exit
//kill phoenix server on process exit (SIGINT or SIGTERM, but not SIGKILL)
process.on('exit', function() { phoenix.kill('SIGKILL'); });
//catch signals
const cleanExit = function() { process.exit() };
process.on('SIGINT', cleanExit); // catch ctrl-c
process.on('SIGTERM', cleanExit); // catch kill
