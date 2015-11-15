var Menu = function(list, searchTerm, start) {
    this.JQ = $('<div class="aC-container">'+
                '<div class="aC-results">'+
                '<span class="search_results">'+
                '<span class="resultsholder">'+
                '<span class="namerow"></span>'+
                '<span class="resultsrow"></span>'+
                '</span></span></div></div>');
    
    // List of found items
    this.list = list;
    this.searchterm = searchTerm;
    this.start = start;
    this.mode = '';
};

extend(Menu, Object, function(_) {
    _.setContent = function(list, searchTerm) {
        this.list = list;
        this.searchterm = searchTerm;
    };
    
    _.setStart = function(start) {
        this.start = start;
    }
    _.display = function(mode) {
        var menu = this;
        var mJQ = menu.JQ;
        var symbolcount = 0;
        var firstposition = 0;
        var search = this.searchterm;
        var maxLength = 0;
        this.mode = mode;
        this.sort();
        mJQ.find('.namerow').html(this.marquee(this.searchterm, this.list[0].aggSymbol));
        if (mode == 'left') {
            this.list.forEach(function(item) {
                var symbolposition = '';
                if (item.aggSymbol.length > maxLength)
                    maxLength = item.aggSymbol.length;
                if(++symbolcount == 1) 
                    symbolposition = 'symbolfirst list-row-hover';
                mJQ.find('.resultsrow')
                    .append('<span class="symbol '+symbolposition+
                            '" title="'+item.aggSymbol+'">'
                            +item.props.output+'</span>');
            });
            mJQ.find('.resultsrow').css({'width': 1000+'px', 'left': 0+'px'});
        } else {
            for (var j=(this.list.length-1); j >= 0; j--) {
                var item = this.list[j];
                var symbolposition = '';
                if (item.aggSymbol.length > maxLength)
                    maxLength = item.aggSymbol.length;
                if(++symbolcount == this.list.length) 
                    symbolposition = 'symbolfirst list-row-hover';
                mJQ.find('.resultsrow')
                    .append('<span class="symbol '+symbolposition+
                            '" title="'+item.aggSymbol+'">'
                            +item.props.output+'</span>');
            }
            firstposition = this.list.length-1;
        }
        maxLength *= 8;
        if (symbolcount > 5) {
            if (mode == 'right') {
                var leftOffset = (this.list.length-5)*(-50);
                mJQ.find('.resultsrow').css({'width': 1000+'px', 'left': leftOffset+'px'});
            }
            mJQ.find('.search_results')
                .addClass('search-'+mode)
                .css({'width': 332+'px'})
                .attr({'data-str': this.searchterm,'data-num': 5});
            mJQ.find('.resultsholder')
                .css('width', 250+'px')
                .before('<span class="resultsnav leftnav">&#12296;</span>')
                .after('<span class="resultsnav rightnav">&#12297;</span>');
        } else if (symbolcount <= 5) {
            var offset = 0;
            if (symbolcount == 1)
                offset = 1;
            var menuWidth = 50*(symbolcount+offset);
            if (maxLength > menuWidth)
                menuWidth = maxLength;
            mJQ.find('.search_results')
                .addClass('search-'+mode)
                .css({'width': menuWidth+'px'})
                .attr({'data-str': this.searchterm,'data-num': 5});
            mJQ.find('.resultsholder')
                .css('width', '100%');
        }
        var top = -30;
        var left = 0;
        this.JQ.css({
            'display': 'block',
            'left': left+'px',
            'top': top+'px'
        });
        // Right Nav Button
        mJQ.find(".rightnav").click(function(){
            var curr = mJQ.find('.list-row-hover');
            var left = mJQ.find('.resultsrow').css('left');
            var items = mJQ.find('.resultsrow').children();
            var marquee = '';
            var currIndex = items.index(curr);
            curr.css('color', '#FFFFFF').removeClass('list-row-hover');
            var nextIndex = (Math.floor(currIndex/5)+1)*5;
            var resetIndex = 0;
            var resetOffset = 0;
            if (mode == 'left') {
                if (nextIndex < items.length) {
                    marquee = $(items[nextIndex]).attr('title');
                    $(items[nextIndex]).css('color', '#55D7FF').addClass('list-row-hover');
                    mJQ.find('.resultsrow').animate({left: '-=250px'}, 400);
                } else {
                    nextIndex = resetIndex;
                    marquee = $(items[nextIndex]).attr('title');
                    $(items[nextIndex]).css('color', '#55D7FF').addClass('list-row-hover');
                    mJQ.find('.resultsrow').animate({left: resetOffset+'px'}, 400);
                }
            } else {
                resetIndex = ((items.length-1)%5);
                resetOffset = '+='+((Math.ceil(items.length/5)-1)*250);
                nextIndex = ((Math.floor(currIndex/5)+1)*5)+resetIndex;
                if (currIndex < items.length-5) {
                    marquee = $(items[nextIndex]).attr('title');
                    $(items[nextIndex]).css('color', '#55D7FF').addClass('list-row-hover');
                    mJQ.find('.resultsrow').animate({left: '-=250px'}, 400);
                } else {
                    nextIndex = resetIndex;
                    marquee = $(items[nextIndex]).attr('title');
                    $(items[nextIndex]).css('color', '#55D7FF').addClass('list-row-hover');
                    mJQ.find('.resultsrow').animate({left: resetOffset+'px'}, 400);
                }
            }
            mJQ.find('.namerow').html(menu.marquee(search, marquee));
        });
        // Left Nav Button
        mJQ.find(".leftnav").click(function(){
            var symbols = mJQ.find('.resultsrow').children();
            var wraparound = false;
            firstposition -= 5;
            if (firstposition < 0) {
                var symoffset = symbols.length % 5;
                if (symoffset == 0) {
                    symoffset = 5;
                }
                wraparound = true;
                firstposition = symbols.length-symoffset;
                if (mode=='right') {
                    firstposition = symbols.length-1;
                }
            }
            for (var i = 0; i < symbols.length; i++) {
                if ($(symbols[i]).hasClass("symbolfirst") ||
                    $(symbols[i]).hasClass("list-row-hover"))
                    $(symbols[i]).css('color', '#FFFFFF').removeClass("symbolfirst list-row-hover");
                if (i == firstposition) {
                    $(symbols[i]).css('color', '#55D7FF').addClass('symbolfirst list-row-hover');
                    var before = "";
                    var after = "";
                    var symbol = $(symbols[i]).attr('title');
                    var startIndex = symbol.indexOf(search);
                    before = symbol.substr(0, startIndex);
                    after = symbol.substr(before.length+search.length);
                    mJQ.find('.namerow').html('<span nowrap>'+before+
                                              '<span class="resnamematch">'+
                                              search+
                                              '</span>'+after+'</span>');
                    if (wraparound) {
                        var pages = Math.ceil(symbols.length/5);
                        mJQ.find('.resultsrow').animate({left: '-='+((pages-1)*250)+'px'}, 400);
                    } else {
                        mJQ.find('.resultsrow').animate({left: '+=250px'}, 400);
                    }
                }
            }
        });
        mJQ.find('.symbol').mouseover(function(){
           mJQ.find('.symbol').each(function() {
               $(this).css('color', '#FFFFFF').removeClass('list-row-hover');
           });
           $(this).css('color', '#55D7FF').addClass('list-row-hover');
            var before = "";
            var after = "";
            var symbol = $(this).attr('title');
            var startIndex = symbol.indexOf(search);
            before = symbol.substr(0, startIndex);
            after = symbol.substr(before.length+search.length);
            mJQ.find('.namerow').html('<span nowrap>'+before+
                                      '<span class="resnamematch">'+
                                      search+
                                      '</span>'+after+'</span>');
        });
    };
    
    _.marquee = function(search, symbol) {
        var i = symbol.indexOf(search);
        var firstpart = symbol.substr(0, i);
        var lastpart = symbol.substr(i+search.length, symbol.length-1);
        return '<span nowrap>'+firstpart+
               '<span class="resnamematch">'+search+
               '</span>'+lastpart+'</span>';
    };
    
    _.moveRight = function() {
        var curr = this.JQ.find('.list-row-hover');
        var items = this.JQ.find('.resultsrow').children();
        var marquee = '';
        curr.css('color', '#FFFFFF').removeClass('list-row-hover');
        if (this.mode == 'left') {
            var currIndex = items.index(curr);
            if (currIndex == items.length-1) {
                $(items[0]).css('color', '#55D7FF').addClass('list-row-hover');
                marquee = $(items[0]).attr('title');
            } else {
                curr.next().css('color', '#55D7FF').addClass('list-row-hover');
                marquee = curr.next().attr('title');
            }
            if (items.length > 5) {
                if (currIndex < items.length-1) {
                    if ((currIndex+1)%5 == 0) {
                    this.JQ.find('.resultsrow').animate({left: '-=250px'}, 400);
                    }
                } else {
                    this.JQ.find('.resultsrow').animate({left: '0px'}, 400);
                }
            }
        }
        if (this.mode == 'right') {
            var currIndex = items.index(curr);
            if (currIndex < items.length-1) {
                curr.next().css('color', '#55D7FF').addClass('list-row-hover');
                marquee = curr.next().attr('title');
            } else {
                $(items[0]).css('color', '#55D7FF').addClass('list-row-hover');
                marquee = $(items[0]).attr('title');
            }
            if (items.length > 5) {
                if (currIndex < items.length-1) {
                    if ((currIndex+1)%5 == items.length%5) {
                        this.JQ.find('.resultsrow').animate({left: '-=250px'}, 400);
                    }
                } else {
                    this.JQ.find('.resultsrow').animate({left: '+='+((Math.ceil(items.length/5)-1)*250)+'px'}, 400);
                }
            }
        }
        this.JQ.find('.namerow').html(this.marquee(this.searchterm, marquee));
    };
    
    _.moveLeft = function() {
        var curr = this.JQ.find('.list-row-hover');
        var items = this.JQ.find('.resultsrow').children();
        var marquee = '';
        curr.css('color', '#FFFFFF').removeClass('list-row-hover');
        if (this.mode == 'left') {
            var currIndex = items.index(curr);
            if (currIndex == 0) {
                $(items[items.length-1]).css('color', '#55D7FF').addClass('list-row-hover');
                marquee = $(items[0]).attr('title');
            } else {
                curr.prev().css('color', '#55D7FF').addClass('list-row-hover');
                marquee = curr.prev().attr('title');
            }
            if (items.length > 5) {
                if (currIndex > 0) {
                    if ((currIndex)%5 == 0) {
                    this.JQ.find('.resultsrow').animate({left: '+=250px'}, 400);
                    }
                } else {
                    this.JQ.find('.resultsrow').animate({left: '-'+(Math.ceil(items.length/5)-1)*250+'px'}, 400);
                }
            }
        }
        if (this.mode == 'right') {
            var currIndex = items.index(curr);
            if (currIndex > 0) {
                curr.prev().css('color', '#55D7FF').addClass('list-row-hover');
                marquee = curr.prev().attr('title');
            } else {
                $(items[items.length-1]).css('color', '#55D7FF').addClass('list-row-hover');
                marquee = $(items[items.length-1]).attr('title');
            }
            if (items.length > 5) {
                if (currIndex > 0) {
                    if ((currIndex)%5 == items.length%5) {
                        this.JQ.find('.resultsrow').animate({left: '+=250px'}, 400);
                    }
                } else {
                    this.JQ.find('.resultsrow').animate({left: '-='+((Math.ceil(items.length/5)-1)*250)+'px'}, 400);
                }
            }
        }
        this.JQ.find('.namerow').html(this.marquee(this.searchterm, marquee));
    };
    
    _.sort = function() {
        var search = this.searchterm;
        this.list.sort(function (a, b) {
            if (a.props.category == b.props.category) {
                if (parseInt(a.props.rank) > parseInt(b.props.rank))
                    return 1;
                return -1;
            }
            if (a.props.category > b.props.category) {
               return 1;
            }
            if (a.props.category < b.props.category) {
                return -1;
            }
        });
    };
    
    // See sorting for testing purposes
    _.printList = function() {
        for (var i = 0; i < this.list.length; i++) {
            console.log((i+1)+". "+this.list[i].aggSymbol+" "+this.list[i].props.rank+" "+this.list[i].props.category);
        }
    }
});
