"use strict";

var path = require('path');
var config = {};


/*
* JavaScript configuration
*/
config.js = {};
config.js.SOURCE_DIR = path.join(__dirname, 'web', 'static', 'js/');
config.js.DEST_DIR = path.join(__dirname, 'priv', 'static', 'js/');
config.js.DIST_NAME = 'app'; //name of compiled file to be served i.e. app.js and app.min.js
config.js.app_files = ['aquery', 'add_tag_to_bookmark'];

//add source dir prefix and .js suffix to js source files
config.js.app_files = config.js.app_files.map(function(file){return path.join(config.js.SOURCE_DIR, file + '.js');});




/*
* Export config
*/
module.exports = config;
