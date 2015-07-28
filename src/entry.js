var entry = function(JQ) {
    var input = new MathInput();

    JQ.append(input.root.JQ);
    JQ.prop('tabindex', 0);
    JQ.bind({
        keydown: onKeydown,
        keypress: onKeypress
    });

    var KEY_VALUES = {
        8: 'Backspace',
        9: 'Tab',

        10: 'Enter', // for Safari on iOS

        13: 'Enter',

        16: 'Shift',
        17: 'Control',
        18: 'Alt',
        20: 'CapsLock',

        27: 'Esc',

        32: 'Spacebar',

        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',

        37: 'Left',
        38: 'Up',
        39: 'Right',
        40: 'Down',

        45: 'Insert',

        46: 'Del',

        144: 'NumLock'
    };

    function onKeydown(e) {
        var key = KEY_VALUES[e.keyCode];
        if (key) handleKey(key, e);
        console.log(input.dumpTree());
    }

    function onKeypress(e) {
        var key = String.fromCharCode(e.charCode);
        handleKey(key, e);
    }

    function handleKey(key, e) {
        try {
            input.input(key);
        } catch (e) {
            console.log(e);
        }
        e.preventDefault();
    }

    return input;
};
