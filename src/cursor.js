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

        var menclose = this.parent.parent;
        if (menclose instanceof Menclose && !menclose.settled)
            this.lastMenclose = menclose;
        else
            this.lastMenclose = null;
    };

    _.afterInput = function(key) {
        if (this.lastMenclose && !this.lastMenclose.isAncestor(this))
            this.lastMenclose.settle();
        this.JQ.parent().addClass('focus');
        this.bubble('resize');
    };

    _.moveLeft = function() {
        var stay;
        if (this.isFirstChild()) {
            var parent = this.parent;
            if (parent.isRoot)
                return;
            stay = parent.putCursorBefore(this);
        } else {
            var prev = this.prev;
            if (prev instanceof Mrow)
                stay = prev.appendCursor(this);
            else
                stay = prev.putCursorBefore(this);
        }
        if (!stay)
            this.moveLeft();
    };

    _.moveRight = function() {
        var stay;
        if (this.isLastChild()) {
            var parent = this.parent;
            if (parent.isRoot)
                return;
            stay = parent.putCursorAfter(this);
        } else {
            var next = this.next;
            if (next instanceof Mrow)
                stay = next.prependCursor(this);
            else
                stay = next.putCursorAfter(this);
        }
        if (!stay)
            this.moveRight();
    };

    _.moveFirst = function() {
        if (this.isFirstChild())
            return;
        var first = this.parent.firstChild();
        first.putCursorBefore(this);
    };

    _.moveLast = function() {
        if (this.isLastChild())
            return;
        var last = this.parent.lastChild();
        last.putCursorAfter(this);
    };

    _.movePrevRow = function() {
        var parent = this.parent;
        if (parent.isRoot && this.isFirstChild())
            return;
        var prev = this.prev;
        while (true) {
            this.moveLeft();
            if (this.parent != parent)
                return;
            if (this.parent.isRoot && this.isFirstChild())
                break
        }
        prev.putCursorAfter(this);
    };

    _.moveNextRow = function() {
        var parent = this.parent;
        if (parent.isRoot && this.isLastChild())
            return;
        var next = this.next;
        while (true) {
            this.moveRight();
            if (this.parent != parent)
                return;
            if (this.parent.isRoot && this.isLastChild())
                break
        }
        next.putCursorBefore(this);
    };

    _.moveUp = function() {
        var parent = this.parent;
        var up = null;
        if (parent instanceof Msub) {
            if (parent.next instanceof Msup)
                up = parent.next;
            else if (parent.prev instanceof Msup)
                up = parent.prev;
        }
        if (parent instanceof Munder) {
            if (parent.next instanceof Mover)
                up = parent.next;
            if (parent.prev instanceof Mover)
                up = parent.prev
        }
        if (up !== null)
            up.prependCursor(this);
    };

    _.moveDown = function() {
        var parent = this.parent;
        var down = null;
        if (parent instanceof Msup) {
            if (parent.next instanceof Msub)
                down = parent.next;
            else if (parent.prev instanceof Msub)
                down = parent.prev;
        }
        if (parent instanceof Mover) {
            if (parent.next instanceof Munder)
                down = parent.next;
            if (parent.prev instanceof Munder)
                down = parent.prev
        }
        if (down !== null)
            down.prependCursor(this);
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
        var search ='';
        var aggList = [];
        listEachReversed(start, this, function(e) {
            search = e.input + search;
            if (aggSymbols.hasOwnProperty(search)) {
                agg = aggSymbols[search];
                input = search;
                start = e;
            } else if (search.length > 2) {
                for(var aggSymbol in aggSymbols) {
                    if (aggSymbol.substr(0, search.length) == search) {
                        // Add symbol to SmartMenu candidate list
                        var aggNode = {
                             aggSymbol: aggSymbol,
                             props: aggSymbols[aggSymbol]
                        }
                        aggList.push(aggNode);
                    }
                }
            }
        });
        
        if (!agg) {
            if (aggList.length > 0) {
                // Add list and display SmartMenu
                console.log('unsorted: ');
                aggList.forEach(function(item) {
                    console.log(item.aggSymbol);
                });
                var menu = new Menu(aggList);
                this.parent.JQ.find('.aC-container').remove();
                menu.JQ.appendTo(this.parent.JQ);
                menu.display();
                console.log('sorted: ');
                aggList.forEach(function(item) {
                    console.log(item.aggSymbol);
                });
            }
            return;
        }

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
        var aggList = [];
        // Reengage search of the SmartMenu
        for(var aggSymbol in aggSymbols) {
            if (aggSymbol.substr(0, agg.input.length) == agg.input) {
                // Add symbol to SmartMenu candidate list
                var aggNode = {
                     aggSymbol: aggSymbol,
                     props: aggSymbols[aggSymbol]
                }
                aggList.push(aggNode);
            }
        }
        if (aggList) {
            // TODO: Display SmartMenu
            aggList.forEach(function(a) {
                console.log(a.aggSymbol);
            });
        }
        
        agg.input.split('').forEach(function(c) {
            cursor.inputKey(c);
            if (first === null)
                first = cursor.prev;
        });

        if (before)
            first.putCursorBefore(this);
    };
});
