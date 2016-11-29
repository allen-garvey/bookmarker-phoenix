"use strict";

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var maps = require('gulp-sourcemaps');

var config = require(path.join(__dirname, 'gulp-config.js'));

/*
* JavaScript Tasks
*/
gulp.task('concatScripts', function(){
	return gulp.src(config.js.app_files)
		.pipe(maps.init())
		.pipe(concat(config.js.DIST_NAME + '.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(config.js.DEST_DIR));
});

gulp.task('minifyScripts', ['concatScripts'], function(){
	return gulp.src(path.join(config.js.DEST_DIR, config.js.DIST_NAME + '.js'))
		.pipe(uglify())
		.pipe(rename(config.js.DIST_NAME + '.min.js'))
		.pipe(gulp.dest(config.js.DEST_DIR));
});



/*
* Watch tasks
*/


gulp.task('watchScripts', function(){
	gulp.watch(config.js.SOURCE_DIR + '**/*.js', ['minifyScripts']);
});


/*
* Main gulp tasks
*/
gulp.task('watch', ['build', 'watchScripts']);
gulp.task('build', ['minifyScripts']);
gulp.task('default', ['build']);