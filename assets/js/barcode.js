/* Amrita Global Exchange — Code 39 barcode renderer.
   Dependency-free. Renders an inline SVG so the symbol prints crisp and
   inherits the surrounding ink colour. Every symbol carries a real,
   standards-compliant payload: the registry file number. */
(function () {
  'use strict';

  /* Nine elements per character: bar, space, bar, space, bar, space, bar,
     space, bar. "n" is one module, "w" is three. */
  var CODE39 = {
    '0': 'nnnwwnwnn',
    '1': 'wnnwnnnnw',
    '2': 'nnwwnnnnw',
    '3': 'wnwwnnnnn',
    '4': 'nnnwwnnnw',
    '5': 'wnnwwnnnn',
    '6': 'nnwwwnnnn',
    '7': 'nnnwnnwnw',
    '8': 'wnnwnnwnn',
    '9': 'nnwwnnwnn',
    'A': 'wnnnnwnnw',
    'B': 'nnwnnwnnw',
    'C': 'wnwnnwnnn',
    'D': 'nnnnwwnnw',
    'E': 'wnnnwwnnn',
    'F': 'nnwnwwnnn',
    'G': 'nnnnnwwnw',
    'H': 'wnnnnwwnn',
    'I': 'nnwnnwwnn',
    'J': 'nnnnwwwnn',
    'K': 'wnnnnnnww',
    'L': 'nnwnnnnww',
    'M': 'wnwnnnnwn',
    'N': 'nnnnwnnww',
    'O': 'wnnnwnnwn',
    'P': 'nnwnwnnwn',
    'Q': 'nnnnnnwww',
    'R': 'wnnnnnwwn',
    'S': 'nnwnnnwwn',
    'T': 'nnnnwnwwn',
    'U': 'wwnnnnnnw',
    'V': 'nwwnnnnnw',
    'W': 'wwwnnnnnn',
    'X': 'nwnnwnnnw',
    'Y': 'wwnnwnnnn',
    'Z': 'nwwnwnnnn',
    '-': 'nwnnnnwnw',
    '.': 'wwnnnnwnn',
    ' ': 'nwwnnnwnn',
    '$': 'nwnwnwnnn',
    '/': 'nwnwnnnwn',
    '+': 'nwnnnwnwn',
    '%': 'nnnwnwnwn',
    '*': 'nwnnwnwnn'
  };

  var NARROW = 1;
  var WIDE = 3;
  var GAP = 1;

  function esc(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clean(value) {
    return String(value == null ? '' : value)
      .toUpperCase()
      .replace(/[^0-9A-Z\-. $/+%]/g, '')
      .trim();
  }

  function render(value, options) {
    var opts = options || {};
    var text = clean(value);
    if (!text) return '';

    var height = opts.height || 44;
    var quiet = opts.quiet == null ? 10 : opts.quiet;
    var className = opts.className || 'barcode';
    var chars = ('*' + text + '*').split('');
    var bars = '';
    var x = quiet;
    var last = 0;

    for (var i = 0; i < chars.length; i++) {
      var pattern = CODE39[chars[i]];
      if (!pattern) continue;

      for (var j = 0; j < pattern.length; j++) {
        var w = pattern.charAt(j) === 'w' ? WIDE : NARROW;
        if (j % 2 === 0) {
          bars += '<rect x="' + x + '" y="0" width="' + w + '" height="' + height + '"/>';
        }
        x += w;
      }

      last = x;
      if (i < chars.length - 1) x += GAP;
    }

    var width = last + quiet;

    return '<svg class="' + esc(className) + '" viewBox="0 0 ' + width + ' ' + height + '" ' +
      'preserveAspectRatio="none" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true" ' +
      'focusable="false" data-code39="' + esc(text) + '">' + bars + '</svg>';
  }

  function mount(el, value, options) {
    if (!el) return;
    var markup = render(value, options);
    if (markup) el.innerHTML = markup;
  }

  window.AGXCode39 = {
    render: render,
    mount: mount,
    encode: clean
  };
})();
