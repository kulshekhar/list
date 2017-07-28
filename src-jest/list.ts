"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cons {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
    toArray() {
        const array = [];
        let cur = this;
        while (cur !== undefined) {
            array.push(cur.value);
            cur = cur.next;
        }
        return array;
    }
    nth(index) {
        let cur = this;
        for (let i = 0; i < index; ++i) {
            cur = cur.next;
        }
        return cur.value;
    }
}
exports.Cons = Cons;
function copyFirst(n, list) {
    const newHead = new Cons(list.value, undefined);
    let current = list;
    let newCurrent = newHead;
    while (--n > 0) {
        current = current.next;
        const cons = new Cons(current.value, undefined);
        newCurrent.next = cons;
        newCurrent = cons;
    }
    return newHead;
}
exports.copyFirst = copyFirst;
function concat(a, b) {
    let list = new Cons(a.value, undefined);
    let prev = list;
    let cur = a;
    while ((cur = cur.next) !== undefined) {
        prev.next = new Cons(cur.value, undefined);
        prev = prev.next;
    }
    prev.next = b;
    return list;
}
exports.concat = concat;
