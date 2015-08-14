"use strict";

var iteration = require("../source/iteration");

describe("looping collections", function () {
	describe("fold", function () {
		it("should fold a collection", function () {
			var result = iteration.fold(
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
			var result = iteration.map(
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
			var result = iteration	.select(
				function (item) {
					return item % 2 === 0;
				},
				[1, 2, 3, 4]
			);

			expect(result).toEqual([2, 4]);

		});
	});
});