"use strict";

var gulp = require("gulp");
var serveTaskName = require("./serveTask");
var watchScripsTaskName = require("./watchScriptsTask");
var watchTestTaskName = require("./watchTestTask");

var taskName = 'watch';

gulp.task(taskName, [serveTaskName, watchTestTaskName, watchScripsTaskName], function () {
});

module.exports = taskName;
