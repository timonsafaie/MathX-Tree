var fs = require('fs');
var jsdom = require('jsdom');
var mxtree = fs.readFileSync('../build/mathx-tree-test.js', 'utf-8');
jsdom.env({
    html: '<div class="mathx-tree"/>',
    src: [mxtree],
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
    done: function(err, window) {
        if (err)
            console.error(err);
        else
            console.log('Done');
    },
});
