"use strict";

var fn = require("./functional");

var getKey = fn.prop(0);
var getValue = fn.prop(1);
var isValueAFunction = fn.compose(fn.isFunction, getValue);

var fold = fn.curry(function fold(iterator, initial, items) {
	var memo = initial;

	for(var key in items) {
		if (items.hasOwnProperty(key)) {
			memo = iterator(memo, items[key], key);
		}
	}

	return memo;
});

var map = fn.curry(function map(iterator, items) {

	return fold(function (memo, value, key) {
			var result = iterator(value, key, items);
			memo.push(result);

			return memo;
	}, [], items);
});

var select = fn.curry(function select(iterator, tuples) {
	return fold(function (selection, tuple) {
		if (iterator(tuple)) {
			selection.push(tuple);
		}

		return selection;
	}, [], tuples);
});

var toTuple = fn.curry(function toTuple(key, value) {
	return [key, value];
});

var toTuples = fn.curry(function toTuples(items) {
	return fold(function (tuples, value, key) {
		tuples.push(toTuple(key, value));
		return tuples;
	}, [], items);
});

var toObject = fn.curry(function toObject(tuples) {
	return fold(function (memo, tuple) {
		memo[getKey(tuple)] = getValue(tuple);
		return memo;
	}, {}, tuples);
});

var curryMethodInDirection = fn.curry(function curryMethodInDirection(curryMethod, tuple) {
	var key = getKey(tuple);
	var method = curryMethod(getValue(tuple));

	return toTuple(key, method);
});

var curryMethodLeft = curryMethodInDirection(fn.curryMethodLeft);
var curryMethodRight = curryMethodInDirection(fn.curryMethodRight);

module.exports = {
	fold: fold,
	map: map,
	select: select,
	toTuple: toTuple,
	toTuples: toTuples,
	toObject: toObject,
	getKey: getKey,
	getValue: getValue,
	isValueAFunction: isValueAFunction,
	curryMethodLeft: curryMethodLeft,
	curryMethodRight: curryMethodRight
};
