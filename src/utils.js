var __slice = [].slice;

function assert(truth, message) {
    if (!truth) {
        if (message === undefined)
            message = 'assert failed';
        throw message;
    }
}

function extend(type, base, fn) {
    type.prototype = Object.create(base.prototype);
    if (typeof fn === 'function')
        fn(type.prototype, base.prototype);
}
