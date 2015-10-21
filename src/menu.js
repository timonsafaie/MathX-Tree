var Menu = function(list) {
    this.JQ = $('<div class="aC-container">'+
                '<div class="aC-results">'+
                '<span class="search_results">'+
                '<span class="resultsholder">'+
                '<span class="namerow"></span>'+
                '<span class="resultsrow"></span>'+
                '</span></span></div></div>');
    
    // List of found items
    this.list = list;
};

extend(Menu, Object, function(_) {
    _.display = function() {
        var mJQ = this.JQ;
        this.sort();
        this.list.forEach(function(item) {
            mJQ.find('.resultsrow').append('<span class="symbol">'+item.aggSymbol+'</span>');
        });
        this.JQ.css('display', 'block');
    };

    _.hide = function() {
        this.JQ.css('display', 'none');
        this.JQ.find('.aC-results').find('span').remove();
    };
    
    _.sort = function() {
        this.list.sort(function (a, b) {
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
        });
    }
});
