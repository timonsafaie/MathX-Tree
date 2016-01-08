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
var n = node.JQ.find('.exp-holder');
assert(n.length === 1, 'test_translate.sup: ' + n);

doc = JSON.stringify({
    "tag": "root",
    "children": [
        {
            "tag": "munderover",
            "input": "sum",
            "under": {
                "tag": "munder",
                "children": [
                    {
                        "tag": "mn",
                        "input": "1"
                    }
                ]
            },
            "over": {
                "tag": "mover",
                "children": [
                    {
                        "tag": "mn",
                        "input": "2"
                    }
                ]
            }
        }
    ]
}, null, '    ');

node = fromJSON(doc);
doc_ = toJSON(node);
assert(doc === doc_, 'test_translate: ' + doc_);

n = node.JQ.find('.func-over .mX');
assert(n.length === 1, 'test_translate.over: ' + n);
n = node.JQ.find('.func-under .mX');
assert(n.length === 1, 'test_translate.under: ' + n);

doc = JSON.stringify({
    "tag": "root",
    "children": [
        {
            "tag": "mi",
            "input": "sin"
        },
        {
            "tag": "mfenced",
            "input": "(",
            "menclosed": {
                "tag": "mrow",
                "children": [
                    {
                        "tag": "mi",
                        "input": "x"
                    }
                ]
            },
            "mopen": {
                "tag": "mopen",
                "input": "("
            },
            "mclose": {
                "tag": "mclose",
                "input": ")"
            }
        }
    ]
}, null, '    ');

node = fromJSON(doc);
doc_ = toJSON(node);
assert(doc === doc_, 'test_translate: ' + doc_);
