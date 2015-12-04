function serialize(node, level, indent) {
    var result = "";
    if (node.tag != 'mopen' && node.tag != 'mclose') {
        result += indent.repeat(level);
        if (node.tag == 'root')
            node.tag = 'math';
        result += '<' + node.tag + '>';
        if (node instanceof Mrow) {
            var start = node.children.next;
            var end = node.children;
            if (node instanceof Menclose) {
                result = result.substr(0, result.length-2)+' open="'+start.input+'"';
                result += ' close="'+end.prev.input+'"';
                result += '>';
            }
            result += listFold(start, end, '\n', serialize, level+1, indent);
            result += indent.repeat(level);
        } else {
            var cmd = node.input;
            if (aggSymbols[node.input])
                cmd = aggSymbols[node.input].output;
            result += cmd;
        }
        result += '</' + node.tag + '>\n';
    }
    return result;
}

function toLatex(node) {
    var result = "";
    var delimiter = '';
    var enclose = '';
    var mid = '';
    var skip = false;
    if (node instanceof Mrow) {
        var start = node.children.next;
        var end = node.children;
        switch (node.tag) {
            case 'msup':
                result += '^{';
                enclose = '}';
                break;
            case 'msub':
                result += '_{';
                enclose = '}';
                break;
            case 'mover':
                result += '^{';
                enclose = '}';
                break;
            case 'munder':
                result += '_{';
                enclose = '}';
                break;
            case 'mfrac':
                result += '\\frac{';
                enclose = '}';
                result += toLatex(start)+'}{'+toLatex(end.prev);
                skip = true;
                break;
            case 'msubsup':
                result += node.info.latex;
                break;
            case 'munderover':
                result += node.info.latex;
                break;
            case 'msqrt':
                result += '\\sqrt{';
                enclose = '}';
                break;
            case 'mfenced':
                var left = (start.input == "{")? "\\{" : start.input;
                var right = (end.prev.input == "}")? "\\}" : end.prev.input;
                result += '\\left'+left;
                result += toLatex(node.children.next.next);
                result += '\\right'+right;
                skip = true;
                break;
        }
        if (!skip)
            result += listFold(start, end, delimiter, toLatex);
        result += enclose;
    } else if (node instanceof Mspace) {
        result += '\\ ';
    } else {
        var cmd = node.input;
        if (aggSymbols[node.input])
            cmd = aggSymbols[node.input].latex;
        result += cmd;
    }
    return result;
}

function deserialize(tree) {
    // TODO: deserialize MathML
}