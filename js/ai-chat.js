/**
 * ai-chat.js — Gemini AI chat widget for supathdhital.com.np
 *
 * SETUP (one-time):
 *  1. Go to https://aistudio.google.com and sign in with your Google account.
 *  2. Click "Get API key" → "Create API key" (free tier, no credit card needed).
 *  3. Replace 'YOUR_GEMINI_API_KEY' below with your key.
 *  4. For security, in Google AI Studio → Manage key → add an HTTP referrer
 *     restriction to your domain (e.g. https://supathdhital.com.np/*).
 */
(function () {
  'use strict';

  /* ── CONFIG ──────────────────────────────────────────────── */
  /* ⚠ REPLACE THIS KEY when quota is exceeded:
       1. Go to https://aistudio.google.com → Get API key → Create API key
       2. Paste the new key below (free tier resets daily)
       3. In AI Studio → Manage key → add HTTP referrer: https://supathdhital.com.np/* */
  var API_KEY = 'AIzaSyAmUOI2MdXdNrBrbumvcuXX9jYX4boOqkc';
  var MODEL   = 'gemini-2.0-flash';
  /* ────────────────────────────────────────────────────────── */

  var API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/'
    + MODEL + ':generateContent?key=' + API_KEY;

  var SYSTEM_PROMPT = [
    'You are an AI research assistant on Supath Dhital\'s personal portfolio website (supathdhital.com.np).',
    'Your role is to help visitors learn about Supath\'s research, projects, publications, skills, background, and how to connect with him.',
    'Be professional, concise, and friendly. Keep answers under 200 words unless more detail is clearly needed.',
    '',
    'ABOUT SUPATH DHITAL:',
    'Supath Dhital is a GIS/Remote Sensing researcher and developer at the Surface Dynamics Modeling Lab (SDML), Department of Geography and the Environment, University of Alabama. His research advisor is Dr. Sagy Cohen. He maintains a 4.0 GPA in his MS program.',
    '',
    'RESEARCH FOCUS:',
    '- Surrogate Modeling & AI in Water Science (CNN-based surrogate flood inundation mapping)',
    '- Operational Flood Forecasting Systems (NOAA OWP HAND-FIM)',
    '- Hydroclimatic Extremes & Terrestrial Hydrology',
    '- GIScience for Decision Support & Disaster Preparedness',
    '- Geospatial Big Data Processing for Hydrology',
    '',
    'KEY ACHIEVEMENT: Developed a CNN surrogate model that achieves 35% better accuracy than NOAA\'s baseline HAND-FIM system and runs 10,000× faster than physics-based models (HEC-RAS). Components are now integrated into NOAA\'s operational pipeline.',
    '',
    'OPEN-SOURCE SOFTWARE (all on PyPI and GitHub):',
    '1. FIMserv — Modular Flood Inundation Mapping platform using NOAA OWP HAND-FIM. 40,000+ downloads. pip install fimserve. github.com/sdmlua/FIMserv',
    '2. FIMeval — Evaluation framework for flood-inundation predictions across benchmark databases. 15,000+ downloads. github.com/sdmlua/fimeval',
    '3. msfootprint — Python package to extract Microsoft global building footprints by geographic boundary. Ideal for disaster damage assessment. 15,000+ downloads. github.com/supathdhitalGEO/msfootprint',
    '4. RiverJoin — Spatial matching and joining framework for river flowline datasets like NHDPlus and MERIT Hydro. 2,000+ downloads. github.com/sdmlua/RiverJoin',
    '5. FIMbox — github.com/sdmlua/fimbox',
    'Total: 72,000+ PyPI downloads across all tools.',
    '',
    'PUBLICATIONS:',
    '1. "Enhancement of the NOAA Flood Inundation Mapping Framework (OWP HAND-FIM) through Surrogate Modeling" — Water Resources Research, 2025. Authors: Dhital, S., Cohen, S., Nikrou, P., Baruah, A., Chen, Y., Munasinghe, D., Devi, D. DOI: 10.22541/essoar.173850027.01843831/v1',
    '2. "Methods to improve run time of hydrologic models: opportunities and challenges in the machine learning era" — arXiv preprint, 2024. DOI: 10.48550/arXiv.2408.02242',
    '12+ total publications and conference presentations.',
    '',
    'SKILLS:',
    'Python, R, JavaScript; ArcGIS Pro, QGIS, GDAL, rasterio, Google Earth Engine, ArcGIS Online; PyTorch, TensorFlow (CNN surrogate models); AWS S3, cloud workflows; PostgreSQL/PostGIS; Flask web apps.',
    '',
    'BACKGROUND:',
    '- HOT (Humanitarian OpenStreetMap Team) Data Quality Intern 2022 — selected as 1 of 28 from 1,000+ global applicants. Validated 70+ projects across 12 countries.',
    '- Geomatics Engineering background from Nepal.',
    '',
    'BLOG (at supathdhital.com.np/blog.html):',
    '- "Making Flood Mapping 10,000× Faster with Deep Learning" (March 2025)',
    '- "Why I Build Open-Source Geospatial Tools" (January 2025)',
    '- "Journey to the HOT Data Quality Internship" (November 2022)',
    '',
    'CONTACT:',
    'Email: sdhital@ua.edu or supathdh990@gmail.com',
    'Website: supathdhital.com.np',
    'GitHub: github.com/supathdhitalGEO',
    'LinkedIn: linkedin.com/in/supath-dhital-628b47222',
    'Google Scholar: scholar.google.com/citations?user=aczRhooAAAAJ',
    'YouTube: youtube.com/@sdgeo',
    '',
    'If asked about topics outside Supath\'s work, answer helpfully using your general knowledge and note when you\'re doing so.',
  ].join('\n');

  var SUGGESTIONS = [
    'What is Supath\'s research focus?',
    'What open-source tools has he built?',
    'What are his recent publications?',
    'How can I contact Supath?'
  ];

  var CONTACT_REPLY = 'You can contact Supath by email at **sdhital@ua.edu** or **supathdh990@gmail.com**. You can also connect through LinkedIn: linkedin.com/in/supath-dhital-628b47222, GitHub: github.com/supathdhitalGEO, Google Scholar: scholar.google.com/citations?user=aczRhooAAAAJ, or YouTube: youtube.com/@sdgeo.';

  var history   = [];
  var panel, overlay, msgsEl, suggestEl, inputEl, sendEl, typingRow;
  var isOpen    = false;
  var isBusy    = false;

  /* ── Build and inject UI ── */
  function init() {
    injectCriticalCSS();
    injectCSS();
    buildUI();
    wireToggle();
  }

  function injectCriticalCSS() {
    if (document.getElementById('ai-chat-critical-css')) return;
    var style = document.createElement('style');
    style.id = 'ai-chat-critical-css';
    style.textContent =
      '.ai-overlay{position:fixed;inset:0;z-index:9998;opacity:0;pointer-events:none}' +
      '.ai-panel{position:fixed;top:0;right:0;bottom:0;width:380px;z-index:9999;display:flex;flex-direction:column;transform:translateX(100%);transition:none}' +
      '.ai-panel.open{transform:translateX(0)}' +
      '@media(max-width:480px){.ai-panel{width:100%}}';
    document.head.appendChild(style);
  }

  function injectCSS() {
    if (document.querySelector('link[href*="ai-chat.css"]')) return;
    var link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = '/css/ai-chat.css';
    document.head.appendChild(link);
  }

  function buildUI() {
    /* Overlay */
    overlay = document.createElement('div');
    overlay.className = 'ai-overlay';
    overlay.addEventListener('click', closePanel);
    document.body.appendChild(overlay);

    /* Panel */
    panel = document.createElement('div');
    panel.className = 'ai-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Ask AI about Supath Dhital');

    var noKey = (API_KEY === 'YOUR_GEMINI_API_KEY');

    panel.innerHTML =
      /* Header */
      '<div class="ai-head">' +
        '<div class="ai-head-left">' +
          '<div class="ai-head-icon">' +
            sparkleIcon() +
          '</div>' +
          '<div>' +
            '<div class="ai-head-name">Ask about Supath</div>' +
            '<div class="ai-head-sub">Powered by Google Gemini</div>' +
          '</div>' +
        '</div>' +
        '<button class="ai-close-btn" id="ai-close-btn" aria-label="Close chat">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +

      /* No-key warning */
      (noKey
        ? '<div class="ai-nokey">⚠ <strong>API key not set.</strong> Open <code>js/ai-chat.js</code>, replace <code>YOUR_GEMINI_API_KEY</code> with a free key from <a href="https://aistudio.google.com" target="_blank" rel="noopener">aistudio.google.com</a>.</div>'
        : '') +

      /* Messages */
      '<div class="ai-msgs" id="ai-msgs"></div>' +

      /* Suggestion chips */
      '<div class="ai-suggestions" id="ai-suggestions">' +
        SUGGESTIONS.map(function (s) {
          return '<button class="ai-chip">' + escHtml(s) + '</button>';
        }).join('') +
      '</div>' +

      /* Input footer */
      '<div class="ai-foot">' +
        '<div class="ai-input-row">' +
          '<input class="ai-input" id="ai-input" type="text"' +
            ' placeholder="Ask anything about Supath…" autocomplete="off"' +
            (noKey ? ' disabled' : '') + ' />' +
          '<button class="ai-send" id="ai-send" aria-label="Send"' +
            (noKey ? ' disabled' : '') + '>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="ai-powered">Powered by Google Gemini · supathdhital.com.np</div>' +
      '</div>';

    document.body.appendChild(panel);

    /* Allow one paint frame before enabling the slide transition — prevents
       the panel from briefly appearing at translateX(0) on page load/refresh */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panel.classList.add('ai-panel-ready');
      });
    });

    /* Cache elements */
    msgsEl    = document.getElementById('ai-msgs');
    suggestEl = document.getElementById('ai-suggestions');
    inputEl   = document.getElementById('ai-input');
    sendEl    = document.getElementById('ai-send');

    /* Events */
    document.getElementById('ai-close-btn').addEventListener('click', closePanel);
    if (!noKey) {
      sendEl.addEventListener('click', handleSend);
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
      });
      suggestEl.querySelectorAll('.ai-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          suggestEl.style.display = 'none';
          sendMessage(chip.textContent);
        });
      });
    }

    /* Welcome message */
    appendBot('Hi! I\'m Supath\'s AI assistant. Ask me anything about his research, publications, open-source tools, background, or how to get in touch. What would you like to know?');
  }

  function wireToggle() {
    var btn = document.getElementById('ai-chat-toggle');
    if (btn) { btn.addEventListener('click', openPanel); return; }
    /* Retry if header hasn't loaded yet */
    setTimeout(wireToggle, 150);
  }

  /* ── Panel open / close ── */
  function openPanel() {
    isOpen = true;
    overlay.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (inputEl && !inputEl.disabled) inputEl.focus(); }, 320);
  }

  function closePanel() {
    isOpen = false;
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Send ── */
  function handleSend() {
    if (isBusy) return;
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    if (suggestEl) suggestEl.style.display = 'none';
    sendMessage(text);
  }

  function sendMessage(text) {
    isBusy = true;
    if (sendEl) sendEl.disabled = true;

    appendUser(text);
    history.push({ role: 'user', parts: [{ text: text }] });
    showTyping();

    var localReply = getLocalReply(text);
    if (localReply) {
      setTimeout(function () {
        hideTyping();
        history.push({ role: 'model', parts: [{ text: localReply }] });
        appendBot(localReply);
        done();
      }, 220);
      return;
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: history,
        generationConfig: { temperature: 0.72, maxOutputTokens: 700, topP: 0.9 }
      })
    })
    .then(function (r) {
      return r.json()
        .then(function (data) {
          data._httpStatus = r.status;
          return data;
        })
        .catch(function () {
          return {
            error: {
              code: r.status,
              message: r.statusText || 'Gemini request failed'
            }
          };
        });
    })
    .then(function (data) {
      hideTyping();
      if (data.error) {
        var code = data.error.code || data._httpStatus || 0;
        var msg  = data.error.message || '';
        var friendly;
        if (code === 429 || msg.toLowerCase().indexOf('quota') !== -1 || msg.toLowerCase().indexOf('exceeded') !== -1 || msg.toLowerCase().indexOf('rate') !== -1) {
          friendly = 'Gemini is temporarily rate-limited, but I can still answer common portfolio questions here. Try asking about Supath\'s research, open-source tools, publications, skills, background, or contact details.';
        } else if (code === 400) {
          friendly = 'Sorry, I couldn\'t process that request. Please try rephrasing your question.';
        } else if (code === 403 || code === 401) {
          friendly = 'The Gemini API key is not currently accepting requests. Please contact Supath at **sdhital@ua.edu**.';
        } else {
          friendly = 'Something went wrong on my end. Please try again shortly or reach out at **sdhital@ua.edu**.';
        }
        history.push({ role: 'model', parts: [{ text: friendly }] });
        appendBot(friendly);
        done(); return;
      }
      var reply = data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text;
      if (!reply) {
        reply = 'Gemini did not return a usable response. Please try rephrasing, or contact Supath at **sdhital@ua.edu**.';
      }
      history.push({ role: 'model', parts: [{ text: reply }] });
      appendBot(reply);
      done();
    })
    .catch(function () {
      hideTyping();
      appendBot('Network error — please check your connection and try again.');
      done();
    });

    function done() {
      isBusy = false;
      if (sendEl) sendEl.disabled = false;
      if (inputEl) inputEl.focus();
    }
  }

  function getLocalReply(text) {
    var q = String(text || '').toLowerCase();

    if (/(contact|email|reach|connect|linkedin|github|scholar|youtube)/.test(q)) {
      return CONTACT_REPLY;
    }

    if (/(research|focus|work on|study|advisor|lab)/.test(q)) {
      return 'Supath focuses on GIScience, remote sensing, AI-assisted flood inundation mapping, operational flood forecasting, hydroclimatic extremes, and geospatial big-data workflows for hydrology. He works with the Surface Dynamics Modeling Lab at the University of Alabama under Dr. Sagy Cohen.';
    }

    if (/(open.?source|tool|software|package|pypi|fimserv|fimeval|msfootprint|riverjoin|fimbox)/.test(q)) {
      return 'Supath has built several open-source geospatial tools, including **FIMserv** for modular flood inundation mapping, **FIMeval** for evaluating flood predictions, **msfootprint** for extracting MS footprints based on AOI, plus **RiverJoin** and **FIMbox**. Together, these tools have more than 72,000 PyPI downloads.';
    }

    if (/(publication|paper|article|doi|conference|presentation)/.test(q)) {
      return 'Recent work includes **"Enhancement of the NOAA Flood Inundation Mapping Framework (OWP HAND-FIM) through Surrogate Modeling"** in Water Resources Research, 2025, and **"Methods to improve run time of hydrologic models: opportunities and challenges in the machine learning era"** on arXiv, 2024. Supath has 12+ publications and conference presentations.';
    }

    if (/(skill|programming|python|gis|remote sensing|machine learning|ml|cloud|database)/.test(q)) {
      return 'Supath works with Python, R, JavaScript, ArcGIS Pro, QGIS, GDAL, rasterio, Google Earth Engine, ArcGIS Online, PyTorch, TensorFlow, AWS S3, PostgreSQL/PostGIS, and Flask. His strongest technical overlap is geospatial data engineering, hydrology, and AI/ML for flood modeling.';
    }

    if (/(background|education|gpa|hot|intern|nepal|geomatics)/.test(q)) {
      return 'Supath has a Geomatics Engineering background from Nepal and is pursuing graduate research at the University of Alabama with a 4.0 GPA. He was also a HOT Data Quality Intern in 2022, selected from a global applicant pool, and worked on validation across humanitarian mapping projects.';
    }

    return null;
  }

  /* ── DOM helpers ── */
  function appendUser(text) {
    var div = document.createElement('div');
    div.className = 'ai-msg ai-msg-user';
    div.innerHTML = '<div class="ai-bubble">' + escHtml(text) + '</div>';
    msgsEl.appendChild(div);
    scroll();
  }

  function appendBot(text) {
    var div = document.createElement('div');
    div.className = 'ai-msg ai-msg-bot';
    div.innerHTML = '<div class="ai-bubble">' + mdToHtml(text) + '</div>';
    msgsEl.appendChild(div);
    scroll();
  }

  function showTyping() {
    typingRow = document.createElement('div');
    typingRow.className = 'ai-msg ai-msg-bot';
    typingRow.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
    msgsEl.appendChild(typingRow);
    scroll();
  }

  function hideTyping() {
    if (typingRow) { typingRow.remove(); typingRow = null; }
  }

  function scroll() { msgsEl.scrollTop = msgsEl.scrollHeight; }

  /* ── Markdown → HTML (lightweight) ── */
  function mdToHtml(raw) {
    var s = escHtml(raw);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g,     '<em>$1</em>');
    s = s.replace(/`(.+?)`/g,       '<code>$1</code>');
    /* Bullet lists */
    s = s.replace(/((?:^|\n)- .+)+/g, function (block) {
      var items = block.trim().split('\n').map(function (l) {
        return '<li>' + l.replace(/^- /, '') + '</li>';
      });
      return '<ul style="padding-left:1.2rem;margin:.4rem 0">' + items.join('') + '</ul>';
    });
    /* Paragraphs */
    s = s.replace(/\n{2,}/g, '</p><p>');
    s = s.replace(/\n/g, '<br>');
    return '<p>' + s + '</p>';
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  function sparkleIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2c0 0 .6 5.5 2.5 7.5S22 12 22 12s-5.5.6-7.5 2.5S12 22 12 22s-.6-5.5-2.5-7.5S2 12 2 12s5.5-.6 7.5-2.5S12 2 12 2z"/>' +
    '</svg>';
  }

  /* ── Bootstrap ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
