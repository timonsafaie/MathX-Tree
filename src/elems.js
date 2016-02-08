function elemToJSON(elem) {
    return {tag: elem.tag, input: elem.input};
}

function elemFromJSON(doc) {
    var node;
    if (doc.tag === 'cursor')
        return null;
    if (doc.input) {
        var info = findAtom(doc.input) || findAgg(doc.input);
        if (!info)
            throw new Error('invalid input ' + doc.input);
        node = new info.Tag(doc.input, info);
    } else if (doc.children) {
        node = new Mrow(doc.tag);
    } else {
        throw new Error('invalid JSON ' + doc);
    }
    if (node.loadJSON)
        node.loadJSON(doc);
    return node;
}

var elemId = 0;
var allElems = {};

var Elem = function(tag, input, info) {
    Node.call(this);
    this.tag = (tag)? tag : 'mrow';
    this.input = input;
    this.output = input;
    this.info = info;
    if (info && info.output !== undefined)
        this.output = info.output;
    this.id = elemId++;
    allElems[this.id] = this;

    this.JQ = $('<span class="mX">' + this.output + '</span>');
    this.JQ.addClass(tag);
    this.JQ.attr('data-value', input);
    if (this.info && this.info.css)
        this.JQ.css(this.info.css);
    this.JQ.attr('mxId', this.id);

    this.grouping = true;
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

    _.toJSON = function() {
        return elemToJSON(this);
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
});

var Mi = function(input, info) {
    Elem.call(this, 'mi', input, info);
};

extend(Mi, Elem);

var Mo = function(input, info) {
    Elem.call(this, 'mo', input, info);
    this.grouping = false;
};

extend(Mo, Elem);

var Mn = function(input, info) {
    Elem.call(this, 'mn', input, info);
};

extend(Mn, Elem);

var Mspace = function(input, info) {
    Elem.call(this, 'mspace', input, info);
    this.grouping = false;
};

extend(Mspace, Elem);

function copyChildren(src, dst) {
    listEach(src.children.next, src.children, function(elem) {
        var cp = elem.copy();
        cp.addBefore(dst.children);
        cp.JQ.appendTo(dst.children.JQ);
    });
}

function jsonChildren(doc, node) {
    doc.children = [];
    listEach(node.children.next, node.children, function(elem) {
        doc.children.push(elem.toJSON());
    });
}

function loadChildren(node, doc) {
    if (!doc.children)
        return;
    doc.children.forEach(function(d) {
        var n = elemFromJSON(d);
        if (!n)
            return;
        n.addBefore(node.children);
        n.JQ.appendTo(node.children.JQ);
    });
}

var Mrow = function() {
    Elem.apply(this, arguments);
    this.JQ = $('<span class="mX-container"><span>&#8203;</span></span>');
    this.children.JQ = this.JQ;
    this.cursorStay = true;
};

extend(Mrow, Elem, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.children.JQ);
    };

    _.copy = function() {
        var copy = new this.constructor(this.input, this.info);
        copyChildren(this, copy);
        return copy;
    };

    _.toJSON = function() {
        var doc = elemToJSON(this);
        jsonChildren(doc, this);
        return doc;
    };

    _.loadJSON = function(doc) {
        loadChildren(this, doc);
    };

    _.prependCursor = function(cursor) {
        cursor.moveAfter(this.children);
        if (cursor.isLastChild())
            this.children.JQ.prepend(cursor.JQ);
        else
            cursor.JQ.insertBefore(cursor.next.JQ);
        return this.cursorStay;
    };

    _.appendCursor = function(cursor) {
        cursor.moveBefore(this.children);
        if (cursor.isFirstChild())
            this.children.JQ.prepend(cursor.JQ);
        else
            cursor.JQ.insertAfter(cursor.prev.JQ);
        return this.cursorStay;
    };

    _.resize = function() {
        var first = this.firstChild();
        var last = this.lastChild();
        if (!this.hasChild() || (first === last && first instanceof Cursor))
            this.children.JQ.addClass('empty');
        else
            this.children.JQ.removeClass('empty');
    };
});

