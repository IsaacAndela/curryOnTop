# curryOnTop

curryOnTop aims to make functional programming convenient when working with API’s that rely on object instances and their methods.

It does so by taking every method of an object and creating a curried version of these methods that can be used in a functional manner with the instances of said object. Secondarily curryOnTop exposes a number of utility functions for functional programming. Of course all of these are curried.


## What is currying?

Currying a function creates a new function that accepts one or more arguments of the original function. When the curried function is called and all of the original function’s arguments are provided, it invokes the original function returning its result. Otherwise the curried function returns a new function that accepts one or more of the remaining original function’s arguments, and so on.


## Use case and examples

Say you are using the following constructor to create list instances:

	function List() {
		this.list = [];
	}
	List.prototype.get = function (index) { return this.list[index]; }
	List.prototype.set = function (index, value) { this.list[index] = value; }


Normally one would use an instance of `List` in the following manner:

	var listInstance = new List();
	listInstance.set(0, "value0");
	listInstance.get(0); // returns "value0"


With curryOnTop you can take advantage of currying and do more interesting things in a functional style, for example:

	// create a new instance of List as normal
	var listInstance = new List();

	// make left curried functions of all methods of List.prototype
	// The signature of these functions is func(methodArg1, methodArg2, ..., methodArgN, context)
	// Whereby the methodArg’s are taken from the original method
	var listCurry = curryOnTop.left(List.prototype);

	// 0 is the index of the list in both lines below
	// We take advantage of currying to create new functions
	var setFirst = listCurry.set(0);
	var getFirst = listCurry.get(0);

	// The object to use as context for the method is always provides last
	setFirst("value0", listInstance);
	getFirst(listInstance); // returns "value0"
	listCurry.get(0, listInstance); // same as previous line

Using this technique you can work in a functional style with libraries who by them selves use constructors, instances and methods as there API.


## API documentation

### Curry methods

#### `curryOnTop.singleLeft(method)`

Returns a function that is the left to right curried version of the method.

The function takes the same arguments as the original function with a context argument added as the last argument.

Example:

	var obj = {
		method: function (arg1, arg2, arg3) { return [this.prop, arg1, arg2, arg3] }
	};
	var otherObj = { prop: "otherObjProp" };
	var curriedFunc = curryOnTop.singleLeft(obj.method);

	// could also be written as curriedFunc(1, 2, 3, otherObj)
	// or it could be written as curriedFunc(1, 2)(3, otherObj) or curriedFunc(1)(2, 3)(otherObj) etcetera
	var result = curriedFunc(1)(2)(3)(otherObj);
	// result is: ["otherObjProp", 1, 2, 3]


#### `curryOnTop.singleLeftWithArity(arity, method)`

Does the same as `curryOnTop.singleLeft(method)` except that the `arity` argument is used to determine the number of arguments `method` has.

Example:

	var obj = {
		method: function (arg1, arg2, arg3) { return [this.prop, arg1, arg2, arg3] }
	};
	var otherObj = { prop: "otherObjProp" };
	var curriedFunc = curryOnTop.singleLeftWithArity(2, obj.method);

	// could also be written as curriedFunc(1, 2, otherObj)
	// or it could be written as curriedFunc(1, 2)(otherObj) or curriedFunc(1)(2, otherObj) etcetera
	var result = curriedFunc(1)(2)(otherObj);
	// result is: ["otherObjProp", 1, 2, undefined]
	// The last argument is undefined because it is never provided to the method.
	// The provided arity of 2 causes only the first to arguments to be passed to the method.


#### `curryOnTop.left(object)`

Runs `curryOnTop.singleLeft(method)` on all methods belonging to object and returns a new object with these newly curried functions as properties.


#### `curryOnTop.singleRight(method)`

Returns a function that is the right to left curried version of the method.

The function takes the same arguments as the original function with a context argument added as the last argument.

	var obj = {
		method: function (arg1, arg2, arg3) { return [this.prop, arg1, arg2, arg3] }
	};
	var otherObj = { prop: "otherObjProp" };
	var curriedFunc = curryOnTop.singleRight(obj.method);

	// could also be written as curriedFunc(3, 2, 1, otherObj)
	// or it could be written as curriedFunc(3, 2)(1, otherObj) or curriedFunc(3)(2, 1)(otherObj) etcetera
	var result = curriedFunc(3)(2)(1)(otherObj);
	// result is: ["otherObjProp", 1, 2, 3]


