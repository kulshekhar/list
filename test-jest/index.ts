"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../src-jest/index");
function numberArray(start, end) {
    let array = [];
    for (let i = start; i < end; ++i) {
        array.push(i);
    }
    return array;
}
function assertIndicesFromTo(list, from, to) {
    for (let i = from; i < to; ++i) {
        chai_1.assert.strictEqual(list.nth(i), i);
    }
}
describe("List", () => {
    describe("append", () => {
        it("can append small", () => {
            const list = index_1.empty().append(1).append(2).append(3).append(4);
            chai_1.assert.strictEqual(list.nth(0), 1);
            chai_1.assert.strictEqual(list.nth(1), 2);
            chai_1.assert.strictEqual(list.nth(2), 3);
            chai_1.assert.strictEqual(list.nth(3), 4);
        });
        it("can append 1000 elements", () => {
            let list = index_1.empty();
            const size = 1000;
            for (let i = 0; i < size; ++i) {
                list = list.append(i);
            }
            assertIndicesFromTo(list, 0, 1000);
        });
        it("can append 97 elements", () => {
            let list = index_1.empty();
            const size = 97;
            for (let i = 0; i < size; ++i) {
                list = list.append(i);
            }
            assertIndicesFromTo(list, 0, 97);
        });
        it("can append tree of depth 2", () => {
            const size = 32 * 32 * 32 + 32;
            const list = index_1.range(0, size);
            assertIndicesFromTo(list, 0, size);
        });
    });
    describe("list", () => {
        it("creates a list with the given elements", () => {
            const l = index_1.list(0, 1, 2, 3);
            assertIndicesFromTo(l, 0, 4);
        });
    });
    describe("pair", () => {
        it("creates a list of two elements", () => {
            const p = index_1.pair("foo", "bar");
            chai_1.assert.strictEqual(index_1.length(p), 2);
            chai_1.assert.strictEqual(index_1.nth(0, p), "foo");
            chai_1.assert.strictEqual(index_1.nth(1, p), "bar");
        });
    });
    describe("last", () => {
        it("gets the last element of a short list", () => {
            chai_1.assert.strictEqual(index_1.last(index_1.list(0, 1, 2, 3)), 3);
        });
        it("gets the last element of a long list", () => {
            chai_1.assert.strictEqual(index_1.last(index_1.range(0, 100)), 99);
        });
        it("returns undefined on empty list", () => {
            chai_1.assert.strictEqual(index_1.last(index_1.list()), undefined);
        });
    });
    describe("concat", () => {
        const list = index_1.empty().append(1).append(2).append(3);
        it("concats empty sides", () => {
            chai_1.assert.strictEqual(index_1.concat(list, index_1.empty()), list);
            chai_1.assert.strictEqual(index_1.concat(index_1.empty(), list), list);
        });
        describe("right is smaller than 32", () => {
            it("combined size is smaller than 32", () => {
                let l1 = index_1.range(0, 12);
                let l2 = index_1.range(12, 31);
                const catenated = index_1.concat(l1, l2);
                chai_1.assert.strictEqual(index_1.length(catenated), 31);
                const end = 31;
                for (let i = 0; i < end; ++i) {
                    chai_1.assert.strictEqual(index_1.nth(i, catenated), i);
                }
            });
            it("left suffix is full", () => {
                [32, 32 * 4, 32 * 5, 32 * 12].forEach((leftSize) => {
                    const l1 = index_1.range(0, leftSize);
                    const l2 = index_1.range(leftSize, leftSize + 30);
                    const catenated = index_1.concat(l1, l2);
                    chai_1.assert.strictEqual(catenated.length, leftSize + 30);
                    for (let i = 0; i < leftSize + 30; ++i) {
                        chai_1.assert.strictEqual(index_1.nth(i, catenated), i);
                    }
                });
            });
            it("left is full tree", () => {
                const leftSize = 32 * 32 * 32 + 32;
                const l1 = index_1.range(0, leftSize);
                assertIndicesFromTo(l1, 0, leftSize);
                const l2 = index_1.range(leftSize, leftSize + 30);
                const catenated = index_1.concat(l1, l2);
                chai_1.assert.strictEqual(catenated.length, leftSize + 30);
                assertIndicesFromTo(catenated, 0, leftSize + 30);
            });
            it("left suffix is arbitrary size", () => {
                [70, 183, 1092].forEach((leftSize) => {
                    const l1 = index_1.range(0, leftSize);
                    const l2 = index_1.range(leftSize, leftSize + 30);
                    const catenated = index_1.concat(l1, l2);
                    chai_1.assert.strictEqual(catenated.length, leftSize + 30);
                    assertIndicesFromTo(catenated, 0, leftSize + 30);
                });
            });
            it("suffix has to be pushed down without room for it", () => {
                [[40, 33]].forEach(([leftSize, rightSize]) => {
                    const l1 = index_1.range(0, leftSize);
                    const l2 = index_1.range(leftSize, leftSize + rightSize);
                    const catenated = index_1.concat(l1, l2);
                    assertIndicesFromTo(catenated, 0, leftSize + rightSize);
                });
            });
        });
        describe("both are large", () => {
            it("concats once properly", () => {
                [[83, 128], [2381, 3720]].forEach(([leftSize, rightSize]) => {
                    const l1 = index_1.range(0, leftSize);
                    const l2 = index_1.range(leftSize, leftSize + rightSize);
                    const catenated = index_1.concat(l1, l2);
                    assertIndicesFromTo(catenated, 0, leftSize + rightSize);
                });
            });
            it("does balancing", () => {
                const size = 4 * 32 + 1;
                const firstSize = 5 * 32 + 1;
                const secondSize = 5 * 32 + 1;
                const thirdSize = 5 * 32 + 1;
                const totalSize = firstSize + secondSize + thirdSize;
                const l1 = index_1.range(0, size * 1);
                const l2 = index_1.range(size * 1, size * 2);
                const l3 = index_1.range(size * 2, size * 3);
                const l4 = index_1.range(size * 3, size * 4);
                const l5 = index_1.range(size * 4, size * 5);
                const catenated = index_1.concat(index_1.concat(index_1.concat(index_1.concat(l1, l2), l3), l4), l5);
                chai_1.assert.strictEqual(catenated.length, size * 5);
                assertIndicesFromTo(catenated, 0, totalSize + size);
            });
        });
    });
    describe("map", () => {
        it("maps function over list", () => {
            [30, 100, 32 * 4 + 1].forEach((n) => {
                const l = index_1.range(0, n);
                const mapped = index_1.map((m) => m * m, l);
                for (let i = 0; i < n; ++i) {
                    chai_1.assert.strictEqual(index_1.nth(i, mapped), i * i);
                }
            });
        });
        it("has Fantasy Land method", () => {
            const n = 50;
            const l = index_1.range(0, n);
            const mapped = l["fantasy-land/map"]((m) => m * m);
            for (let i = 0; i < n; ++i) {
                chai_1.assert.strictEqual(index_1.nth(i, mapped), i * i);
            }
        });
    });
    describe("fold", () => {
        const subtract = (n, m) => n - m;
        it("folds from the left", () => {
            [10, 70].forEach((n) => {
                chai_1.assert.strictEqual(index_1.foldl(subtract, 0, index_1.range(0, n)), numberArray(0, n).reduce(subtract, 0));
            });
        });
    });
    describe("iteration", () => {
        it("iterates over leftwise dense list", () => {
            [
                20,
                50,
                1000,
                Math.pow(// a tree with larger depth,
                    32, 2) + 3 // an even larger tree
            ].forEach((n) => {
                const l = index_1.range(0, n);
                let last = -1;
                for (const element of l) {
                    chai_1.assert.strictEqual(element, last + 1);
                    last = element;
                }
                chai_1.assert.strictEqual(last, n - 1);
            });
        });
    });
});
