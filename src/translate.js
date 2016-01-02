function toJSON(node) {
    return JSON.stringify(node.toJSON(), null, '  ');
}

function fromJSON(str) {
    return elemFromJSON(JSON.parse(str));
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
                if (node.info.category == 'Function')
                    result += node.info.latex;
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
        result = result.trim() + enclose;
    } else if (node instanceof Mspace) {
        result += '\\ ';
    } else {
        var cmd = node.input;
        if (aggSymbols[node.input])
            cmd = ' '+aggSymbols[node.input].latex+' ';
        result = result.trim() + cmd;
    }
    return result;
}
