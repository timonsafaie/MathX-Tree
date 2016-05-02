var Cursor = function(root) {
    Elem.call(this, 'cursor', '');
    this.root = root;
    var cJQ = this.JQ = $('<span class="mX-cursor">&#8203;</span>');
    this.selection = new Selection();
    this.menu = this.intervalId = null;
    this.blink = function(){ cJQ.toggleClass('blink'); };
};

extend(Cursor, Node, function(_) {
    var cancelSelectOps = [
        'moveLeft',
        'moveRight',
        'moveNextRow',
        'movePrevRow',
        'moveFirst',
        'moveLast',
        'moveUp',
        'moveDown',
        'selectAll',
        'reduceAgg',
        'undo',
    ];

    _.focus = function() {
        this.show();
        this.setBlink();
    };

    _.blur = function() {
        this.clearBlink();
        this.hide();
        this.selection.reset();
        if (this.lastAgg) {
            this.lastAgg.settle();
            delete this.lastAgg;
        }
        var menclose = this.parent.parent;
        if (menclose instanceof Menclose && !menclose.settled)
            menclose.settle();
        this.JQ.parent().find('.aC-container').remove();
    };

    _.show = function() {
        this.JQ.parent().addClass('focus');
        this.JQ.removeClass('invisible-cursor');
    };

    _.hide = function() {
        this.JQ.addClass('invisible-cursor').removeClass('blink');
        this.JQ.parent().removeClass('focus');
    };

    _.setBlink = function() {
        if ('intervalId' in this)
            clearInterval(this.intervalId);
        this.intervalId = setInterval(this.blink, 500);
    };
    
    _.clearBlink = function() {
        if ('intervalId' in this)
            clearInterval(this.intervalId);
        delete this.intervalId;
        this.JQ.removeClass('blink');
    };

    _.beforeInput = function(key) {
        this.hide();
        this.clearBlink();
        this.show();

        if (key !== 'undo')
            this.saveState();

        var prev = this.prev;
        var next = this.next;
        if (cancelSelectOps.indexOf(key) !== -1) {
            if (key === 'reduceAgg') {
                var mx = this.root;
                if (mx.JQ.find('.aC-container').children().length > 0) {
                    // Insert highlighted Symbol
                    var symbol = this.menu.JQ.find('.list-row-hover').attr('title');
                    var insert = aggSymbols[symbol];
                    
                    listEachReversed(this.menu.start, this, function(e) {
                        e.remove();
                    });
                    
                    if (mx.JQ.find('.aC-container').children().length > 0)
                        mx.JQ.find('.aC-container').remove();
                    
                    if(insert.category == "Matrix") {
                        this.menu.matrixbuilder(symbol);
                    } else {
                        var node = new insert.Tag(symbol, insert);
                        node.insert(this);
                        this.lastAgg = node;
                    }
                }
            }
            this.selection.reset();
        }

        if (this.lastAgg && key !== 'delLeft') {
            this.lastAgg.settle();
            delete this.lastAgg;
        }

        var menclose = this.parent.parent;
        if (menclose instanceof Menclose && !menclose.settled)
            this.lastMenclose = menclose;
        else
            this.lastMenclose = null;
        this.hide();
    };

    _.afterInput = function(key) {
        if (this.lastMenclose && !this.lastMenclose.isAncestor(this)) {
            this.lastMenclose.settle();
        }
        if ($(':focus').attr('class')!='mat-inp') {
            this.show();
            this.setBlink();
            this.bubble('resize');
        }
    };

    _.undo = function() {
        this.restoreState();
    };

    _.moveLeft = function() {
        var mx = this.root;
        if ($(':focus').attr('class')=='mat-inp') {
            var input = document.activeElement;
            var curpos = -1;
            if ('selectionStart' in input) {
                // Standard-compliant browsers
                curpos = input.selectionStart;
            } else if (document.selection) {
                // IE
                input.focus();
                var sel = document.selection.createRange();
                var selLen = document.selection.createRange().text.length;
                sel.moveStart('character', - input.value.length);
                curpos = sel.text.length - selLen;
            }
            if (curpos > 0) {
                var val = $(':focus').val();
                input.setSelectionRange(val.length, curpos-1);
            }
        } else if (mx.JQ.find('.aC-container').children().length > 0) {
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
        var mx = this.root;
        if ($(':focus').attr('class')=='mat-inp') {
            var input = document.activeElement;
            var curpos = -1;
            if ('selectionStart' in input) {
                // Standard-compliant browsers
                curpos = input.selectionStart;
            } else if (document.selection) {
                // IE
                input.focus();
                var sel = document.selection.createRange();
                var selLen = document.selection.createRange().text.length;
                sel.moveStart('character', - input.value.length);
                curpos = sel.text.length - selLen;
            }
            if (curpos > -1) {
                var val = $(':focus').val();
                if (curpos < val.length) {
                    input.setSelectionRange(val.length, curpos+1);
                }
            }
        } else if (mx.JQ.find('.aC-container').children().length > 0) {
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

    _.moveBegin = function() {
        var begin = this.root.firstChild();
        if (begin instanceof Elem && begin !== this)
            begin.putCursorBefore(this);
    };

    _.moveEnd = function() {
        var end = this.root.lastChild();
        if (end instanceof Elem && end !== this)
            end.putCursorAfter(this);
    };

    _.movePrevRow = function() {
        var parent = this.parent;
        var mx = this.root;
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
        var mx = this.root;
        if ($(':focus').attr('class')=='mat-inp') {
            var inps = mx.JQ.parent().find('.matrixbuilder').children();
            if(inps.length > 0) {
                if (inps.length == 2) {
                    (document.activeElement == inps[0])?
                        inps[1].focus() : inps[0].focus();
                    return;
                }
            }
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
        this.clearBlink();
        // Erase text in Smart Menu
        if ($(':focus').attr('class')=='mat-inp') {
            var input = document.activeElement;
            var curpos = -1;
            if ('selectionStart' in input) {
                // Standard-compliant browsers
                curpos = input.selectionStart;
            } else if (document.selection) {
                // IE
                input.focus();
                var sel = document.selection.createRange();
                var selLen = document.selection.createRange().text.length;
                sel.moveStart('character', - input.value.length);
                curpos = sel.text.length - selLen;
            }
            if (curpos > 0) {
                var val = $(':focus').val();
                val = val.substr(0, curpos-1)+val.substr(curpos,val.length);
                $(':focus').val(val);
                input.setSelectionRange(val.length, curpos-1);
            }
        } else { // Erase text
            this.show();
            if (this.selection.del())
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
                this.selection.setStartEnd(prev, prev);
                return;
            }

            prev.putCursorBefore(this);
            prev.remove();
            // Update SmartMenu
            var parent = this.root;
            var start = this.parent.firstChild();
            var search ='';
            var target = '';
            var aggList = [];
            // Create Matrix        
            if ($(':focus').attr('class') == 'mat-inp') {
                console.log('ENTER TO CREATE');
            }
            listEachReversed(start, this, function(e) {
                if ((e instanceof Mi) || (e instanceof Mspace)) {
                    if (e.input.length == 1) 
                        search = e.input + search;
                }
                if (search.trim().length > 2) {
                    for(var aggSymbol in aggSymbols) {
                        if ((aggSymbol.indexOf(search.trim()) > -1) &&
                            (aggSymbols[aggSymbol].rank)) {
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
                this.menu = new Menu(aggList, target, start, this, parent);
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
        }
    };

    _.delRight = function() {
        if (this.selection.del())
            return;
        if (this.isLastChild())
            return;
        var next = this.next;
        if (next instanceof Mrow && !next.selected) {
            this.selection.setStartEnd(next, next);
            return;
        }

        next.putCursorBefore(this);
        next.remove();
    };

    _.inputKey = function(key) {
        this.selection.del();

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

        if (!atom) {
            // TODO: Implement Ctrl+ and Shift+ prefixes
            throw 'Unknown input "' + key + '"';
        }
        
        if ($(':focus').attr('class')=='mat-inp') {
            var reg = new RegExp('^\\d+$');
            if (reg.test(key)) {
                var input = document.activeElement;
                var curpos = -1;
                if ('selectionStart' in input) {
                    // Standard-compliant browsers
                    curpos = input.selectionStart;
                } else if (document.selection) {
                    // IE
                    input.focus();
                    var sel = document.selection.createRange();
                    var selLen = document.selection.createRange().text.length;
                    sel.moveStart('character', - input.value.length);
                    curpos = sel.text.length - selLen;
                }
                if (curpos > -1) {
                    var val = $(':focus').val();
                    val = val.substr(0, curpos)+key+val.substr(curpos,val.length);
                    $(':focus').val(val);
                    input.setSelectionRange(val.length, curpos+1);
                }
            }
        } else {
            var node = new atom.Tag(key, atom);
            var parent = this.parent;
            if (this.parent.maxLength === 1) {
                this.delLeft();
                this.delRight();
            }
            node.insert(this);
        }
    };

    _.selectLeft = function() {
        this.selection.setStart(this);
        while (true) {
            if (this.isFirstChild() && this.parent.isRoot)
                break;
            this.moveLeft();
            if (this.selection.setEnd(this))
                break;
        }
        this.selection.update(this);
    };

    _.selectRight = function() {
        this.selection.setStart(this);
        while (true) {
            if (this.isLastChild() && this.parent.isRoot)
                break;
            this.moveRight();
            if (this.selection.setEnd(this))
                break;
        }
        this.selection.update(this);
    };

    _.reduceAgg = function() {
        var agg, input;
        
        var parent = this.root;
        var start = this.parent.firstChild();
        var aggTag = this.prev.tag;
        var search ='';
        var target ='';
        var aggList = [];
        listEachReversed(start, this, function(e) {
            if (e instanceof Mrow)
                return false;
            search = e.input + search;
            if (aggSymbols.hasOwnProperty(search.trim())) {
                agg = aggSymbols[search.trim()];
                input = search;
                if (search == search.trim())
                    start = e;
            }
            if (search.trim().length > 2) {
                for(var aggSymbol in aggSymbols)
                    if ((aggSymbol.indexOf(search.trim()) > -1) &&
                        (aggSymbols[aggSymbol].rank)) {
                        target = search;
                        if (search == search.trim())
                            start = e;
                    }
             }
        });
        if (target && target != input) {
            var trimTarget = target.trim();
            for(var aggSymbol in aggSymbols) {
                if ((aggSymbol.indexOf(trimTarget) > -1) && 
                    (aggSymbols[aggSymbol].rank)) {
                    input = target;
                    var aggNode = {
                         aggSymbol: aggSymbol,
                         props: aggSymbols[aggSymbol]
                    }
                    aggList.push(aggNode);
                }
            }
            // Add list and display SmartMenu
            this.menu = new Menu(aggList, trimTarget, start, this, parent);
            this.menu.display();
            
            // Setup Clicking
            var c = this;
            this.menu.JQ.find('.symbol').click(function(){
                c.hide();
                
                listEachReversed(start, c, function(e) {
                    e.remove();
                });
                
                var csym = $(this).attr('title');
                var cagg = aggSymbols[csym];

                if(cagg.category == "Matrix") {
                    c.menu.matrixbuilder(csym);
                } else { 
                    var node = c.menu.click(this);
                    node.insert(c);
                }
                c.selection.reset();
                c.show();
            });
            
            return;
            
        } 

        // Hide SmartMenu
        if (parent.JQ.find('.aC-container')) {
            parent.JQ.find('.aC-container').remove();
        }

        if (!agg)
            return;

        listEachReversed(start, this, function(e) {
            e.remove();
        });
        
        if(agg.category == "Matrix") {
            this.menu.matrixbuilder(input);
        } else {    
            var node = new agg.Tag(input, agg);
            node.insert(this);
            this.lastAgg = node;
            this.lastAgg.unsettle();
        }
    };

    _.expandAgg = function(agg) {
        if (agg.expand)
            return agg.expand(this);

        agg.putCursorBefore(this);
        agg.remove();

        var cursor = this;
        var first = null;

        agg.input.split('').forEach(function(c) {
            cursor.inputKey(c);
            if (first === null)
                first = cursor.prev;
        });
    };

    _.rebuildMatrix = function(rows, cols) {
        var insert = aggSymbols[this.menu.symbol];
        insert.rows = rows;
        insert.cols = cols;
        
        this.menu.closeMenu();
        
        this.root.containerJQ.focus();
        
        var node = new insert.Tag(this.menu.symbol, insert);
        node.insert(this);
        this.lastAgg = node;

        return false;
    };

    _.reduceFont = function(JQ, scale) {
        var rootSize = this.root.JQ.css('font-size').slice(0, -2);
        var origSize = JQ.css('font-size').slice(0, -2);
        if (scale)
            return rootSize * scale;
        if (origSize === rootSize)
            return rootSize * 0.72;
        return rootSize * 0.5;
    };

    _.copySelection = function() {
        this.selection.copy();
    };

    _.cutSelection = function() {
        this.selection.cut();
    };

    _.pasteSelection = function() {
        this.selection.paste(this);
    };

    _.selectAll = function() {
        var first = this.root.firstChild();
        var last = this.root.lastChild();
        this.selection.setStartEnd(first, last);
    };

    _.saveState = function() {
        var state = {}
        state.parent = this.parent;
        state.prev = this.prev;
        state.next = this.next;
        state.siblings = [];
        var cursor = this;
        this.parent.eachChild(function(elem) {
            if (elem instanceof Elem)
                state.siblings.push(elem);
        });
        this.saved = state;
    };

    _.restoreState = function() {
        if (!this.saved)
            return;

        var state = this.saved;
        this.saved = null;

        var parent = this.parent;
        while (parent !== state.parent && parent !== this.root)
            parent = parent.parent;
        parent.eachChild(function(elem) {
            elem.remove();
        });
        parent.appendCursor(this);
        var cursor = this;
        state.siblings.forEach(function(elem) {
            elem.addBefore(cursor);
            elem.JQ.insertBefore(cursor.JQ);
            elem.deSelect();
        });
        if (state.prev instanceof Elem)
            state.prev.putCursorAfter(this);
        else if (state.next instanceof Elem)
            state.next.putCursorBefore(this);
    };
});
