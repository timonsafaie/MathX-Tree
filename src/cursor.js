var Cursor = function(root) {
    Node.call(this);
    delete this.children;
    this.aggTag = undefined;
    this.aggStart = undefined;

    this.root = root;
    this.addAfter(root.children);
    this.JQ = $('<span class="mX-cursor">&#8203;</span>');
    this.JQ.appendTo(root.JQ);
};

extend(Cursor, Node, function(_) {
    _.moveLeft = function() {
        if (this.isFirstChild()) {
            if (this.parent === this.root)
                return;
            this.JQ.insertBefore(this.parent.JQ.first());
            this.moveBefore(this.parent);
        } else {
            if (this.prev instanceof Mrow) {
                this.JQ.appendTo(this.prev.JQ.last());
                this.moveBefore(this.prev.children);
            } else {
                this.JQ.insertBefore(this.prev.JQ.first());
                this.moveBefore(this.prev);
            }
        }
    };

    _.moveRight = function() {
        if (this.isLastChild()) {
            if (this.parent === this.root)
                return;
            this.JQ.insertAfter(this.parent.JQ.last());
            this.moveAfter(this.parent);
        } else {
            if (this.next instanceof Mrow) {
                this.JQ.prependTo(this.next.JQ.last());
                this.moveAfter(this.next.children);
            } else {
                this.JQ.insertAfter(this.next.JQ.last());
                this.moveAfter(this.next);
            }
        }
    };

    _.delLeft = function() {
    };
});
