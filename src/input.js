var Cursor = function() {
    Node.call(this);
    delete this.children;
    this.aggTag = undefined;
    this.aggStart = undefined;
};

var MathInput = function() {
    this.root = new Node();
    this.root.tag = 'mrow';
    this.cursor = new Cursor(root);
    listAddAfter(this.cursor, this.root.children);
};

MathInput.prototype = {
    input: function(key) {
        var cursor = this.cursor;
        if (checkControl(key, cursor) === true)
            return;

        var tag;
        for (var i = 0; i < atomElems.length; i++) {
            var atom = atomElems[i];
            if (atom.input.test !== undefined) {
                if (atom.input.test(key)) {
                    tag = atom.tag;
                    break;
                }
            } else {
                if (atom.input === key) {
                    tag = atom.tag;
                    break;
                }
            }
        }
        if (tag === undefined)
            throw 'Unknown input "' + key + '"';
        node = tag.insert(key, cursor);

        if (cursor.aggTag !== node.tag) {
            cursor.aggTag = node.tag;
            cursor.aggStart = node;
            return;
        }

        var aggText = listFold(cursor.aggStart, cursor, '',
                               function(n) {return n.text;});
        for (var i = 0; i < aggElems.length; i++) {
            var agg = aggElems[i];
            if (agg.input === aggText) {
                listDel(cursor.aggStart, cursor);
                agg.tag.insert(aggText, cursor);
                cursor.aggTag = undefined;
                cursor.aggStart = undefined;
                break;
            }
        }
    }
};
