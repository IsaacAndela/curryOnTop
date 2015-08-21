"use strict";

var gulp = require("gulp");
var bundleScriptsTaskName = require("./bundleScriptsTask");
var uglifyScriptsTaskName = require("./uglifyScriptsTask");


var taskName = 'scripts';

gulp.task(taskName, [bundleScriptsTaskName, uglifyScriptsTaskName]);

module.exports = taskName;