"use strict";

var fn = require("./functional");
var iteration = require("./iteration");
var methodCurry = require("./methodCurry");
var tuple = require("./tuple");

var selectTuplesWithFunctions = iteration.select(tuple.isValueAFunction);

var selectFunctionTuplesFromObject = fn.compose(selectTuplesWithFunctions, tuple.toTuples);

var curryLeftTupleMethods = iteration.map(tuple.curryMethodLeft);
var curryRightTupleMethods = iteration.map(tuple.curryMethodRight);

var curryObjectMethodsLeft =
		fn.compose(tuple.toObject, curryLeftTupleMethods, selectFunctionTuplesFromObject);

var curryObjectMethodsRight =
		fn.compose(tuple.toObject, curryRightTupleMethods, selectFunctionTuplesFromObject);


// Build the export object
var curryOnTop = {
	functional: fn,
	left: curryObjectMethodsLeft,
	right: curryObjectMethodsRight,
	singleLeftWithArity: methodCurry.curryMethodLeftWithArity,
	singleRightWithArity: methodCurry.curryMethodRightWithArity,
	singleLeft: methodCurry.curryMethodLeft,
	singleRight: methodCurry.curryMethodRight
};

module.exports = curryOnTop;