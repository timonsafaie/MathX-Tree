var atomSymbols = [
    {input: 'A', Tag: Mi, output: "&#x1d434;", css: {padding: '0 0 0 0'}},
    {input: 'B', Tag: Mi, output: "&#x1d435;", css: {padding: '0 .17em 0 0'}},
    {input: 'C', Tag: Mi, output: "&#x1d436;", css: {padding: '0 .1em 0 0'}},
    {input: 'D', Tag: Mi, output: "&#x1d437;", css: {padding: '0 .1em 0 0'}},
    {input: 'E', Tag: Mi, output: "&#x1d438;", css: {padding: '0 .12em 0 0'}},
    {input: 'F', Tag: Mi, output: "&#x1d439;", css: {padding: '0 .14em 0 0'}},
    {input: 'G', Tag: Mi, output: "&#x1d43a;", css: {padding: '0 .12em 0 0'}},
    {input: 'H', Tag: Mi, output: "&#x1d43b;", css: {padding: '0 .13em 0 0'}},
    {input: 'I', Tag: Mi, output: "&#x1d43c;", css: {padding: '0 .13em 0 0'}},
    {input: 'J', Tag: Mi, output: "&#x1d43d;", css: {padding: '0 .15em 0 0'}},
    {input: 'K', Tag: Mi, output: "&#x1d43e;", css: {padding: '0 .15em 0 0'}},
    {input: 'L', Tag: Mi, output: "&#x1d43f;", css: {padding: '0 .08em 0 0'}},
    {input: 'M', Tag: Mi, output: "&#x1d440;", css: {padding: '0 .13em 0 0'}},
    {input: 'N', Tag: Mi, output: "&#x1d441;", css: {padding: '0 .13em 0 0'}},
    {input: 'O', Tag: Mi, output: "&#x1d442;", css: {padding: '0 .11em 0 0'}},
    {input: 'P', Tag: Mi, output: "&#x1d443;", css: {padding: '0 .1em 0 0'}},
    {input: 'Q', Tag: Mi, output: "&#x1d444;", css: {padding: '0 .09em 0 0'}},
    {input: 'R', Tag: Mi, output: "&#x1d445;", css: {padding: '0 .03em 0 0'}},
    {input: 'S', Tag: Mi, output: "&#x1d446;", css: {padding: '0 .11em 0 0'}},
    {input: 'T', Tag: Mi, output: "&#x1d447;", css: {padding: '0 .14em 0 0'}},
    {input: 'U', Tag: Mi, output: "&#x1d448;", css: {padding: '0 .16em 0 0'}},
    {input: 'V', Tag: Mi, output: "&#x1d449;", css: {padding: '0 .16em 0 0'}},
    {input: 'W', Tag: Mi, output: "&#x1d44a;", css: {padding: '0 .16em 0 0'}},
    {input: 'X', Tag: Mi, output: "&#x1d44b;", css: {padding: '0 .16em 0 0'}},
    {input: 'Y', Tag: Mi, output: "&#x1d44c;", css: {padding: '0 .17em 0 0'}},
    {input: 'Z', Tag: Mi, output: "&#x1d44d;", css: {padding: '0 .17em 0 0'}},

    {input: 'a', Tag: Mi, output: "&#x1D44E;", css: {padding: '0 .08em 0 0'}},
    {input: 'b', Tag: Mi, output: "&#x1d44f;", css: {padding: '0 .1em 0 0'}},
    {input: 'c', Tag: Mi, output: "&#x1d450;", css: {padding: '0 .12em 0 0'}},
    {input: 'd', Tag: Mi, output: "&#x1d451;", css: {padding: '0 .1em 0 0'}},
    {input: 'e', Tag: Mi, output: "&#x1d452;", css: {padding: '0 .1em 0 0'}},
    {input: 'f', Tag: Mi, output: "&#x1d453;", css: {padding: '0 .15em 0 .13em'}},
    {input: 'g', Tag: Mi, output: "&#x1d454;", css: {padding: '0 .1em 0 .03em'}},
    {input: 'h', Tag: Mi, output: "&#8462;",   css: {padding: '0 .05em 0 0'}},
    {input: 'i', Tag: Mi, output: "&#x1d456;", css: {padding: '0 .1em 0 0'}},
    {input: 'j', Tag: Mi, output: "&#x1d457;", css: {padding: '0 .09em 0 .07em'}},
    {input: 'k', Tag: Mi, output: "&#x1d458;", css: {padding: '0 .1em 0 0'}},
    {input: 'l', Tag: Mi, output: "&#x1d459;", css: {padding: '0 .15em 0 0'}},
    {input: 'm', Tag: Mi, output: "&#x1d45a;", css: {padding: '0 .05em 0 0'}},
    {input: 'n', Tag: Mi, output: "&#x1d45b;", css: {padding: '0 .05em 0 0'}},
    {input: 'o', Tag: Mi, output: "&#x1d45c;", css: {padding: '0 .08em 0 0'}},
    {input: 'p', Tag: Mi, output: "&#x1d45d;", css: {padding: '0 .1em 0 .07em'}},
    {input: 'q', Tag: Mi, output: "&#x1d45e;", css: {padding: '0 .12em 0 0'}},
    {input: 'r', Tag: Mi, output: "&#x1d45f;", css: {padding: '0 .11em 0 0'}},
    {input: 's', Tag: Mi, output: "&#x1d460;", css: {padding: '0 .11em 0 0'}},
    {input: 't', Tag: Mi, output: "&#x1d461;", css: {padding: '0 .15em 0 0'}},
    {input: 'u', Tag: Mi, output: "&#x1d462;", css: {padding: '0 .08em 0 0'}},
    {input: 'v', Tag: Mi, output: "&#x1d463;", css: {padding: '0 .12em 0 0'}},
    {input: 'w', Tag: Mi, output: "&#x1d464;", css: {padding: '0 .1em 0 0'}},
    {input: 'x', Tag: Mi, output: "&#x1d465;", css: {padding: '0 .05em 0 0'}},
    {input: 'y', Tag: Mi, output: "&#x1d466;", css: {padding: '0 .06em 0 0'}},
    {input: 'z', Tag: Mi, output: "&#x1d467;", css: {padding: '0 .07em 0 0'}},

    {input: '<', Tag: Mo, css: {padding: '0 .2em'}},
    {input: '>', Tag: Mo, css: {padding: '0 .2em'}},
    {input: '=', Tag: Mo, css: {padding: '0 .2em'}},
    {input: '*', Tag: Mo, css: {padding: '0 .2em'}},

    {input: '(', Tag: Menclose, closeInfo: {input: ')'}},
    {input: '[', Tag: Menclose, closeInfo: {input: ']'}},
    {input: '{', Tag: Menclose, closeInfo: {input: ']'}},
    {input: ')', Tag: Mclose},
    {input: ']', Tag: Mclose},
    {input: '}', Tag: Mclose},

    {input: '/',             Tag: Mfrac},
    {input: ' ',             Tag: Mspace},
    {input: '^',             Tag: Msup},
    {input: '_',             Tag: Msub},
    {input: /^[0-9.]$/,      Tag: Mn},
    {input: /^[:;,'"$@#%&!=?]$/,    Tag: Mo},
    {input: /^[+\-|\\]$/,           Tag: Mo}
];

var aggSymbols = {
    '+-':                 {Tag: Mo, output: '&pm;'},
    '-+':                 {Tag: Mo, output: '&mp;'},
    '<=':                 {Tag: Mo, output: '&leq;', css: {padding: '0 .2em'}},
    '>=':                 {Tag: Mo, output: '&geq;', css: {padding: '0 .2em'}},
    '=>':                 {Tag: Mo, output: '&rArr;'},
    '->':                 {Tag: Mo, output: '&rarr;'},
    '<-':                 {Tag: Mo, output: '&larr;'},
    '->':                 {Tag: Mo, output: '&rarr;'},
    '<->':                {Tag: Mo, output: '&harr;'},
    '|->':                {Tag: Mo, output: '&map;'},
    '\\->':               {Tag: Mo, output: '&hookrightarrow;'},

    '<--':                {Tag: Mo, output: '&longleftarrow;'},
    '-->':                {Tag: Mo, output: '&longrightarrow;'},
    '<-->':               {Tag: Mo, output: '&longleftrightarrow;'},
    '|-->':               {Tag: Mo, output: '&longmapsto;'},

    'del':                {Tag: Mi, output: '&part;', category: 'Operator', rank: "2"},
    'gradient':           {Tag: Mi, output: '&nabla;', category: 'Operator', rank: "4"},
    'nabla':              {Tag: Mi, output: '&nabla;', category: 'Operator', rank: "5"},
    'curl':               {Tag: Mi, output: '&nabla;', category: 'Operator', rank: "6"},

    'if':                 {Tag: Mo, output: '&Longleftarrow;', category: 'Arrow', rank: "27"},
    'only if':            {Tag: Mo, output: '&Longrightarrow;', category: 'Arrow', rank: "28"},
    'and':                {Tag: Mo, output: '&and;', category: 'Logic', rank: "1"},

    'integral':                      {Tag: Msubsup, output: '&int;', category: 'Function', rank: "1"},
    'double integral':               {Tag: Msubsup, output: '&#8748;', category: 'Function', rank: "2"},
    'triple integral':               {Tag: Msubsup, output: '&#8749;', category: 'Function', rank: "3"},
    'quadruple integral':            {Tag: Msubsup, output: '&#10764;', category: 'Function', rank: "4"},
    'clockwise integral':            {Tag: Msubsup, output: '&#8753;', category: 'Function', rank: "5"},
    'anticlockwise integral':        {Tag: Msubsup, output: '&#10769;', category: 'Function', rank: "6"},
    'contour integral':              {Tag: Msubsup, output: '&#8750;', category: 'Function', rank: "7"},
    'surface integral':              {Tag: Msubsup, output: '&#8751;', category: 'Function', rank: "8"},
    'volume integral':               {Tag: Msubsup, output: '&#8752;', category: 'Function', rank: "9"},
    'clockwise contour integral':     {Tag: Msubsup, output: '&#8754;', category: 'Function', rank: "10"},
    'anticlockwise contour integral': {Tag: Msubsup, output: '&#8755;', category: 'Function', rank: "11"},
    
    'product':            {Tag: Munderover, output: '&prod;', category: 'Function', rank: "12"},
    'coproduct':          {Tag: Munderover, output: '&coprod;', category: 'Function', rank: "13"},
    'tensor product':      {Tag: Munderover, output: '&bigotimes;', category: 'Function', rank: "14"},
    'wedge product':       {Tag: Munderover, output: '&bigwedge;', category: 'Function', rank: "15"},
    'interior product':    {Tag: Munderover, output: '&bigvee;', category: 'Function', rank: "16"},
    'cup product':         {Tag: Munderover, output: '&bigsqcup;', category: 'Function', rank: "17"},
    'cap product':         {Tag: Munderover, output: '&sqcap;', category: 'Function', rank: "18"},

    'sum':                {Tag: Munderover, output: '&Sum;', category: 'Function', rank: "19"},
    'direct sum':          {Tag: Munderover, output: '&#8853;', category: 'Function', rank: "20"},

    'lim':   {Tag: Munder, output: 'lim', category: 'Function', rank: "21"},
    'limit': {Tag: Munder, output: 'lim', category: 'Function', rank: "21"},
    'sqrt':  {Tag: Msqrt,  output: '&radic;', css: {padding: '0 0.2em 0 0'}, category: 'Function', rank: "22"},
    // 'root': {Tag: Msqrt,  output: '&radic;', css: {padding: '0 0.2em 0 0'}},

    'sin':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'sinh':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arcsin':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arcsinh': {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'cos':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'cosh':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arccos':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arccosh': {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'tan':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'tanh':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arctan':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arctanh': {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'sec':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'sech':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arcsec':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arcsech': {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'csc':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'csch':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arccsc':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arccsch': {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'cot':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'coth':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arccot':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'arccoth': {Tag: Mi, css: {padding: '0 0.1em 0 0'}},

    'log':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'mod':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'min':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'inf':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'sup':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'ln':      {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'gcd':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'max':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'det':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'lcm':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'Tr':      {Tag: Mi, css: {padding: '0 0.1em 0 0'}},
    'tr':      {Tag: Mi, css: {padding: '0 0.1em 0 0'}}
};

for (var key in _aggSymbols) {
    if (_aggSymbols.hasOwnProperty(key))
        aggSymbols[key] = _aggSymbols[key];
}
