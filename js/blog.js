/**
 * blog.js — Blog filter functionality
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Abstract toggles (for research page too)
    document.querySelectorAll('.abstract-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var abstract = btn.closest('.pub-body').querySelector('.pub-abstract');
        if (!abstract) return;
        var isOpen = abstract.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.querySelector('.toggle-text').textContent = isOpen ? 'Hide abstract' : 'Show abstract';
      });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        document.querySelectorAll('[data-category]').forEach(function(item) {
          var cat = item.dataset.category;
          var show = filter === 'all' || cat === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });

    updateResearchCounts();
  });

  function updateResearchCounts() {
    var publicationCountEl = document.getElementById('publicationCount');
    var conferenceCountEl = document.getElementById('conferenceCount');
    var datasetCountEl = document.getElementById('datasetCount');

    if (!publicationCountEl && !conferenceCountEl && !datasetCountEl) return;

    var publicationCount = document.querySelectorAll('#publicationList [data-category=\"publication\"]').length;
    var conferenceCount = document.querySelectorAll('#publicationList [data-category=\"presentation\"]').length;
    var datasetCount = document.querySelectorAll('#publicationList [data-category=\"dataset\"]').length;

    if (publicationCountEl) publicationCountEl.textContent = publicationCount + '+';
    if (conferenceCountEl) conferenceCountEl.textContent = conferenceCount + '+';
    if (datasetCountEl) datasetCountEl.textContent = datasetCount + '+';
  }
})();
