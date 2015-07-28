var Cursor = function(root) {
    Node.call(this);
    delete this.children;

    this.root = root;
    this.addAfter(root.children);

    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
    this.JQ.appendTo(root.JQ);
};

extend(Cursor, Node, function(_) {
    _.moveLeft = function() {
        if (this.isFirstChild()) {
            if (this.parent === this.root)
                return;
            this.JQ.insertBefore(this.parent.JQ.first());
            this.moveBefore(this.parent);
        } else {
            if (this.prev instanceof Mrow) {
                this.JQ.appendTo(this.prev.JQ.last());
                this.moveBefore(this.prev.children);
            } else {
                this.JQ.insertBefore(this.prev.JQ.first());
                this.moveBefore(this.prev);
            }
        }
    };

    _.moveRight = function() {
        if (this.isLastChild()) {
            if (this.parent === this.root)
                return;
            this.JQ.insertAfter(this.parent.JQ.last());
            this.moveAfter(this.parent);
        } else {
            if (this.next instanceof Mrow) {
                this.JQ.prependTo(this.next.JQ.last());
                this.moveAfter(this.next.children);
            } else {
                this.JQ.insertAfter(this.next.JQ.last());
                this.moveAfter(this.next);
            }
        }
    };

    _.delLeft = function() {
        if (this.isFirstChild()) {
            if (this.parent === this.root)
                return;
            var parent = this.parent;
            var parentJQ = this.parent.JQ.first();
            listEach(this.next, parent.children, function(e) {
                e.JQ.insertBefore(parentJQ);
                e.moveBefore(parent);
                return true;
            });
            this.JQ.insertBefore(parentJQ);
            this.moveBefore(parent);
            parent.JQ.remove();
            parent.remove();
            this.expandAgg(parent);
        } else {
            if (this.prev instanceof Mrow) {
                this.JQ.appendTo(this.prev.JQ.last());
                this.moveBefore(this.prev.children);
                this.delLeft();
            } else {
                var prev = this.prev;
                prev.JQ.remove();
                prev.remove();
                this.expandAgg(prev);
            }
        }
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
