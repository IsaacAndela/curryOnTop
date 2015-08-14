"use strict";

var fn = require("./functional");

var executeMethod = fn.curry(function executeMethod(context, method, args) {
	return method.apply(context, args);
});

var curryMethodInDirection = fn.curry(function curryMethodInDirection(processArgs, arity, method) {
	arity = fn.exists(arity) ? arity : method.length;
	// Plus 1 because context will be 1 extra argument
	arity +=1;

	var curried = fn.curryRight(function (context) {
		var args = processArgs(fn.rest(arguments));

		return executeMethod(context, method, args);

	}, arity);

	return curried.apply(null, fn.others(curryMethodInDirection.length, arguments));
});

var curryMethodLeftWithArity = curryMethodInDirection(fn.reverse);
var curryMethodRightWithArity = curryMethodInDirection(fn.identity);

var curryMethodLeft = curryMethodLeftWithArity(undefined);
var curryMethodRight = curryMethodRightWithArity(undefined);

module.exports = {
	executeMethod: executeMethod,
	curryMethodLeftWithArity: curryMethodLeftWithArity,
	curryMethodRightWithArity: curryMethodRightWithArity,
	curryMethodLeft: curryMethodLeft,
	curryMethodRight: curryMethodRight
};