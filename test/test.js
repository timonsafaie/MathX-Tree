fs = require('fs');
eval(fs.readFileSync('../src/utils.js', 'utf8'));
eval(fs.readFileSync('../src/node.js', 'utf8'));
eval(fs.readFileSync('../src/ctrls.js', 'utf8'));
eval(fs.readFileSync('../src/elems.js', 'utf8'));
eval(fs.readFileSync('../src/input.js', 'utf8'));

input = new MathInput();
lines = fs.readFileSync('equations/temp.in', 'utf8');
lines = lines.split('\n');
for (var i = 0; i < lines.length; i++) {
    var key = lines[i];
    if (key.length == 0)
        continue;
    input.input(key);
}

function dumpTree(node, level, indent) {
    var result = ''
    result += indent.repeat(level);
    result += '<' + node.tag + '>';
    if (node.text !== undefined) {
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

treeString = dumpTree(input.root, 0, '  ');
assert(treeString == fs.readFileSync('equations/temp.xml', 'utf8'));

print('OK');
