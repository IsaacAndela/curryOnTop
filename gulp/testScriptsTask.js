"use strict";

var gulp = require("gulp");
var _ = require("lodash");
var bundleScripts = require("./bundleScripts");


var taskName = 'testScripts';

gulp.task(taskName, _.partial(bundleScripts, "mainSpec.js", "./test", "./testRun", false));

module.exports = taskName;