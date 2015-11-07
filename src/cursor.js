var Cursor = function(root) {
    Elem.call(this, 'cursor', '');
    this.root = root;
    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
    this.selection = {start: null, end: null};
    this.savedSelection = new Mrow('savedSelection');
};

var keepSelections = [
    'Left',
    'Right',
    'Tab',
    'Shift-Tab',
    'Home',
    'End',
    'Up',
    'Down',
    'Enter',
    'Click',
    'Select',
    'Ctrl-C',
    'Ctrl-X',
    'Ctrl-Esc'
];

extend(Cursor, Elem, function(_) {
    _.beforeInput = function(key) {
        var prev = this.prev;
        var next = this.next;
        if (keepSelections.indexOf(key) !== -1) {
            while (prev.selected) {
                prev.deSelect();
                prev = prev.prev;
            }
            while (next.selected) {
                next.deSelect();
                next = next.next;
            }
        }
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

    _.delSelection = function() {
        var prev = this.prev;
        var next = this.next;
        var deleted = false;
        while (prev.selected) {
            prev = prev.prev;
            prev.next.remove();
            deleted = true;
        }
        while (next.selected) {
            next = next.next;
            next.prev.remove();
            deleted = true;
        }
        if (deleted)
            this.selection = {start: null, end: null};
        return deleted;
    };

    _.delLeft = function() {
        if (this.delSelection())
            return;
        if (this.lastAgg) {
            this.expandAgg(this.lastAgg);
            delete this.lastAgg;
            return;
        }
        if (this.isFirstChild())
            return;
        var prev = this.prev;
        if (prev instanceof Mrow && !prev.selected) {
            prev.select();
            return;
        }
        prev.putCursorBefore(this);
        prev.remove();
        // Update SmartMenu
        var menu;
        var start = this.parent.firstChild();
        var search ='';
        var aggList = [];
        listEachReversed(start, this, function(e) {
            if ((e instanceof Mi) || (e instanceof Mspace)) {
                search = e.input + search;
            } else {
                start = e;
            }
            if (search.length > 2) {
                for(var aggSymbol in aggSymbols) {
                    if (aggSymbol.indexOf(search) > -1) {
                        // Add symbol to SmartMenu candidate list
                        input = search;
                        var aggNode = {
                             aggSymbol: aggSymbol,
                             props: aggSymbols[aggSymbol]
                        }
                        aggList.push(aggNode);
                    }
                }
             }
        });
        if (aggList.length > 0) {
            // Add list and display SmartMenu
            menu = new Menu(aggList, input);
            this.parent.JQ.find('.aC-container').remove();
            menu.JQ.appendTo(this.parent.JQ);
            menu.display();
        } else {
            if (this.parent.JQ.find('.aC-container'))
                   this.parent.JQ.find('.aC-container').remove();
        }
    };

    _.delRight = function() {
        if (this.delSelection())
            return;
        if (this.isLastChild())
            return;
        var next = this.next;
        if (next instanceof Mrow && !next.selected) {
            next.select();
            return;
        }
        next.putCursorBefore(this);
        next.remove();
    };

    _.inputKey = function(key) {
        this.delSelection();

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

    _.click = function($elem, pageX, pageY) {
        var mxid = $elem.attr('mxid');
        var elem = allElems[mxid];

        if (!elem.putCursorBefore(this))
            this.moveLeft();
        var leftOff = pageX - this.JQ.offset().left;

        this.moveRight();
        var rightOff = this.JQ.offset().left - pageX;
        if (leftOff < rightOff)
            this.moveLeft();
    };

    function select(sel) {
        if (!sel.start)
            return;
        listEach(sel.start, sel.end.next, function(elem) {
            elem.select();
        });
    }
    function deSelect(sel) {
        if (!sel.start)
            return;
        listEach(sel.start, sel.end.next, function(elem) {
            elem.deSelect();
        });
    }

    _.resetSelection = function() {
        deSelect(this.selection);
        this.selection = {start: null, end: null};
    };

    _.updateSelection = function(startX, startY, endX, endY) {
        var rec = {left: startX, right: endX, top: startY, bottom: endY};

        if (endX < startX) {
            rec.left = endX;
            rec.right = startX;
        }
        if (endY < startY) {
            rec.top = endY;
            rec.bottom = startY;
        }
        if (rec.right - rec.left < 3 && rec.bottom - rec.top < 3)
            return;

        this.selection = this.getSelection(rec, this.root);
        if (!this.selection.start)
            return;
        select(this.selection);

        if (startX === rec.left) {
            this.selection.end.putCursorAfter(this);
        } else {
            this.selection.start.putCursorBefore(this);
        }
    };

    function overlap(rec1, rec2) {
        return !(rec1.top > rec2.bottom || rec2.top > rec1.bottom ||
                 rec1.left > rec2.right || rec2.left > rec1.right);
    }

    _.getSelection = function(rec, node) {
        var cursor = this;
        var start = node.children.next;
        var end = node.children;
        var elems = [];

        listEach(start, end, function(elem) {
            if (elem === cursor)
                return;
            var $elem = elem.JQ;
            var offset = $elem.offset();
            var recElem = {
                left: offset.left,
                top: offset.top,
                right: offset.left + $elem.width(),
                bottom: offset.top + $elem.height()
            };
            if (overlap(rec, recElem))
                elems.push(elem);
        });

        if (elems.length === 0)
            return {start: null, end: null};

        if (elems.length > 1 || !elems[0].hasChild()) {
            if (node.cursorStay === false)
                return {start: node, end: node};
            return {start: elems[0], end: elems[elems.length-1]};
        }

        return this.getSelection(rec, elems[0]);
    };

    _.copySelection = function() {
        this.savedSelection = new Mrow('savedSelection');

        if (!this.selection.start)
            return;

        var savedSelection = this.savedSelection;
        var start = this.selection.start;
        var end = this.selection.end.next;

        listEach(start, end, function(elem) {
            var copy = elem.copy();
            copy.addBefore(savedSelection.children);
        });
    };

    _.pasteSelection = function() {
        if (!this.savedSelection.hasChild())
            return;

        var cursor = this;
        var start = this.savedSelection.children.next;
        var end = this.savedSelection.children;

        listEach(start, end, function(elem) {
            var copy = elem.copy();
            copy.addBefore(cursor);
            copy.JQ.insertBefore(cursor.JQ);
        });
    };

    _.cutSelection = function() {
        this.copySelection();
        this.delSelection();
    };

    _.reduceAgg = function() {
        var agg, input, menu;
        
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
                    if (aggSymbol.indexOf(search) > -1) {
                    //if (aggSymbol.substr(0, search.length) == search) {
                        // Add symbol to SmartMenu candidate list
                        input = search;
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
                menu = new Menu(aggList, input);
                this.parent.JQ.find('.aC-container').remove();
                menu.JQ.appendTo(this.parent.JQ);
                menu.display();
            } else {
                if (this.parent.JQ.find('.aC-container'))
                   this.parent.JQ.find('.aC-container').remove();
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
