var __slice = [].slice;

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
