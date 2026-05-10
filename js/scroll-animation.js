/**
 * scroll-animation.js — Fade-in on scroll using IntersectionObserver
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (!entry.target.classList.contains('stagger')) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .fade-in, .stagger').forEach(function(el) {
      observer.observe(el);
    });
  });
})();
