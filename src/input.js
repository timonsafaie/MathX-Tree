var MathInput = function() {
    this.root = new Mrow();
    this.root.JQ = $('<span class="mX-container"></span>');
    this.cursor = new Cursor(this.root);
};

extend(MathInput, Object, function(_) {
    _.input = function(key) {
        console.log(key);

        var cursor = this.cursor;
        if (checkControl(key, cursor) === true)
            return;

        var found;
        for (var i = 0; i < atomElems.length; i++) {
            var atom = atomElems[i];
            if (atom.input.test !== undefined) {
                if (atom.input.test(key)) {
                    found = atom;
                    break;
                }
            } else {
                if (atom.input === key) {
                    found = atom;
                    break;
                }
            }
        }

        if (!found)
            throw 'Unknown input "' + key + '"';
        node = new found.Tag(key, found);
        node.insert(cursor);

        if (cursor.aggTag !== node.tag) {
            cursor.aggTag = node.tag;
            cursor.aggStart = node;
            return;
        }

        var aggFound;
        var aggInput = listFold(cursor.aggStart, cursor, '', function(e) {
            return e.input;
        });
        for (var i = 0; i < aggElems.length; i++) {
            var agg = aggElems[i];
            if (agg.input.test != undefined) {
                if (agg.input.test(aggInput)) {
                    aggFound = agg;
                    break;
                }
            } else {
                if (agg.input === aggInput) {
                    aggFound = agg;
                    break;
                }
            }
        }

        if (!aggFound)
            return;
        listEachReversed(cursor.aggStart, cursor, function(e) {
            e.remove(cursor);
        });
        node = new aggFound.Tag(aggInput, aggFound);
        node.insert(cursor);

        cursor.aggTag = node.tag;
        cursor.aggStart = node;
    };

    _.dumpTree = function() {
        var cursor = this.cursor;

        function _dump(node, level, indent) {
            var result = indent.repeat(level);

            if (node === cursor)
                return result + '<cursor/>\n';

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
