/**
 * cv-metrics.js — Populate CV highlight cards from live site content
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
      fetchDocument('/projects/'),
      fetchDocument('/research/')
    ]).then(function(results) {
      var projectsDoc = results[0];
      var researchDoc = results[1];

      if (projectsDoc) {
        setMetric('tool-downloads', formatCompactTotal(sumDownloadCounts(projectsDoc)));
      }

      if (researchDoc) {
        setMetric('publications', readResearchSummaryMetric(researchDoc, 'Publications'));
        setMetric('datasets', readResearchSummaryMetric(researchDoc, 'Open Research Datasets'));
        setMetric('presentations', readResearchSummaryMetric(researchDoc, 'Presentations'));
      }
    }).catch(function() {
      /* Keep fallback values if fetch fails. */
    });
  });

  function fetchDocument(url) {
    return fetch(url)
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to fetch ' + url);
        return response.text();
      })
      .then(function(html) {
        return new DOMParser().parseFromString(html, 'text/html');
      })
      .catch(function() {
        return null;
      });
  }

  function setMetric(key, value) {
    if (!value) return;
    var el = document.querySelector('[data-cv-metric="' + key + '"]');
    if (el) el.textContent = value;
  }

  function sumDownloadCounts(doc) {
    var total = 0;
    doc.querySelectorAll('#tools-packages .project-stat strong').forEach(function(el) {
      var text = (el.textContent || '').trim();
      if (!/\d/.test(text)) return;
      total += parseCompactNumber(text);
    });
    return total;
  }

  function parseCompactNumber(text) {
    var match = text.match(/([\d.]+)\s*([KMB])?\+?/i);
    if (!match) return 0;
    var value = parseFloat(match[1]);
    var unit = (match[2] || '').toUpperCase();
    if (unit === 'K') return Math.round(value * 1000);
    if (unit === 'M') return Math.round(value * 1000000);
    if (unit === 'B') return Math.round(value * 1000000000);
    return Math.round(value);
  }

  function formatCompactTotal(value) {
    if (!value) return null;
    if (value >= 1000) return Math.round(value / 1000) + 'K+';
    return String(value) + '+';
  }

  function readResearchSummaryMetric(doc, labelText) {
    var cards = doc.querySelectorAll('.research-summary-card');
    for (var i = 0; i < cards.length; i += 1) {
      var label = cards[i].querySelector('.research-summary-label');
      var number = cards[i].querySelector('.research-summary-number');
      if (!label || !number) continue;
      if ((label.textContent || '').trim() === labelText) {
        return (number.textContent || '').trim();
      }
    }
    return null;
  }
}());
