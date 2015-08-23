var atomSymbols = [
    {input: /^[a-zA-Z]$/,    Tag: Mi},
    {input: /^[0-9.]$/,      Tag: Mn},
    {input: /^[\/+-<>|\\]$/, Tag: Mo},
    {input: '^',             Tag: Msup},
    {input: '_',             Tag: Msub}
];

var aggSymbols = {
    '<-':                 {Tag: Mo, output: '&larr;'},
    '->':                 {Tag: Mo, output: '&rarr;'},
    '<->':                {Tag: Mo, output: '&harr;'},
    '|->':                {Tag: Mo, output: '&map;'},
    '\\->':               {Tag: Mo, output: '&hookrightarrow;'},

    '<--':                {Tag: Mo, output: '&longleftarrow;'},
    '-->':                {Tag: Mo, output: '&longrightarrow;'},
    '<-->':               {Tag: Mo, output: '&longleftrightarrow;'},
    '|-->':               {Tag: Mo, output: '&longmapsto;'},

    'product':            {Tag: Munderover, output: '&prod;'},
    'coproduct':          {Tag: Munderover, output: '&coprod;'},
    'tensorproduct':      {Tag: Munderover, output: '&bigotimes;'},
    'wedgeproduct':       {Tag: Munderover, output: '&bigwedge;'},
    'interiorproduct':    {Tag: Munderover, output: '&bigvee;'},
    'cupproduct':         {Tag: Munderover, output: '&bigsqcup;'},
    'capproduct':         {Tag: Munderover, output: '&sqcap;'},

    'sum':                {Tag: Munderover, output: '&Sum;'},
    'directsum':          {Tag: Munderover, output: '&#8853;'},

    'integral':                     {Tag: Msubsup, output: '&int;'},
    'doubleintegral':               {Tag: Msubsup, output: '&#8748;'},
    'tripleintegral':               {Tag: Msubsup, output: '&#8749;'},
    'quadrupleintegral':            {Tag: Msubsup, output: '&#10764;'},
    'clockwiseintegral':            {Tag: Msubsup, output: '&#8753;'},
    'anticlockwiseintegral':        {Tag: Msubsup, output: '&#10769;'},
    'contourintegral':              {Tag: Msubsup, output: '&#8750;'},
    'surfaceintegral':              {Tag: Msubsup, output: '&#8751;'},
    'volumeintegral':               {Tag: Msubsup, output: '&#8752;'},
    'clockwisecontourintegral':     {Tag: Msubsup, output: '&#8754;'},
    'anticlockwisecontourintegral': {Tag: Msubsup, output: '&#8755;'},

    'limit': {Tag: Munder, output: 'lim'},
    'sqrt':  {Tag: Msqrt,  output: '&radic;', css: {padding: '0 0.2em 0 0'}},
    // 'root': {Tag: Msqrt,  output: '&radic;', css: {padding: '0 0.2em 0 0'}},
};

for (var key in _aggSymbols) {
    if (_aggSymbols.hasOwnProperty(key))
        aggSymbols[key] = _aggSymbols[key];
}
