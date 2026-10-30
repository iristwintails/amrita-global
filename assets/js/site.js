/* Amrita Global Exchange — public register.
   No dependencies. No analytics. No storage. */
(function () {
  'use strict';

  var AGX = window.AGX || { members: [] };
  var HUB = AGX.hub || 'https://amrita-global.github.io/';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(value) {
    try {
      var u = new URL(String(value), HUB);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
      if (!u.hostname || u.hostname.indexOf('.') === -1) return null;
      return u.href;
    } catch (err) {
      return null;
    }
  }

  function domain(value) {
    try {
      return new URL(value).hostname.replace(/^www\./, '');
    } catch (err) {
      return String(value || '');
    }
  }

  function members() {
    return (Array.isArray(AGX.members) ? AGX.members : [])
      .filter(function (m) { return m && safeUrl(m.url); });
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function fileNo(n) {
    return String(n).padStart(3, '0');
  }

  function displayDate(value) {
    if (!value) return '—';
    var date = new Date(String(value) + 'T00:00:00');
    if (isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date).toUpperCase();
  }

  function updateCounts(list) {
    var n = pad(list.length);
    document.querySelectorAll('[data-count-listed]').forEach(function (el) {
      el.textContent = n;
    });
    document.querySelectorAll('[data-updated]').forEach(function (el) {
      el.textContent = displayDate(AGX.updated);
    });
  }

  function memberCard(m, i) {
    var n = fileNo(i + 1);
    var file = 'AGX-' + n;
    var tone = ' record--c' + ((i % 3) + 1);
    var url = safeUrl(m.url);
    var name = esc(m.name || m.slug || 'Untitled');
    var practice = esc(m.practice || 'Unclassified');
    var campus = esc(m.campus || '');
    var year = esc(m.year || '');
    var d = esc(domain(url));
    var line = campus + (campus && year ? ' / ' : '') + year;
    var barcode = window.AGXCode39
      ? window.AGXCode39.render(file, { className: 'record__barcode', height: 44 })
      : '';

    return '<a class="record record--member' + tone + '" href="' + esc(url) + '" target="_blank" rel="noopener">' +
      '<span class="record__tab">File <b>' + n + '</b></span>' +
      '<span class="record__top"><span>No. ' + n + '</span><span class="record__mark">Listed</span></span>' +
      '<span class="record__status">' + name + '</span>' +
      '<span class="record__sub">' + practice + (line ? '<br>' + line : '') + '</span>' +
      '<span class="record__rule"></span>' +
      '<span class="record__foot"><span>' + d + '</span><span>Open &rarr;</span></span>' +
      barcode +
      '<span class="record__code"><span>' + file + '</span><span>Code 39</span></span>' +
      '</a>';
  }

  function renderRegistry() {
    var list = members();
    var grid = document.querySelector('[data-registry]');
    var empty = document.querySelector('[data-register-empty]');

    if (grid) {
      grid.innerHTML = list.map(memberCard).join('');
      grid.dataset.count = String(list.length);
      grid.hidden = list.length === 0;
    }
    if (empty) {
      empty.hidden = list.length !== 0;
    }
    var emptyBar = document.querySelector('.register-empty__barcode');
    if (emptyBar && window.AGXCode39) {
      window.AGXCode39.mount(emptyBar, 'AGX-000', { height: 44 });
    }
    updateCounts(list);
  }

  function bindClock() {
    var nodes = document.querySelectorAll('[data-clock]');
    if (!nodes.length) return;
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    function tick() {
      var parts = fmt.formatToParts(new Date()).reduce(function (acc, p) {
        acc[p.type] = p.value;
        return acc;
      }, {});
      var text = parts.day + ' ' + String(parts.month).toUpperCase() + ' ' + parts.year +
        ' · ' + parts.hour + ':' + parts.minute + ':' + parts.second + ' IST';
      nodes.forEach(function (n) { n.textContent = text; });
    }
    tick();
    window.setInterval(tick, 1000);
  }

  function init() {
    renderRegistry();
    bindClock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
