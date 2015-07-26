var Cursor = function() {
    Node.call(this);
    delete this.children;
    this.aggTag = undefined;
    this.aggStart = undefined;
};

extend(Cursor, Node, function(_) {
    _.html = function () {
        return '<span class="cursor">&#8203;</span>';
    };
    _.moveLeft = function() {
        if (!this.isFirstChild()) {
            this.moveBefore(this.prev);
        } else {
            do {
                this.moveBefore(this.parent);
            } while (this.parent.cursorStay !== true);
        }
    };
    _.moveRight = function() {
        if (!this.isLastChild()) {
            this.moveAfter(this.next);
        } else {
            do {
                this.moveAfter(this.parent);
            } while (this.parent.cursorStay !== true);
        }
    };
});