var Msqrt = function(input, info) {
    Mrow.call(this, 'msqrt', input, info);

    this.JQ = $('<span class="mX">' +
                '<span class="func-symbol-sqrt">' + this.output + '</span>' +
                '<span class="func-sqrt"><span>&#8203;</span></span>' +
                '</span>');
    this.JQ.attr('mxId', this.id);

    this.$sym = this.JQ.find('.func-symbol-sqrt');
    if (this.info.css)
        this.$sym.css(this.info.css);

    this.children.JQ = this.JQ.find('.func-sqrt');
};

extend(Msqrt, Mrow, function(_, _super) {
    _.resize = function() {
        _super.resize.call(this);
        var $t = this.children.JQ;
        var scale = $t.outerHeight()/+$t.css('font-size').slice(0, -2);
        var transform = 'scale(1,' + scale + ')';
        this.$sym.css({transform: transform});
    };
});

var Mbar = function(input, info) {
    Mrow.call(this, 'mbar', input, info);

    this.JQ = $('<span class="mX">' +
                '<span class="mbar-sym">' + this.output + '</span>' +
                '<span class="mbar-row"><span>&#8203;</span></span>' +
                '</span>');
    this.JQ.attr('mxId', this.id);

    this.$sym = this.JQ.find('.mbar-sym');
    if (this.info.css)
        this.$sym.css(this.info.css);
    if (this.info.singular)
        this.maxLength = 1;

    this.children.JQ = this.JQ.find('.mbar-row');
};

extend(Mbar, Mrow);

var Mroot = function(input, info) {
    Mrow.call(this, 'mroot', input, info);
    this.cursorStay = false;

    this.index = new Mrow();
    this.index.maxLength = 1;
    this.radicand = new Mrow();
    this.index.addBefore(this.children);
    this.radicand.addBefore(this.children);

    this.JQ = $('<span class="mX">' +
                '<sup class="root-index"><span>&#8203;</span></sup>' +
                '<span class="root-radix func-symbol-sqrt">&radic;</span>' +
                '<span class="root-radicand func-sqrt"><span>&#8203;</span></span>' +
                '</span>');
    this.index.children.JQ = this.JQ.find('.root-index');
    this.radicand.children.JQ = this.JQ.find('.root-radicand');

    this.$sym = this.JQ.find('.func-symbol-sqrt');
    if (this.info.css)
        this.$sym.css(this.info.css);

    this.JQ.attr('mxId', this.id);
};

extend(Mroot, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.index.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.index.children.JQ);
        var JQ;
        JQ = this.index.children.JQ;
        JQ.css('font-size', cursor.reduceFont(JQ, 0.5));
    };

    _.copy = function() {
        var copy = new this.constructor(this.input, this.info);
        copyChildren(this.index, copy.index);
        copyChildren(this.radicand, copy.radicand);
        return copy;
    };

    _.toJSON = function() {
        var doc = elemToJSON(this);
        doc.index = this.index.toJSON();
        doc.radicand = this.radicand.toJSON();
        return doc;
    };

    _.loadJSON = function(doc) {
        loadChildren(this.index, doc.index);
        loadChildren(this.radicand, doc.radicand);
    };

    _.resize = function() {
        var $t = this.radicand.children.JQ;
        var scale = $t.outerHeight()/+$t.css('font-size').slice(0, -2);
        var transform = 'scale(1,' + scale + ')';
        this.$sym.css({transform: transform});
    };
});

var Msub = function(input, info) {
    Mrow.call(this, 'msub', input, info);
    this.JQ = $('<span class="und-holder"><span>&#8203;</span></span>');
    this.children.JQ = this.JQ;
};

extend(Msub, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        _super.insert.call(this, cursor);
        this.children.JQ.css('font-size', cursor.reduceFont(this.children.JQ));
        this.repose();
    };

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
        if (prev instanceof Msup) {
            this.JQ.css('margin-left', -prev.JQ.width());
            prev = prev.prev;
        }
        if (prev.JQ) {
            var height = prev.JQ.outerHeight() * -0.25;
            this.JQ.css('vertical-align', height);
        }
    };

    _.resize = function() {
        _super.resize.call(this);
        var next = this.next;
        if (next instanceof Msup)
            next.JQ.css('margin-left', next.offset-this.JQ.width());
    };
});

