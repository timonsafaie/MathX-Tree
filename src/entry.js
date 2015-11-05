var entry = function(JQ) {
    var input = new MathInput();

    JQ.append(input.root.JQ);
    JQ.prop('tabindex', 0);
    JQ.bind({
        keydown: onKeydown,
        keypress: onKeypress,
        mousedown: onMousedown,
    });
    $('body').on('click', '[mxId]', function (e) {
        return input.click($(e.currentTarget), e.offsetX, e.offsetY);
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
        var key = KEY_VALUES[e.keyCode] || String.fromCharCode(e.keyCode);
        if (e.ctrlKey)
            key = 'Ctrl-' + key;
        if (e.shiftKey)
            key = 'Shift-' + key;
        try {
            return input.inputControl(key);
        } catch (e) {
            console.log(e);
        }
    }

    function onKeypress(e) {
        var key = String.fromCharCode(e.charCode);
        try {
            input.inputKey(key);
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    function onMousedown(e) {
        var startX, startY;

        function startSelection(e) {
            input.resetSelection();
            startX = e.pageX;
            startY = e.pageY;
        }

        function updateSelection(e) {
            input.updateSelection(startX, startY, e.pageX, e.pageY);
        }

        function endSelection(e) {
            $('body').off('mousemove.mathx');
            $('body').off('mouseup.mathx');
        }

        startSelection(e);
        $('body').on('mousemove.mathx', updateSelection);
        $('body').on('mouseup.mathx', endSelection);
    }

    return input;
};
