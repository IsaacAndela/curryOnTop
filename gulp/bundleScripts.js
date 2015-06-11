"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var livereload = require("gulp-livereload");
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var gutil = require('gulp-util');
var _ = require('lodash');
var exorcist = require('exorcist');

function rebundle(bundler, fileName, outputDir) {
	gutil.log("Compiling 'scripts'...");
	var mapFileName = fileName + ".map";
	return bundler.bundle()
		.on('error', function (err) {
			gutil.log(err.message);
			this.end();
		})
		.pipe(plumber())
		.pipe(exorcist(outputDir + "/" + mapFileName))
		.pipe(source(fileName))
		.pipe(gulp.dest(outputDir))
		.pipe(livereload())
		.pipe(plumber.stop());
}


function bundleScripts(fileName, sourceDir, outputDir, watch) {

	var bundler = browserify({
		cache: {},
	    packageCache: {},
		debug: true
	});
	if (watch) {
		bundler = watchify(bundler);
		bundler.on('update', _.partial(rebundle, bundler, fileName, outputDir));
	}

	bundler.add(sourceDir + "/" + fileName);

	return rebundle(bundler, fileName, outputDir);
}

module.exports = bundleScripts;