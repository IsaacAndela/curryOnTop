"use strict";
var curryOnTop = require("../source/curryOnTop");

describe("curryOnTop", function () {
	describe("curryOnTop.left", function () {
		it("should curry object methods", function () {
			var obj = {
				num: 1,
				str: "test",
				obj: {},
				func1: function (x, y, z) { return "" + x + y + z + this.num; },
				func2: function (strArg1, strArg2) { return this.str + strArg1 + strArg2; },
				func3: function () {},
			};

			var curriedObj = curryOnTop.left(obj);

			expect(curriedObj.num).toBe(undefined);
			expect(curriedObj.str).toBe(undefined);
			expect(curriedObj.obj).toBe(undefined);
			expect(curriedObj.func1(1)(2, 3)(obj)).toBe("1231");
			expect(curriedObj.func2("1")("2", obj)).toBe("test12");
		});
	});

	describe("curryOnTop.right", function () {
		it("should curry object methods", function () {
			var obj = {
				num: 1,
				str: "test",
				obj: {},
				func1: function (x, y, z) { return "" + x + y + z + this.num; },
				func2: function (strArg1, strArg2) { return this.str + strArg1 + strArg2; },
				func3: function () {},
			};

			var curriedObj = curryOnTop.right(obj);

			expect(curriedObj.num).toBe(undefined);
			expect(curriedObj.str).toBe(undefined);
			expect(curriedObj.obj).toBe(undefined);
			expect(curriedObj.func1(1)(2, 3)(obj)).toBe("3211");
			expect(curriedObj.func2("1")("2", obj)).toBe("test21");
		});
	});

	describe("single", function () {


		var methodCurry = require("../source/methodCurry");

		describe("curryOnTop.singleLeft", function () {
			it("should be methodCurry.curryMethodLeft", function () {
				expect(curryOnTop.singleLeft).toBe(methodCurry.curryMethodLeft);
			});
		});

		describe("curryOnTop.singleRight", function () {
			it("should be methodCurry.curryMethodRight", function () {
				expect(curryOnTop.singleRight).toBe(methodCurry.curryMethodRight);
			});
		});

		describe("curryOnTop.singleLeftWithArity", function () {
			it("should be methodCurry.curryMethodLeftWithArity", function () {
				expect(curryOnTop.singleLeftWithArity).toBe(methodCurry.curryMethodLeftWithArity);
			});
		});

		describe("curryOnTop.singleRightWithArity", function () {
			it("should be methodCurry.curryMethodRightWithArity", function () {
				expect(curryOnTop.singleRightWithArity).toBe(methodCurry.curryMethodRightWithArity);
			});
		});
	});
});