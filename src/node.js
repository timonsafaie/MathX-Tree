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

function listDelNode(node) {
    node.next.prev = node.prev;
    node.prev.next = node.next;
    node.next = undefined;
    node.prev = undefined;
}

/* list range is defined as [start, end) */

function listEach(start, end, fn) {
    var args = __slice.call(arguments, 3);
    if (start === end)
        return;
    for (var pos = start, next = pos.next; pos != end;
         pos = next, next = pos.next)
        if (fn.apply(undefined, [pos].concat(args)) === false)
            return;
}

function listEachReversed(start, end, fn) {
    var args = __slice.call(arguments, 3);
    if (start === end)
        return;
    for (var pos = end.prev, prev = pos.prev; pos != start;
         pos = prev, prev = pos.prev)
        if (fn.apply(undefined, [pos].concat(args)) === false)
            return;
    fn.apply(undefined, [pos].concat(args));
}

function listFold(start, end, acc, fn) {
    var args = __slice.call(arguments, 4);
    for (var pos = start; pos != end; pos = pos.next) {
        var ret = fn.apply(undefined, [pos].concat(args));
        if (ret === false) break;
        acc += ret;
    }
    return acc;
}

function listFirst(head) {
    return head.next;
}

function listLast(head) {
    return head.prev;
}

function listIsFirst(node, head) {
    return node.prev === head;
}

function listIsLast(node, head) {
    return node.next === head;
}

var Node = function() {
    List.call(this);
    this.parent = undefined;
    this.children = new List();
    listInitHead(this.children);
    this.children.parent = this;
};

extend(Node, List, function(_) {
    _.addBefore = function(dest) {
        listAddBefore(this, dest);
        this.parent = dest.parent;
    };

    _.addAfter = function(dest) {
        listAddAfter(this, dest);
        this.parent = dest.parent;
    };

    _.remove = function() {
        listDelNode(this);
    };

    _.moveBefore = function(dest) {
        // root node has no sibling
        if (dest.parent === undefined)
            return;
        listDelNode(this);
        listAddBefore(this, dest);
        this.parent = dest.parent;
    };

    _.moveAfter = function(dest) {
        // root node has no sibling
        if (dest.parent === undefined)
            return;
        listDelNode(this);
        listAddAfter(this, dest);
        this.parent = dest.parent;
    };

    _.firstChild = function() {
        return listFirst(this.children);
    };

    _.lastChild = function() {
        return listLast(this.children);
    };

    _.isFirstChild = function() {
        return listIsFirst(this, this.parent.children);
    };

    _.isLastChild = function() {
        return listIsLast(this, this.parent.children);
    };

    _.isAncestor = function(node) {
        while (node) {
            if (node.parent === this)
                return true;
            node = node.parent;
        }
        return false;
    };

    _.bubble = function(fn) {
        var args = __slice.call(arguments, 1);
        for (var n = this; n; n = n.parent) {
            if (!n[fn])
                continue;
            if (n[fn].apply(n, args) === false)
                break;
        }
    };
});
