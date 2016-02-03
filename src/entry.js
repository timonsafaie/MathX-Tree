var entry = function(JQ, root) {
    var input = new MathInput();
    if (root) input.root = root;
    JQ.append(input.root.JQ);
    JQ.prop('tabindex', 0);
    JQ.bind({
        keydown: onKeydown,
        keypress: onKeypress,
        mousedown: onMousedown
    });
    JQ.focus(function() {
        input.cursor.show();
        input.cursor.setBlink();
    });
    JQ.blur(function(e) {
        input.cursor.hide();
        input.cursor.clearBlink();
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
    input.root.JQ.click(function(e) {
        input.click($(e.target), e.pageX, e.pageY);
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
        if (e.ctrlKey)
          key = 'Ctrl-' + key;
        if (e.shiftKey)
          key = 'Shift-' + key;
        return input.inputControl(key);
      }
    }

    function onKeypress(e) {
      if (input.mathMode) {
        var key = String.fromCharCode(e.charCode);
        input.inputKey(key);
        return false;
      } else {

      }
    }

    function onMousedown(e) {
        var startX, startY;

        function startSelection(e) {
            input.resetSelection()
            startX = e.pageX;
            startY = e.pageY;
        }

        function updateSelection(e) {
            input.updateSelection(startX, startY, e.pageX, e.pageY);
            input.cursor.clearBlink();
            input.cursor.hide();
            if ((startX == e.pageX) && 
                (startY == e.pageY))
                input.cursor.show();
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
