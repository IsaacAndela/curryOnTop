(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./functional":2,"./tuple":3}],2:[function(require,module,exports){
"use strict";


// These functions are not curried because
// they are needed for the curry impelmentation.
function currylessSlice(arr, start, end) {
	return [].slice.call(arr, start, end);
}

function currylessReverse(arr) {
	return currylessSlice(arr).reverse();
}

function currylessIdentity(arg) {
	return arg;
}


// Function that does the actual currying.
// It can be used for currying left or right.
var curryExecuteNext = function (processArgs, func, arity, args) {
	arity = arity || func.length;
	if (args.length >= arity) {
		return func.apply(this, processArgs(args));
	} else {
		return function () {
			var newArgs = currylessSlice(arguments);
			var nextArgs = args.concat(newArgs);
			return curryExecuteNext.call(this, processArgs, func, arity, nextArgs);
		};
	}
};


var curryRight = function curryRight(func, arity) {
	return curryExecuteNext.call(this, currylessReverse, func, arity, []);
};


// Curry left
var curry = function curry(func, arity) {
	return curryExecuteNext.call(this, currylessIdentity, func, arity, []);
};


var slice = curryRight(currylessSlice);
var others = slice(undefined);
var toArray = others(0);
var rest = others(1);

function compose() {
	var funcs = toArray(arguments);

	return function composer() {
		var args = arguments;
		var func;
		for (var index = funcs.length - 1; index >= 0; index -= 1) {
			func = funcs[index];
			args = [func.apply(null, args)];
		}

		return args[0];
	};
}

var negate = curry(function (func) {
	return function () {
		return !func.apply(this, arguments);
	};
});

var reverse = curry(currylessReverse);
var identity = curry(currylessIdentity);

var constant = curry(function constant(value) {
	return value;
});

function noop() {}

var exists = curry(function exists(obj) {
	return obj != null; // jshint ignore:line
});

var truthy = curry(function truthy(obj) {
	return exists(obj) && obj !== false;
});

var falsy = negate(truthy);


// Object type helpers

var isOfType = curry(function isOfType(type, obj) {
	return typeof obj === type;
});

var isFunction = curry(function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
});

var isObject = curry(function isObject(obj) {
    return isFunction(obj) || (Boolean(obj) && isOfType("object", obj));
});

var isString = isOfType("string");
var isNumber = curry(function (num) {
	return isOfType("number", num) && !isNaN(num);
});

var isBoolean = isOfType("boolean");

var prop = curry(function (key, obj) {
	return obj[key];
});

var executeMethod = curry(function executeMethod(context, method, args) {
	return method.apply(context, args);
});

var curryMethodInDirection = curry(function curryMethodInDirection(processArgs, method) {
	var arity = method.length + 1;

	var curried = curryRight(function (context) {
		var args = processArgs(rest(arguments));

		return executeMethod(context, method, args);

	}, arity);

	return curried.apply(null, others(2, arguments));
});

var curryMethodLeft = curryMethodInDirection(reverse);
var curryMethodRight = curryMethodInDirection(identity);

module.exports = {
	reverse: reverse,
	identity: identity,
	constant: constant,
	noop: noop,
	exists: exists,
	negate: negate,
	truthy: truthy,
	falsy: falsy,

	isFunction: isFunction,
	isObject: isObject,
	isString: isString,
	isNumber: isNumber,
	isBoolean: isBoolean,

	slice: slice,
	others: others,
	rest: rest,
	toArray: toArray,
	prop: prop,

	curryRight: curryRight,
	curry: curry,

	compose: compose,

	executeMethod: executeMethod,
	curryMethodLeft: curryMethodLeft,
	curryMethodRight: curryMethodRight
};
},{}],3:[function(require,module,exports){
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

},{"./functional":2}]},{},[1])


//# sourceMappingURL=curryOnTop.js.map