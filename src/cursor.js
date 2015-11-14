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
};

extend(Cursor, Elem, function(_) {
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
        var start = this.parent.firstChild();
        var search ='';
        var target = '';
        var aggList = [];
        listEachReversed(start, this, function(e) {
            if ((e instanceof Mi) || (e instanceof Mspace)) {
                if (e.input.length == 1) 
                    search = e.input + search;
                else
                    start = e;
            } else {
                start = e;
            }
            if (search.trim().length > 2) {
                for(var aggSymbol in aggSymbols) {
                    if ((aggSymbol.indexOf(search) > -1) && (aggSymbols[aggSymbol].rank)) {
                        // Add symbol to SmartMenu candidate list
                        target = search;
                    }
                }
             }
        });
        if (target) {
            for (var aggSymbol in aggSymbols) {
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
            // Add list and display SmartMenu
            if (this.parent.JQ.find('.aC-container')) {
                this.parent.JQ.find('.aC-container').remove();
            }
            var menu = new Menu(aggList, target);
            menu.JQ.appendTo(this.parent.JQ);
            var mode = 'left';
            // Calculates how far (in %) the cursor is into the textbox
            var cursorOffset = ((this.JQ.offset().left - 
                                 this.parent.JQ.offset().left)/
                                this.parent.JQ.parent().width())*100;
            if (cursorOffset > 50) {
                mode = 'right';
            }
            menu.display(mode);
            
            // Fix location above cursor
            menu.JQ.css('top', this.JQ.offset().top-this.parent.JQ.offset().top-40);
            menu.JQ.css('left', this.JQ.offset().left-this.parent.JQ.offset().left-40);

            // Setup Clicking
            var clickedSymbol = "";
            var c = this;
            menu.JQ.find('.symbol').click(function(){
                clickedSymbol = aggSymbols[$(this).attr('title')];

                listEachReversed(start, c, function(e) {
                    e.remove();
                });

                var node = new clickedSymbol.Tag('click', clickedSymbol);
                node.insert(c);

                c.parent.JQ.find('.aC-container').remove();
            });
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
        if (!this.selection.start)
            return;

        clipBoard.reset();
        var start = this.selection.start;
        var end = this.selection.end.next;
        listEach(start, end, function(elem) {
            var copy = elem.copy();
            copy.addBefore(clipBoard.children);
        });
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
        this.copySelection();
        this.delSelection();
    };

    _.reduceAgg = function() {
        var agg, input, menu;
        
        var start = this.parent.firstChild();
        var aggTag = this.prev.tag;
        var search ='';
        var target ='';
        var aggList = [];
        listEachReversed(start, this, function(e) {
            search = e.input + search;
            if (aggSymbols.hasOwnProperty(search)) {
                agg = aggSymbols[search];
                input = search;
                start = e;
            } else if (search.length > 2) {
                for(var aggSymbol in aggSymbols)
                    if ((aggSymbol.indexOf(search) > -1) && (aggSymbols[aggSymbol].rank)) {
                        target = search;
                        start = e;
                    }
             }
        });
        
        if (!agg) {
            if (target) {
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
                /*
                // Single SmartMenu item should be autoinserted
                if (aggList.length == 1) {
                    console.log("'"+target+"'"+' length 1')
                    
                    // Agg found
                    agg = aggSymbols[aggList[0].aggSymbol];
                    input = target;
                    
                    // Convert to Agg
                    listEachReversed(start, this, function(e) {
                        e.remove();
                    });
                    
                    // Insert Agg into textbox
                    var node = new agg.Tag(input, agg);
                    node.insert(this);
                    this.lastAgg = node;
                    this.lastAgg.unsettle();
                    
                    // Hide SmartMenu
                    if (this.parent.JQ.find('.aC-container'))
                       this.parent.JQ.find('.aC-container').remove();
                } else {
                    // Add list and display SmartMenu
                    menu = new Menu(aggList, input);
                    this.parent.JQ.find('.aC-container').remove();
                    menu.JQ.appendTo(this.parent.JQ);
                    menu.display();
                    menu.printList();
                    
                    // Fix location above cursor
                    menu.JQ.css('top', this.JQ.offset().top-this.parent.JQ.offset().top-40);
                    menu.JQ.css('left', this.JQ.offset().left-this.parent.JQ.offset().left-40);
                    
                    // Setup Clicking
                    var clickedSymbol = "";
                    var c = this;
                    menu.JQ.find('.symbol').click(function(){
                        clickedSymbol = aggSymbols[$(this).attr('title')];
                        
                        listEachReversed(start, c, function(e) {
                            e.remove();
                        });
                        
                        
                        c.parent.JQ.find('.aC-container').remove();

                        var node = new clickedSymbol.Tag('click', clickedSymbol);
                        node.insert(c);
                        
                    });
                }
                */
                // Add list and display SmartMenu
                menu = new Menu(aggList, input);
                this.parent.JQ.find('.aC-container').remove();
                menu.JQ.appendTo(this.parent.JQ);
                var mode = 'left';
                // Calculates how far (in %) the cursor is into the textbox
                var cursorOffset = ((this.JQ.offset().left - 
                                     this.parent.JQ.offset().left)/
                                    this.parent.JQ.parent().width())*100;
                if (cursorOffset > 50) {
                    mode = 'right';
                }
                menu.display(mode);

                // Fix location above cursor
                menu.JQ.css('top', this.JQ.offset().top-this.parent.JQ.offset().top-40);
                menu.JQ.css('left', this.JQ.offset().left-this.parent.JQ.offset().left-40);
                /*
                console.log("cursor offset: "+this.JQ.offset().left+
                            " textbox offset: "+this.parent.JQ.offset().left+
                            " tb width: "+this.parent.JQ.parent().width());
                console.log('cursor location: '+cursorOffset+" mode: "+mode);
                */
                // Setup Clicking
                var clickedSymbol = "";
                var c = this;
                menu.JQ.find('.symbol').click(function(){
                    clickedSymbol = aggSymbols[$(this).attr('title')];

                    listEachReversed(start, c, function(e) {
                        e.remove();
                    });


                    c.parent.JQ.find('.aC-container').remove();

                    var node = new clickedSymbol.Tag('click', clickedSymbol);
                    node.insert(c);

                });
            } else {
                if (this.parent.JQ.find('.aC-container'))
                   this.parent.JQ.find('.aC-container').remove();
            }
            return;
        }
        // Hide SmartMenu
        if (this.parent.JQ.find('.aC-container')) {
            this.parent.JQ.find('.aC-container').remove();
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
        
        /*
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
        */
        
        agg.input.split('').forEach(function(c) {
            cursor.inputKey(c);
            if (first === null)
                first = cursor.prev;
        });

        if (before)
            first.putCursorBefore(this);
    };
});
