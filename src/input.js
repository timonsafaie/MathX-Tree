var MathInput = function() {
    this.root = new Mrow('root');
    this.root.isRoot = true;
    this.root.JQ = $('<span class="mX-container"></span>');

    this.cursor = new Cursor();
    this.cursor.addAfter(this.root.children);
    this.cursor.JQ.appendTo(this.root.JQ);
    this.cursor.afterInput();
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
