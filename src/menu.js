var Menu = function(list, searchterm) {
    this.JQ = $('<div class="aC-container">'+
                '<div class="aC-results">'+
                '<span class="search_results">'+
                '<span class="resultsholder">'+
                '<span class="namerow"></span>'+
                '<span class="resultsrow"></span>'+
                '</span></span></div></div>');
    
    // List of found items
    this.list = list;
    this.searchterm = searchterm;
};

extend(Menu, Object, function(_) {
    _.display = function() {
        var mJQ = this.JQ;
        var symbolcount = 0;
        this.sort();
        mJQ.find('.namerow').html(this.marquee(this.searchterm, this.list[0].aggSymbol));
        this.list.forEach(function(item) {
            var symbolposition = '';
            if(++symbolcount == 1)
                symbolposition = 'symbolfirst';
            mJQ.find('.resultsrow')
                .css({'width': 1000+'px', 'left': 0+'px'})
                .append('<span class="symbol '+symbolposition+
                        '" title="'+item.aggSymbol+'">'
                        +item.props.output+'</span>');
        });
        if (symbolcount > 5) {
            mJQ.find('.search_results')
                .addClass('search-left')
                .css({'width': 332+'px'})
                .attr({'data-str': this.searchterm,'data-num': 5});
            mJQ.find('.resultsholder')
                .css('width', 250+'px')
                .before('<span class="resultsnav leftnav">&#12296;</span>')
                .after('<span class="resultsnav rightnav">&#12297;</span>');
        }
        var top = -30;
        var left = 0;
        this.JQ.css({
            'display': 'block',
            'left': left+'px',
            'top': top+'px'
        });
    };

    _.hide = function() {
        this.JQ.css('display', 'none');
        this.JQ.find('.aC-results').find('span').remove();
    };
    
    _.marquee = function(search, symbol) {
        var i = symbol.indexOf(search);
        var firstpart = symbol.substr(0, i);
        var lastpart = symbol.substr(i+search.length, symbol.length-1);
        return '<span nowrap>'+firstpart+
               '<span class="resnamematch">'+search+
               '</span>'+lastpart+'</span>';
    }
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
                    if (a.props.rank > b.props.rank)
                        return 1;
                    return -1;
                }
                return 0;
            }
        });
    }
});
