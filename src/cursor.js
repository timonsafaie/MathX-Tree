var Cursor = function() {
    Node.call(this);
    delete this.children;
    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
};

extend(Cursor, Node, function(_) {
    _.moveLeft = function() {
        if (this.isFirstChild()) {
            var parent = this.parent;
            if (parent.isRoot)
                return;
            if (!parent.putCursorBefore(this))
                this.moveLeft();
        } else {
            var prev = this.prev;
            if (prev instanceof Mrow) {
                if (!prev.appendCursor(this))
                    this.moveLeft();
            } else {
                prev.putCursorBefore(this);
            }
        }
    };

    _.moveRight = function() {
        if (this.isLastChild()) {
            var parent = this.parent;
            if (parent.isRoot)
                return;
            if (!parent.putCursorAfter(this))
                this.moveRight();
        } else {
            var next = this.next;
            if (next instanceof Mrow) {
                if (!next.prependCursor(this))
                    this.moveRight();
            } else {
                next.putCursorAfter(this);
            }
        }
    };

    _.delLeft = function() {
        if (this.isFirstChild())
            return;
        var prev = this.prev;
        prev.putCursorBefore(this);
        prev.remove();
    };

    _.inputKey = function(key) {
        var atom;
        for (var i = 0; i < atomElems.length; i++) {
            var e = atomElems[i];
            if (e.input.test !== undefined) {
                if (e.input.test(key)) {
                    atom = e;
                    break;
                }
            } else {
                if (e.input === key) {
                    atom = e;
                    break;
                }
            }
        }

        if (!atom)
            throw 'Unknown input "' + key + '"';

        node = new atom.Tag(key, atom);
        node.insert(this);
    };

    _.reduceAgg = function() {
        var cursor = this;
        var agg;

        var start = cursor.parent.children.next;
        var input = '';
        listEachReversed(start, cursor, function(e) {
            if (e.input.length > 1 || e.tag != cursor.prev.tag)
                return false;
            input = e.input + input;
            if (aggElems.hasOwnProperty(input)) {
                agg = aggElems[input];
                start = e;
                return false;
            }
            return true;
        });

        if (!agg)
            return;

        listEachReversed(start, cursor, function(e) {
            e.JQ.remove();
            e.remove();
            return true;
        });
        node = new agg.Tag(input, agg);
        node.insert(cursor);
    };

    _.expandAgg = function(agg) {
        var cursor = this;
        if (agg.input.length === 1)
            return;
        agg.input.split('').forEach(function(c) {
            cursor.inputKey(c);
        });
    };
});
