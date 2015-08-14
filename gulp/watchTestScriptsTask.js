"use strict";

var gulp = require("gulp");
var _ = require("lodash");
var bundleScripts = require("./bundleScripts");


var taskName = 'watchTestScripts';
/**
* Watch test script files and compile them
*/
gulp.task(taskName, _.partial(bundleScripts, "mainSpec.js", "./test", "./testRun", true));

module.exports = taskName;