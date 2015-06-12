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
	return function () {
		return value;
	};
});

function noop() {}

var exists = curry(function exists(obj) {
	return obj != null; // jshint ignore:line
});

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
var isNumber = curry(function (num) {
	return isOfType("number", num) && !isNaN(num);
});

var isBoolean = isOfType("boolean");

var prop = curry(function (key, obj) {
	return obj[key];
});

var fold = curry(function fold(iterator, initial, items) {
	var memo = initial;

	for(var key in items) {
		if (items.hasOwnProperty(key)) {
			memo = iterator(memo, items[key], key);
		}
	}

	return memo;
});

var map = curry(function map(iterator, items) {

	return fold(function (memo, value, key) {
			var result = iterator(value, key, items);
			memo.push(result);

			return memo;
	}, [], items);
});

var select = curry(function select(iterator, tuples) {
	return fold(function (selection, tuple) {
		if (iterator(tuple)) {
			selection.push(tuple);
		}

		return selection;
	}, [], tuples);
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

	fold: fold,
	map: map,
	select: select,

	curryRight: curryRight,
	curry: curry,

	compose: compose,

	executeMethod: executeMethod,
	curryMethodLeft: curryMethodLeft,
	curryMethodRight: curryMethodRight
};