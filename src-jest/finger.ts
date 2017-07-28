"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// An affix is a list that can only have length 0 to 4. It is a
// structure used internally in the finger tree.
class Affix {
    constructor(size, len, a, b, c, d) {
        this.size = size;
        this.len = len;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    toArray() {
        switch (this.len) {
            case 0: return [];
            case 1: return [this.a];
            case 2: return [this.a, this.b];
            case 3: return [this.a, this.b, this.c];
            default: return [this.a, this.b, this.c, this.d];
        }
    }
    get(idx) {
        switch (idx) {
            case 0: return this.a;
            case 1: return this.b;
            case 2: return this.c;
            default: return this.d;
        }
    }
}
exports.Affix = Affix;
function affixIntoArray(affix, offset, arr) {
    switch (affix.len) {
        case 0: return;
        case 1:
            arr[offset] = affix.a;
            return;
        case 2:
            arr[offset] = affix.a, arr[offset + 1] = affix.b;
            return;
        case 3:
            arr[offset] = affix.a, arr[offset + 1] = affix.b, arr[offset + 2] = affix.c;
            return;
        default:
            arr[offset] = affix.a, arr[offset + 1] = affix.b, arr[offset + 2] = affix.c, arr[offset + 3] = affix.d;
            return;
    }
}
function affixIntoArrayRev(affix, offset, arr) {
    switch (affix.len) {
        case 0: return;
        case 1:
            arr[offset] = affix.a;
            return;
        case 2:
            arr[offset] = affix.b, arr[offset + 1] = affix.a;
            return;
        case 3:
            arr[offset] = affix.c, arr[offset + 1] = affix.b, arr[offset + 2] = affix.a;
            return;
        default:
            arr[offset] = affix.d, arr[offset + 1] = affix.c, arr[offset + 2] = affix.b, arr[offset + 3] = affix.a;
            return;
    }
}
const emptyAffix = new Affix(0, 0, undefined);
function affixPrepend(size, a, as) {
    return new Affix(as.size + size, as.len + 1, a, as.a, as.b, as.c);
}
// Node in a 2-3 tree
// export type NNode<A> = [A, A] | [A, A, A];
class NNode {
    constructor(size, // number of elements in tree
        three, // true if the node has three elements
        a, b, c) {
        this.size = size;
        this.three = three;
        this.a = a;
        this.b = b;
        this.c = c;
    }
    get(idx) {
        switch (idx) {
            case 0: return this.a;
            case 1: return this.b;
            default: return this.c;
        }
    }
}
exports.NNode = NNode;
class FingerTree {
    constructor(depth, size, prefix, deeper, suffix) {
        this.depth = depth;
        this.size = size;
        this.prefix = prefix;
        this.deeper = deeper;
        this.suffix = suffix;
    }
}
exports.FingerTree = FingerTree;
exports.nil = new FingerTree(0, 0, undefined, undefined, undefined);
function deep(depth, size, prefix, deeper, suffix) {
    return new FingerTree(depth, size, prefix, deeper, suffix);
}
function prepend(a, t) {
    return nrPrepend(0, 1, a, t);
}
exports.prepend = prepend;
function nrPrepend(depth, size, a, t) {
    if (t.size === 0) {
        return deep(depth, size, new Affix(size, 1, a), exports.nil, emptyAffix);
    }
    else {
        return nrPrependDeep(t.prefix, depth, t, size, a);
    }
}
exports.nrPrepend = nrPrepend;
function nrPrependDeep(p, depth, t, s, a) {
    if (p.len < 4) {
        return deep(depth, t.size + s, affixPrepend(s, a, t.prefix), t.deeper, t.suffix);
    }
    else if (t.suffix === emptyAffix) {
        return deep(depth, t.size + s, new Affix(s, 1, a), t.deeper, new Affix(p.size, 4, p.d, p.c, p.b, p.a));
    }
    else {
        const num = depth === 0 ? 1 : p.a.size;
        const node = new NNode(p.size - num, true, p.b, p.c, p.d);
        return deep(depth, t.size + s, new Affix(s + num, 2, a, p.a), nrPrepend(depth + 1, node.size, node, t.deeper), t.suffix);
    }
}
function append(a, t) {
    return nrAppend(0, 1, a, t);
}
exports.append = append;
function nrAppend(depth, size, a, t) {
    if (t.size === 0) {
        return deep(depth, size, emptyAffix, exports.nil, new Affix(size, 1, a));
    }
    else {
        return nrAppendDeep(t.suffix, depth, t, size, a);
    }
}
function nrAppendDeep(suf, depth, t, s, a) {
    if (suf.len < 4) {
        return deep(depth, t.size + s, t.prefix, t.deeper, affixPrepend(s, a, t.suffix));
    }
    else if (t.prefix === emptyAffix) {
        return deep(depth, t.size + s, new Affix(suf.size, 4, suf.d, suf.c, suf.b, suf.a), t.deeper, new Affix(s, 1, a));
    }
    else {
        const num = depth ? suf.a.size : 1;
        const node = new NNode(suf.size - num, true, suf.d, suf.c, suf.b);
        return deep(depth, t.size + s, t.prefix, nrAppend(depth + 1, node.size, node, t.deeper), new Affix(num + s, 2, a, suf.a));
    }
}
function size(t) {
    return t.size;
}
exports.size = size;
// Concat
const buffer = new Array(12);
const digitBuffer = new Array(4);
let digitSize = 0;
let digitLen = 0;
function copy(b, d, left) {
    b[left] = d[0];
    b[left + 1] = d[1];
    b[left + 2] = d[2];
    b[left + 3] = d[3];
}
function nodes(deep, suffix, prefix) {
    let left = suffix.len;
    affixIntoArrayRev(suffix, 0, buffer);
    copy(buffer, digitBuffer, left);
    left += digitLen;
    affixIntoArray(prefix, left, buffer);
    left += prefix.len;
    let idx = 0;
    digitLen = 0;
    digitSize = 0;
    while (left > 4 || left === 3) {
        const size = deep === true ? buffer[idx].size + buffer[idx + 1].size + buffer[idx + 2].size : 3;
        digitBuffer[digitLen++] = new NNode(size, true, buffer[idx], buffer[idx + 1], buffer[idx + 2]);
        left -= 3;
        idx += 3;
        digitSize += size;
    }
    while (left !== 0) {
        const size = deep === true ? buffer[idx].size + buffer[idx + 1].size : 2;
        digitBuffer[digitLen++] = new NNode(size, false, buffer[idx], buffer[idx + 1]);
        digitSize += size;
        idx += 2;
        left -= 2;
    }
}
function concat(t1, t2) {
    if (t1 === exports.nil) {
        return t2;
    }
    if (t2 === exports.nil) {
        return t1;
    }
    digitSize = digitLen = 0;
    let topTree = deep(0, t1.size + t2.size, t1.prefix, exports.nil, t2.suffix);
    nodes(false, t1.suffix, t2.prefix);
    t1 = t1.deeper;
    t2 = t2.deeper;
    let curTree = topTree;
    let depth = 1;
    while (t1 !== exports.nil && t2 !== exports.nil) {
        let newTree = deep(depth, t1.size + t2.size + digitSize, t1.prefix, exports.nil, t2.suffix);
        nodes(true, t1.suffix, t2.prefix);
        t1 = t1.deeper;
        t2 = t2.deeper;
        curTree.deeper = newTree;
        curTree = newTree;
        depth++;
    }
    if (t1 === exports.nil) {
        for (let i = digitLen - 1; i >= 0; --i) {
            t2 = nrPrepend(depth, digitBuffer[i].size, digitBuffer[i], t2);
        }
        curTree.deeper = t2;
    }
    else {
        for (let i = 0; i < digitLen; ++i) {
            t1 = nrAppend(depth, digitBuffer[i].size, digitBuffer[i], t1);
        }
        curTree.deeper = t1;
    }
    return topTree;
}
exports.concat = concat;
// Get
function affixGet(depth, idx, affix) {
    const { len, size, a, b, c, d } = affix;
    if (len === size) {
        return affix.get(idx);
    }
    let elm = a;
    let delta = a.size;
    while (idx >= delta) {
        delta += b.size;
        if (idx < delta) {
            elm = b;
            break;
        }
        delta += c.size;
        if (idx < delta) {
            elm = c;
            break;
        }
        delta += d.size;
        elm = d;
        break;
    }
    return nodeGet(depth, idx - delta + elm.size, elm);
}
function affixGetRev(depth, idx, affix) {
    const { len, size, a, b, c, d } = affix;
    if (len === size) {
        return affix.get(len - 1 - idx);
    }
    let elm = a;
    let delta = size - a.size;
    while (idx < delta) {
        delta -= b.size;
        if (delta <= idx) {
            elm = b;
            break;
        }
        delta -= c.size;
        if (delta <= idx) {
            elm = c;
            break;
        }
        delta -= d.size;
        elm = d;
        break;
    }
    return nodeGet(depth, idx - delta, elm);
}
function nodeGet(depth, idx, node) {
    while (--depth > 0) {
        let size = 0;
        if (idx < node.a.size) {
            node = node.a;
            idx -= size;
            continue;
        }
        size += node.a.size;
        if (idx < size + node.b.size) {
            node = node.b;
            idx -= size;
            continue;
        }
        size += node.b.size;
        if (idx < size + node.c.size) {
            node = node.c;
            idx -= size;
            continue;
        }
    }
    return node.get(idx);
}
function get(idx, tree) {
    let { size, prefix } = tree;
    if (size === 0) {
        return undefined;
    }
    let prefSize = tree.prefix.size;
    let deepSize = prefSize + tree.deeper.size;
    while (prefSize <= idx && idx < deepSize) {
        idx = idx - prefSize;
        tree = tree.deeper;
        prefix = tree.prefix;
        prefSize = prefix.size;
        deepSize = prefSize + tree.deeper.size;
    }
    const { depth } = tree;
    if (idx < prefSize) {
        return affixGet(depth, idx, prefix);
    }
    else {
        return affixGetRev(depth, idx - deepSize, tree.suffix);
    }
}
exports.get = get;
// Fold
function nodeFoldl(f, initial, node, depth) {
    if (depth === 1) {
        return f(f(f(initial, node.a), node.b), node.c);
    }
    else {
        const foldedA = nodeFoldl(f, initial, node.a, depth - 1);
        const foldedB = nodeFoldl(f, foldedA, node.b, depth - 1);
        const foldedC = nodeFoldl(f, foldedB, node.c, depth - 1);
        return foldedC;
    }
}
function affixFoldr(f, initial, affix) {
    switch (affix.len) {
        case 0: return initial;
        case 1: return f(affix.a, initial);
        case 2: return f(affix.a, f(affix.b, initial));
        case 3: return f(affix.a, f(affix.b, f(affix.c, initial)));
        default: return f(affix.a, f(affix.b, f(affix.c, f(affix.d, initial))));
    }
}
function affixFoldl(f, initial, affix, depth) {
    if (depth === 0) {
        switch (affix.len) {
            case 0: return initial;
            case 1: return f(initial, affix.a);
            case 2: return f(f(initial, affix.a), affix.b);
            case 3: return f(f(f(initial, affix.a), affix.b), affix.c);
            default: return f(f(f(f(initial, affix.a), affix.b), affix.c), affix.d);
        }
    }
    else {
        switch (affix.len) {
            case 0: return initial;
            case 1: return nodeFoldl(f, initial, affix.a, depth);
            case 2: return nodeFoldl(f, nodeFoldl(f, initial, affix.a, depth), affix.b, depth);
            case 3: return nodeFoldl(f, nodeFoldl(f, nodeFoldl(f, initial, affix.a, depth), affix.b, depth), affix.c, depth);
            default: return nodeFoldl(f, nodeFoldl(f, nodeFoldl(f, nodeFoldl(f, initial, affix.a, depth), affix.b, depth), affix.c, depth), affix.d, depth);
        }
    }
}
function affixFoldlRev(f, initial, affix, depth) {
    if (depth === 0) {
        switch (affix.len) {
            case 0: return initial;
            case 1: return f(initial, affix.a);
            case 2: return f(f(initial, affix.b), affix.a);
            case 3: return f(f(f(initial, affix.c), affix.b), affix.a);
            default: return f(f(f(f(initial, affix.d), affix.c), affix.b), affix.a);
        }
    }
    else {
        switch (affix.len) {
            case 0: return initial;
            case 1: return nodeFoldl(f, initial, affix.a, depth);
            case 2: return nodeFoldl(f, nodeFoldl(f, initial, affix.b, depth), affix.a, depth);
            case 3: return nodeFoldl(f, nodeFoldl(f, nodeFoldl(f, initial, affix.c, depth), affix.b, depth), affix.a, depth);
            default: return nodeFoldl(f, nodeFoldl(f, nodeFoldl(f, nodeFoldl(f, initial, affix.d, depth), affix.c, depth), affix.b, depth), affix.a, depth);
        }
    }
}
function foldl(f, initial, list) {
    const { size, prefix, deeper, suffix, depth } = list;
    if (size === 0) {
        return initial;
    }
    else {
        const foldedSuffix = suffix === undefined ? initial : affixFoldlRev(f, initial, suffix, depth);
        const foldedMiddle = deeper === undefined ? foldedSuffix : foldl(f, foldedSuffix, deeper);
        return prefix === undefined ? foldedMiddle : affixFoldl(f, foldedMiddle, prefix, depth);
    }
}
exports.foldl = foldl;
function flatten(a) {
    let array = [];
    for (let i = 0; i < a.length; ++i) {
        const e = a[i];
        array.push(e.a);
        array.push(e.b);
        if (e.three === true) {
            array.push(e.c);
        }
    }
    return array;
}
function toArray(t) {
    if (t.size === 0) {
        return [];
    }
    else {
        return t.prefix.toArray().concat(flatten(toArray(t.deeper))).concat(t.suffix.toArray().reverse());
    }
}
exports.toArray = toArray;
