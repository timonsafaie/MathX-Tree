var Cursor = function() {
    Node.call(this);
    delete this.children;
    this.JQ = $('<span class="cursor">&#8203;</span>');
    this.aggTag = undefined;
    this.aggStart = undefined;
};

extend(Cursor, Node, function(_) {
    _.moveLeft = function() {
        if (!this.isFirstChild()) {
            this.moveBefore(this.prev);
        } else {
            do {
                this.moveBefore(this.parent);
            } while (this.parent.cursorStay !== true);
        }
        this.JQ.insertBefore(this.next.JQ);
    };
    _.moveRight = function() {
        if (!this.isLastChild()) {
            this.moveAfter(this.next);
        } else {
            do {
                this.moveAfter(this.parent);
            } while (this.parent.cursorStay !== true);
        }
        this.JQ.insertAfter(this.prev.JQ);
    };
});
