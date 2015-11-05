var MathInput = function() {
    this.root = new Mrow('root');
    this.root.isRoot = true;
    this.root.JQ = $('<span class="mX-container"></span>');

    this.cursor = new Cursor();
    this.cursor.addAfter(this.root.children);
    this.cursor.JQ.appendTo(this.root.JQ);
    this.cursor.afterInput();

    this.selection = {start: null, end: null};
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
        case 'Ctrl-Esc':
            console.log(this.dumpTree());
            return false;
        }
    };

    _.click = function($elem, offsetX, offsetY) {
        var mxid = $elem.attr('mxid');
        var width2 = $elem.width()/2;
        var elem = allElems[mxid];

        this.cursor.beforeInput();
        if (offsetX < width2)
            elem.putCursorLeft(this.cursor);
        else
            elem.putCursorRight(this.cursor);
        this.cursor.afterInput();
        return false;
    };

    function unMarkSelection(sel) {
        if (!sel.start)
            return;
        listEach(sel.start, sel.end.next, function(elem) {
            elem.JQ.removeClass('mx-selected');
        });
    }
    function markSelection(sel) {
        if (!sel.start)
            return;
        listEach(sel.start, sel.end.next, function(elem) {
            elem.JQ.addClass('mx-selected');
        });
    }

    _.resetSelection = function() {
        unMarkSelection(this.selection);
        this.selection = {start: null, end: null};
    };

    _.updateSelection = function(startX, startY, endX, endY) {
        var rec = {left: startX, right: endX, top: startY, bottom: endY};

        if (endX < startX) {
            rec.left = endX;
            rec.right = startX;
        }
        if (endY < startY) {
            rec.top = endY;
            rec.bottom = startY;
        }
        if (rec.right - rec.left < 3 && rec.bottom - rec.top < 3)
            return;

        unMarkSelection(this.selection);
        this.selection = this.getSelection(rec, this.root);
        if (!this.selection.start)
            return;
        markSelection(this.selection);

        if (startX === rec.left) {
            this.selection.end.putCursorAfter(this.cursor);
        } else {
            this.selection.start.putCursorBefore(this.cursor);
        }
    };

    function overlap(rec1, rec2) {
        return !(rec1.top > rec2.bottom || rec2.top > rec1.bottom ||
                 rec1.left > rec2.right || rec2.left > rec1.right);
    }
    _.getSelection = function(rec, node) {
        var cursor = this.cursor;
        var start = node.children.next;
        var end = node.children;
        var elems = [];

        listEach(start, end, function(elem) {
            if (elem === cursor)
                return;
            var $elem = elem.JQ;
            var offset = $elem.offset();
            var recElem = {
                left: offset.left,
                top: offset.top,
                right: offset.left + $elem.width(),
                bottom: offset.top + $elem.height()
            };
            if (overlap(rec, recElem))
                elems.push(elem);
        });

        if (elems.length === 0)
            return {start: null, end: null};

        if (elems.length > 1 || !elems[0].hasChild() ||
            elems[0].cursorStay === false)
            return {start: elems[0], end: elems[elems.length-1]};

        return this.getSelection(rec, elems[0]);
    };

    _.dumpTree = function() {
        function _dump(node, level, indent) {
            var result = indent.repeat(level);

            result += '<' + node.tag + '>';
            if (node instanceof Mrow) {
                var start = node.children.next;
                var end = node.children;
                result += listFold(start, end, '\n', _dump, level+1, indent);
                result += indent.repeat(level);
            } else {
                result += node.input;
            }
            result += '</' + node.tag + '>\n';
            return result;
        }

        return _dump(this.root, 0, '  ');
    };
});
