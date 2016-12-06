"use strict";

var path = require('path');
var config = {};

config.SOURCE_DIR = path.join(__dirname, 'web', 'static/');
config.DEST_DIR = path.join(__dirname, 'priv', 'static/');

/*
* JavaScript configuration
*/
config.js = {};
config.js.SOURCE_DIR = path.join(config.SOURCE_DIR, 'js/');
config.js.DEST_DIR = path.join(config.DEST_DIR, 'js/');
config.js.DIST_NAME = 'app'; //name of compiled file to be served i.e. app.js and app.min.js
config.js.app_files = ['aquery', 'add_tag_to_bookmark'];

//add source dir prefix and .js suffix to js source files
config.js.app_files = config.js.app_files.map(function(file){return path.join(config.js.SOURCE_DIR, file + '.js');});


/*
* Sass/Styles configuration
*/
config.styles = {};
config.styles.SOURCE_DIR = path.join(config.SOURCE_DIR, 'css/');
config.styles.DEST_DIR = path.join(config.DEST_DIR, 'css/');
config.styles.sass_options = {
  errLogToConsole: true,
  // sourceComments: true, //turns on line number comments 
  outputStyle: 'compressed' //options: expanded, nested, compact, compressed
};

/*
* Static assets configuration
*/
config.static_assets = {};
config.static_assets.SOURCE_DIR = path.join(config.SOURCE_DIR, 'assets/');
config.static_assets.DEST_DIR = config.DEST_DIR;



/*
* Export config
*/
module.exports = config;
