var Elem = function(tag, text) {
    Node.call(this);
    this.tag = tag;
    this.text = text;
};

extend(Elem, Node);

var Mrow = function() {
    Elem.call(this, 'mrow');
    this.cursorStay = true;
}

extend(Mrow, Elem);

var Mo = function(text) {
    Elem.call(this, 'mo', text);
};

extend(Mo, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
    }
});

var Mn = function(text) {
    Elem.call(this, 'mn', text);
};

extend(Mn, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
    }
});

var Mi = function(text) {
    Elem.call(this, 'mi', text);
};

extend(Mi, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
    }
});

var Msup = function() {
    Elem.call(this, 'msup');
};

extend(Msup, Elem, function(_) {
    _.insert = function(cursor) {
        var base = cursor.prev;
        base.moveAfter(this.children);

        var mrow = new Mrow()
        mrow.addAfter(base);

        this.addBefore(cursor);
        cursor.moveAfter(mrow.children);
    }
});

var Msqrt = function() {
    Elem.call(this, 'msqrt');
    this.cursorStay = true;
};

extend(Msqrt, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
    }
});

var atomElems = [
    {input: /^[a-zA-Z]$/, Tag: Mi},
    {input: /^[0-9.]$/,   Tag: Mn},
    {input: /^[\/+-]$/,   Tag: Mo},
    {input: '^',          Tag: Msup}
];

var aggElems = [
    {input: '+-',         Tag: Mo},
    {input: '-+',         Tag: Mo},
    {input: 'sqrt',       Tag: Msqrt}
];
