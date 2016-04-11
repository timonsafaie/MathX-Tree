var MathInput = function() {
    this.root = new Mrow('root');
    this.root.isRoot = true;
    this.root.resize();

    this.cursor = new Cursor(this.root);
    this.cursor.addAfter(this.root.children);
    this.cursor.JQ.appendTo(this.root.JQ);
    this.cursor.hide();

    this.log = [];
    this.uuid = null;
    this.mathMode = true;
    this.didExitTextMode = false;
};

var cursorControlKeys = {
    'Left':        'moveLeft',
    'Right':       'moveRight',
    'Tab':         'moveNextRow',
    'Shift-Tab':   'movePrevRow',
    'Home':        'moveFirst',
    'End':         'moveLast',
    'Ctrl-Left':   'moveBegin',
    'Ctrl-Right':  'moveEnd',
    'Up':          'moveUp',
    'Down':        'moveDown',
    'Backspace':   'delLeft',
    'Del':         'delRight',
    'Enter':       'reduceAgg',
    'Shift-Left':  'selectLeft',
    'Shift-Right': 'selectRight',
    'Ctrl-A':      'selectAll',
    'Ctrl-C':      'copySelection',
    'Ctrl-V':      'pasteSelection',
    'Ctrl-X':      'cutSelection',
    'Ctrl-Z':      'undo',
};

extend(MathInput, Object, function(_) {
    _.inputKey = function(key) {
        var cursor = this.cursor;
        cursor.beforeInput(key);
        cursor.inputKey(key);
        cursor.reduceAgg();
        cursor.afterInput(key);
    };

    _.inputMatrixBuilder = function(rows, cols) {
        var cursor = this.cursor;
        cursor.beforeInput('matrix');
        cursor.rebuildMatrix(rows, cols);
        cursor.afterInput('matrix');
    };

    _.inputControl = function(key) {
        if (cursorControlKeys[key]) {
            var ctrlOp = cursorControlKeys[key];
            var cursor = this.cursor;
            cursor.beforeInput(ctrlOp);
            cursor[ctrlOp].apply(cursor);
            cursor.afterInput(ctrlOp);
            return false;
        }
        switch (key) {
        case 'Ctrl-Esc':
            console.log(this.dumpRoot());
            return false;
        case 'Shift-Ctrl-Esc':
            console.log(this.dumpSavedSelection());
            return false;
        case 'Ctrl-Backslash':
            if (this.mathMode && !this.didExitTextMode) {
              var that = this;
              var textSpan = document.createElement('span');
              var textDiv = document.createElement('div');
              textDiv.contentEditable = "true";
              $(textDiv).addClass('mx-txt');
              textDiv.onkeydown = function(e) {
                if (e.keyCode == 220) {
                  that.didExitTextMode = true;
                  var newMX = document.createElement('span');
                  var newInput = entry($(newMX));
                  this.parentElement.appendChild(newMX);
                  $(newMX).focus();
                  that.mathMode = true;
                  return false;
                }
              };
              textSpan.appendChild(textDiv);
              this.root.JQ[0].parentElement.appendChild(textSpan);
              textDiv.focus();
              this.mathMode = false;
            } else if (this.mathMode) this.mathMode = false;
            this.didExitTextMode = false;
            return false;
        }
    };

    _.dumpRoot = function() {
        return dumpTree(this.root);
    };

    _.dumpSavedSelection = function() {
        return dumpTree(clipBoard);
    };
});

function dumpTree(node) {
    function dump(node, level, indent) {
        var result = indent.repeat(level);

        result += '<' + node.tag + '>';
        if (node instanceof Mrow) {
            var start = node.children.next;
            var end = node.children;
            result += listFold(start, end, '\n', dump, level+1, indent);
            result += indent.repeat(level);
        } else {
            result += node.input;
        }
        result += '</' + node.tag + '>\n';
        return result;
    }
    return dump(node, 0, '  ');
};
