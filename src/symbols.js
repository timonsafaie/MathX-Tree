// FIXME: may merge atomElems and aggElems into symbols
var atomElems = [
    {input: /^[a-zA-Z]$/, Tag: Mi},
    {input: /^[0-9.]$/,   Tag: Mn},
    {input: /^[\/+-]$/,   Tag: Mo},
    {input: '^',          Tag: Msup},
    {input: '_',          Tag: Msub}
];

var aggElems = {
    '+-':   {Tag: Mo,     output: '&plusmn;'},
    '-+':   {Tag: Mo,     output: '&#8723;'},
    'sqrt': {Tag: Msqrt,  output: '&radic;', css: {padding: '0 0.2em 0 0'}},
    'product': {Tag: Munderover, output: '&prod;'}
};
