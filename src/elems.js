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
