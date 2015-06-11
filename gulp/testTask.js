"use strict";

var gulp = require("gulp");
var karma = require('karma').server;


var taskName = 'test';
/**
* Run test once and exit
*/
gulp.task(taskName, function () {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true,
		browsers: ["PhantomJS"],
		autoWatch: false,

	});
});

module.exports = taskName;