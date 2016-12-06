
"use strict";

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var maps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

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
* Sass/Styles Tasks
*/
gulp.task('sass', function() {
    gulp.src(config.styles.SOURCE_DIR + '**/*.scss')
        .pipe(sass(config.styles.sass_options).on('error', sass.logError))
        .pipe(gulp.dest(config.styles.DEST_DIR));
});

/*
* Static Assets Tasks
*/
gulp.task('copyStaticAssets', function() {
    gulp.src(config.static_assets.SOURCE_DIR + '**/*', {base: config.static_assets.SOURCE_DIR})
        .pipe(gulp.dest(config.static_assets.DEST_DIR));
});


/*
* Watch tasks
*/

gulp.task('watchSass',function() {
    gulp.watch(config.styles.SOURCE_DIR + '**/*.scss', ['sass']);
});

gulp.task('watchScripts', function(){
	gulp.watch(config.js.SOURCE_DIR + '**/*.js', ['minifyScripts']);
});

gulp.task('watchStaticAssets', function(){
	gulp.watch(config.static_assets.SOURCE_DIR + '**/*', ['copyStaticAssets']);
});


/*
* Main gulp tasks
*/
gulp.task('watch', ['build', 'watchSass', 'watchScripts', 'watchStaticAssets']);
gulp.task('build', ['minifyScripts', 'sass', 'copyStaticAssets']);
gulp.task('default', ['build']);