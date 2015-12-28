$('.mathx-tree').each(function() {
    var entree = entry($(this));
    entrees[entree.root.id] = entree;
});
$('.mathx-tree').first().focus();
//expose serialization
return {
  _mxD: fromJSON,
  _mxE: entry
}
})();