var Msup = function(input, info) {
    Mrow.call(this, 'msup', input, info);
    this.offset = 0;
    if (info.offset)
        this.offset = em2px(info.offset);
    this.JQ = $('<span class="exp-holder"><span>&#8203;</span></span>');
    this.children.JQ = this.JQ;
};

extend(Msup, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        _super.insert.call(this, cursor);
        this.children.JQ.css('font-size', cursor.reduceFont(this.children.JQ));
        this.repose();
    };

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
        if (prev instanceof Msub) {
            this.JQ.css('margin-left', this.offset-prev.JQ.width());
            prev = prev.prev;
        }
        if (prev.JQ) {
            var height = prev.JQ.outerHeight() * 0.375;
            this.JQ.css('vertical-align', height);
        }
    };

    _.resize = function() {
        _super.resize.call(this);
        var next = this.next;
        if (next instanceof Msub)
            next.JQ.css('margin-left', -this.JQ.width());
    };
});

var Msubsup = function(input, info) {
    Mrow.call(this, 'msubsup', input, info);
    this.cursorStay = false;

    this.sub = new Msub(null);
    this.sup = new Msup(null, {offset: info.supOffset});
    this.sub.addBefore(this.children);
    this.sup.addBefore(this.children);

    this.JQ = $('<span class="function">' +
                '<span class="func-symbol-subsup">' + this.output + '</span>' +
                '<span class="func-sub"><span>&#8203;</span></span>' +
                '<span class="func-sup"><span>&#8203;</span></span>' +
                '</span>');
    this.sub.JQ = this.sub.children.JQ = this.JQ.find('.func-sub');
    this.sup.JQ = this.sup.children.JQ = this.JQ.find('.func-sup');
    if (info.subOffset)
        this.sub.JQ.css('margin-left', em2px(info.subOffset));

    var $sym = this.JQ.find('.func-symbol-subsup');
    $sym.css('font-size', '2em');
    if (this.info.css)
        $sym.css(this.info.css);

    this.JQ.attr('mxId', this.id);

    this.grouping = false;
};

extend(Msubsup, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.sub.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.sub.children.JQ);
        /*
        var JQ;
        JQ = this.sub.children.JQ;
        JQ.css('font-size', cursor.reduceFont(JQ));
        JQ = this.sup.children.JQ;
        JQ.css('font-size', cursor.reduceFont(JQ));
        */
    };

    _.copy = function() {
        var copy = new this.constructor(this.input, this.info);
        copyChildren(this.sub, copy.sub);
        copyChildren(this.sup, copy.sup);
        return copy;
    };

    _.toJSON = function() {
        var doc = elemToJSON(this);
        doc.sub = this.sub.toJSON();
        doc.sup = this.sup.toJSON();
        return doc;
    };

    _.loadJSON = function(doc) {
        loadChildren(this.sub, doc.sub);
        loadChildren(this.sup, doc.sup);
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
    this.children.JQ = this.JQ.find('.munder-row');
};

extend(Munder, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        _super.insert.call(this, cursor);
        this.children.JQ.css('font-size', cursor.reduceFont(this.children.JQ));
    };
});

var Mover = function(input, info) {
    Mrow.call(this, 'mover', input, info);

    this.JQ = $('<span class="mover">' +
                '<span class="mover-sym">' + this.output + '</span>' +
                '<span class="mover-row"><span>&#8203;</span></span>' +
                '<span style="display:block;width:0">&nbsp;</span>' +
                '</span>');
    var $sym = this.JQ.find('.mover-sym');
    if (this.info && this.info.css)
        $sym.css(this.info.css);

    this.JQ.attr('mxId', this.id);
    this.children.JQ = this.JQ.find('.mover-row');
};

