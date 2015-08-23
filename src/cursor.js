var Cursor = function() {
    Elem.call(this, 'cursor', '');
    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
};

extend(Cursor, Elem, function(_) {
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
                if (prev.highlighted)
                    prev.deHighlight();
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
        if (prev instanceof Mrow && !prev.highlighted) {
            prev.highlight();
            return;
        }
        prev.putCursorBefore(this);
        prev.remove();
        this.bubble('resize');
    };

    _.inputKey = function(key) {
        var atom;
        for (var i = 0; i < atomSymbols.length; i++) {
            var s = atomSymbols[i];
            if (s.input.test !== undefined) {
                if (s.input.test(key)) {
                    atom = s;
                    break;
                }
            } else {
                if (s.input === key) {
                    atom = s;
                    break;
                }
            }
        }

        if (!atom)
            throw 'Unknown input "' + key + '"';

        var node = new atom.Tag(key, atom);
        node.insert(this);
        this.bubble('resize');
    };

    _.reduceAgg = function() {
        var agg;

        var start = this.parent.firstChild();
        var aggTag = this.prev.tag;
        var input = '';
        listEachReversed(start, this, function(e) {
            if (e.tag != aggTag)
                return false;
            input = e.input + input;
            if (aggSymbols.hasOwnProperty(input)) {
                agg = aggSymbols[input];
                start = e;
            }
        });

        if (!agg)
            return;

        listEachReversed(start, this, function(e) {
            e.remove();
        });
        node = new agg.Tag(input, agg);
        node.insert(this);
        this.bubble('resize');
    };

    _.expandAgg = function(agg) {
        var cursor = this;
        if (agg.input.length === 1)
            return;
        agg.input.split('').forEach(function(c) {
            cursor.inputKey(c);
        });
        this.bubble('resize');
    };
});
