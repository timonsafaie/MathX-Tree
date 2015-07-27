var MathInput = function() {
    this.root = new Mrow();
    this.cursor = new Cursor();
    this.cursor.addAfter(this.root.children);
    this.JQ = $('<span class="mX-container"></span>');
    this.cursor.JQ.appendTo(this.JQ);
};

extend(MathInput, Object, function(_) {
    _.html = function() {
        return 
    };
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
});
