"use strict";

var gulp = require("gulp");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');



var taskName = 'uglifyScripts';

gulp.task(taskName, function () {
	return gulp.src('dist/curryOnTop.js')
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify({}))
		.pipe(rename({ suffix: ".min"}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'));
});

module.exports = taskName;