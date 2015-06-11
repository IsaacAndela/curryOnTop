var gulp = require("gulp");
var livereload = require("gulp-livereload");
var http = require('http');
var st = require('st');

var taskName = 'serve';

gulp.task(taskName, function(done) {
	http.createServer(
		st({ path: process.cwd(), index: 'index.html', cache: false })
	).listen(8080, done);

	// Create LiveReload server
	livereload.listen();

});

module.exports = taskName;