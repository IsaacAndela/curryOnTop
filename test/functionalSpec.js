"use strict";

describe("functional", function () {
	var fn = curryOnTop.functional;

	describe("reverse", function () {
		it("schould reverse an array", function () {
			expect(fn.reverse([1,2,3])).toEqual([3,2,1]);
		});
	});

	describe("identity", function () {
		it("should return what it was passed as an argument", function () {
			var obj = {};
			expect(fn.identity(obj)).toBe(obj);
		});
	});

	describe("constant", function () {
		it("should return what it was passed as an argument", function () {
			var obj = {};
			expect(fn.identity(obj)).toBe(obj);
		});
	});

	describe("noop", function () {
		it("should be an empty function", function () {
			expect(fn.noop(1, 2, 3)).toBe(undefined);
		});
	});

	describe("exists", function () {
		it("should return true for existing values", function () {
			expect(fn.exists([])).toBe(true);
			expect(fn.exists({})).toBe(true);
			expect(fn.exists("")).toBe(true);
			expect(fn.exists(false)).toBe(true);
			expect(fn.exists(0)).toBe(true);
		});
		it("should return false for null and undefined", function () {
			expect(fn.exists(null)).toBe(false);
			expect(fn.exists(undefined)).toBe(false);
		});
	});

	describe("thruthy", function () {
		it("should return true for thruthy values", function () {
			expect(fn.truthy([])).toBe(true);
			expect(fn.truthy({})).toBe(true);
			expect(fn.truthy(0)).toBe(true);
			expect(fn.truthy(1)).toBe(true);
			expect(fn.truthy("")).toBe(true);
			expect(fn.truthy(NaN)).toBe(true);
		});
		it("should return false for null, undefined and false", function () {
			expect(fn.truthy(null)).toBe(false);
			expect(fn.truthy(undefined)).toBe(false);
			expect(fn.truthy(false)).toBe(false);
		});
	});

	describe("falsy", function () {
		it("should return true for null, undefined and false", function () {
			expect(fn.falsy(null)).toBe(true);
			expect(fn.falsy(undefined)).toBe(true);
			expect(fn.falsy(false)).toBe(true);
		});
		it("should return false for thruthy values", function () {
			expect(fn.falsy([])).toBe(false);
			expect(fn.falsy({})).toBe(false);
			expect(fn.falsy(0)).toBe(false);
			expect(fn.falsy(1)).toBe(false);
			expect(fn.falsy("")).toBe(false);
			expect(fn.falsy(NaN)).toBe(false);
		});
	});

	describe("isFunction", function () {
		it("should identify a function type", function () {
			expect(fn.isFunction(function () {})).toBe(true);
			expect(fn.isFunction({})).toBe(false);
			expect(fn.isFunction(5)).toBe(false);
			expect(fn.isFunction([])).toBe(false);
		});
	});

	describe("isObject", function () {
		it("should identify an object type", function () {
			function Test() {}

			var instance = new Test();

			expect(fn.isObject({})).toBe(true);
			expect(fn.isObject([])).toBe(true);
			expect(fn.isObject(instance)).toBe(true);
			expect(fn.isObject(function () {})).toBe(true);

			expect(fn.isObject(5)).toBe(false);
			expect(fn.isObject("test")).toBe(false);
			expect(fn.isObject(null)).toBe(false);
			expect(fn.isObject(undefined)).toBe(false);
			expect(fn.isObject(NaN)).toBe(false);
		});
	});

	describe("isString", function () {
		it("should identify a string type", function () {
			expect(fn.isString("")).toBe(true);
			expect(fn.isString("test")).toBe(true);

			expect(fn.isString({})).toBe(false);
			expect(fn.isString(5)).toBe(false);
			expect(fn.isString(undefined)).toBe(false);
			expect(fn.isString(null)).toBe(false);
			expect(fn.isString(true)).toBe(false);
			expect(fn.isString([])).toBe(false);
			expect(fn.isString(function () {})).toBe(false);
			expect(fn.isString(NaN)).toBe(false);
		});
	});

	describe("isNumber", function () {
		it("should identify a string type", function () {
			expect(fn.isNumber(0)).toBe(true);
			expect(fn.isNumber(-5.3)).toBe(true);
			expect(fn.isNumber(7.2)).toBe(true);

			expect(fn.isNumber({})).toBe(false);
			expect(fn.isNumber(true)).toBe(false);
			expect(fn.isNumber(false)).toBe(false);
			expect(fn.isNumber(undefined)).toBe(false);
			expect(fn.isNumber(null)).toBe(false);
			expect(fn.isNumber([])).toBe(false);
			expect(fn.isNumber(function () {})).toBe(false);
			expect(fn.isNumber(NaN)).toBe(false);
		});
	});

	describe("isBoolean", function () {
		it("should identify a string type", function () {
			expect(fn.isBoolean(true)).toBe(true);
			expect(fn.isBoolean(false)).toBe(true);

			expect(fn.isBoolean({})).toBe(false);
			expect(fn.isBoolean(5)).toBe(false);
			expect(fn.isBoolean(undefined)).toBe(false);
			expect(fn.isBoolean(null)).toBe(false);
			expect(fn.isBoolean([])).toBe(false);
			expect(fn.isBoolean(function () {})).toBe(false);
			expect(fn.isBoolean(NaN)).toBe(false);
		});
	});

	describe("slice", function () {
		it("should slice up an array", function () {
			var array = [1, 2, 3, 4];
			expect(fn.slice(3, 1, array)).toEqual([2, 3]);
			expect(array).toEqual([1, 2, 3, 4]);
		});
	});

	describe("others", function () {
		it("should give back the rest of the array from the specified start point", function () {
			var array = [1, 2, 3, 4];
			expect(fn.others(2, array)).toEqual([3, 4]);
			expect(array).toEqual([1, 2, 3, 4]);
		});
	});

	describe("rest", function () {
		it("should give back the array without the first item", function () {
			var array = [1, 2, 3, 4];
			expect(fn.rest(array)).toEqual([2, 3, 4]);
			expect(array).toEqual([1, 2, 3, 4]);
		});
	});

	describe("toArray", function () {

		it("should convert an object to an array", function () {
			var obj = {
				0: "v0",
				1: "v1",
				2: "v2",
				3: "v3",
				length: 4
			};

			expect(fn.toArray(obj)).toEqual(["v0", "v1", "v2", "v3"]);
		});
	});

	describe("prop", function () {
		it("should return the property of an object", function () {
			var obj = { a: "value" };

			expect(fn.prop("a", obj)).toBe("value");
		});
	});

	describe("curryRight", function () {
		it("should curry a function from right to left", function () {
			var curriedFunc = fn.curryRight(function func(a, b, c) {
				return a + b + c;
			});
			expect(curriedFunc("1")("2")("3")).toEqual("321");
		});
		it("should limit to arity", function () {
			var curriedFuncWithArity = fn.curryRight(function func(a, b, c) {
				return a + b + c;
			}, 2);

			expect(curriedFuncWithArity("1")("2")).toEqual("21undefined");
			expect(curriedFuncWithArity("1")("2", "3")).toEqual("321");
		});
	});

	describe("curry", function () {
		it("should curry a function from left to right", function () {
			var curriedFunc = fn.curry(function func(a, b, c) {
				return a + b + c;
			});
			expect(curriedFunc("1")("2")("3")).toEqual("123");
		});
		it("should limit to arity", function () {
			var curriedFuncWithArity = fn.curry(function func(a, b, c) {
				return a + b + c;
			}, 2);

			expect(curriedFuncWithArity("1")("2")).toEqual("12undefined");
			expect(curriedFuncWithArity("1")("2", "3")).toEqual("123");
		});
	});

	describe("compose", function () {
		it("should compose function right to left", function () {
			var composed = fn.compose(
				function (arg) {
					return arg + "3";
				},
				function (arg) {
					return arg + "2";

				},
				function (arg) {
					return arg + "1";

				}
			);

			expect(composed("0")).toBe("0123");
		});
	});

	describe("executeMethod", function () {
		it("should execute a method from an object with arguments", function () {
			var obj = {
				func: function () {
					return [].slice.call(arguments);
				}
			};

			var result = fn.executeMethod(obj, obj.func, [1, 2]);

			expect(result).toEqual([1, 2]);
		});
	});

	describe("curryMethodLeft", function () {
		it("should apply currying to a method with context", function () {
			var obj = {
				prop: "1"
			};

			var func = function (arg1, arg2) {
				return this.prop + arg1 + arg2;
			};

			var result = fn.curryMethodLeft(func)("2")("3")(obj);

			expect(result).toBe("123");

			var result2 = fn.curryMethodLeft(func, "2", "3", obj);

			expect(result2).toBe("123");
		});
	});

	describe("curryMethodRight", function () {
		it("should apply currying to a method with context", function () {
			var obj = {
				prop: "1"
			};

			var func = function (arg1, arg2) {
				return this.prop + arg1 + arg2;
			};

			var result = fn.curryMethodRight(func)("3")("2")(obj);

			expect(result).toBe("123");

			var result2 = fn.curryMethodRight(func, "3", "2", obj);

			expect(result2).toBe("123");
		});
	});
});