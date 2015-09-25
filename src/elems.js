var Elem = function(tag, input, info) {
    Node.call(this);
    this.tag = tag;
    this.input = input;
    this.output = input;
    this.info = info;
    if (info && info.output !== undefined)
        this.output = info.output;
};

extend(Elem, Node, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="mX">' + this.output + '</span>');
        if (this.info.css)
            this.JQ.css(this.info.css);
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

    _.unsettle = function() {
        this.unsettled = true;
        this.JQ.addClass('unsettled');
    };

    _.settle = function() {
        this.unsettled = false;
        this.JQ.removeClass('unsettled');
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

var Mspace = function(input, info) {
    Elem.call(this, 'mspace', input, info);
};

extend(Mspace, Elem, function(_, _super) {
    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="mX space"></span>');
        this.JQ.insertBefore($cursor);
    };
});

var Mrow = function() {
    Elem.apply(this, arguments);
    this.cursorStay = true;
};

extend(Mrow, Elem, function(_, _super) {
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

    _.highlight = function() {
        this.highlighted = true;
        this.JQ.addClass('highlight');
    };

    _.deHighlight = function() {
        this.highlighted = false;
        this.JQ.removeClass('highlight');
    };
});

var Msqrt = function(input, info) {
    Mrow.call(this, 'msqrt', input, info);
};

extend(Msqrt, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="func-symbol-sqrt">' + this.output + '</span>' +
                    '<span class="func-sqrt"><span>&#8203;</span></span>');
        if (this.info.css)
            this.JQ.first().css(this.info.css);

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.JQ.last());
    };
});

var Msub = function(input, info) {
    Mrow.call(this, 'msub', input, info);
};

extend(Msub, Mrow, function(_, _super) {
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

        var prev = this.prev;
        if (prev instanceof Msup)
            this.JQ.css('margin-left', -prev.JQ.width());
    };

    _.putCursorBefore = function(cursor) {
        var prev = this.prev;
        return _super.putCursorBefore.call(this, cursor) && !(prev instanceof Msup);
    };

    _.putCursorAfter = function(cursor) {
        var next = this.next;
        return _super.putCursorAfter.call(this, cursor) && !(next instanceof Msup);
    };

    _.resize = function() {
        var next = this.next;
        if (next instanceof Msup)
            next.JQ.css('margin-left', -this.JQ.width());
    };
});

var Msup = function(input, info) {
    Mrow.call(this, 'msup', input, info);
};

extend(Msup, Mrow, function(_, _super) {
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

        var prev = this.prev;
        if (prev instanceof Msub)
            this.JQ.css('margin-left', -prev.JQ.width());
    };

    _.putCursorBefore = function(cursor) {
        var prev = this.prev;
        return _super.putCursorBefore.call(this, cursor) && !(prev instanceof Msub);
    };

    _.putCursorAfter = function(cursor) {
        var next = this.next;
        return _super.putCursorAfter.call(this, cursor) && !(next instanceof Msub);
    };

    _.resize = function() {
        var next = this.next;
        if (next instanceof Msub)
            next.JQ.css('margin-left', -this.JQ.width());
    };
});

var Msubsup = function(input, info) {
    Mrow.call(this, 'msubsup', input, info);
    this.cursorStay = false;
};

extend(Msubsup, Mrow, function(_, _super) {
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
        if (this.info.css)
            $sym.css(this.info.css);

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.sub.JQ);
    };
});

var Munder = function(input, info) {
    Mrow.call(this, 'munder', input, info);
};

extend(Munder, Mrow, function(_, _super) {
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

    _.putCursorBefore = function(cursor) {
        var prev = this.prev;
        return _super.putCursorBefore.call(this, cursor) && !(prev instanceof Mover);
    };

    _.putCursorAfter = function(cursor) {
        var next = this.next;
        return _super.putCursorAfter.call(this, cursor) && !(next instanceof Mover);
    };
});

var Mover = function(input, info) {
    Mrow.call(this, 'mover', input, info);
};

