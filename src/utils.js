var __slice = [].slice;

function assert() {
    if (arguments.length === 1)
        return console.assert(arguments[0], 'assert failed');
    return console.assert(arguments)
}

function extend(type, base, fn) {
    type.prototype = Object.create(base.prototype);
    if (typeof fn === 'function')
        fn(type.prototype, base.prototype);
}
