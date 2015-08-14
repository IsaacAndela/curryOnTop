"use strict";

var gulp = require("gulp");
var karma = require('karma').server;
var testScriptsTaskName = require("./testScriptsTask");

var taskName = 'test';
/**
* Run test once and exit
*/
gulp.task(taskName, [testScriptsTaskName], function () {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true,
		browsers: ["PhantomJS"],
		autoWatch: false,

	});
});

module.exports = taskName;