var Cursor = function() {
    Elem.call(this, 'cursor', '');
    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
};

extend(Cursor, Elem, function(_) {
    _.beforeInput = function(key) {
        if (this.prev.highlighted && key !== 'Backspace')
            this.prev.deHighlight();
        if (this.next.highlighted && key !== 'Del')
            this.next.deHighlight();
        if (this.lastAgg && key !== 'Backspace') {
            this.lastAgg.settle();
            delete this.lastAgg;
        }
        this.JQ.parent().removeClass('focus');
    };

    _.afterInput = function(key) {
        this.JQ.parent().addClass('focus');
        this.bubble('resize');
    };

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
        if (this.lastAgg) {
            this.expandAgg(this.lastAgg);
            delete this.lastAgg;
            return;
        }
        if (this.isFirstChild())
            return;
        var prev = this.prev;
        if (prev instanceof Mrow && !prev.highlighted) {
            prev.highlight();
            return;
        } else if (prev.info.multiChar) {
            this.expandAgg(prev);
            prev = this.prev;
        }
        prev.putCursorBefore(this);
        prev.remove();
    };

    _.delRight = function() {
        if (this.isLastChild())
            return;
        var next = this.next;
        if (next instanceof Mrow && !next.highlighted) {
            next.highlight();
            return;
        } else if (next.info.multiChar) {
            this.expandAgg(next, true);
            next = this.next;
        }
        next.putCursorBefore(this);
        next.remove();
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
    };

    _.reduceAgg = function() {
        var agg, input;

        var start = this.parent.firstChild();
        var aggTag = this.prev.tag;
        var search = '';
        listEachReversed(start, this, function(e) {
            if (e.tag != aggTag)
                return false;
            search = e.input + search;
            if (aggSymbols.hasOwnProperty(search)) {
                agg = aggSymbols[search];
                input = search;
                start = e;
            }
        });

        if (!agg)
            return;

        listEachReversed(start, this, function(e) {
            e.remove();
        });

        var node = new agg.Tag(input, agg);
        node.insert(this);
        this.lastAgg = node;
        this.lastAgg.unsettle();
    };

    _.expandAgg = function(agg, before) {
        agg.putCursorBefore(this);
        agg.remove();

        var cursor = this;
        var first = null;
        agg.input.split('').forEach(function(c) {
            cursor.inputKey(c);
            if (first === null)
                first = cursor.prev;
        });

        if (before)
            first.putCursorBefore(this)
    };
});
