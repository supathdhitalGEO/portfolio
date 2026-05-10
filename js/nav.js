/**
 * nav.js — Header/footer injection, mobile nav, scroll effects, active nav
 * All component/asset paths are root-relative so this works from any folder depth.
 */
(function () {
  function loadComponent(selector, url, callback) {
    var el = document.querySelector(selector);
    if (!el) { if (callback) callback(); return; }
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        el.innerHTML = html;
        el.querySelectorAll('script').forEach(function (s) {
          var ns = document.createElement('script');
          if (s.src) ns.src = s.src;
          else ns.textContent = s.textContent;
          document.head.appendChild(ns);
        });
        if (callback) callback();
      })
      .catch(function () { if (callback) callback(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadComponent('#header-placeholder', '/components/header.html', function () {
      initHeader();
      setActiveNav();
      var ac = document.createElement('script');
      ac.src = '/js/ai-chat.js';
      document.body.appendChild(ac);
    });
    loadComponent('#footer-placeholder', '/components/footer.html');

  });

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 10);
      });
    }

    var mobileToggle = document.querySelector('.mobile-toggle');
    var mainNav      = document.querySelector('.main-nav');
    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', function () {
        var isOpen = mainNav.classList.toggle('open');
        mobileToggle.classList.toggle('open', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });
      document.addEventListener('click', function (e) {
        if (header && !header.contains(e.target)) {
          mainNav.classList.remove('open');
          mobileToggle.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* Theme toggle is handled by theme-toggle.js */
  }

  function setActiveNav() {
    /* Normalize current path: strip trailing slash, default to '/' */
    var path = window.location.pathname.replace(/\/+$/, '') || '/';

    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = (link.getAttribute('href') || '/').replace(/\/+$/, '') || '/';
      var active = false;

      if (href === '' || href === '/') {
        active = (path === '' || path === '/' || path === '/index.html');
      } else {
        /* Active if path exactly matches or is a deeper page within that section */
        active = (path === href) || path.startsWith(href + '/');
      }

      link.classList.toggle('active', active);
    });
  }
}());
