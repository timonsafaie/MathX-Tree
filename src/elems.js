var mo = {
    insert: function(text, cursor) {
        var node = new Node(cursor.parent);
        node.tag = 'mo';
        node.text = text;

        listAddBefore(node, cursor);
        return node;
    }
};

var mi = {
    insert: function(text, cursor) {
        var node = new Node(cursor.parent);
        node.tag = 'mi';
        node.text = text;

        listAddBefore(node, cursor);
        return node;
    }
};

var msup = {
    insert: function(text, cursor) {
        var node = new Node(cursor.parent);
        node.tag = 'msup';

        var base = cursor.prev;
        listDelNode(base);
        listAddAfter(base, node.children);
        base.parent = node;

        var mrow = new Node(node);
        listAddAfter(mrow, base);

        listAddBefore(node, cursor);
        listDelNode(cursor);
        listAddAfter(cursor, mrow.children);
        cursor.parent = mrow;
        return node;
    }
};

var msqrt = {
    insert: function(text, cursor) {
        var node = new Node(cursor.parent);
        node.tag = 'msqrt';

        var mrow = new Node(node);
        listAddAfter(mrow, node.children);

        listAddBefore(node, cursor);
        listDelNode(cursor);
        listAddAfter(cursor, mrow.children);
        cursor.parent = mrow;
        return node;
    }
};

var atomElems = [
    {input: /^[a-zA-Z]$/, tag: mi},
    {input: /^[\/+-]$/, tag: mo},
    {input: '^', tag: msup}
];

var aggElems = [
    {input: '+-', tag: mo},
    {input: '-+', tag: mo},
    {input: 'sqrt', tag: msqrt}
];
