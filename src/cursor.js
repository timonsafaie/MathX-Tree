var Cursor = function() {
    Elem.call(this, 'cursor', '');
    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
};

extend(Cursor, Elem, function(_) {
    _.focus = function() {
        this.JQ.parent().addClass('focus');
    };

    _.blur = function() {
        this.JQ.parent().removeClass('focus');
    };

    _._moveLeft = function() {
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

    _._moveRight = function() {
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

    _._move = function(moveFn) {
        this.blur();
        if (this.prev.highlighted)
            this.prev.deHighlight();
        moveFn.apply(this);
        this.focus();
    };

    _.moveLeft = function() {
        this._move(this._moveLeft);
    };

    _.moveRight = function() {
        this._move(this._moveRight);
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
        this.blur();
        node.insert(this);
        this.bubble('resize');
        this.focus();
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

        var node = new agg.Tag(input, agg);
        this.blur();
        node.insert(this);
        this.bubble('resize');
        this.focus();
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
