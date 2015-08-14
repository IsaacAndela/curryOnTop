"use strict";

var methodCurry = require("../source/methodCurry");


describe("Method helpers", function () {
	describe("executeMethod", function () {
		it("should execute a method from an object with arguments", function () {
			var obj = {
				func: function () {
					return [].slice.call(arguments);
				}
			};

			var result = methodCurry.executeMethod(obj, obj.func, [1, 2]);

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

			var result = methodCurry.curryMethodLeft(func)("2")("3")(obj);

			expect(result).toBe("123");

			var result2 = methodCurry.curryMethodLeft(func, "2", "3", obj);

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

			var result = methodCurry.curryMethodRight(func)("3")("2")(obj);

			expect(result).toBe("123");

			var result2 = methodCurry.curryMethodRight(func, "3", "2", obj);

			expect(result2).toBe("123");
		});
	});

	describe("curryMethodLeftWithArity", function () {
		it("should apply currying with arity to a method with context", function () {
			var obj = {
				prop: 1
			};

			var func = function (arg1, arg2) {
				return [this.prop, arg1, arg2];
			};

			var result = methodCurry.curryMethodLeftWithArity(1, func)(2)(obj);

			expect(result).toEqual([1, 2, undefined]);

			var result2 = methodCurry.curryMethodLeftWithArity(0, func, obj);

			expect(result2).toEqual([1, undefined, undefined]);
		});
	});

	describe("curryMethodRightWithArity", function () {
		it("should apply currying with arity to a method with context", function () {
			var obj = {
				prop: 1
			};

			var func = function (arg1, arg2, arg3) {
				return [this.prop, arg1, arg2, arg3];
			};

			var result = methodCurry.curryMethodRightWithArity(1, func)(3)(obj);

			expect(result).toEqual([1, 3, undefined, undefined]);

			var result2 = methodCurry.curryMethodRightWithArity(2, func, 3, 2, obj);

			expect(result2).toEqual([1, 2, 3, undefined]);
		});
	});
});