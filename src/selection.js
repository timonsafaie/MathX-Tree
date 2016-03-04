var ClipBoard = function() {
    Mrow.call(this, 'clipboard');
};

extend(ClipBoard, Mrow, function(_) {
    _.reset = function() {
        this.children = new List();
        listInitHead(this.children);
    };
});

var clipBoard = new ClipBoard();

var Mark = function() {
    Node.call(this);
    this.tag = 'mark';
    this.input = '';
    this.active = false;
};

extend(Mark, Node, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        this.active = true;
    };
    _.remove = function() {
        _super.remove.call(this);
        this.active = false;
    };
    _.putCursorBefore = function(cursor) {
        cursor.moveBefore(this);
        return false;
    };
    _.putCursorAfter = function(cursor) {
        cursor.moveAfter(this);
        return false;
    };
});

var Selection = function(root, cursor) {
    this.mark = new Mark();
    this._reset();
};

extend(Selection, Object, function(_) {
    _._reset = function() {
        this.start = null;
        this.end = null;
        this.newStart = null;
        this.newEnd = null;
        this.reversed = false;
        this.mark.remove();
    };

    _.reset = function() {
        if (this.start && this.end) {
            listEach(this.start, this.end.next, function(elem) {
                elem.deSelect();
            });
        }
        this._reset();
    };

    _.del = function() {
        var changed = false;
        if (this.start && this.end) {
            listEach(this.start, this.end.next, function(elem) {
                elem.remove();
            });
            changed = true;
        }
        this._reset();
        return changed;
    };

    _.changed = function(start, end) {
        if (start === this.start && end === this.end)
            return false;
        this.newStart = start;
        this.newEnd = end;
        return true;
    };

    _.update = function(cursor) {
        if (this.start && this.end) {
            listEach(this.start, this.end.next, function(elem) {
                elem.deSelect();
            });
        }
        this.start = this.newStart;
        this.end = this.newEnd;
        if (this.start && this.end) {
            listEach(this.start, this.end.next, function(elem) {
                elem.select();
            });
            if (this.reversed)
                this.start.putCursorBefore(cursor);
            else
                this.end.putCursorAfter(cursor);
        }
    };

    _.setStartEnd = function(start, end) {
        if (this.start && this.end) {
            listEach(this.start, this.end.next, function(elem) {
                elem.deSelect();
            });
        }
        this.start = start;
        this.end = end;
        if (this.start && this.end) {
            listEach(this.start, this.end.next, function(elem) {
                elem.select();
            });
        }
    };

    _.setStart = function(cursor) {
        if (!this.mark.active)
            this.mark.insert(cursor);
    };

    _.setEnd = function(cursor) {
        if (cursor.next === this.mark || cursor.prev === this.mark)
            return this.changed(null, null);

        var start = this.mark;
        var end = cursor;
        this.reversed = end.isBefore(start);

        while (!(start.parent.isAncestor(end) && start.parent.cursorStay))
            start = start.parent;
        while (end.parent != start.parent)
            end = end.parent;

        if (this.reversed) {
            if (start === this.mark)
                start = start.prev;
            if (end === cursor)
                end = end.next;
            return this.changed(end, start);
        } else {
            if (start === this.mark)
                start = start.next;
            if (end === cursor)
                end = end.prev;
            return this.changed(start, end);
        }
    };

    _.copy = function() {
        this.mark.remove();
        if (this.start && this.end) {
            clipBoard.reset();
            listEach(this.start, this.end.next, function(elem) {
                var copy = elem.copy();
                if (copy)
                    copy.addBefore(clipBoard.children);
            });
        }
        this.reset();
    };

    _.cut = function() {
        this.mark.remove();
        if (this.start && this.end) {
            clipBoard.reset();
            listEach(this.start, this.end.next, function(elem) {
                var copy = elem.copy();
                if (copy)
                    copy.addBefore(clipBoard.children);
            });
        }
        this.del();
    };

    _.paste = function(cursor) {
        this.mark.remove();
        if (!clipBoard.hasChild())
            return;
        clipBoard.eachChild(function(elem) {
            var copy = elem.copy();
            copy.addBefore(cursor);
            copy.JQ.insertBefore(cursor.JQ);
            copy.depthFirstIter('postInsertJQ', cursor);
            copy.depthFirstIter('resize', cursor);
        });
    };
});