extend(Mover, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        _super.insert.call(this, cursor);
        this.children.JQ.css('font-size', cursor.reduceFont(this.children.JQ));
    };
});

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
    this.under.children.JQ = this.JQ.find('.func-under');
    this.over.children.JQ = this.JQ.find('.func-over');

    var $sym = this.JQ.find('.func-symbol');
    $sym.css('font-size', '1.5em');
    if (this.info.css)
        $sym.css(this.info.css);

    this.JQ.attr('mxId', this.id);

    this.grouping = false;
};

extend(Munderover, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.under.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.under.children.JQ);
        var JQ;
        JQ = this.under.children.JQ;
        JQ.css('font-size', cursor.reduceFont(JQ));
        JQ = this.over.children.JQ;
        JQ.css('font-size', cursor.reduceFont(JQ));
    };

    _.copy = function() {
        var copy = new this.constructor(this.input, this.info);
        copyChildren(this.under, copy.under);
        copyChildren(this.over, copy.over);
        return copy;
    };

    _.toJSON = function() {
        var doc = elemToJSON(this);
        doc.under = this.under.toJSON();
        doc.over = this.over.toJSON();
        return doc;
    };

    _.loadJSON = function(doc) {
        loadChildren(this.under, doc.under);
        loadChildren(this.over, doc.over);
    };
});

var Mfrac = function(input, info) {
    Mrow.call(this, 'mfrac', input, info);
    this.cursorStay = false;

    this.over = new Mrow('mover');
    this.under = new Mrow('munder');
    this.over.addBefore(this.children);
    this.under.addBefore(this.children);

    this.JQ = $('<span class="division">' +
                '<span class="divisor"><span>&#8203;</span></span>' +
                '<span class="dividend"><span>&#8203;</span></span>' +
                '<span style="display:block;width:0">&nbsp;</span>' +
                '</span>');
    this.over.children.JQ = this.JQ.find('.divisor');
    this.under.children.JQ = this.JQ.find('.dividend');

    this.JQ.attr('mxId', this.id);
};

