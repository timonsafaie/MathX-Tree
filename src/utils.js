var __slice = [].slice;

function print(message) {
    console.log(message);
}

function assert(truth, message) {
    if (!truth) {
        if (message === undefined)
            message = 'assert failed';
        throw message;
    }
}
