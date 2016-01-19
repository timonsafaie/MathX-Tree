$('.mathx-tree').each(function() {
    entry($(this));
});
$('.mathx-tree').first().focus();
//expose serialization
return {
  _mxD: fromJSON,
  _mxE: entry,
  _mm: mathMode,
  _detm: didExitTextMode
}
})();
