/* ============================================================
   FITMORPHS — EDITORIAL BLOG ARTICLE
   Handles: reading-progress bar, auto-generated TOC,
            scroll-spy highlighting, dynamic footer year.
   ============================================================ */
(function () {
  'use strict';

  // ---------- Reading progress ----------
  var progressFill = document.querySelector('.fm-art-progress__fill');
  function updateProgress() {
    if (!progressFill) return;
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop || 0;
    var max = (doc.scrollHeight - window.innerHeight) || 1;
    var pct = Math.min(100, Math.max(0, (scrollTop / max) * 100));
    progressFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ---------- TOC auto-generation ----------
  var tocList = document.querySelector('.fm-art-toc ol');
  var article = document.querySelector('.fm-art-body');
  var headings = [];
  if (tocList && article) {
    var h2s = article.querySelectorAll('h2');
    h2s.forEach(function (h, i) {
      if (!h.id) {
        h.id = 'section-' + (i + 1) + '-' + (h.textContent || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 40);
      }
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.setAttribute('data-target', h.id);
      li.appendChild(a);
      tocList.appendChild(li);
      headings.push(h);
    });
  }

  // ---------- Scroll-spy ----------
  var tocLinks = document.querySelectorAll('.fm-art-toc a');
  function syncSpy() {
    if (!headings.length || !tocLinks.length) return;
    var probe = window.scrollY + 140;
    var activeId = headings[0].id;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].offsetTop <= probe) {
        activeId = headings[i].id;
      } else {
        break;
      }
    }
    tocLinks.forEach(function (link) {
      if (link.getAttribute('data-target') === activeId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }
  window.addEventListener('scroll', syncSpy, { passive: true });
  syncSpy();

  // ---------- Smooth scroll for TOC ----------
  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-target');
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.replaceState(null, '', '#' + id);
      }
    });
  });

  // ---------- Dynamic footer year ----------
  var yearEl = document.querySelector('[data-fm-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
