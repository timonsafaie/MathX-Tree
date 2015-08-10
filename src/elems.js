var Elem = function(tag, input, info) {
    Node.call(this);
    this.tag = tag;
    this.input = input;
    this.output = input;
    if (info) {
        if (info.output)
            this.output = info.output;
        if (info.css)
            this.css = info.css;
    }
};

extend(Elem, Node, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="mX">' + this.output + '</span>');
        if (this.css)
            this.JQ.css(this.css);
        this.JQ.insertBefore($cursor);
    };

    _.remove = function() {
        _super.remove.call(this);
        this.removeJQ();
    };

    _.removeJQ = function() {
        this.JQ.remove();
    };

    _.putCursorBefore = function(cursor) {
        cursor.moveBefore(this);
        cursor.JQ.insertBefore(this.JQ.first());
        return this.parent.cursorStay;
    };

    _.putCursorAfter = function(cursor) {
        cursor.moveAfter(this);
        cursor.JQ.insertAfter(this.JQ.last());
        return this.parent.cursorStay;
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
    this.cursorStay = true;
};

extend(Mrow, Elem, function(_) {
    _.prependCursor = function(cursor) {
        cursor.moveAfter(this.children);
        if (cursor.isLastChild())
            this.JQ.last().prepend(cursor.JQ);
        else
            cursor.JQ.insertBefore(cursor.next.JQ.first());
        return this.cursorStay;
    };

    _.appendCursor = function(cursor) {
        cursor.moveBefore(this.children);
        if (cursor.isFirstChild())
            this.JQ.last().prepend(cursor.JQ);
        else
            cursor.JQ.insertAfter(cursor.prev.JQ.last());
        return this.cursorStay;
    };
});

var Msqrt = function(input, info) {
    Mrow.call(this, 'msqrt', input, info);
};

extend(Msqrt, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="func-symbol-sqrt">' + this.output + '</span>' +
                    '<span class="func-sqrt"><span>&#8203;</span></span>');
        if (this.css)
            this.JQ.first().css(this.css);

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.JQ.last());
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
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<sub class="und-holder"><span>&#8203;</span></sub>');
        this.JQ.css({verticalAlign: '-0.325em', fontSize: '0.72em'});

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.JQ);
    };
});

var Msup = function(input, info) {
    Mrow.call(this, 'msup', input, info);
};

extend(Msup, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<sup class="exp-holder"><span>&#8203;</span></sup>');
        this.JQ.css({verticalAlign: '0.625em', fontSize: '0.72em'});

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.JQ);
    };
});

var Msubsup = function(input, info) {
    Mrow.call(this, 'msubsup', input, info);
    this.cursorStay = false;
};

extend(Msubsup, Mrow, function(_) {
    _.insert = function(cursor) {
        this.sub = new Msub();
        this.sup = new Msup();

        this.addBefore(cursor);
        this.sub.addBefore(this.children);
        this.sup.addBefore(this.children);
        cursor.moveAfter(this.sub.children);

        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="function">' +
                    '<span class="func-symbol-subsup">' + this.output + '</span>' +
                    '<sub class="func-sub"><span>&#8203;</span></sub>' +
                    '<sup class="func-sup"><span>&#8203;</span></sup>' +
                    '</span>');
        this.sub.JQ = this.JQ.find('.func-sub');
        this.sup.JQ = this.JQ.find('.func-sup');

        var $sym = this.JQ.find('.func-symbol-subsup');
        $sym.css('font-size', '2em');
        if (this.css)
            $sym.css(this.css);

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.sub.JQ);
    };
});

var Munder = function(input, info) {
    Mrow.call(this, 'munder', input, info);
};

extend(Munder, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="func-under"><span>&#8203;</span></span>');
        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.JQ);
    };
});

var Mover = function(input, info) {
    Mrow.call(this, 'mover', input, info);
};

extend(Mover, Mrow, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor.JQ);
    }

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="func-over"><span>&#8203;</span></span>');
        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.JQ);
    };
});

var Munderover = function(input, info) {
    Mrow.call(this, 'munderover', input, info);
    this.cursorStay = false;
};

extend(Munderover, Mrow, function(_) {
    _.insert = function(cursor) {
        this.under = new Munder();
        this.over = new Mover();

        this.addBefore(cursor);
        this.under.addBefore(this.children);
        this.over.addBefore(this.children);
        cursor.moveAfter(this.under.children);

        this.insertJQ(cursor.JQ);
    }

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="function">' +
                    '<span class="func-over"><span>&#8203;</span></span>' +
                    '<span class="func-symbol">' + this.output + '</span>' +
                    '<span class="func-under"><span>&#8203;</span></span>' +
                    '</span>');
        this.under.JQ = this.JQ.find('.func-under');
        this.over.JQ = this.JQ.find('.func-over');

        var $sym = this.JQ.find('.func-symbol');
        $sym.css('font-size', '1.5em');
        if (this.css)
            $sym.css(this.css);

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.under.JQ);
    };
});
