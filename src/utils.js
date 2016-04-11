var __slice = [].slice;

function min(a, b) {
    return (a > b) ? b : a;
}

function abs(x) {
    return (x >= 0) ? x: -x;
}

function em2px(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (emSize * input);
}

function assert(cond, msg) {
    if (!cond)
        throw new Error(msg);
}

function extend(type, base, fn) {
    type.prototype = Object.create(base.prototype);
    type.prototype.constructor = type;
    if (typeof fn === 'function')
        fn(type.prototype, base.prototype);
}

function clone(obj) {
    if (obj === undefined)
        return obj;
    return JSON.parse(JSON.stringify(obj));
}
