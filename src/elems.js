elemId = 0;
allElems = {};

var Elem = function(tag, input, info) {
    Node.call(this);
    this.tag = tag;
    this.input = input;
    this.output = input;
    this.info = info;
    if (info && info.output !== undefined)
        this.output = info.output;

    this.id = elemId++;
    allElems[this.id] = this;

    this.JQ = $('<span class="mX">' + this.output + '</span>');
    if (this.info && this.info.css)
        this.JQ.css(this.info.css);
    this.JQ.attr('mxId', this.id);
};

extend(Elem, Node, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        this.JQ.insertBefore(cursor.JQ);
    };

    _.remove = function() {
        _super.remove.call(this);
        this.JQ.remove();
    };

    _.copy = function() {
        return new this.constructor(this.input, this.info);
    };

    _.putCursorBefore = function(cursor) {
        cursor.moveBefore(this);
        cursor.JQ.insertBefore(this.JQ);
        return this.parent.cursorStay;
    };

    _.putCursorAfter = function(cursor) {
        cursor.moveAfter(this);
        cursor.JQ.insertAfter(this.JQ);
        return this.parent.cursorStay;
    };

    _.unsettle = function() {
        this.settled = false;
        this.JQ.addClass('unsettled');
    };

    _.settle = function() {
        this.settled = true;
        this.JQ.removeClass('unsettled');
    };

    _.select = function() {
        this.selected = true;
        this.JQ.addClass('mx-selected');
    };

    _.deSelect = function() {
        this.selected = false;
        this.JQ.removeClass('mx-selected');
    };

    // Temporary Target Highlighting
    // inplace of SmartMenu display
    /*
    _.showMenu = function() {
        this.showMenu = true;
        this.JQ.addClass('showMenu');
    };
    
    _.hideMenu = function() {
        this.showMenu = false;
        this.JQ.removeClass('showMenu');
    };
    */
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
    this.JQ = $('<span class="mX space"></span>');
};

extend(Mspace, Elem);

var Mrow = function() {
    Elem.apply(this, arguments);
    this.cursorStay = true;
};

extend(Mrow, Elem, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.childrenJQ);
        if (this.repose)
            this.repose();
    };

    _.copy = function() {
        var copy = new this.constructor(this.input, this.info);
        var start = this.children.next;
        var end = this.children;
        listEach(start, end, function(elem) {
            var cp = elem.copy();
            cp.addBefore(copy.children);
            cp.JQ.appendTo(copy.childrenJQ);
        });
        return copy;
    };

    _.prependCursor = function(cursor) {
        cursor.moveAfter(this.children);
        if (cursor.isLastChild())
            this.JQ.prepend(cursor.JQ);
        else
            cursor.JQ.insertBefore(cursor.next.JQ);
        return this.cursorStay;
    };

    _.appendCursor = function(cursor) {
        cursor.moveBefore(this.children);
        if (cursor.isFirstChild())
            this.JQ.prepend(cursor.JQ);
        else
            cursor.JQ.insertAfter(cursor.prev.JQ);
        return this.cursorStay;
    };
});

var Msqrt = function(input, info) {
    Mrow.call(this, 'msqrt', input, info);

    this.JQ = $('<span>' +
                '<span class="func-symbol-sqrt">' + this.output + '</span>' +
                '<span class="func-sqrt"><span>&#8203;</span></span>' +
                '</span>');
    this.JQ.attr('mxId', this.id);

    var $sym = this.JQ.find('.func-symbol-sqrt');
    if (this.info.css)
        $sym.css(this.info.css);

    this.childrenJQ = this.JQ.find('.func-sqrt');
};

extend(Msqrt, Mrow);

var Msub = function(input, info) {
    Mrow.call(this, 'msub', input, info);

    this.JQ = $('<sub class="und-holder"><span>&#8203;</span></sub>');
    this.JQ.css({verticalAlign: '-0.325em', fontSize: '0.72em'});

    this.childrenJQ = this.JQ;
};

