var Elem = function(tag, input, output) {
    Node.call(this);
    this.tag = tag;
    this.input = input;
    this.output = output;
};

extend(Elem, Node);

var Mrow = function() {
    Elem.call(this, 'mrow');
    this.cursorStay = true;
}

extend(Mrow, Elem, function(_) {
    _.html = function () {
        return listFold(this.children.next, this.children, '',
                        function(e) {return e.html();});
    };
});

var Mo = function(input, info) {
    Elem.call(this, 'mo', input, info.output);
};

extend(Mo, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
    }
    _.html = function () {
        output = this.output || this.input;
        return '<span class="mX fontnorm" style="padding: 0px 0.2em;">' + output + '</span>';
    };
});

var Mn = function(input) {
    Elem.call(this, 'mn', input);
};

extend(Mn, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
    }
    _.html = function () {
	return '<span class="mX fontnorm">' + this.input + '</span>';
    };
});

var Mi = function(input, info) {
    Elem.call(this, 'mi', input, info.output);
};

extend(Mi, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
    }
    _.html = function () {
	return '<span class="mX">' + this.input + '</span>'
    };
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
    _.html = function() {
        var base = this.children.next;
        var sup = base.next;
        return '<span class="mX" style="padding: 0px 0.1em 0px 0px;">' + base.html() + '</span>' +
            '<sup class="exp-holder" style="vertical-align: 0.625em; font-size: 0.72em;">' + sup.html() + '</sup>';
    };
});

var Msqrt = function(input, info) {
    Elem.call(this, 'msqrt', input, info.output);
    this.cursorStay = true;
};

extend(Msqrt, Elem, function(_) {
    _.insert = function(cursor) {
        this.addBefore(cursor);
        cursor.moveAfter(this.children);
    };
    _.html = function() {
        var html = '<span class="function" func="sqrt">' +
            '<span class="func-symbol func-symbol-sqrt" style="padding: 0px 0.2em 0px 0px;">' + this.output + '</span>' +
            '<span class="func-sqrt func-box func-max" order="1">';
        listEach(this.children.next, this.children, function(e) {
            html += e.html();
        });
        html += '</span></span>';
        return html;
    };
});

var atomElems = [
    {input: /^[a-zA-Z]$/, Tag: Mi},
    {input: /^[0-9.]$/,   Tag: Mn},
    {input: /^[\/+-]$/,   Tag: Mo},
    {input: '^',          Tag: Msup}
];

var aggElems = [
    {input: '+-',         Tag: Mo,     output: '&plusmn;'},
    {input: '-+',         Tag: Mo,     output: '&#8723;'},
    {input: 'sqrt',       Tag: Msqrt,  output: '&radic;'}
];
