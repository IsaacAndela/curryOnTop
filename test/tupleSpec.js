"use strict";

describe("tuple", function () {
	var tuple = curryOnTop.tuple;

	describe("fold", function () {
		it("should fold a collection", function () {
			var result = tuple.fold(
				function (memo, item) {
					memo += item;
					return memo;
				},
				0,
				[1, 2, 3]
			);

			expect(result).toBe(6);
		});
	});

	describe("map", function () {
		it("should map a collection", function () {
			var result = tuple.map(
				function (item) {
					return item * 2;
				},
				[1, 2, 3]
			);

			expect(result).toEqual([2, 4, 6]);

		});
	});

	describe("select", function () {
		it("should filter a collection", function () {
			var result = tuple.select(
				function (item) {
					return item % 2 === 0;
				},
				[1, 2, 3, 4]
			);

			expect(result).toEqual([2, 4]);

		});
	});

	describe("toTuple", function () {
		it("should make a tuple", function () {
			var key = "key";
			var value = "value";

			expect(tuple.toTuple(key, value)).toEqual([key, value]);
		});
	});

	describe("toTuples", function () {
		it("should convert an object into tuples", function () {
			var obj = {
				a: 0,
				b: 1
			};

			var tuples = tuple.toTuples(obj);

			expect(tuples).toEqual([["a", 0], ["b", 1]]);
		});
	});

	describe("toObject", function () {
		it("should convert tuples into an object", function () {
			var tuples = [
				["a", 0],
				["b", 1]
			];

			var obj = tuple.toObject(tuples);

			expect(obj).toEqual({
				a: 0,
				b: 1
			});
		});
	});

	describe("getKey", function () {
		it("should get the key from a tuple", function () {
			expect(tuple.getKey(["a", 1])).toBe("a");
		});
	});

	describe("getValue", function () {
		it("should get the value from a tuple", function () {
			expect(tuple.getValue(["a", 1])).toBe(1);
		});
	});

	describe("isTupleValueAFunction", function () {
		it("should identify if a tuple value is a function", function () {
			expect(tuple.isValueAFunction(["a", function () {}])).toBe(true);
			expect(tuple.isValueAFunction(["a", 1])).toBe(false);
		});
	});

	describe("curryTupleLeft", function () {
		it("should ", function () {
			var context = {
				c: 3,
				d: 4
			};
			var curriedTupleMethod = tuple.curryMethodLeft(["a", function (a, b) {
				return "" + a + b + this.c + this.d;
			}]);
			var key = tuple.getKey(curriedTupleMethod);
			var curriedMethod = tuple.getValue(curriedTupleMethod);

			expect(key).toBe("a");

			expect(curriedMethod(1)(2)(context)).toBe("1234");
		});
	});

	describe("curryTupleRight", function () {
		it("should ", function () {
			var context = {
				c: 3,
				d: 4
			};
			var curriedTupleMethod = tuple.curryMethodRight(["a", function (a, b) {
				return "" + a + b + this.c + this.d;
			}]);
			var key = tuple.getKey(curriedTupleMethod);
			var curriedMethod = tuple.getValue(curriedTupleMethod);

			expect(key).toBe("a");

			expect(curriedMethod(2)(1)(context)).toBe("1234");
		});
	});
});