/**
 * theme-toggle.js — Light/Dark mode switch
 */
(function() {
  const KEY = 'sd-theme';
  const root = document.documentElement;

  function setTheme(theme, animate) {
    if (animate && document.body) {
      document.body.classList.add('theme-transitioning');
      setTimeout(function () { document.body.classList.remove('theme-transitioning'); }, 350);
    }
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function getPreferred() {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply immediately (no animation — avoids flash on load)
  setTheme(getPreferred(), false);

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const current = root.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  document.addEventListener('DOMContentLoaded', function() {
    setTheme(root.getAttribute('data-theme') || getPreferred(), false);
  });
})();
