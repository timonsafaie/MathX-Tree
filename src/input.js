var MathInput = function() {
    this.root = new Mrow('root');
    this.root.isRoot = true;

    this.cursor = new Cursor(this.root);
    this.cursor.addAfter(this.root.children);
    this.cursor.JQ.appendTo(this.root.JQ);
    this.cursor.hide();
    this.log = [];
    this.uuid = null;
    this.mathMode = true;
    this.didExitTextMode = false;
};

extend(MathInput, Object, function(_) {
    _.inputKey = function(key) {
        var cursor = this.cursor;

        cursor.beforeInput(key);
        cursor.inputKey(key);
        cursor.reduceAgg();
        cursor.afterInput(key);


    };

    _._runControl = function(fn, key) {
        var cursor = this.cursor;

        cursor.beforeInput(key);
        fn.apply(cursor);
        cursor.afterInput(key);
    };

    _.inputControl = function(key) {
        var cursor = this.cursor;

        switch (key) {
        case 'Left':
            this._runControl(cursor.moveLeft, key);
            return false;
        case 'Right':
            this._runControl(cursor.moveRight, key);
            return false;
        case 'Tab':
            this._runControl(cursor.moveNextRow, key);
            return false;
        case 'Shift-Tab':
            this._runControl(cursor.movePrevRow, key);
            return false;
        case 'Home':
            this._runControl(cursor.moveFirst, key);
            return false;
        case 'End':
            this._runControl(cursor.moveLast, key);
            return false;
        case 'Up':
            this._runControl(cursor.moveUp, key);
            return false;
        case 'Down':
            this._runControl(cursor.moveDown, key);
            return false;
        case 'Backspace':
            this._runControl(cursor.delLeft, key);
            return false;
        case 'Del':
            this._runControl(cursor.delRight, key);
            return false;
        case 'Enter':
            this._runControl(cursor.reduceAgg, key);
            return false;
        case 'Ctrl-C':
            this._runControl(cursor.copySelection, key);
            return false;
        case 'Ctrl-V':
            this._runControl(cursor.pasteSelection, key);
            return false;
        case 'Ctrl-X':
            this._runControl(cursor.cutSelection, key);
            return false;
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
              $(textDiv).css('padding','0px 8px 0px 8px');
              $(textDiv).css('display','inline');
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

    _.click = function($elem, pageX, pageY) {
        var mxid = $elem.attr('mxid');
        if (!mxid)
            return;
        var elem = allElems[mxid];
        cursor = this.cursor;
        cursor.beforeInput('Click');
        cursor.click($elem, pageX, pageY);
        cursor.afterInput('Click');
        return false;
    };

    _.resetSelection = function() {
        cursor = this.cursor;
        cursor.beforeInput('Select');
        cursor.resetSelection();
        cursor.afterInput('Select');
    };

    _.updateSelection = function(startX, startY, endX, endY) {
        cursor = this.cursor;
        cursor.beforeInput('Select');
        cursor.updateSelection(startX, startY, endX, endY);
        cursor.afterInput('Select');
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
