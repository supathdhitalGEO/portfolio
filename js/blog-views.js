/* ============================================================
   blog-views.js — Page view counter for blog posts
   Uses localStorage (persistent) + sessionStorage (dedup).
   Counts once per browser session per post URL.
   No backend or third-party service required.
   ============================================================ */
(function () {
  'use strict';

  var path   = window.location.pathname.replace(/\/+$/, '') || '/';
  var LS_KEY = 'bpv:' + path;  // persistent count
  var SS_KEY = 'bss:' + path;  // "already counted this session" flag

  var count = parseInt(localStorage.getItem(LS_KEY) || '0', 10);

  if (!sessionStorage.getItem(SS_KEY)) {
    count += 1;
    try {
      localStorage.setItem(LS_KEY, String(count));
      sessionStorage.setItem(SS_KEY, '1');
    } catch (e) { /* private browsing / quota exceeded — display only */ }
  }

  function render() {
    var els = document.querySelectorAll('[data-view-count]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = count.toLocaleString();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
}());
