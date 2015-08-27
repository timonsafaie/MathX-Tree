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
            break;
        case 'Right':
            this._runControl(cursor.moveRight, key);
            break;
        case 'Backspace':
            this._runControl(cursor.delLeft, key);
            break;
        case 'Del':
            this._runControl(cursor.delRight, key);
            break;
        case 'Enter':
            this._runControl(cursor.reduceAgg, key);
            break;
        }
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
