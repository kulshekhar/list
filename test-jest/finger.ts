"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const finger_1 = require("../src-jest/finger");
function randomNumber(max) {
    return Math.floor(Math.random() * max);
}
function randomBool() {
    return Math.random() > 0.5;
}
function subtract(n, m) {
    return n - m;
}
function createList(from, n) {
    let list = finger_1.nil;
    for (let i = from; i < from + n; ++i) {
        list = finger_1.append(i, list);
    }
    return list;
}
function createArray(from, n) {
    let array = [];
    for (let i = from; i < from + n; ++i) {
        array.push(i);
    }
    return array;
}
describe("Finger tree", () => {
    it("appends two elements", () => {
        const list = finger_1.append(1, finger_1.append(0, finger_1.nil));
        chai_1.assert.deepEqual(finger_1.toArray(list), [0, 1]);
    });
    it("appends three elements", () => {
        const list = finger_1.append(2, finger_1.append(1, finger_1.append(0, finger_1.nil)));
        chai_1.assert.deepEqual(finger_1.toArray(list), [0, 1, 2]);
    });
    it("appends six elements", () => {
        const list = finger_1.append(5, finger_1.append(4, finger_1.append(3, finger_1.append(2, finger_1.append(1, finger_1.append(0, finger_1.nil))))));
        chai_1.assert.deepEqual(finger_1.toArray(list), [0, 1, 2, 3, 4, 5]);
    });
    it("prepends six elements", () => {
        const list = finger_1.prepend(5, finger_1.prepend(4, finger_1.prepend(3, finger_1.prepend(2, finger_1.prepend(1, finger_1.prepend(0, finger_1.nil))))));
        chai_1.assert.deepEqual(finger_1.toArray(list), [5, 4, 3, 2, 1, 0]);
    });
    it("appends 1000 elements", () => {
        let arr = [];
        let list = finger_1.nil;
        for (let i = 0; i < 1000; ++i) {
            list = finger_1.append(i, list);
            arr.push(i);
        }
        chai_1.assert.deepEqual(finger_1.toArray(list), arr);
    });
    it("has proper size", () => {
        const list = finger_1.prepend(5, finger_1.prepend(4, finger_1.prepend(3, finger_1.prepend(2, finger_1.prepend(1, finger_1.prepend(0, finger_1.nil))))));
        chai_1.assert.deepEqual(finger_1.size(list), 6);
    });
    describe("concat", () => {
        it("empty list to list", () => {
            const list = createList(0, 10);
            const concatenated = finger_1.concat(list, finger_1.nil);
            chai_1.assert.deepEqual(finger_1.toArray(concatenated), createArray(0, 10));
            const concatenated2 = finger_1.concat(finger_1.nil, list);
            chai_1.assert.deepEqual(finger_1.toArray(concatenated2), createArray(0, 10));
        });
        it("singleton list to list", () => {
            const list = createList(0, 10);
            const singleton = finger_1.prepend(10, finger_1.nil);
            const concatenated = finger_1.concat(list, singleton);
            const array = createArray(0, 11);
            chai_1.assert.deepEqual(finger_1.toArray(concatenated), array);
            const concatenated2 = finger_1.concat(singleton, list);
            const array2 = createArray(0, 10);
            array2.unshift(10);
            chai_1.assert.deepEqual(finger_1.toArray(concatenated2), array2);
        });
        it("can index into concatenated lists", () => {
            const list1 = createList(0, 20);
            const list2 = createList(20, 20);
            const concatenated = finger_1.concat(list1, list2);
            for (let i = 0; i < 40; ++i) {
                chai_1.assert.strictEqual(finger_1.get(i, concatenated), i);
            }
        });
        it("two lists", () => {
            let times = 100;
            while (--times > 0) {
                const array1 = [];
                const array2 = [];
                const n = randomNumber(300);
                const m = randomNumber(300);
                let list1 = finger_1.nil;
                let list2 = finger_1.nil;
                for (let i = 0; i < n; ++i) {
                    if (randomBool()) {
                        list1 = finger_1.append(i, list1);
                        array1.push(i);
                    }
                    else {
                        list1 = finger_1.prepend(i, list1);
                        array1.unshift(i);
                    }
                }
                for (let i = 0; i < m; ++i) {
                    if (randomBool()) {
                        list2 = finger_1.append(i, list2);
                        array2.push(i);
                    }
                    else {
                        list2 = finger_1.prepend(i, list2);
                        array2.unshift(i);
                    }
                }
                const concatenated = finger_1.concat(list1, list2);
                const array = array1.concat(array2);
                chai_1.assert.deepEqual(finger_1.toArray(concatenated), array);
            }
        });
    });
    describe("indexing", () => {
        it("can index", () => {
            const list = finger_1.prepend(5, finger_1.prepend(4, finger_1.prepend(3, finger_1.prepend(2, finger_1.prepend(1, finger_1.prepend(0, finger_1.nil))))));
            chai_1.assert.deepEqual(finger_1.get(0, list), 5);
            chai_1.assert.deepEqual(finger_1.get(2, list), 3);
        });
        it("can large index", () => {
            const n = 10000;
            let list = finger_1.nil;
            for (let i = 0; i < n; ++i) {
                list = finger_1.append(i, list);
            }
            let arr = [];
            for (let i = 0; i < n; ++i) {
                arr.push(finger_1.get(i, list));
            }
            chai_1.assert.deepEqual(finger_1.toArray(list), arr);
        });
        it("can large index into prepend built tree", () => {
            const n = 10000;
            let list = finger_1.nil;
            for (let i = 0; i < n; ++i) {
                list = finger_1.prepend(i, list);
            }
            let arr = [];
            for (let i = 0; i < n; ++i) {
                arr.push(finger_1.get(i, list));
            }
            chai_1.assert.deepEqual(arr, finger_1.toArray(list));
        });
    });
    describe("folding", () => {
        describe("foldl", () => {
            it("fold left over tree with no subtree", () => {
                const list = finger_1.append(5, finger_1.append(4, finger_1.prepend(0, finger_1.prepend(1, finger_1.prepend(2, finger_1.prepend(3, finger_1.nil))))));
                chai_1.assert.strictEqual(finger_1.foldl(subtract, 10, list), [0, 1, 2, 3, 4, 5].reduce(subtract, 10));
            });
            it("folds left", () => {
                const list = finger_1.prepend(5, finger_1.prepend(4, finger_1.prepend(3, finger_1.prepend(2, finger_1.prepend(1, finger_1.prepend(0, finger_1.nil))))));
                chai_1.assert.strictEqual(finger_1.foldl(subtract, 10, list), [5, 4, 3, 2, 1, 0].reduce(subtract, 10));
            });
            it("can fold left over large tree", () => {
                const n = 10000;
                let list = finger_1.nil;
                let array = [];
                for (let i = 0; i < n; ++i) {
                    list = finger_1.prepend(i, list);
                    array.push(i);
                }
                array.reverse();
                chai_1.assert.strictEqual(finger_1.foldl(subtract, 10, list), array.reduce(subtract, 10));
            });
        });
    });
});
