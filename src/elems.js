var Elem = function(tag, input, info) {
    Node.call(this);
    this.tag = tag;
    this.input = input;
    this.output = input;
    if (info) {
        if (info.output)
            this.output = info.output;
        if (info.padding)
            this.padding = info.padding;
    }
};

extend(Elem, Node, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        this.insertJQ(cursor);
    };

    _.insertJQ = function(cursor) {
        this.JQ = $('<span class="mX">' + this.output + '</span>');
        if (this.padding)
            this.JQ.css('padding', this.padding)
        this.JQ.insertBefore(cursor.JQ);
    };
});

var Mi = function(input, info) {
    Elem.call(this, 'mi', input, info);
};

extend(Mi, Elem);

var Mo = function(input, info) {
    Elem.call(this, 'mo', input, info);
};

extend(Mo, Elem);

var Mn = function(input, info) {
    Elem.call(this, 'mn', input, info);
};

extend(Mn, Elem);

var Mrow = function() {
    Elem.apply(this, arguments);
    this.isRoot = false;
};

extend(Mrow, Elem, function(_) {
    _.insert = undefined;

    _.moveCursorLeft = function(cursor) {
        assert(cursor.parent === this);
        if (cursor.isFirstChild()) {
            if (this.isRoot)
                return;
            cursor.JQ.insertBefore(this.JQ.first());
            cursor.moveBefore(this);
        } else {
            if (cursor.prev instanceof Mrow) {
                cursor.JQ.appendTo(cursor.prev.JQ.last());
                cursor.moveBefore(cursor.prev.children);
            } else {
                cursor.JQ.insertBefore(cursor.prev.JQ.first());
                cursor.moveBefore(cursor.prev);
            }
        }
    };

    _.moveCursorRight = function(cursor) {
        assert(cursor.parent === this);
        if (cursor.isLastChild()) {
            if (this.isRoot)
                return;
            cursor.JQ.insertAfter(this.JQ.last());
            cursor.moveAfter(this);
        } else {
            if (cursor.next instanceof Mrow) {
                cursor.JQ.prependTo(cursor.next.JQ.last());
                cursor.moveAfter(cursor.next.children);
            } else {
                cursor.JQ.insertAfter(cursor.next.JQ.last());
                cursor.moveAfter(cursor.next);
            }
        }
    };

    _.delCursorLeft = function(cursor) {
        assert(cursor.parent === this);
        if (cursor.isFirstChild()) {
            if (this.isRoot)
                return;
            var self = this;
            var selfJQ = this.JQ.first();
            listEachReversed(cursor, self.children, function(e) {
                e.JQ.insertAfter(selfJQ);
                e.moveAfter(self);
                return true;
            });
            self.JQ.remove();
            self.remove();
            cursor.expandAgg(self);
        } else {
            if (cursor.prev instanceof Mrow) {
                cursor.JQ.appendTo(cursor.prev.JQ.last());
                cursor.moveBefore(cursor.prev.children);
            } else {
                var prev = cursor.prev;
                prev.JQ.remove();
                prev.remove();
                cursor.expandAgg(prev);
            }
        }
    }
});

var Msqrt = function(input, info) {
    Mrow.call(this, 'msqrt', input, info);
};

extend(Msqrt, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor);
    };

    _.insertJQ = function(cursor) {
        this.JQ = $('<span class="func-symbol-sqrt">' + this.output
                    + '</span>' + '<span class="func-sqrt"></span>');
        if (this.padding)
            this.JQ.first().css('padding', this.padding)

        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.appendTo(this.JQ.last());
    };
});

// FIXME: resize sub sup

var Msub = function(input, info) {
    Mrow.call(this, 'msub', input, info);
};

extend(Msub, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor);
    }

    _.insertJQ = function(cursor) {
        this.JQ = $('<sub class="und-holder"></sub>');
        this.JQ.css({verticalAlign: '-0.325em', fontSize: '0.72em'});

        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.appendTo(this.JQ);

        var prev = this.JQ.prev();
        if (prev.prop('tagName') === 'SUP')
            this.JQ.css('margin-left', -prev.width());
    };
});

var Msup = function(input, info) {
    Mrow.call(this, 'msup', input, info);
};

extend(Msup, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor);
    }

    _.insertJQ = function(cursor) {
        this.JQ = $('<sup class="exp-holder"></sup>');
        this.JQ.css({verticalAlign: '0.625em', fontSize: '0.72em'});

        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.appendTo(this.JQ);

        var prev = this.JQ.prev();
        if (prev.prop('tagName') === 'SUB')
            this.JQ.css('margin-left', -prev.width());
    };
});

var Msubsup = function(input, info) {
    Melem.call(this, 'msubsup', input, info);
};

extend(Msubsup, Elem, function(_) {
    _.insert = function(cursor) {
        this.sub = new Msub();
        this.sup = new Msup();

        this.addBefore(cursor);
        this.sub.addBefore(cursor);
        this.sup.addBefore(cursor);
        cursor.moveAfter(this.sub.children);

        this.insertJQ(cursor);
    }

    _.insertJQ = function(cursor) {
        this.JQ = $('<span class="func-symbol">' + this.output + '</span>');
        if (this.padding)
            this.JQ.css('padding', this.padding)
        this.JQ.css('font-size', '2em');
        this.JQ.insertBefore(cursor.JQ);

        this.sub.JQ = $('<sub class="func-sub"></sub>');
        this.JQ.insertBefore(cursor.JQ);

        this.sup.JQ = $('<sup class="func-sup"></sup>');
        this.JQ.insertBefore(cursor.JQ);

        cursor.JQ.appendTo(this.sub.JQ);
    };
});

var Munder = function(input, info) {
    Erow.call(this, 'munder', input, info);
};

extend(Munder, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor);
    }

    _.insertJQ = function(cursor) {
        this.JQ = $('<span class="func-under"></span>');
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.appendTo(this.JQ);
    };
});

var Mover = function(input, info) {
    Erow.call(this, 'msub', input, info);
};

extend(Mover, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor);
    }

    _.insertJQ = function(cursor) {
        this.JQ = $('<span class="func-over"></span>');
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.appendTo(this.JQ);
    };
});

var Munderover = function(input, info) {
    Elem.call(this, 'msub', input, info);
};

extend(Munderover, Melem, function(_) {
    _.insert = function(cursor) {
        this.under = new Munder();
        this.over = new Mover();

        this.addBefore(cursor);
        this.under.addBefore(cursor);
        this.over.addBefore(cursor);
        cursor.moveAfter(this.under.children);

        this.insertJQ(cursor);
    }

    _.insertJQ = function(cursor) {
        this.JQ = $('<span class="func-symbol">' + this.output + '</span>');
        this.JQ.css('font-size', '1.5em');
        this.JQ.insertBefore(cursor.JQ);

        this.under.JQ = $('<span class="func-under"></span>');
        this.JQ.insertBefore(cursor.JQ);

        this.over.JQ = $('<span class="func-over"></span>');
        this.JQ.insertBefore(cursor.JQ);

        cursor.JQ.appendTo(this.under.JQ);
    };
});
