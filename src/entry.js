var entry = function(JQ, root) {
    var input = new MathInput();
    if (root) input.root = root;
    JQ.append(input.root.JQ);
    JQ.prop('tabindex', 0);
    JQ.bind({
        keydown: onKeydown,
        keypress: onKeypress,
    });
    JQ.focus(function() {
        input.cursor.focus();
    });
    JQ.blur(function(e) {
        input.cursor.blur();
        if (typeof mxapi == "object" && mxapi && mxapi.host) {
          var eq = {
            content: toJSON(input.root)
          };
          var meth = "POST",path = "/User/equation";
          if (input.uuid) {
            meth = "PUT";
            path = "/User/equation/" + input.uuid;
          }
          mxapi.call(mxapi.host+path, meth, JSON.stringify(eq), true, function(req) {
            var shwing = JSON.parse(req.responseText);
            if (shwing && shwing.uuid) {
              input.uuid = shwing.uuid;
              JQ.attr('mx-id',shwing.uuid);
            }
          });
        }
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

        144: 'NumLock',

        220: 'Backslash'
    };

    function onKeydown(e) {
      var key = KEY_VALUES[e.keyCode] || String.fromCharCode(e.keyCode);
      if (input.mathMode) {
        var prefix = '';
        if (e.metaKey || e.ctrlKey)
          prefix = 'Ctrl-';
        if (e.shiftKey)
          prefix = 'Shift-';
        if ($(':focus').hasClass('mat-inp')) {
            if (key == 'Enter') {
                var sib = $(':focus').parent().children();
                if (sib.length !== 2)
                    return;
                var rows = 0 + sib[0].value;
                var cols = 0 + sib[1].value;
                if (rows <= 0 || rows > 10 || cols <= 0 || cols > 10)
                    return;
                return input.inputMatrixBuilder(rows, cols);
            }
        } 
        return input.inputControl(prefix+key);
      }
    }

    function onKeypress(e) {
      if (input.mathMode) {
        var key = String.fromCharCode(e.charCode);
        input.inputKey(key);
        return false;
      }
    }

    JQ.on('mousedown', '[row-id]', function(e) {
        var rid = $(this).attr('row-id');
        if (!rid)
            return;

        if (e.mathxProcessed)
            return;
        e.mathxProcessed = true;

        var cursor = input.cursor;
        cursor.beforeInput('selectAll');
        locateCursor(e.pageX, e.pageY, rid, cursor);
        cursor.selection.reset();
        cursor.selection.setStart(cursor);
        cursor.afterInput('selectAll');

        JQ.on('mousemove.mathx', '[row-id]', updateSelection);
        $('body').on('mouseup.mathx', endSelection);
    });

    function updateSelection(e) {
        var rid = $(this).attr('row-id');
        if (!rid)
            return;

        if (e.mathxProcessed)
            return;
        e.mathxProcessed = true;

        var cursor = input.cursor;
        cursor.hide();
        locateCursor(e.pageX, e.pageY, rid, cursor);
        cursor.selection.setEnd(cursor)
        cursor.selection.update(cursor);
        cursor.show();
    }

    function endSelection(e) {
        JQ.off('mousemove.mathx', '[row-id]');
        $('body').off('mouseup.mathx');
    }

    return input;
};
