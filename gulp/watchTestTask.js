"use strict";

var gulp = require("gulp");
var karma = require('karma').server;
var watchTestScripsTaskName = require("./watchTestScriptsTask");


var taskName = 'watch-test';
/**
* Run test once and exit
*/
gulp.task(taskName, [watchTestScripsTaskName], function () {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: false,
		browsers: ["PhantomJS"],
		autoWatch: true,
	});
});

module.exports = taskName;