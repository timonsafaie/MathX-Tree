function inputKeys(keys) {
    var input = new MathInput();
    keys.forEach(function(k) {
        if (k.length === 1)
            input.inputKey(k);
        else
            input.inputControl(k);
    });
    return input;
}

var keys = [
    '-', 'b', '+', '-',
    's', 'q', 'r', 't',
    'b', '^', '2', 'Right',
    '-', '4', 'a', 'c'
];
var dump = [
    "<root>",
    "  <mo>-</mo>",
    "  <mi>b</mi>",
    "  <mo>+-</mo>",
    "  <msqrt>",
    "    <mi>b</mi>",
    "    <msup>",
    "      <mn>2</mn>",
    "    </msup>",
    "    <mo>-</mo>",
    "    <mn>4</mn>",
    "    <mi>a</mi>",
    "    <mi>c</mi>",
    "    <cursor></cursor>",
    "  </msqrt>",
    "</root>",
    ""
].join('\n');

input = inputKeys(keys);
var dump_ = input.dumpRoot();
assert(dump === dump_, 'test_input error: ' + dump_);

keys = [
    's', 'u', 'm',
    '1', 'Right',
    '2', 'Right',
];
dump = [
    "<root>",
    "  <munderover>",
    "    <munder>",
    "      <mn>1</mn>",
    "    </munder>",
    "    <mover>",
    "      <mn>2</mn>",
    "    </mover>",
    "  </munderover>",
    "  <cursor></cursor>",
    "</root>",
    ""
].join('\n');

input = inputKeys(keys);
var dump_ = input.dumpRoot();
assert(dump === dump_, 'test_input error: ' + dump_);

keys = [
    's', 'i', 'n',
    '(', 'x', 'Right',
];
dump = [
    "<root>",
    "  <mi>sin</mi>",
    "  <mfenced>",
    "    <mopen>(</mopen>",
    "    <mrow>",
    "      <mi>x</mi>",
    "    </mrow>",
    "    <mclose>)</mclose>",
    "  </mfenced>",
    "  <cursor></cursor>",
    "</root>",
    ""
].join('\n');

input = inputKeys(keys);
var dump_ = input.dumpRoot();
assert(dump === dump_, 'test_input error: ' + dump_);