extend(Mfrac, Munderover, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.over.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.over.children.JQ);

        var hasNumerator = false;
        while (true) {
            var prev = this.prev;
            if (!prev.grouping)
                break;
            hasNumerator = true;
            prev.moveAfter(this.over.children);
            prev.JQ.prependTo(this.over.children.JQ);
        }
        if (hasNumerator) {
            cursor.moveAfter(this.under.children);
            cursor.JQ.prependTo(this.under.children.JQ);
        }
    };

    _.expand = function(cursor) {
        var parent = this.parent;
        this.putCursorBefore(cursor);
        this.remove();
        if (this.over.hasChild()) {
            listEach(this.over.children.next, this.over.children, function(elem) {
                elem.moveBefore(cursor);
                elem.JQ.insertBefore(cursor.JQ);
            });
        }
        cursor.inputKey('/');
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

var Menclose = function(input, info) {
    Mrow.call(this, 'mfenced', input, info);
    this.settled = false;
    this.cursorStay = false;

    this.mopen = new Elem('mopen', input, info);
    this.mclose = new Mclose(info.closeInfo.input, info.closeInfo);
    this.menclosed = new Mrow('mrow');

    this.mopen.addBefore(this.children);
    this.menclosed.addBefore(this.children);
    this.mclose.addBefore(this.children);

    this.JQ = $('<span class="brack-holder">' +
                '<span class="mX mopen">' + this.mopen.output + '</span>' +
                '<span class="brack-holder menclosed"><span>&#8203;</span></span>' +
                '<span class="mX mclose unsettled">' + this.mclose.output + '</span>' +
                '</span>');
    this.mopen.JQ = this.JQ.find('.mopen');
    this.menclosed.children.JQ = this.JQ.find('.menclosed');
    this.mclose.JQ = this.JQ.find('.mclose');

    this.mopen.JQ.attr('mxId', this.mopen.id);
    this.mclose.JQ.attr('mxId', this.mclose.id);
};

extend(Menclose, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.menclosed.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(this.menclosed.children.JQ);
    };

    _.copy = function() {
        var copy = new this.constructor(this.input, this.info);
        copy.resetMclose(this.mclose);
        copyChildren(this.menclosed, copy.menclosed);
        return copy;
    };

    _.toJSON = function() {
        var doc = elemToJSON(this);
        doc.menclosed = this.menclosed.toJSON();
        doc.mopen = this.mopen.toJSON();
        doc.mclose = this.mclose.toJSON();
        return doc;
    };

    _.loadJSON = function(doc) {
        var mclose = elemFromJSON(doc.mclose);
        this.resetMclose(mclose);
        loadChildren(this.menclosed, doc.menclosed);
    };

    _.resize = function() {
        var $t = this.menclosed.children.JQ;
        var h = $t.outerHeight()/+$t.css('font-size').slice(0,-2);
        var hscale = min(1+0.2*(h-1), 1.2);
        var vscale = 1.05 * h;
        var transform = 'scale(' + hscale + ',' + vscale + ')';
        this.mopen.JQ.css({transform: transform});
        this.mclose.JQ.css({transform: transform});

        var next = this.next;
        if (next instanceof Msup) {
            next.repose();
            next = next.next;
            if (next instanceof Msub)
                next.repose();
        } else if (next instanceof Msub) {
            next.repose();
            next = next.next;
            if (next instanceof Msup)
                next.repose();
        }
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

var Mmatrix = function(input, info) {
    Mrow.call(this, 'mmatrix', input, info);
    this.cursorStay = false;

    this.mopen = new Elem('mopen', info.open, info);
    this.mcontent = new Mrow('mrow');
    this.mcontent.cursorStay = false;
    this.mclose = new Elem('mclose', info.close, info);

    this.mopen.addBefore(this.children);
    this.mcontent.addBefore(this.children);
    this.mclose.addBefore(this.children);

    this.rows = info.rows;
    this.cols = info.cols;

    var html = [
        '<span class="func-holder">',
        '<span class="function">',
        '<span class="mat-symbol mopen">' + info.open + '</span>',
        '<span class="matcontents" cellspacing="4">'
    ];
    for (var i = 0; i < this.rows; i++) {
        var row = new Mrow('mrow')
        row.cursorStay = false;
        row.addBefore(this.mcontent.children);
        html.push('<span class="mat-col">');
        for (var j = 0; j < this.cols; j++) {
            var elem = new Mrow('mrow')
            elem.addBefore(row.children);
            html.push('<span class="func-box mat-box"><span class="arginput mX"></span></span>');
        }
        html.push('</span>');
    }
    html = html.concat([
        '</span>',
        '<span class="mat-symbol mclose">' + info.close + '</span>',
        '</span>',
        '</span>'
    ]);
    this.JQ = $(html.join(''));

    this.mopen.JQ = this.JQ.find('.mopen');
    this.mcontent.children.JQ = this.JQ.find('.matcontents');
    this.mclose.JQ = this.JQ.find('.mclose');

    var i = 0;
    var $content = this.mcontent.children.JQ;
    this.mcontent.eachChild(function(row) {
        row.eachChild(function(elem) {
            elem.JQ = $content.find('.mat-box').eq(i++);
            elem.children.JQ = elem.JQ.find('.mX');
        });
    });
};

extend(Mmatrix, Mrow, function(_, _super) {
    _.insert = function(cursor) {
        var firstElem = this.mcontent.firstChild().firstChild();
        this.addBefore(cursor);
        cursor.moveAfter(firstElem.children);
        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.prependTo(firstElem.children.JQ);
    };

    _.resize = function() {
        var $t = this.mcontent.children.JQ;
        var h = $t.outerHeight()/+$t.css('font-size').slice(0,-2);
        var hscale = min(1+0.2*(h-1), 1.2);
        var vscale = 1.0 * h;
        var transform = 'scale(' + hscale + ',' + vscale + ')';
        this.mopen.JQ.css({transform: transform});
        this.mclose.JQ.css({transform: transform});
    };
});
