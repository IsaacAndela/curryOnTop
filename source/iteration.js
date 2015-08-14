"use strict";

var fn = require("./functional");

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

module.exports = {
	fold: fold,
	map: map,
	select: select,
};