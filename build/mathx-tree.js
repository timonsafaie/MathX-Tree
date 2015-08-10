function mathxtree(JQ) {
var __slice = [].slice;

function assert(truth, message) {
    if (!truth) {
        if (message === undefined)
            message = 'assert failed';
        throw message;
    }
}

function extend(type, base, fn) {
    type.prototype = Object.create(base.prototype);
    if (typeof fn === 'function')
        fn(type.prototype, base.prototype);
}
var List = function() {
    this.prev = undefined;
    this.next = undefined;
};

function listInitHead(node) {
    node.prev = node;
    node.next = node;
}

function _listAdd(node, prev, next) {
    next.prev = node;
    node.next = next;
    node.prev = prev;
    prev.next = node;
}

function listAddBefore(node, dest) {
    _listAdd(node, dest.prev, dest);
}

function listAddAfter(node, dest) {
    _listAdd(node, dest, dest.next);
}

function listDelNode(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
    node.next = undefined;
    node.prev = undefined;
}

/* list range is defined as [start, end) */

function listEach(start, end, fn) {
    var args = __slice.call(arguments, 3);
    if (start === end)
        return;
    for (var pos = start, next = pos.next; pos != end;
         pos = next, next = pos.next)
        if (!fn.apply(undefined, [pos].concat(args)))
            return;
}

function listEachReversed(start, end, fn) {
    var args = __slice.call(arguments, 3);
    if (start === end)
        return;
    for (var pos = end.prev, prev = pos.prev; pos != start;
         pos = prev, prev = pos.prev)
        if (!fn.apply(undefined, [pos].concat(args)))
            return;
    fn.apply(undefined, [pos].concat(args));
}

function listFold(start, end, acc, fn) {
    var args = __slice.call(arguments, 4);
    for (var pos = start; pos != end; pos = pos.next) {
        var ret = fn.apply(undefined, [pos].concat(args));
        if (!ret) break;
        acc += ret;
    }
    return acc;
}

function listIsFirst(node, head) {
    return node.prev === head;
}

function listIsLast(node, head) {
    return node.next === head;
}

var Node = function() {
    List.call(this);
    this.parent = undefined;
    this.children = new List();
    listInitHead(this.children);
    this.children.parent = this;
};

extend(Node, List, function(_) {
    _.addBefore = function(dest) {
        listAddBefore(this, dest);
        this.parent = dest.parent;
    };
    _.addAfter = function(dest) {
        listAddAfter(this, dest);
        this.parent = dest.parent;
    };
    _.remove = function() {
        listDelNode(this);
    };
    _.moveBefore = function(dest) {
        // root node has no sibling
        if (dest.parent === undefined)
            return;
        listDelNode(this);
        listAddBefore(this, dest);
        this.parent = dest.parent;
    };
    _.moveAfter = function(dest) {
        // root node has no sibling
        if (dest.parent === undefined)
            return;
        listDelNode(this);
        listAddAfter(this, dest);
        this.parent = dest.parent;
    };
    _.isFirstChild = function() {
        return listIsFirst(this, this.parent.children);
    };
    _.isLastChild = function() {
        return listIsLast(this, this.parent.children);
    };
});
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

extend(Elem, Node);

var Mrow = function() {
    Elem.call(this, 'mrow');
};

extend(Mrow, Elem);

var Mo = function(input, info) {
    Elem.call(this, 'mo', input, info);
};

extend(Mo, Elem, function(_) {
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

var Mn = function(input, info) {
    Elem.call(this, 'mn', input, info);
};

extend(Mn, Elem, function(_) {
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

extend(Mi, Elem, function(_) {
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

var Msup = function(input, info) {
    Elem.call(this, 'msup', input, info);
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
        if (this.padding)
            this.JQ.css('padding', this.padding);

        this.JQ.insertBefore(cursor.JQ);
        cursor.JQ.appendTo(this.JQ);
    };
});

var Msqrt = function(input, info) {
    Elem.call(this, 'msqrt', input, info);
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
        cursor.JQ.appendTo(this.baseJQ = this.JQ.last());
    };
});

var atomElems = [
    {input: /^[a-zA-Z]$/, Tag: Mi},
    {input: /^[0-9.]$/,   Tag: Mn},
    {input: /^[\/+-]$/,   Tag: Mo},
    {input: '^',          Tag: Msup}
];

var aggElems = {
    '+-':   {Tag: Mo,     output: '&plusmn;'},
    '-+':   {Tag: Mo,     output: '&#8723;'},
    'sqrt': {Tag: Msqrt,  output: '&radic;', padding: '0 0.18em 0 0'}
};
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
            listEachReversed(this, parent.children, function(e) {
                e.JQ.insertAfter(parentJQ);
                e.moveAfter(parent);
                return true;
            });
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
var MathInput = function() {
    this.root = new Mrow();
    this.root.JQ = $('<span class="mX-container"></span>');
    this.cursor = new Cursor(this.root);
};

extend(MathInput, Object, function(_) {
    _.input = function(key) {
        var cursor = this.cursor;
        if (this.checkControl(key) === true)
            return;
        cursor.inputKey(key);
        cursor.reduceAgg();
    };

    _.checkControl = function(key) {
        var cursor = this.cursor;
        switch (key) {
        case 'Left':
            cursor.moveLeft();
            return true;
        case 'Right':
            cursor.moveRight();
            return true;
        case 'Backspace':
            cursor.delLeft();
            return true;
        case 'Enter':
            cursor.reduceAgg();
            return true;
        default:
            return false;
        }
    };

    _.dumpTree = function() {
        var cursor = this.cursor;

        function _dump(node, level, indent) {
            var result = indent.repeat(level);

            if (node === cursor)
                return result + '<cursor/>\n';

            result += '<' + node.tag + '>';
            if (node instanceof Mrow) {
                var start = node.children.next;
                var end = node.children;
                result += listFold(start, end, '\n', _dump, level+1, indent);
                result += indent.repeat(level);
            } else {
                result += node.input;
            }
            result += '</' + node.tag + '>\n';
            return result;
        }

        return _dump(this.root, 0, '  ');
    };
});
var entry = function(JQ) {
    var input = new MathInput();

    JQ.append(input.root.JQ);
    JQ.prop('tabindex', 0);
    JQ.bind({
        keydown: onKeydown,
        keypress: onKeypress
    });

    var KEY_VALUES = {
        8: 'Backspace',
        9: 'Tab',

        10: 'Enter', // for Safari on iOS

        13: 'Enter',

        16: 'Shift',
        17: 'Control',
        18: 'Alt',
        20: 'CapsLock',

        27: 'Esc',

        32: 'Spacebar',

        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',

        37: 'Left',
        38: 'Up',
        39: 'Right',
        40: 'Down',

        45: 'Insert',

        46: 'Del',

        144: 'NumLock'
    };

    function onKeydown(e) {
        var key = KEY_VALUES[e.keyCode];
        if (key) handleKey(key, e);
    }

    function onKeypress(e) {
        var key = String.fromCharCode(e.charCode);
        handleKey(key, e);
    }

    function handleKey(key, e) {
        try {
            input.input(key);
        } catch (e) {
            console.log(e);
        }
        e.preventDefault();
    }

    return input;
};
return entry(JQ);
}
