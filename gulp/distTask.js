"use strict";

var gulp = require("gulp");
var scriptsTaskName = require("./scriptsTask");


var taskName = 'dist';

gulp.task(taskName, [scriptsTaskName]);

module.exports = taskName;