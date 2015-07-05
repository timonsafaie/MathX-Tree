var List = function() {
    this.prev = undefined;
    this.next = undefined;
};

function listInitHead(node) {
    node.prev = node;
    node.next = node;
}

function _listAdd(node, prev, next) {
    next.prev = node;
    node.next = next;
    node.prev = prev;
    prev.next = node;
}

function listAddBefore(node, dest) {
    _listAdd(node, dest.prev, dest);
}

function listAddAfter(node, dest) {
    _listAdd(node, dest, dest.next);
}

/* list range is defined as [start, end) */

function listDel(start, end) {
    end.prev = start.prev;
    start.prev.next = end;
}

function listDelNode(node) {
    listDel(node, node.next);
    node.next = undefined;
    node.prev = undefined;
}

function listEach(start, end, fn) {
    var args = __slice.call(arguments, 3);
    for (var pos = start; pos != end; pos = pos.next)
        fn.apply(undefined, [pos].concat(args));
}

function listFold(start, end, acc, fn) {
    var args = __slice.call(arguments, 4);
    for (var pos = start; pos != end; pos = pos.next)
        acc += fn.apply(undefined, [pos].concat(args));
    return acc;
}

function listEmpty(node) {
    return node.next === node;
}

var Node = function() {
    List.call(this);
    this.parent = undefined;
    this.children = new List();
    listInitHead(this.children);
    this.children.parent = this;
};

function treeAddBefore(node, dest) {
    listAddBefore(node, dest);
    node.parent = dest.parent;
}

function treeAddAfter(node, dest) {
    listAddAfter(node, dest);
    node.parent = dest.parent;
}

function treeMoveAfter(node, dest) {
    listDelNode(node);
    listAddAfter(node, dest);
    node.parent = dest.parent;
}
