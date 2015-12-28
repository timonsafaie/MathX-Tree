var input = new MathInput();

var keys = [
    '-', 'b', '+', '-',
    's', 'q', 'r', 't',
    'b', '^', '2', 'Right',
    '-', '4', 'a', 'c'
];

keys.forEach(function(k) {
    if (k.length === 1)
        input.inputKey(k);
    else
        input.inputControl(k);
});

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

var dump_ = input.dumpRoot();
assert(dump === dump_, 'test_input error: ' + dump_);
