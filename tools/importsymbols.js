var fs = require('fs');
var dbjs, symjs;

function parseArgs() {
    var usage = 'Usage: iojs importsymbols.js <db.js> <aggsymbols.js>\n';
    var args = process.argv.slice(2);
    dbjs = args[0];
    symjs = args[1];
}

function isEmpty(obj) {
    for(var prop in obj)
        if(obj.hasOwnProperty(prop))
            return false;
    return true;
}

function importSymbol(sym) {
    var res = '    ';
    if (sym.arguments_table.length > 0)
        return;
    res += '"' + sym.symbolname + '": ';
    res += '{Tag: Mi, output: "' + sym.symbol + '"';
    var css = {};
    if (sym.symbolpadding.length > 0)
        css.padding = sym.symbolpadding;
    if (sym.symbolmargin.length > 0)
        css.margin = sym.symbolmargin;
    if (!isEmpty(css))
        res += ', css: ' + JSON.stringify(css);
    res += ', family: "'+sym.family+'"';
    res += ', category: "'+sym.category+'"';
    res += ', rank: '+sym.symbolrank;
    res += '},\n';
    fs.appendFileSync(symjs, res);
}

parseArgs();
eval(fs.readFileSync(dbjs, 'utf8'));
fs.writeFileSync(symjs, '// auto-generated\n');
fs.appendFileSync(symjs, 'var _aggSymbols = {\n');
db.forEach(function(sym) {
    importSymbol(sym);
});
fs.appendFileSync(symjs, '    null: null\n}\n');