extend(Msub, Mrow, function(_, _super) {
    _.putCursorBefore = function(cursor) {
        var prev = this.prev;
        return _super.putCursorBefore.call(this, cursor) && !(prev instanceof Msup);
    };

    _.putCursorAfter = function(cursor) {
        var next = this.next;
        return _super.putCursorAfter.call(this, cursor) && !(next instanceof Msup);
    };

    _.repose = function() {
        var prev = this.prev;
        if (prev instanceof Msup)
            this.JQ.css('margin-left', -prev.JQ.width());
    };

    _.resize = function() {
        var next = this.next;
        if (next instanceof Msup)
            next.JQ.css('margin-left', -this.JQ.width());
    };
});

var Msup = function(input, info) {
    Mrow.call(this, 'msup', input, info);

    this.JQ = $('<sup class="exp-holder"><span>&#8203;</span></sup>');
    this.JQ.css({verticalAlign: '0.625em', fontSize: '0.72em'});

    this.childrenJQ = this.JQ;
};

extend(Msup, Mrow, function(_, _super) {
    _.putCursorBefore = function(cursor) {
        var prev = this.prev;
        return _super.putCursorBefore.call(this, cursor) && !(prev instanceof Msub);
    };

    _.putCursorAfter = function(cursor) {
        var next = this.next;
        return _super.putCursorAfter.call(this, cursor) && !(next instanceof Msub);
    };

    _.repose = function() {
        var prev = this.prev;
        if (prev instanceof Msub)
            this.JQ.css('margin-left', -prev.JQ.width());
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

    this.sub = new Msub();
    this.sup = new Msup();
    this.sub.addBefore(this.children);
    this.sup.addBefore(this.children);

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

    this.JQ.attr('mxId', this.id);
};

extend(Msubsup, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.sub.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.sub.JQ);
    };

    _.copy = function(cursor) {
        var copy = new Msubsup(this.input, this.info);

        var start = this.sub.children.next;
        var end = this.sub.children;
        listEach(start, end, function(elem) {
            var cp = elem.copy();
            cp.addBefore(copy.sub.children);
            cp.JQ.appendTo(copy.sub.JQ);
        });

        start = this.sup.children.next;
        end = this.sup.children;
        listEach(start, end, function(elem) {
            var cp = elem.copy();
            cp.addBefore(copy.sup.children);
            cp.JQ.appendTo(copy.sup.JQ);
        });

        return copy;
    };
});

var Munder = function(input, info) {
    Mrow.call(this, 'munder', input, info);

    this.JQ = $('<span class="munder">' +
                '<span class="munder-sym">' + this.output + '</span>' +
                '<span class="munder-row"><span>&#8203;</span></span>' +
                '<span style="display:block;width:0">&nbsp;</span>' +
                '</span>');
    var $sym = this.JQ.find('.munder-sym');
    if (this.info && this.info.css)
        $sym.css(this.info.css);

    this.JQ.attr('mxId', this.id);
    this.childrenJQ = this.JQ.find('.munder-row');
};

extend(Munder, Mrow);

var Mover = function(input, info) {
    Mrow.call(this, 'munder', input, info);

    this.JQ = $('<span class="mover">' +
                '<span class="mover-sym">' + this.output + '</span>' +
                '<span class="mover-row"><span>&#8203;</span></span>' +
                '<span style="display:block;width:0">&nbsp;</span>' +
                '</span>');
    var $sym = this.JQ.find('.mover-sym');
    if (this.info && this.info.css)
        $sym.css(this.info.css);

    this.JQ.attr('mxId', this.id);
    this.childrenJQ = this.JQ.find('.mover-row');
};

extend(Mover, Mrow);

var Munderover = function(input, info) {
    Mrow.call(this, 'munderover', input, info);
    this.cursorStay = false;

    this.under = new Munder();
    this.over = new Mover();
    this.under.addBefore(this.children);
    this.over.addBefore(this.children);

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

    this.JQ.attr('mxId', this.id);
};

extend(Munderover, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.under.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.under.JQ);
    };

    _.copy = function() {
        var copy = new Munderover(this.input, this.info);

        var start = this.under.children.next;
        var end = this.under.children;
        listEach(start, end, function(elem) {
            var cp = elem.copy();
            cp.addBefore(copy.under.children);
            cp.JQ.appendTo(copy.under.JQ);
        });

        start = this.over.children.next;
        end = this.over.children;
        listEach(start, end, function(elem) {
            var cp = elem.copy();
            cp.addBefore(copy.over.children);
            cp.JQ.appendTo(copy.over.JQ);
        });

        return copy;
    };
});

