var doc = JSON.stringify({
    "tag": "root",
    "children": [
        {
            "tag": "mo",
            "input": "-"
        },
        {
            "tag": "mi",
            "input": "b"
        },
        {
            "tag": "mo",
            "input": "+-"
        },
        {
            "tag": "msqrt",
            "input": "sqrt",
            "children": [
                {
                    "tag": "mi",
                    "input": "b"
                },
                {
                    "tag": "msup",
                    "input": "^",
                    "children": [
                        {
                            "tag": "mn",
                            "input": "2"
                        }
                    ]
                },
                {
                    "tag": "mo",
                    "input": "-"
                },
                {
                    "tag": "mn",
                    "input": "4"
                },
                {
                    "tag": "mi",
                    "input": "a"
                },
                {
                    "tag": "mi",
                    "input": "c"
                }
            ]
        }
    ]
}, null, '    ');

var node = fromJSON(doc);
var doc_ = toJSON(node);
assert(doc === doc_, 'test_translate: ' + doc_);

var n = node.JQ.find('.func-sqrt');
assert(n.length === 1, 'test_translate.sqrt: ' + n);
var n = node.JQ.find('sup');
assert(n.length === 1, 'test_translate.sup: ' + n);
