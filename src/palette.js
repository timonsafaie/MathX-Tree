var Palette = function() {
    this.JQ = $('<div class="mathx-palette-container"></div>');
    
    this.status = false;
};

extend(Palette, Object, function(_) {
    _.show = function() {
        this.status = true;
    };
    
    _.hide = function() {
        this.status = false;
    }
    
    _.status = function(status) {
        this.status = status;
    }
});
