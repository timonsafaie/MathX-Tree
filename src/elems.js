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
    this.cursorStay = true;
};

extend(Mrow, Elem);

var Mo = function(input, info) {
    Elem.call(this, 'mo', input, info);
};

extend(Mo, Elem, function(_, _super) {
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
    _.remove = function(cursor) {
        cursor.JQ.insertBefore(this.JQ);
        this.JQ.remove();

        cursor.moveBefore(this);
        _super.remove.call(this);
    };
});

var Mn = function(input, info) {
    Elem.call(this, 'mn', input, info);
};

extend(Mn, Elem, function(_, _super) {
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
    _.remove = function(cursor) {
        cursor.JQ.insertBefore(this.JQ);
        this.JQ.remove();

        cursor.moveBefore(this);
        _super.remove.call(this);
    };
});

var Mi = function(input, info) {
    Elem.call(this, 'mi', input, info);
};

extend(Mi, Elem, function(_, _super) {
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
    _.remove = function(cursor) {
        cursor.JQ.insertBefore(this.JQ);
        this.JQ.remove();

        cursor.moveBefore(this);
        _super.remove.call(this);
    };
});

var Msup = function() {
    Elem.call(this, 'msup');
};

extend(Msup, Elem, function(_, _super) {
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
    _.remove = function() {
        // FIXME
        var sup = this.children.prev;
        cursor.JQ.insertBefore(sup.JQ);
        sup.JQ.remove();

        var base = this.children.next;
        base.moveBefore(this);
        cursor.moveBefore(this);
        _super.remove.call(this);
    };
});

var Msqrt = function(input, info) {
    Elem.call(this, 'msqrt', input, info);
    this.cursorStay = true;
};

extend(Msqrt, Elem, function(_, _super) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);

        this.insertJQ(cursor);
    };
    _.insertJQ = function(cursor) {
        this.JQ = $('<span class="func-symbol-sqrt">' + this.output + '</span>');
        if (this.padding)
            this.JQ.css('padding', this.padding)
        this.JQ.insertBefore(cursor.JQ);

        this.baseJQ = $('<span class="func-sqrt"></span>');
        this.baseJQ.insertBefore(cursor.JQ);
        cursor.JQ.appendTo(this.baseJQ);
    };
    _.remove = function(cursor) {
        cursor.JQ.insertBefore(this.JQ);
        this.baseJQ.remove();
        this.JQ.remove();

        cursor.moveBefore(this);
        _super.remove.call(this);
    };
});

var atomElems = [
    {input: /^[a-zA-Z]$/, Tag: Mi},
    {input: /^[0-9.]$/,   Tag: Mn},
    {input: /^[\/+-]$/,   Tag: Mo},
    {input: '^',          Tag: Msup}
];

var aggElems = [
    {input: '+-',   Tag: Mo,     output: '&plusmn;'},
    {input: '-+',   Tag: Mo,     output: '&#8723;'},
    {input: 'sqrt', Tag: Msqrt,  output: '&radic;', padding: '0 0.18em 0 0'}
];
