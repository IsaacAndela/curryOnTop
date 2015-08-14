// Karma configuration
// Generated on Fri Feb 06 2015 00:22:22 GMT+0100 (CET)

module.exports = function(config) {
	"use strict";
	config.set({

	// base path that will be used to resolve all patterns (eg. files, exclude)
	basePath: __dirname + '/../',


	// frameworks to use
	// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
	frameworks: ['jasmine'],


	// list of files / patterns to load in the browser
	files: [
		// 'node_modules/browserify/index.js',
		'testRun/mainSpec.js'
		],


	// test results reporter to use
	// possible values: 'dots', 'progress'
	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
	reporters: ['dots'],

	htmlReporter: {
		outputDir: 'karma_html', // where to put the reports
		templatePath: null, // set if you moved jasmine_template.html
		focusOnFailures: true, // reports show failures on start
		namedFiles: false, // name files instead of creating sub-directories
		pageTitle: null, // page title for reports; browser info by default
		urlFriendlyName: false, // simply replaces spaces with _ for files/dirs


		// experimental
		preserveDescribeNesting: false, // folded suites stay folded
		foldAll: false, // reports start folded (only with preserveDescribeNesting)
	},

	osxReporter: {
		notificationMode: 'failChange'
	},


	// web server port
	port: 9876,

	// level of logging
	// possible values: config.LOG_DISABLE || config.LOG_ERROR ||
	//                  config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	logLevel: config.LOG_INFO,
	// singleRun: true,
});
};