var Mfrac = function(input, info) {
    Mrow.call(this, 'mfrac', input, info);
    this.cursorStay = false;

    this.over = new Mover();
    this.under = new Munder();
    this.over.addBefore(this.children);
    this.under.addBefore(this.children);

    this.JQ = $('<span class="division">' +
                '<span class="divisor"><span>&#8203;</span></span>' +
                '<span class="dividend"><span>&#8203;</span></span>' +
                '<span style="display:block;width:0">&nbsp;</span>' +
                '</span>');
    this.over.JQ = this.JQ.find('.divisor');
    this.under.JQ = this.JQ.find('.dividend');

    this.JQ.css('font-size', '.9em');
    this.JQ.attr('mxId', this.id);
};

extend(Mfrac, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.over.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.over.JQ);

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
    };

    _.copy = function() {
        var copy = new Mfrac(this.input, this.info);

        var start = this.under.children.next;
        var end = this.under.children;
        listEach(start, end, function(elem) {
            var cp = elem.copy();
            cp.addBefore(copy.under.children);
            cp.JQ.appendTo(copy.under.JQ);
        });

        start = this.over.children.next;
        end = this.over.children;
        listEach(start, end, function(elem) {
            var cp = elem.copy();
            cp.addBefore(copy.over.children);
            cp.JQ.appendTo(copy.over.JQ);
        });

        return copy;
    };
});

var Mopen = function(input, info) {
    Elem.call(this, 'mopen', input, info);
    this.closeInfo = info.closeInfo;
};

extend(Mopen, Elem, function(_, _super) {
    _.insert = function(cursor) {
        this.menclose = new Menclose(this);
        this.menclose.insert(cursor);
    };
});

var Mclose = function(input, info) {
    Elem.call(this, 'mclose', input, info);
};

extend(Mclose, Elem, function(_, _super) {
    _.insert = function(cursor) {
        var menclose = cursor.parent.parent;
        if (cursor.isLastChild() &&
            menclose instanceof Menclose && !menclose.settled) {
            menclose.resetMclose(this);
            menclose.putCursorAfter(cursor);
        } else {
            _super.insert.call(this, cursor);
        }
    };
});

var Menclose = function(mopen) {
    Mrow.call(this, 'menclose');
    this.mopen = mopen;
    this.settled = false;
    this.cursorStay = false;
};

extend(Menclose, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        var ci = this.mopen.closeInfo;
        this.mclose = new Mclose(ci.input, ci);
        this.mrow = new Mrow('menclosed');

        this.mopen.addBefore(this.children);
        this.mrow.addBefore(this.children);
        this.mclose.addBefore(this.children);

        this.addBefore(cursor);
        cursor.moveAfter(this.mrow.children);
        this.insertJQ(cursor.JQ);
    };

    _.insertJQ = function($cursor) {
        this.JQ = $(
            '<span class="mX mopen">' + this.mopen.output + '</span>' +
            '<span class="brack-holder"></span>' +
            '<span class="mX mclose unsettled">' + this.mclose.output + '</span>'
        );
        this.mopen.JQ = this.JQ.eq(0);
        this.mrow.JQ = this.JQ.eq(1);
        this.mclose.JQ = this.JQ.eq(2);

        this.mopen.JQ.attr('mxId', this.mopen.id);
        this.mclose.JQ.attr('mxId', this.mclose.id);

        this.JQ.insertBefore($cursor);
        $cursor.prependTo(this.mrow.JQ);
    };

    _.resize = function() {
        var scale = this.mrow.JQ.outerHeight()/+this.mrow.JQ.css('fontSize').slice(0,-2);
        var transform = 'scale(1, ' + scale + ')';
        this.mopen.JQ.css({transform: transform});
        this.mclose.JQ.css({transform: transform});
    };

    _.resetMclose = function(mclose) {
        this.mclose.info = mclose.info;
        this.mclose.input = mclose.input;
        this.mclose.output = mclose.output;
        this.mclose.JQ.html(mclose.output);
        this.settle();
    };

    _.settle = function() {
        this.mclose.JQ.removeClass('unsettled');
        this.settled = true;
    };

    _.unsettle = function() {
        this.mclose.JQ.addClass('unsettled');
        this.settled = false;
    };
});
