fs = require('fs');
eval(fs.readFileSync('../src/utils.js', 'utf8'));
eval(fs.readFileSync('../src/node.js', 'utf8'));
eval(fs.readFileSync('../src/ctrls.js', 'utf8'));
eval(fs.readFileSync('../src/elems.js', 'utf8'));
eval(fs.readFileSync('../src/input.js', 'utf8'));

input = new MathInput();
lines = fs.readFileSync('equations/temp.in', 'utf8');
lines = lines.split('\n');
for (var i = 0; i < lines.length; i++)
    input.input(lines[i]);

function dumpTree(node, level, indent) {
    var result = ''
    result += indent.repeat(level);
    result += '<' + node.tag + '>';
    if (node.text !== undefined) {
        result += node.text;
    } else {
        var start = node.children.next;
        var end = node.children;
        result += listFold(start, end, '', dumpTree, level+1, indent);
    }
    result += '</' + node.tag + '>\n';
    return result;
}

console.log(dumpTree(input.root, 0, '  '));
