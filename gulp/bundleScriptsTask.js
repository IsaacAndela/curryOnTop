"use strict";

var gulp = require("gulp");
var _ = require("lodash");
var bundleScripts = require("./bundleScripts");


var taskName = 'bundleScripts';

gulp.task(taskName, _.partial(bundleScripts, "curryOnTop.js", "./source", "./dist", false));

module.exports = taskName;