var ClipBoard = function() {
    Mrow.call(this, 'savedSelection');
};

extend(ClipBoard, Mrow, function(_) {
    _.reset = function() {
        this.children = new List();
        listInitHead(this.children);
    };
});

var clipBoard = new ClipBoard();

var Cursor = function(root) {
    Elem.call(this, 'cursor', '');
    this.root = root;
    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
    this.selection = {start: null, end: null};
    this.menu = null;
};

extend(Cursor, Elem, function(_) {
    var cancelSelectKeys = [
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
    ];

    _.show = function() {
        this.JQ.parent().addClass('focus');
        this.JQ.removeClass('invisible-cursor');
    };

    _.hide = function() {
        this.JQ.addClass('invisible-cursor');
        this.JQ.parent().removeClass('focus');
    };

    _.beforeInput = function(key) {
        this.hide();

        var prev = this.prev;
        var next = this.next;
        if (cancelSelectKeys.indexOf(key) !== -1) {
            if (key == 'Enter') {
                var mx = this.parent;
                while (mx.JQ.attr('class') != 'mX-container') {
                    mx = mx.parent;
                }
                if (mx.JQ.find('.aC-container').children().length > 0) {
                    // Insert highlighted Symbol
                    var symbol = this.menu.JQ.find('.list-row-hover').attr('title');
                    var insert = aggSymbols[symbol];
                    
                    listEachReversed(this.menu.start, this, function(e) {
                        e.remove();
                    });
                    
                    if (mx.JQ.find('.aC-container').children().length > 0)
                        mx.JQ.find('.aC-container').remove();
                    
                    var node = new insert.Tag(symbol, insert);
                    node.insert(this);
                    
                    if(insert.category == "Matrix") {
                        this.menu.matrixbuilder(symbol);
                    }
                }
            }
            this.resetSelection();
        }

        if (this.lastAgg && key !== 'Backspace') {
            this.lastAgg.settle();
            delete this.lastAgg;
        }

        var menclose = this.parent.parent;
        if (menclose instanceof Menclose && !menclose.settled)
            this.lastMenclose = menclose;
        else
            this.lastMenclose = null;
    };

    _.afterInput = function(key) {
        if (this.lastMenclose && !this.lastMenclose.isAncestor(this))
            this.lastMenclose.settle();
        this.bubble('resize');
        this.show();
    };

    _.moveLeft = function() {
        var mx = this.parent;
        while (mx.JQ.attr('class') != 'mX-container') {
            mx = mx.parent;
        }
        if (mx.JQ.find('.aC-container').children().length > 0) {
            this.menu.moveLeft();
        } else {
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
        }
    };

    _.moveRight = function() {
        var mx = this.parent;
        while (mx.JQ.attr('class') != 'mX-container') {
            mx = mx.parent;
        }
        if (mx.JQ.find('.aC-container').children().length > 0) {
            this.menu.moveRight();
        } else {
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
        }
        
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
        var mx = parent;
        while (mx.JQ.attr('class') != 'mX-container') {
            mx = mx.parent;
        }
        if (mx.JQ.find('.aC-container').children().length > 0) {
            this.menu.moveLeft();
            return;
        }
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
        var mx = parent;
        while (mx.JQ.attr('class') != 'mX-container') {
            mx = mx.parent;
        }
        if (mx.JQ.find('.aC-container').children().length > 0) {
            this.menu.moveRight();
            return;
        }
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
        if (parent.tag === 'msub') {
            if (parent.next.tag === 'msup')
                up = parent.next;
            else if (parent.prev.tag === 'msup')
                up = parent.prev;
        }
        if (parent.tag === 'munder') {
            if (parent.next.tag === 'mover')
                up = parent.next;
            if (parent.prev.tag === 'mover')
                up = parent.prev
        }
        if (up !== null)
            up.prependCursor(this);
    };

    _.moveDown = function() {
        var parent = this.parent;
        var down = null;
        if (parent.tag === 'msup') {
            if (parent.next.tag === 'msub')
                down = parent.next;
            else if (parent.prev.tag === 'msub')
                down = parent.prev;
        }
        if (parent.tag === 'mover') {
            if (parent.next.tag === 'munder')
                down = parent.next;
            if (parent.prev.tag === 'munder')
                down = parent.prev
        }
        if (down !== null)
            down.prependCursor(this);
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
        if (prev instanceof Mrow && !prev.selected)
            return this.setSelection(prev, prev);

        prev.putCursorBefore(this);
        prev.remove();
        // Update SmartMenu
        var parent = this.parent;
        while (parent.JQ.attr('class') != 'mX-container') {
            parent = parent.parent;
        }
        var start = this.parent.firstChild();
        var search ='';
        var target = '';
        var aggList = [];
        listEachReversed(start, this, function(e) {
            if ((e instanceof Mi) || (e instanceof Mspace)) {
                if (e.input.length == 1) 
                    search = e.input + search;
            }
            if (search.trim().length > 2) {
                for(var aggSymbol in aggSymbols) {
                    if ((aggSymbol.indexOf(search.trim()) > -1) && (aggSymbols[aggSymbol].rank)) {
                        // Add symbol to SmartMenu candidate list
                        target = search;
                        if (search == search.trim())
                            start = e;
                    }
                }
             }
        });
        if (target) {
            for (var aggSymbol in aggSymbols) {
                target = target.trim();
                if ((aggSymbol.indexOf(target) > -1) && (aggSymbols[aggSymbol].rank)) {
                    var aggNode = {
                         aggSymbol: aggSymbol,
                         props: aggSymbols[aggSymbol]
                    }
                    aggList.push(aggNode);
                }
            }
        }
        if (aggList.length > 0) {
            this.menu = new Menu(aggList, target, start, parent);
            this.menu.display();
            
            
            // Setup Clicking
            var clickedSymbol = "";
            var c = this;
            this.menu.JQ.find('.symbol').click(function(){
                clickedSymbol = aggSymbols[$(this).attr('title')];

                listEachReversed(start, c, function(e) {
                    e.remove();
                });

                var node = new clickedSymbol.Tag('click', clickedSymbol);
                node.insert(c);

                parent.JQ.find('.aC-container').remove();
            });
            
        } else {
            if (parent.JQ.find('.aC-container'))
                   parent.JQ.find('.aC-container').remove();
        }
    };

    _.delRight = function() {
        if (this.delSelection())
            return;
        if (this.isLastChild())
            return;
        var next = this.next;
        if (next instanceof Mrow && !next.selected)
            return this.setSelection(next, next);

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

    _.resetSelection = function() {
        if (!this.selection.start)
            return;
        var start = this.selection.start;
        var end = this.selection.end.next;
        listEach(start, end, function(elem) {
            elem.deSelect();
        });
        this.selection = {start: null, end: null};
    };

    _.setSelection = function(start, end) {
        if (!start)
            return;
        this.selection = {start: start, end: end};
        listEach(start, end.next, function(elem) {
            elem.select();
        });
    }

    _.delSelection = function() {
        if (!this.selection.start)
            return false;
        listEach(this.selection.start, this.selection.end.next, function(elem) {
            elem.remove();
        });
        this.selection = {start: null, end: null};
        return true;
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

        this.getSelection(rec, this.root);
        if (!this.selection.start)
            return;

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
            return;

        if (elems.length > 1 || !elems[0].hasChild()) {
            if (node.cursorStay === false)
                return this.setSelection(node, node);
            return this.setSelection(elems[0], elems[elems.length-1]);
        }

        return this.getSelection(rec, elems[0]);
    };

    _.copySelection = function() {
        if (!this.selection.start)
            return;

        clipBoard.reset();
        var start = this.selection.start;
        var end = this.selection.end.next;
        listEach(start, end, function(elem) {
            var copy = elem.copy();
            copy.addBefore(clipBoard.children);
        });

        this.resetSelection();
    };

    _.pasteSelection = function() {
        if (!clipBoard.hasChild())
            return;

        var cursor = this;
        var start = clipBoard.children.next;
        var end = clipBoard.children;

        listEach(start, end, function(elem) {
            var copy = elem.copy();
            copy.addBefore(cursor);
            copy.JQ.insertBefore(cursor.JQ);
        });
    };

    _.cutSelection = function() {
        if (!this.selection.start)
            return;

        clipBoard.reset();
        var start = this.selection.start;
        var end = this.selection.end.next;
        listEach(start, end, function(elem) {
            var copy = elem.copy();
            copy.addBefore(clipBoard.children);
        });

        this.delSelection();
    };

    _.reduceAgg = function() {
        var agg, input;
        
        var parent = this.parent;
        while (parent.JQ.attr('class') != 'mX-container') {
            parent = parent.parent;
        }

        var start = this.parent.firstChild();
        var aggTag = this.prev.tag;
        var search ='';
        var target ='';
        var aggList = [];
        listEachReversed(start, this, function(e) {
            search = e.input + search;
            if (aggSymbols.hasOwnProperty(search.trim())) {
                agg = aggSymbols[search.trim()];
                input = search;
                if (search == search.trim())
                    start = e;
            }
            if (search.trim().length > 2) {
                for(var aggSymbol in aggSymbols)
                    if ((aggSymbol.indexOf(search.trim()) > -1) && (aggSymbols[aggSymbol].rank)) {
                        target = search;
                        if (search == search.trim())
                            start = e;
                    }
             }
        });
        if (target && target != input) {
            var trimTarget = target.trim();
            for(var aggSymbol in aggSymbols) {
                if ((aggSymbol.indexOf(trimTarget) > -1) && (aggSymbols[aggSymbol].rank)) {
                    input = target;
                    var aggNode = {
                         aggSymbol: aggSymbol,
                         props: aggSymbols[aggSymbol]
                    }
                    aggList.push(aggNode);
                }
            }
            // Add list and display SmartMenu
            this.menu = new Menu(aggList, trimTarget, start, parent);
            this.menu.display();
            
            // Setup Clicking
            var c = this;
            this.menu.JQ.find('.symbol').click(function(){
                c.hide();
                
                listEachReversed(start, c, function(e) {
                    e.remove();
                });
                
                var node = c.menu.click(this);
                node.insert(c);
                
                c.resetSelection();
                c.show();
            });
            
            return;
            
        } 
        
        // Hide SmartMenu
        if (parent.JQ.find('.aC-container')) {
            parent.JQ.find('.aC-container').remove();
        }
        
        
        if (!agg)
            return
        
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
        
        agg.input.split('').forEach(function(c) {
            cursor.inputKey(c);
            if (first === null)
                first = cursor.prev;
        });

        if (before)
            first.putCursorBefore(this);
    };
});
