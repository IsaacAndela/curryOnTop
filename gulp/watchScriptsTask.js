"use strict";

var gulp = require("gulp");
var _ = require("lodash");
var bundleScripts = require("./bundleScripts");


var taskName = 'watchScripts';
/**
* Run test once and exit
*/
gulp.task(taskName, _.partial(bundleScripts, "curryOnTop.js", "./source", "./dist", true));

module.exports = taskName;