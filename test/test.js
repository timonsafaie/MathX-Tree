var fs = require('fs');

eval(fs.readFileSync('../src/utils.js', 'utf8'));
eval(fs.readFileSync('../src/node.js', 'utf8'));
eval(fs.readFileSync('../src/elems.js', 'utf8'));
eval(fs.readFileSync('../src/cursor.js', 'utf8'));
eval(fs.readFileSync('../src/control.js', 'utf8'));
eval(fs.readFileSync('../src/input.js', 'utf8'));

function print(message) {
    process.stdout.write(message);
}

function dumpTree(node, level, indent) {
    var result = ''
    result += indent.repeat(level);
    result += '<' + node.tag + '>';
    if (node === input.cursor) {
        return indent.repeat(level) + '<cursor/>\n';
    } else if (node.text !== undefined) {
        result += node.text;
    } else {
        var start = node.children.next;
        var end = node.children;
        result += listFold(start, end, '\n', dumpTree, level+1, indent);
        result += indent.repeat(level);
    }
    result += '</' + node.tag + '>\n';
    return result;
}

var filename = process.argv[2];
if (filename === undefined) {
    print('Usage: iojs test.js <in-file>\n');
    process.exit(1);
}

var input = new MathInput();
var lines = fs.readFileSync(filename, 'utf8').split('\n');
for (var i = 0; i < lines.length; i++) {
    var key = lines[i].trim();
    if (key.length == 0)
        continue;
    input.input(key);
}

var treeString = dumpTree(input.root, 0, '  ');
print(treeString);
