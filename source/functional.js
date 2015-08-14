"use strict";


// These functions are not curried because
// they are needed for the curry impelmentation.
function currylessSlice(arr, start, end) {
	return [].slice.call(arr, start, end);
}

function currylessReverse(arr) {
	return currylessSlice(arr).reverse();
}

function currylessIdentity(value) {
	return value;
}

function curryLessExists(obj) {
	return obj != null; // jshint ignore:line
}


// Function that does the actual currying.
// It can be used for currying left or right.
var curryExecuteNext = function (processArgs, func, arity, args) {
	arity = curryLessExists(arity) ? arity : func.length;
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

var negate = curry(function (predicate) {
	return function () {
		return !predicate.apply(this, arguments);
	};
});

var reverse = curry(currylessReverse);
var identity = curry(currylessIdentity);

var constant = curry(function constant(value) {
	return function () {
		return value;
	};
});

function noop() {}

var exists = curry(curryLessExists);

var truthy = curry(function truthy(obj) {
	return exists(obj) && obj !== false;
});

var falsy = negate(truthy);


// *** Type determination ***

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
var isNumber = curry(function (obj) {
	return isOfType("number", obj) && !isNaN(obj);
});

var isBoolean = isOfType("boolean");

var prop = curry(function (key, obj) {
	return obj[key];
});

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

	compose: compose
};