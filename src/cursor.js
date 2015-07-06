var Cursor = function() {
    Node.call(this);
    delete this.children;
    this.aggTag = undefined;
    this.aggStart = undefined;
};

extend(Cursor, Node, function(_) {
    _.movePrev = function() {
        if (!this.isFirstChild()) {
            this.moveBefore(this.prev);
        } else {
            do {
                this.moveBefore(this.parent);
            } while (this.parent.cursorStay !== true);
        }
    };
    _.moveNext = function() {
        if (!this.isLastChild()) {
            this.moveAfter(this.next);
        } else {
            do {
                this.moveAfter(this.parent);
            } while (this.parent.cursorStay !== true);
        }
    };
});
