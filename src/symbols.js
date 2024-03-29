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
    {input: 'h', Tag: Mi, output: "&#x210e;",  css: {padding: '0 .05em 0 0'}},
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

    {input: '<', Tag: Mo},
    {input: '>', Tag: Mo},
    {input: '=', Tag: Mo},
    {input: '~', Tag: Mo, output: "&#8764"},
    {input: '-', Tag: Mo, output: "&#8722"},
    {input: '*', Tag: Mo, output: "&#8727;"},

    {input: '(', Tag: Menclose, closeInfo: {input: ')'}},
    {input: '[', Tag: Menclose, closeInfo: {input: ']'}},
    {input: '{', Tag: Menclose, closeInfo: {input: '}'}},
    {input: ')', Tag: Mclose},
    {input: ']', Tag: Mclose},
    {input: '}', Tag: Mclose},

    {input: '/',             Tag: Mi},
    {input: '^',             Tag: Mi},
    {input: '_',             Tag: Mi},
    {input: ' ',             Tag: Mspace},
    {input: /^[0-9.]$/,      Tag: Mn},
    {input: /^[:;,~`'"$@#%&!?]$/,   Tag: Mi},
    {input: /^[+\-|=\\]$/,          Tag: Mo}
];

var aggSymbols1 = {
    '^':                  {Tag: Msup},
    '_':                  {Tag: Msub},
    '/':                  {Tag: Mfrac, latex: "/", version: "basic"},

    '+-':                 {Tag: Mo, output: '&pm;', latex: "\\pm", version: "basic"},
    '-+':                 {Tag: Mo, output: '&mp;', latex: "\\mp", version: "basic"},
    '*':                  {Tag: Mo, output: '&times;', latex: "\\times", version: "basic"},
    '**':                 {Tag: Mo, output: '&#183;', latex: "\\cdot", version: "basic"},
    '-:':                 {Tag: Mo, output: '&#247;', latex: "\\div", version: "basic"},
    '\\':                 {Tag: Mo, output: '&#8726;', css: {padding: '0 .15em'}, latex: "\\setminus"},
    
    '<=':                 {Tag: Mo, output: '&leq;', latex: "\\leq", version: "basic"},
    '>=':                 {Tag: Mo, output: '&geq;', latex: "\\geq", version: "basic"},
    '<<':                 {Tag: Mo, output: '&#8810;', latex: "\\ll"},
    '>>':                 {Tag: Mo, output: '&#8811;', latex: "\\gg"},
    '>~':                 {Tag: Mo, output: '&#8819;', latex: "\\gtrsim"},
    '<~':                 {Tag: Mo, output: '&#8818;', latex: "\\lesssim"},
    '~~':                 {Tag: Mo, output: '&#8776;', latex: "\\approx"},
    '~-':                 {Tag: Mo, output: '&#8771;', latex: "\\simeq"},
    '~=':                 {Tag: Mo, output: '&#8773;', latex: "\\cong"},
    '-=':                 {Tag: Mo, output: '&#8801;', latex: "\\equiv"},
    '!=':                 {Tag: Mo, output: '&#8800;', latex: "\\ne"},

    '=>':                 {Tag: Mo, output: '&rArr;', latex: "\\Rightarrow"},
    '->':                 {Tag: Mo, output: '&rarr;',  latex: "\\rightarrow", version: "basic"},
    '<-':                 {Tag: Mo, output: '&larr;', latex: "\\leftarrow"},
    '<->':                {Tag: Mo, output: '&harr;', latex: "\\leftrightarrow"},
    '|->':                {Tag: Mo, output: '&map;', latex: "\\mapsto"},
    '\\->':               {Tag: Mo, output: '&hookrightarrow;', latex: "\\xhookrightarrow{}"},
    '<--':                {Tag: Mo, output: '&longleftarrow;', latex: "\\longleftarrow"},
    '-->':                {Tag: Mo, output: '&longrightarrow;', latex: "\\longrightarrow"},
    '<-->':               {Tag: Mo, output: '&longleftrightarrow;', latex: "\\longleftrightarrow"},
    '|-->':               {Tag: Mo, output: '&longmapsto;', latex: "\\longmapsto"},
    
    '|':                  {Tag: Mo, output: '|', latex: '|'},
    '|':                  {Tag: Menclose, closeInfo: {input: '|'}},
    
    '...':                {Tag: Mo, output: '&#8943;', css: {padding: '0 .1em'},  latex: "\\cdots", version: "basic"},
    ':.':                 {Tag: Mo, output: '&#8756;', css: {padding: '0 .1em'},  latex: "\\therefore"},
    '.:':                 {Tag: Mo, output: '&#8757;', css: {padding: '0 .1em'},  latex: "\\because"},
    
    'DD':                 {Tag: Mo, output: '&#8711;', css: {padding: '0 0em'}, latex: "\\nabla"},
    'dd':                 {Tag: Mo, output: '&#8706;', css: {padding: '0 0em'}, latex: "\\partial"},
    'AA':                 {Tag: Mo, output: '&#8704;', css: {padding: '0 0em'}, latex: "\\forall"},
    'EE':                 {Tag: Mo, output: '&#8707;', css: {padding: '0 0em'}, latex: "\\exists"},
    'NN':                 {Tag: Mo, output: '&#8469;', css: {padding: '0 0em'}, latex: "\\mathbb{N}", version: "basic"},
    'ZZ':                 {Tag: Mo, output: '&#8484;', css: {padding: '0 0em'}, latex: "\\mathbb{Z}", version: "basic"},
    'QQ':                 {Tag: Mo, output: '&#8474;', css: {padding: '0 0em'}, latex: "\\mathbb{Q}", version: "basic"},
    'RR':                 {Tag: Mo, output: '&#8477;', css: {padding: '0 0em'}, latex: "\\mathbb{R}", version: "basic"},
    'CC':                 {Tag: Mo, output: '&#8450;', css: {padding: '0 0em'}, latex: "\\mathbb{C}", version: "basic"},
    'WW':                 {Tag: Mo, output: '&#120142;', css: {padding: '0 0em'}, latex: "\\mathbb{W}", version: "basic"},
    'HH':                 {Tag: Mo, output: '&#8461;',  css: {padding: '0 0em'},latex: "\\mathbb{H}"},
    'PP':                 {Tag: Mo, output: '&#8472;', css: {padding: '0 0em'}, latex: "\\wp"},
    'LL':                 {Tag: Mo, output: '&#8466;', css: {padding: '0 0em'}, latex: "\\mathcal{L}"},
    'cc':                 {Tag: Mo, output: '&#8728;', latex: "\\circ"},
    
    
    'del':                {Tag: Mo, output: '&part;', category: 'Operator', rank: "2", latex: "\\nabla"},
    'gradient':           {Tag: Mo, output: '&nabla;', category: 'Operator', rank: "4", latex: "\\nabla"},
    'nabla':              {Tag: Mo, output: '&nabla;', category: 'Operator', rank: "5", latex: "\\nabla"},
    'curl':               {Tag: Mo, output: '&nabla;', category: 'Operator', rank: "6", latex: "\\nabla"},

    'if':                 {Tag: Mo, output: '&Longleftarrow;', category: 'Arrow', rank: "27", latex: "\\Longleftarrow"},
    'only if':            {Tag: Mo, output: '&Longrightarrow;', category: 'Arrow', rank: "28", latex: "\\Longrightarrow"},
    
    'and':                {Tag: Mo, output: '&and;', css: {"padding": "0 .35em 0 .35em"}, category: 'Logic', rank: "1", latex: "\\wedge"},
    'nand':               {Tag: Mo, output: '&#8892;', css: {"padding": "0 .35em 0 .35em"}, category: 'Logic', rank: "2", latex: "\\barwedge"},
    'or':                 {Tag: Mo, output: '&#8744;', css: {"padding": "0 .35em 0 .35em"}, category: 'Logic', rank: "4", latex: "\\vee"},
    'nor':                {Tag: Mo, output: '&#8893;', css: {"padding": "0 .35em 0 .35em"}, category: 'Logic', rank: "5", latex: "\\overline{\vee}"},
    'xor':                {Tag: Mo, output: '&#8891;', css: {"padding": "0 .35em 0 .35em"}, category: 'Logic', rank: "6", latex: "\\veebar"},

    'integral':                      {Tag: Msubsup, output: '&int;', category: 'Function', rank: "1", latex: "\\int",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'double integral':               {Tag: Msubsup, output: '&#8748;', category: 'Function',  rank: "2", latex: "\\iint",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'triple integral':               {Tag: Msubsup, output: '&#8749;', category: 'Function',  rank: "3", latex: "\\iiint",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'quadruple integral':            {Tag: Msubsup, output: '&#10764;', category: 'Function',  rank: "4", latex: "\\iiiint",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'clockwise integral':            {Tag: Msubsup, output: '&#8753;', category: 'Function',  rank: "5", latex: "\\intclockwise",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'anticlockwise integral':        {Tag: Msubsup, output: '&#10769;', category: 'Function',  rank: "6", latex: "\\intctrclockwise",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'contour integral':              {Tag: Msubsup, output: '&#8750;', category: 'Function',  rank: "7", latex: "\\oint",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'surface integral':              {Tag: Msubsup, output: '&#8751;', category: 'Function',  rank: "8", latex: "\\oiint",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'volume integral':               {Tag: Msubsup, output: '&#8752;', category: 'Function',  rank: "9", latex: "\\oiiint",
                                      subOffset: '-0.4', supOffset: '0.7'},
    'clockwise contour integral':     {Tag: Msubsup, output: '&#8754;', category: 'Function',  rank: "10", latex: "\\varointclockwise",
                                       subOffset: '-0.4', supOffset: '0.7'},
    'anticlockwise contour integral': {Tag: Msubsup, output: '&#8755;', category: 'Function',  rank: "11", latex: "\\ointctrclockwise",
                                       subOffset: '-0.4', supOffset: '0.7'},

    'product':            {Tag: Munderover, output: '&prod;', category: 'Function', rank: "12", latex: "\\prod"},
    'coproduct':          {Tag: Munderover, output: '&coprod;', category: 'Function', rank: "13", latex: "\\coprod"},
    'tensor product':      {Tag: Munderover, output: '&bigotimes;', category: 'Function', rank: "14", latex: "\\bigotimes"},
    'wedge product':       {Tag: Munderover, output: '&bigwedge;', category: 'Function', rank: "15", latex: "\\bigwedge"},
    'interior product':    {Tag: Munderover, output: '&bigvee;', category: 'Function', rank: "16", latex: "\\bigvee"},
    'cup product':         {Tag: Munderover, output: '&bigsqcup;', category: 'Function', rank: "17", latex: "\\bigsqcup"},
    'cap product':         {Tag: Munderover, output: '&sqcap;', category: 'Function', rank: "18", latex: "\\bigsqcap"},

    'sum':                {Tag: Munderover, output: '&Sum;', category: 'Function', rank: "19", latex: "\\sum", version: "basic"},
    'direct sum':          {Tag: Munderover, output: '&#8853;', category: 'Function', rank: "20", latex: "\\bigoplus"},

    'lim':   {Tag: Munder, output: 'lim', category: 'Function', rank: "21", latex: "\\lim"},
    'limit': {Tag: Munder, output: 'lim', category: 'Function', rank: "21", latex: "\\lim"},
    'sqrt':  {Tag: Msqrt,  output: '&radic;', category: 'Function', rank: "22", latex: "\\sqrt", version: "basic"},
    'root':  {Tag: Mroot,  output: '&radic;', category: 'Function', rank: "22"},
    
    "oo":    {Tag: Mi, output: "&infin;", family: "symbol", category: "Special Character", rank: "1", latex: "\\infty", version: "basic"},
    
    "nary intersection":    {Tag: Munderover, output: "&bigcap;", category: "Set", rank: "2", latex: "\\bigcap"},
    "nary union":           {Tag: Munderover, output: "&bigcup;", category: "Set", rank: "5", latex: "\\bigcup"},
    
    'sin':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\sin', version: "basic"},
    'sinh':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\sinh', version: "basic"},
    'arcsin':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arcsin'},
    'arcsinh': {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arcsinh'},
    'cos':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\cos', version: "basic"},
    'cosh':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\cosh', version: "basic"},
    'arccos':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arccos'},
    'arccosh': {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arccosh'},
    'tan':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\tan', version: "basic"},
    'tanh':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\tanh', version: "basic"},
    'arctan':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arctan'},
    'arctanh': {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arctanh'},
    'sec':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\sec', version: "basic"},
    'sech':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\sech', version: "basic"},
    'arcsec':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arcsec'},
    'arcsech': {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arcsech'},
    'csc':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\csc', version: "basic"},
    'csch':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\csch', version: "basic"},
    'arccsc':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arccsc'},
    'arccsch': {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arccsch'},
    'cot':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\cot', version: "basic"},
    'coth':    {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\coth', version: "basic"},
    'arccot':  {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arccot'},
    'arccoth': {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\arccoth'},

    'log':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\log', version: "basic"},
    'mod':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\mod'},
    'min':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\min', version: "basic"},
    'inf':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\inf'},
    'sup':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\sup'},
    'ln':      {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\ln', version: "basic"},
    'gcd':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\gcd', version: "basic"},
    'max':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\max', version: "basic"},
    'det':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\det'},
    'lcm':     {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\lcm', version: "basic"},
    'Tr':      {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\Tr'},
    'tr':      {Tag: Mi, css: {padding: '0 0.1em 0 0'}, latex: '\\tr'},

    'vector':  {Tag: Mbar, output: '&#8640;', css: {fontSize: '0.6em'}, family: "symbol", category: "Punctuation", rank: "1"},
    'overbar': {Tag: Mbar, output: '&oline;', css: {fontSize: '0.6em', marginBottom: '-0.4em'}, family: "symbol", category: "Punctuation", rank: "1"},
    'ray':     {Tag: Mbar, output: '&rarr;',  css: {fontSize: '0.6em'}, family: "symbol", category: "Punctuation", rank: "1"},
    'line':    {Tag: Mbar, output: '&harr;',  css: {fontSize: '0.6em'}, family: "symbol", category: "Punctuation", rank: "1"},
    'hat':     {Tag: Mbar, output: '^',       css: {marginBottom: '-0.35em'}, family: "symbol", category: "Punctuation", rank: "1"},
    'tilde':   {Tag: Mbar, output: '~',       css: {marginBottom: '-0.05em'}, family: "symbol", category: "Punctuation", rank: "1"},
    'dot':     {Tag: Mbar, output: '&#729;',  css: {marginBottom: '-0.4em'}, singular: true, family: "symbol", category: "Punctuation", rank: "1"},
    'double dot': {Tag: Mbar, output: '&#168;',  css: {marginBottom: '-0.4em'}, singular: true, family: "symbol", category: "Punctuation", rank: "1"},

    'matrix':       {Tag: Mmatrix, output: '[]', open: '[', close: ']', rows: 1, cols: 1, category: 'Matrix', rank: "1", latex: "[]"},
    'pmatrix':      {Tag: Mmatrix, output: '()', open: '(', close: ')', rows: 1, cols: 1, category: 'Matrix', rank: "2", latex: "()"},
    'determinant':  {Tag: Mmatrix, output: '||', open: '|', close: '|', rows: 1, cols: 1, category: 'Matrix', rank: "3", latex: "||"},
    'binomial':     {Tag: Mmatrix, open: '(', close: ')', rows: 2, cols: 1, category: 'Matrix', rank: "4", latex: "()"},
    'piecewise':    {Tag: Mmatrix, output: '{', open: '{', close: '',  rows: 1, cols: 2, category: 'Matrix', rank: "5", latex: "\\{"}
};

var aggSymbols = {};

function addAggSymbols(dict) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (version === 'basic' && dict[key].version !== 'basic')
                continue;
            aggSymbols[key] = dict[key];
        }
    }
}
addAggSymbols(aggSymbols1);
addAggSymbols(aggSymbols2);

function addLocale(dict) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            key1 = dict[key];
            if (aggSymbols.hasOwnProperty(key1))
                aggSymbols[key] = aggSymbols[key1];
        }
    }
}
locales.forEach(function(locale) {
    addLocale(locale);
});

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
