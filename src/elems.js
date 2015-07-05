var Elem = function(tag, text) {
    Node.call(this);
    this.tag = tag;
    this.text = text;
};

var mo = {
    insert: function(text, cursor) {
        var node = new Elem('mo', text);
        treeAddBefore(node, cursor);
        return node;
    }
};

var mn = {
    insert: function(text, cursor) {
        var node = new Elem('mn', text);
        treeAddBefore(node, cursor);
        return node;
    }
};

var mi = {
    insert: function(text, cursor) {
        var node = new Elem('mi', text);
        treeAddBefore(node, cursor);
        return node;
    }
};

var msup = {
    insert: function(text, cursor) {
        var node = new Elem('msup');

        var base = cursor.prev;
        treeMoveAfter(base, node.children);

        var mrow = new Elem('mrow');
        treeAddAfter(mrow, base);

        treeAddBefore(node, cursor);
        treeMoveAfter(cursor, mrow.children);

        return node;
    }
};

var msqrt = {
    insert: function(text, cursor) {
        var node = new Elem('msqrt');

        var mrow = new Elem('mrow');
        treeAddAfter(mrow, node.children);

        treeAddBefore(node, cursor);
        treeMoveAfter(cursor, mrow.children);

        return node;
    }
};

var atomElems = [
    {input: /^[a-zA-Z]$/, tag: mi},
    {input: /^[0-9]$/,    tag: mn},
    {input: /^[\/+-]$/,   tag: mo},
    {input: '^',          tag: msup}
];

var aggElems = [
    {input: '+-', tag: mo},
    {input: '-+', tag: mo},
    {input: 'sqrt', tag: msqrt}
];
