var Menu = function(list, searchTerm) {
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
};

extend(Menu, Object, function(_) {
    _.setContent = function(list, searchTerm) {
        this.list = list;
        this.searchterm = searchTerm;
    };
    
    _.display = function() {
        var mJQ = this.JQ;
        var symbolcount = 0;
        var firstposition = 0;
        var search = this.searchterm;
        this.sort();
        mJQ.find('.namerow').html(this.marquee(this.searchterm, this.list[0].aggSymbol));
        this.list.forEach(function(item) {
            var symbolposition = '';
            if(++symbolcount == 1) 
                symbolposition = 'symbolfirst list-row-hover';
            mJQ.find('.resultsrow')
                .css({'width': 1000+'px', 'left': 0+'px'})
                .append('<span class="symbol '+symbolposition+
                        '" title="'+item.aggSymbol+'">'
                        +item.props.output+'</span>');
        });
        if (symbolcount > 5) {
            mJQ.find('.search_results')
                .addClass('search-right')
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
            mJQ.find('.search_results')
                .addClass('search-right')
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
            var symbols = mJQ.find('.resultsrow').children();
            firstposition += 5;
            if (firstposition >= symbols.length)
                firstposition = 0;
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
                    if (firstposition > 0)
                        mJQ.find('.resultsrow').animate({left: '-=250px'}, 400);
                    else {
                        var rowLeftOffset = mJQ.find('.resultsrow').css('left');
                        mJQ.find('.resultsrow').animate({left: '0px'}, 400);
                    }
                }
            }
        });
        // Left Nav Button
        mJQ.find(".leftnav").click(function(){
            var symbols = mJQ.find('.resultsrow').children();
            firstposition -= 5;
            if (firstposition < 0)
                firstposition = symbols.length-5;
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
                    if (firstposition < symbols.length-6)
                        mJQ.find('.resultsrow').animate({left: '+=250px'}, 400);
                    else {
                        var pages = Math.ceil(symbols.length/5);
                        mJQ.find('.resultsrow').animate({left: '-'+((pages-1)*250)+'px'}, 400);
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
    
    _.sort = function() {
        var search = this.searchterm;
        this.list.sort(function (a, b) {
            if (a.aggSymbol.indexOf(search) < b.aggSymbol.indexOf(search))
                return -1;
            if(a.aggSymbol.indexOf(search) > b.aggSymbol.indexOf(search))
                return 1;
            if (a.aggSymbol.indexOf(search) == b.aggSymbol.indexOf(search)) {
                if (a.props.category > b.props.category) {
                   return 1;
                }
                if (a.props.category < b.props.category) {
                    return -1;
                }
                // Same category
                if (a.props.category == b.props.category) {
                    if (parseInt(a.props.rank) > parseInt(b.props.rank))
                        return 1;
                    return -1;
                }
                return 0;
            }
        });
    };
    
    // See sorting for testing purposes
    _.printList = function() {
        for (var i = 0; i < this.list.length; i++) {
            console.log((i+1)+". "+this.list[i].aggSymbol+" "+this.list[i].props.rank);
        }
    }
});
