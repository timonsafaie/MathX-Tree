var MathInput = function() {
    this.root = new Mrow('root');
    this.root.isRoot = true;
    this.root.JQ = $('<span class="mX-container"></span>');

    this.cursor = new Cursor();
    this.cursor.addAfter(this.root.children);
    this.cursor.JQ.appendTo(this.root.JQ);
};

extend(MathInput, Object, function(_) {
    _.inputKey = function(key) {
        var cursor = this.cursor;

        cursor.inputKey(key);
        cursor.reduceAgg();
    };

    _.inputControl = function(key) {
        var cursor = this.cursor;

        switch (key) {
        case 'Left':
            cursor.moveLeft();
            return;
        case 'Right':
            cursor.moveRight();
            return;
        case 'Backspace':
            cursor.delLeft();
            return;
        case 'Enter':
            cursor.reduceAgg();
            return;
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
