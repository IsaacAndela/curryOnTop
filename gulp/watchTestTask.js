"use strict";

var gulp = require("gulp");
var karma = require('karma').server;


var taskName = 'watch-test';
/**
* Run test once and exit
*/
gulp.task(taskName, function () {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: false,
		browsers: ["PhantomJS"],
		autoWatch: true,
	});
});

module.exports = taskName;