var MathInput = function() {
    this.root = new Mrow();
    this.cursor = new Cursor();
    this.cursor.addAfter(this.root.children);
};

extend(MathInput, Object, function(_) {
    _.input = function(key) {
        var cursor = this.cursor;
        if (checkControl(key, cursor) === true)
            return;

        var Tag;
        for (var i = 0; i < atomElems.length; i++) {
            var atom = atomElems[i];
            if (atom.input.test !== undefined) {
                if (atom.input.test(key)) {
                    Tag = atom.Tag;
                    break;
                }
            } else {
                if (atom.input === key) {
                    Tag = atom.Tag;
                    break;
                }
            }
        }

        if (Tag === undefined)
            throw 'Unknown input "' + key + '"';
        node = new Tag(key);
        node.insert(cursor);

        if (cursor.aggTag !== node.tag) {
            cursor.aggTag = node.tag;
            cursor.aggStart = node;
            return;
        }

        var AggTag;
        var aggText = listFold(cursor.aggStart, cursor, '',
                               function(n) {return n.text;});
        for (var i = 0; i < aggElems.length; i++) {
            var agg = aggElems[i];
            if (agg.input.test != undefined) {
                if (agg.input.test(aggText)) {
                    AggTag = agg.Tag;
                    break;
                }
            } else {
                if (agg.input === aggText) {
                    AggTag = agg.Tag;
                    break;
                }
            }
        }

        if (AggTag === undefined)
            return;
        listDel(cursor.aggStart, cursor);
        node = new AggTag(aggText);
        node.insert(cursor);

        cursor.aggTag = node.tag;
        cursor.aggStart = node;
    };
});
