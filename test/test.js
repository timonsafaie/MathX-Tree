var fs = require('fs');
var jsdom = require('jsdom');

var jquery = fs.readFileSync('../node_modules/jquery/dist/jquery.js', 'utf-8');
var mxtree = fs.readFileSync('../build/mathx-tree.js', 'utf-8');

var mml = false;
var filename;

function print(message) {
    process.stdout.write(message);
}

function parseArgs() {
    var usage = 'Usage: iojs test.js [-m] <in-file>\n'
    var args = process.argv.slice(2);

    for (var i = 0; i < args.length; i++) {
        if (args[i] === '-m') {
            mml = true;
        } else if (args[i][0] === '-') {
            print(usage + '\n');
            process.exit(1);
        } else {
            filename = args[i];
        }
    }
    if (filename === undefined) {
        print(usage + '\n');
        process.exit(1);
    }
}

function getKeys(filename) {
    var keys = [];
    var lines = fs.readFileSync(filename, 'utf8').split('\n');
    for (var i = 0; i < lines.length; i++) {
        var key = lines[i].trim();
        if (key.length == 0)
            continue;
        keys.push(key);
    }
    return keys;
}

// from stackoverflow
function formatXml(xml, jQuery) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

parseArgs();
jsdom.env({
    html: '<div class="mathx-tree"/>',
    src: [jquery, mxtree],
    done: function(_, window) {
        var $base = window.$('.mathx-tree');
        var input = window.mathxtree($base);
        getKeys(filename).forEach(function(key) {
            input.input(key);
        });
        if (mml)
            print(input.dumpTree());
        else
            print(formatXml($base.html(), window.$));
    }
});
