"use strict";

var fn = require("./functional");
var tuple = require("./tuple");

var selectTuplesWithFunctions = tuple.select(tuple.isValueAFunction);

var selectFunctionTuplesFromObject = fn.compose(selectTuplesWithFunctions, tuple.toTuples);

var curryLeftTupleMethods = tuple.map(tuple.curryMethodLeft);
var curryRightTupleMethods = tuple.map(tuple.curryMethodRight);

var curryObjectMethodsLeft =
		fn.compose(tuple.toObject, curryLeftTupleMethods, selectFunctionTuplesFromObject);

var curryObjectMethodsRight =
		fn.compose(tuple.toObject, curryRightTupleMethods, selectFunctionTuplesFromObject);


// Build the export object
var curryOnTop = {
	functional: fn,
	tuple: tuple,
	left: curryObjectMethodsLeft,
	right: curryObjectMethodsRight
};

module.exports = curryOnTop;

global.curryOnTop = module.exports;