"use strict";

var fn = require("./functional");
var methodCurry = require("./methodCurry");
var iteration = require("./iteration");

var getKey = fn.prop(0);
var getValue = fn.prop(1);
var isValueAFunction = fn.compose(fn.isFunction, getValue);

var toTuple = fn.curry(function toTuple(key, value) {
	return [key, value];
});

var toTuples = fn.curry(function toTuples(items) {
	return iteration.fold(function (tuples, value, key) {
		tuples.push(toTuple(key, value));
		return tuples;
	}, [], items);
});

var toObject = fn.curry(function toObject(tuples) {
	return iteration.fold(function (memo, tuple) {
		memo[getKey(tuple)] = getValue(tuple);
		return memo;
	}, {}, tuples);
});

var curryMethodInDirection = fn.curry(function curryMethodInDirection(curryMethod, tuple) {
	var key = getKey(tuple);
	var method = curryMethod(getValue(tuple));

	return toTuple(key, method);
});

var curryMethodLeft = curryMethodInDirection(methodCurry.curryMethodLeft);
var curryMethodRight = curryMethodInDirection(methodCurry.curryMethodRight);

module.exports = {
	toTuple: toTuple,
	toTuples: toTuples,
	toObject: toObject,
	getKey: getKey,
	getValue: getValue,
	isValueAFunction: isValueAFunction,
	curryMethodLeft: curryMethodLeft,
	curryMethodRight: curryMethodRight
};