extend(Mover, Mrow, function(_, _super) {
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

    _.putCursorBefore = function(cursor) {
        var prev = this.prev;
        return _super.putCursorBefore.call(this, cursor) && !(prev instanceof Munder);
    };

    _.putCursorAfter = function(cursor) {
        var next = this.next;
        return _super.putCursorAfter.call(this, cursor) && !(next instanceof Munder);
    };
});

var Munderover = function(input, info) {
    Mrow.call(this, 'munderover', input, info);
    this.cursorStay = false;
};

extend(Munderover, Mrow, function(_, _super) {
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
        if (this.info.css)
            $sym.css(this.info.css);

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.under.JQ);
    };
});

var Mfrac = function(input, info) {
    Mrow.call(this, 'mfrac', input, info);
    this.cursorStay = false;
};

extend(Mfrac, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.over = new Mover();
        this.under = new Munder();

        this.addBefore(cursor);
        this.over.addBefore(this.children);
        this.under.addBefore(this.children);
        cursor.moveAfter(this.over.children);

        this.insertJQ(cursor.JQ);

        var hasDivisor = false;
        while (true) {
            var prev = this.prev;
            if (!(prev instanceof Mi || prev instanceof Mn || prev instanceof Mfrac))
                break;
            hasDivisor = true;
            prev.moveAfter(this.over.children);
            prev.JQ.prependTo(this.over.JQ);
        }
        if (hasDivisor) {
            cursor.moveAfter(this.under.children);
            cursor.JQ.prependTo(this.under.JQ);
        }
    }

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="division">' +
                    '<span class="divisor"><span>&#8203;</span></span>' +
                    '<span class="dividend"><span>&#8203;</span></span>' +
                    '<span style="display:block;width:0">&nbsp;</span>' +
                    '</span>');
        this.over.JQ = this.JQ.find('.divisor');
        this.under.JQ = this.JQ.find('.dividend');

        this.JQ.css('font-size', '.9em');

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.over.JQ);
    };
});

var Mopen = function(input, info) {
    Elem.call(this, 'mopen', input, info);
};

extend(Mopen, Elem, function(_, _super) {
    _.insert = function(cursor) {
        _super.insert.call(this, cursor);

        var start = cursor.next;
        var end = cursor.parent.children;

        var menclose = new Menclose();
        menclose.insert(cursor);
        listEach(start, end, function(e) {
            if (e instanceof Mclose)
                return false;
            menclose.append(e);
        });
        menclose.resize();
    };

    _.putCursorAfter = function(cursor) {
        _super.putCursorAfter.call(this, cursor);
        return false;
    };
});

var Mclose = function(input, info) {
    Elem.call(this, 'mclose', input, info);
};

extend(Mclose, Elem, function(_, _super) {
    _.insert = function(cursor) {
        if (!(cursor.parent instanceof Menclose)) {
            _super.insert.call(this, cursor);
            return;
        }

        var menclose = cursor.parent;
        menclose.putCursorAfter(cursor);
        _super.insert.call(this, cursor);
        menclose.resize();
    };

    _.putCursorBefore = function(cursor) {
        _super.putCursorBefore.call(this, cursor);
        return false;
    };
});

var Menclose = function() {
    Mrow.call(this, 'menclose');
};

extend(Menclose, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $('<span class="brack-holder"></span>');
        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.JQ);
    };

    _.append = function(elem) {
        elem.moveBefore(this.children);
        elem.JQ.appendTo(this.JQ);
    };

    _.putCursorAfter = function(cursor) {
        _super.putCursorAfter.call(this, cursor);
        return false;
    };

    _.putCursorBefore = function(cursor) {
        _super.putCursorBefore.call(this, cursor);
        return false;
    };

    _.resize = function() {
        var scale = this.JQ.outerHeight()/+this.JQ.css('fontSize').slice(0,-2);
        var transform = 'scale(1, ' + scale + ')';
        if (this.prev instanceof Mopen)
            this.prev.JQ.css({transform: transform});
        if (this.next instanceof Mclose)
            this.next.JQ.css({transform: transform});
    };
});
