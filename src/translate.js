function serialize(node, level, indent) {
    var result = "";
    if (node.tag != 'mopen' && node.tag != 'mclose') {
        result += indent.repeat(level);
        if (node.tag == 'root')
            node.tag = 'math';
        if (node.input)
            result += '<' + node.tag + ' input="' + node.input + '">';
        else
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

// FIXME: may merge atomSymbols with aggSymbols

function findAtom(input) {
    var atom;
    for (var i = 0; i < atomSymbols.length; i++) {
        var s = atomSymbols[i];
        if (s.input.test !== undefined) {
            if (s.input.test(input)) {
                atom = s;
                break;
            }
        } else {
            if (s.input === input) {
                atom = s;
                break;
            }
        }
    }
    return atom;
}

function findAgg(input) {
    return aggSymbols[input];
}

function deserialize(str) {
    function _deserialize($parent, parentNode) {
        $parent.children().each(function() {
            var $this = $(this);
            var tag = $this.prop('tagName');
            if (tag === 'cursor')
                return;
            var input = $this.attr('input');
            var info = findAtom(input) || findAgg(input);
            if (!info)
                throw new Error('invalid input ' + input);
            var node = new info.Tag(input, info);
            node.addBefore(parentNode.children);
            node.JQ.appendTo(parentNode.children.JQ);
            if ($this.children().length > 0)
                _deserialize($this, node);
        });
    }
    var xml = $.parseXML(str);
    var $xml = $(xml);
    var rootNode = new Mrow('root');
    $xml.children().each(function() {
        var $this = $(this);
        if ($this.prop('tagName') === 'math') {
            _deserialize($this, rootNode);
        }
    });
    return rootNode;
}
