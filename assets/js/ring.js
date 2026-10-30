/* Amrita Global Exchange — ring widget.
   Embed: <div class="agx-ring" data-member="your-slug"></div>
   Then:  <script src="https://amrita-global.github.io/assets/js/ring.js" defer></script>
   No cookies. No tracking. Data loads from the public register. */
(function () {
  'use strict';

  var script = document.currentScript || document.querySelector('script[src*="/ring.js"]');
  var base;
  try {
    base = script && script.src ? new URL('../../', script.src) : new URL('https://amrita-global.github.io/');
  } catch (err) {
    base = new URL('https://amrita-global.github.io/');
  }

  var CSS = [
    ':host{all:initial;display:block;box-sizing:border-box;margin:22px 0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;line-height:1.2;}',
    ':host *,:host *::before,:host *::after{box-sizing:border-box;}',
    '.ring{display:flex;align-items:stretch;width:100%;max-width:560px;min-height:44px;border:1px solid #17150f;background:#ece3cf;color:#17150f;box-shadow:4px 4px 0 rgba(23,21,15,.14);text-align:left;}',
    '.brand{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;flex:none;width:58px;background:#173f39;color:#efe5cf;text-decoration:none;}',
    '.brand b{font-family:"Libre Franklin",Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:-.05em;line-height:1;}',
    '.brand span{font-size:4.5px;letter-spacing:.16em;text-transform:uppercase;color:#c9a53c;}',
    '.brand:hover{background:#a63a1f;color:#efe5cf;}',
    '.meta{display:flex;flex-direction:column;justify-content:center;gap:3px;flex:1;min-width:0;padding:0 11px;}',
    '.meta b{font-size:7.5px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.meta span{font-size:6px;letter-spacing:.12em;text-transform:uppercase;color:#665f4e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.links{display:flex;align-items:stretch;border-left:1px solid #bcae8f;flex:none;}',
    '.links a{display:flex;align-items:center;justify-content:center;padding:0 9px;border-left:1px solid #bcae8f;color:inherit;text-decoration:none;font-size:6.5px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;transition:background .15s,color .15s;}',
    '.links a:first-child{border-left:0;}',
    '.links a:hover{background:#a63a1f;color:#efe5cf;}',
    '.links a:focus-visible,.brand:focus-visible{outline:2px solid #a63a1f;outline-offset:2px;}',
    '@media(max-width:520px){.meta span{display:none}.links a{padding:0 6px;font-size:6px}.brand{width:48px}}',
    '@media(prefers-reduced-motion:reduce){*{transition:none!important;}}'
  ].join('');

  function safeUrl(value) {
    try {
      var u = new URL(String(value), base);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
      return u.href;
    } catch (err) {
      return null;
    }
  }

  function loadData() {
    if (window.AGX) return Promise.resolve(window.AGX);
    if (window.__AGX_DATA_PROMISE__) return window.__AGX_DATA_PROMISE__;
    window.__AGX_DATA_PROMISE__ = new Promise(function (resolve) {
      var existing = document.querySelector('script[data-agx-register]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(window.AGX || { members: [] }); });
        existing.addEventListener('error', function () { resolve({ members: [] }); });
        return;
      }
      var s = document.createElement('script');
      s.setAttribute('data-agx-register', '');
      s.src = new URL('data/members.js', base).href;
      s.onload = function () { resolve(window.AGX || { members: [] }); };
      s.onerror = function () { resolve({ members: [] }); };
      document.head.appendChild(s);
    });
    return window.__AGX_DATA_PROMISE__;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render(host, data) {
    var root = host.shadowRoot || host.attachShadow({ mode: 'open' });
    root.textContent = '';

    var style = document.createElement('style');
    style.textContent = CSS;
    root.appendChild(style);

    var members = (Array.isArray(data.members) ? data.members : [])
      .filter(function (m) { return m && safeUrl(m.url); });
    var hub = safeUrl(data.hub) || base.href;
    var slug = host.getAttribute('data-member') || '';
    var current = -1;
    for (var i = 0; i < members.length; i += 1) {
      if (members[i].slug === slug) { current = i; break; }
    }

    var nav = el('nav', 'ring');
    nav.setAttribute('aria-label', 'Amrita Global Exchange webring');

    var brand = el('a', 'brand');
    brand.href = hub;
    brand.title = 'Amrita Global Exchange — public registry';
    brand.appendChild(el('b', null, 'AGX'));
    brand.appendChild(el('span', null, 'LISTED'));
    nav.appendChild(brand);

    var meta = el('div', 'meta');
    var line1 = el('b');
    var line2 = el('span');
    if (current >= 0) {
      var me = members[current];
      line1.textContent = String(me.name || me.slug || 'MEMBER');
      line2.textContent = 'NO. ' + String(current + 1).padStart(2, '0') + ' / ' + String(members.length).padStart(2, '0') + ' · MEMBER';
    } else {
      line1.textContent = 'PUBLIC REGISTRY';
      line2.textContent = members.length + ' LISTED';
    }
    meta.appendChild(line1);
    meta.appendChild(line2);
    nav.appendChild(meta);

    var links = el('div', 'links');
    if (current >= 0 && members.length) {
      var prev = members[(current - 1 + members.length) % members.length];
      var next = members[(current + 1) % members.length];
      var random = members.length > 1
        ? members[(current + 1 + Math.floor(Math.random() * (members.length - 1))) % members.length]
        : members[current];

      var prevA = el('a', null, '← PREV');
      prevA.href = safeUrl(prev.url);
      prevA.setAttribute('aria-label', 'Previous listing: ' + (prev.name || prev.slug));
      links.appendChild(prevA);

      var randA = el('a', null, 'RANDOM');
      randA.href = safeUrl(random.url);
      randA.setAttribute('aria-label', 'Random listing: ' + (random.name || random.slug));
      links.appendChild(randA);

      var nextA = el('a', null, 'NEXT →');
      nextA.href = safeUrl(next.url);
      nextA.setAttribute('aria-label', 'Next listing: ' + (next.name || next.slug));
      links.appendChild(nextA);
    } else {
      var registry = el('a', null, 'REGISTRY →');
      registry.href = hub;
      registry.setAttribute('aria-label', 'Open the public register');
      links.appendChild(registry);
    }
    nav.appendChild(links);
    root.appendChild(nav);
  }

  function renderAll(data) {
    document.querySelectorAll('.agx-ring').forEach(function (host) {
      render(host, data);
    });
  }

  function boot() {
    loadData().then(renderAll).catch(function () {
      renderAll({ members: [] });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
