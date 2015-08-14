# curryOnTop

curryOnTop aims to make functional programming convenient when working with API’s that rely on object instances and their methods.

It does so by taking every method of an object and creating a curried version of these methods that can be used in a functional manner with the instances of said object. Secondarily curryOnTop exposes a number of utility functions for functional programming. Of course all of these are curried.


## What is currying?

Currying a function creates a new function that accepts one or more arguments of the original function. When the curried function is called and all of the original function’s arguments are provided, it invokes the original function returning its result. Otherwise the curried function returns a new function that accepts one or more of the remaining original function’s arguments, and so on.[1]


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

	var obj {
		method: function (arg1, arg2, arg3) { return [this.prop, arg1, arg2, arg3] };
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

	var obj {
		method: function (arg1, arg2, arg3) { return [this.prop, arg1, arg2, arg3] };
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

Applies `curryOnTop.singleLeft(method)` to all methods belonging to object and returns a new object with these new functions as properties.


#### `curryOnTop.singleRight(method)`

Returns a function that is the right to left curried version of the method.

The function takes the same arguments as the original function with a context argument added as the last argument.

Example:

	var obj {
		method: function (arg1, arg2, arg3) { return [this.prop, arg1, arg2, arg3] };
	};
	var otherObj = { prop: "otherObjProp" };
	var curriedFunc = curryOnTop.singleLeftWithArity(2, obj.method);

	// could also be written as curriedFunc(2, 1, otherObj)
	// or it could be written as curriedFunc(2, 1)(otherObj) or curriedFunc(2)(1, otherObj) etcetera
	var result = curriedFunc(2)(1)(otherObj);
	// result is: ["otherObjProp", 1, 2, undefined]
	// The last argument is undefined because it is never provided to the method.
	// The provided arity of 2 causes only the first to arguments to be passed to the method.


#### `curryOnTop.right(object)`

Applies `curryOnTop.singleLeft(method)` to all methods belonging to object and returns a new object with these new functions as properties.


### Functional helpers

[...]


[1]: This explanation is adapted from the [Lodash documentation](https://lodash.com/docs#curry)