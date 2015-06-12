# curryOnTop

curryOnTop aims to make functional programming convenient when working with API’s that rely on object instances and their methods.

It does so by taking every method of an object and creating a curried version of these methods that can be used in a functional manner with the instances of said object. Secondarily curryOnTop exposes a number of utility functions for functional programming. Of course all of these are curried.


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

### `curryOnTop.left(object)`

...


### `curryOnTop.right(object)`

...


### Functional helpers

...