#### `curryOnTop.singleRightWithArity(arity, method)`

Does the same as `curryOnTop.singleRight(method)` except that the `arity` argument is used to determine the number of arguments `method` has.

Example:

	var obj = {
		method: function (arg1, arg2, arg3) { return [this.prop, arg1, arg2, arg3] }
	};
	var otherObj = { prop: "otherObjProp" };
	var curriedFunc = curryOnTop.singleRightWithArity(2, obj.method);

	// could also be written as curriedFunc(2, 1, otherObj)
	// or it could be written as curriedFunc(2, 1)(otherObj) or curriedFunc(2)(1, otherObj) etcetera
	var result = curriedFunc(2)(1)(otherObj);
	// result is: ["otherObjProp", 1, 2, undefined]
	// The last argument is undefined because it is never provided to the method.
	// The provided arity of 2 causes only the first to arguments to be passed to the method.


#### `curryOnTop.right(object)`

Runs `curryOnTop.singleRight(method)` on all methods belonging to object and returns a new object with these newly curried functions as properties.


### Functional helpers

All these functions are curried except for `curryOnTop.functional.curry`, `curryOnTop.functional.curryRight` and `curryOnTop.functional.compose`


#### `curryOnTop.functional.reverse(array)`

Returns a new array that is the reverse of array.


#### `curryOnTop.functional.identity(value)`

Return the exact value that is provided as an argument.


#### `curryOnTop.functional.constant(value)`

Returns a function that always returns `value`;


#### `curryOnTop.functional.noop`

A no-operation function that always returns `undefined` regardless of the arguments it receives.


#### `curryOnTop.functional.exists(object)`

Returns `false` when object is `undefined` or `null`. Otherwise it returns `true`.


#### `curryOnTop.functional.negate(predicate)`

Returns a function that returns the opposite of `predicate`.


#### `curryOnTop.functional.truthy(value)`

Returns `false` for a `value` of `null`, `undefined` and `false`, otherwise it returns `true`.


#### `curryOnTop.functional.falsy`

Returns `true` for a `value` of `null`, `undefined` and `false`, otherwise it returns `false`.



#### `curryOnTop.functional.isFunction(object)`

Returns `true` if `object` is a function, otherwise it returns `false`.


#### `curryOnTop.functional.isObject(object)`

Returns `true` if `object` is an object, otherwise it returns `false`.


#### `curryOnTop.functional.isString(object)`

Returns `true` if `object` is a string, otherwise it returns `false`.


#### `curryOnTop.functional.isNumber(object)`

Returns `true` if `object` is a number, otherwise it returns `false`.


#### `curryOnTop.functional.isBoolean(object)`

Returns `true` if `object` is a boolean, otherwise it returns `false`.


#### `curryOnTop.functional.slice(end, start, array)`

Returns a new array that is a slice of `array` from `start` up to but not including `end`.


#### `curryOnTop.functional.others(start, array)`

Returns a new array that is a slice of `array` from `start` till the end of the array.


#### `curryOnTop.functional.rest(array)`

Returns a new array that is a `array` without the first property.


#### `curryOnTop.functional.toArray(object)`

Coverts array-like objects into arrays.


#### `curryOnTop.functional.prop(key, object)`

Returns `object[key]`.


#### `curryOnTop.functional.compose(...funcs)`

Multiple functions can be supplied as arguments.

Returns a function that returns the result of invoking each function where each successive invocation is supplied the return value of the previous function.

Note, because the number of arguments are variable, this `compose` is not curried.


#### `curryOnTop.functional.curry(func, arity: optional)`

Returns a new function that accepts one or more arguments of the original function. When the curried function is called and all of the original function’s arguments are provided, it invokes the original function returning its result. Otherwise the curried function returns a new function that accepts one or more of the remaining original function’s arguments, and so on.


#### `curryOnTop.functional.curryRight(func, arity: optional)`

Same as `curryOnTop.functional.curry(func, arity)` except arguments are applied right to left to `func`.






### Credits

Functional concepts explanations are largely adapted from the [Lodash documentation](https://lodash.com/docs#curry).