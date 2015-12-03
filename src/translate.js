function serialize(node, level, indent) {
    var result = indent.repeat(level);
    if (node.tag == 'root')
        node.tag = 'math';
    result += '<' + node.tag + '>';
    if (node instanceof Mrow) {
        var start = node.children.next;
        var end = node.children;
        result += listFold(start, end, '\n', serialize, level+1, indent);
        result += indent.repeat(level);
    } else {
        result += node.input;
    }
    result += '</' + node.tag + '>\n';
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
            case 'menclose':
                break;
        }
        if (!skip)
            result += listFold(start, end, delimiter, toLatex);
        result += enclose;
    } else if (node instanceof Mspace) {
        result += '\\';
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