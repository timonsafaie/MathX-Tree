var checkControl = (function () {
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

    function stringify(evt) {
        var which = evt.which || evt.keyCode;
        var keyVal = KEY_VALUES[which];
        var key;
        var modifiers = [];

        if (evt.ctrlKey)
            modifiers.push('Ctrl');
        if (evt.originalEvent && evt.originalEvent.metaKey)
            modifiers.push('Meta');
        if (evt.altKey)
            modifiers.push('Alt');
        if (evt.shiftKey)
            modifiers.push('Shift');

        key = keyVal || String.fromCharCode(which);

        if (!modifiers.length && !keyVal)
            return key;

        modifiers.push(key);
        return modifiers.join('-');
    }

    return function (key, cursor) {
        return false;
    };
})();
