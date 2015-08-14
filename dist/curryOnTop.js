!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.curryOnTop=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./functional":2,"./iteration":3,"./methodCurry":4,"./tuple":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"./functional":2}],4:[function(require,module,exports){
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
},{"./functional":2}],5:[function(require,module,exports){
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

},{"./functional":2,"./iteration":3,"./methodCurry":4}]},{},[1])(1)
});


//# sourceMappingURL=curryOnTop.js.map