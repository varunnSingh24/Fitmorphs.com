// FitMorphs — Premium Script V3

/* =========================================================
   BACK/FORWARD CACHE RESET
   The pageshow event (with persisted===true) is the canonical
   signal for a bfcache restore — reset the page-wipe and body
   state so a page frozen mid-transition becomes interactive
   again. motion.js owns the wipe's resting position (off-screen
   left) on fresh loads; this only handles the bfcache edge case.
   ========================================================= */
window.addEventListener('pageshow', e => {
  const wipe = document.getElementById('page-wipe');
  if (wipe && window.gsap) window.gsap.set(wipe, { xPercent: -101 });
  document.body.style.overflow = '';
  const intro = document.getElementById('fm-intro');
  if (intro && e.persisted) intro.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {

  // Page wipe transition and the homepage splash are now owned entirely
  // by assets/js/motion.js (initPageTransitions / initSplash) — one GSAP
  // timeline each instead of the two competing setTimeout-based systems
  // that used to run here.

  // =========================================================
  // 0. ANNOUNCEMENT BAR — rotating messages + offset navbar
  // =========================================================
  const announcementBar = document.getElementById('announcementBar');
  if (announcementBar) {
    // After bar animation completes, shift navbar down
    setTimeout(() => document.body.classList.add('bar-loaded'), 1400);

    const msgs = announcementBar.querySelectorAll('.announcement-msg');
    let current = 0;

    if (msgs.length > 1) {
      setInterval(() => {
        msgs[current].classList.remove('active');
        current = (current + 1) % msgs.length;
        msgs[current].classList.add('active');
      }, 4000);
    }
  }


  // =========================================================
  // 3. ACTIVE NAV ITEM
  // =========================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });


  // =========================================================
  // 4. HAMBURGER MENU
  // =========================================================
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // =========================================================
  // 5. SCROLL: NAVBAR + PROGRESS BAR
  // =========================================================
  const navbar = document.querySelector('.navbar');
  const progressBar = document.querySelector('.scroll-progress-bar');

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);
    if (progressBar && scrollHeight > 0) progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // =========================================================
  // 6. CUSTOM CURSOR
  // =========================================================
  const cursor = document.querySelector('.custom-cursor');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (cursor && !isTouch) {
    let mouseX = -100, mouseY = -100, curX = -100, curY = -100;
    let started = false;

    // Continuous RAF loop — smooth lerp tracking, never drops positions
    function tick() {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!started) {
        curX = mouseX; curY = mouseY; // snap to position on first move
        cursor.classList.add('visible');
        started = true;
      }
    });

    document.querySelectorAll('a, button, input, textarea, select, .card, .filter-btn, .faq-question, .dark-cat-card, .team-card, .result-card, .video-card, .scroll-card, .badge').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.addEventListener('mouseenter', () => { if (started) cursor.classList.remove('hidden'); });
  } else if (cursor) {
    cursor.style.display = 'none';
  }


  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // (Gold-particle canvas system removed — it targeted canvas.gold-particles,
  // an element no page ever actually renders; the function never ran. The
  // site's signature motion element is now the vitals line in motion.js.)


  // Fade-in / staggered-children reveals and the stat counters are now
  // driven by assets/js/motion.js (one ScrollTrigger.batch call instead
  // of three separate ad-hoc IntersectionObservers here).


  // =========================================================
  // 10-B. SECTION-ORNAMENT SCROLL-IN REVEAL
  // Hairlines on the .section-ornament draw outward from the
  // diamond when the ornament enters the viewport. Toggled
  // by an IntersectionObserver adding `.in-view`.
  // =========================================================
  const ornaments = document.querySelectorAll('.section-ornament');
  if (ornaments.length && 'IntersectionObserver' in window) {
    const ornObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -8% 0px' });
    ornaments.forEach(o => ornObserver.observe(o));
  }


  // Magnetic CTA is now a single implementation in motion.js
  // (initMagnetic) — this used to be two separate, competing
  // mousemove handlers (this one plus "14." further down) both
  // attaching to .btn-shimmer.


  // =========================================================
  // 11. FAQ ACCORDION
  // =========================================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(open => {
        open.classList.remove('active');
        const ans = open.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
        const q = open.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
    // Keyboard support
    question.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); question.click(); }
    });
  });


  // =========================================================
  // 12. GALLERY FILTER
  // =========================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          const cats = item.getAttribute('data-category') || '';
          const match = filter === 'all' || cats.split(' ').includes(filter);
          if (match) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.classList.remove('hidden');
            requestAnimationFrame(() => requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }));
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(() => item.classList.add('hidden'), 300);
          }
        });
      });
    });
  }


  // =========================================================
  // 13. HbA1c COUNTDOWN (diabetes.html)
  // =========================================================
  const hba1cEl = document.getElementById('hba1c-anim');
  if (hba1cEl) {
    const startVal = 9.4, endVal = 5.7;
    const hba1cObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      const duration = 2500;
      const startTime = performance.now();
      const animate = now => {
        const elapsed = Math.min(now - startTime, duration);
        const eased = 1 - Math.pow(1 - elapsed / duration, 3);
        hba1cEl.textContent = (startVal - (startVal - endVal) * eased).toFixed(1);
        if (elapsed < duration) requestAnimationFrame(animate);
        else hba1cEl.textContent = endVal.toFixed(1);
      };
      requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.5 });
    hba1cObserver.observe(hba1cEl);
  }


  // (Duplicate magnetic-CTA handler removed — see motion.js initMagnetic.)


  // =========================================================
  // 15. 3D TILT ON CARDS
  // .team-card excluded — it now owns a dedicated flip-on-hover
  // (see about-inline.css .flip-card-inner), and this generic
  // mouse-tilt was fighting it: two rotations applied to nested
  // elements at once. Team cards get the clean flip only.
  // =========================================================
  if (!isTouch) {
    // NOTE: .blog-card intentionally excluded — it already owns a rich CSS :hover
    // reveal (image lift, gradient slide, content slide-up). Stacking 3D tilt on
    // top causes perspective-rotation to redraw the hit area each mousemove,
    // which oscillates mouseenter/mouseleave near edges and breaks hover/click.
    document.querySelectorAll('.card, .result-card, .scroll-card, .dark-cat-card, .story-card, .expert-card').forEach(card => {
      card.style.perspective = '1000px';
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${(y * -4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
        // Holographic light reflection
        const px = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const py = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty('--mouse-x', px + '%');
        card.style.setProperty('--mouse-y', py + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }


  // (Hero word-by-word animation removed — targeted .hero-global h1, which
  // no page actually uses; dead code. Hero headlines now use
  // data-reveal="lines" via motion.js.)


  // =========================================================
  // 17. HERO PARALLAX
  // =========================================================
  const heroEl = document.querySelector('.hero-global');
  const heroParallax = document.querySelector('.hero-parallax');

  if (heroEl && heroParallax) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      if (scrollTop < heroEl.offsetTop + heroEl.offsetHeight) {
        heroParallax.style.transform = `translateY(${scrollTop * 0.3}px)`;
      }
    }, { passive: true });
  }


  // =========================================================
  // 18. LAZY BLUR-UP IMAGES
  // =========================================================
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('lazy-blur');
        if (img.complete) img.classList.add('loaded');
        else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => imgObserver.observe(img));


  // =========================================================
  // 20. SOCIAL PROOF TICKER
  // =========================================================
  const spToast = document.getElementById('spToast');
  const spText = document.getElementById('spText');

  if (spToast && spText) {
    const spMessages = [
      { name: 'Rahul', city: 'Mumbai', msg: 'just started his transformation journey' },
      { name: 'Priya', city: 'Pune', msg: 'reduced her HbA1c by 3.2 points' },
      { name: 'Suresh', city: 'Delhi', msg: 'reversed Type 2 Diabetes in 87 days' },
      { name: 'Meera', city: 'Hyderabad', msg: 'lost 18kg and is off all medications' },
      { name: 'Arun', city: 'Bangalore', msg: 'completed his 90-day program today' },
      { name: 'Neha', city: 'Chennai', msg: 'reversed her PCOD symptoms naturally' },
      { name: 'Vikram', city: 'Ahmedabad', msg: 'dropped his fasting glucose to 92 mg/dL' },
      { name: 'Sunita', city: 'Kolkata', msg: 'is now insulin-free after 3 months' },
    ];

    let spIdx = 0;
    let spVisible = false;

    function showNextSP() {
      if (spVisible) {
        // Hide first
        spToast.classList.remove('sp-visible');
        setTimeout(() => {
          spIdx = (spIdx + 1) % spMessages.length;
          showMessage();
        }, 500);
      } else {
        showMessage();
      }
    }

    function showMessage() {
      const { name, city, msg } = spMessages[spIdx];
      spText.innerHTML = `<strong>${name} from ${city}</strong> ${msg}`;
      spToast.classList.add('sp-visible');
      spVisible = true;

      // Auto-dismiss after 4s
      setTimeout(() => {
        spToast.classList.remove('sp-visible');
        spVisible = false;
      }, 4200);
    }

    // Start after 8s on first page load, then every 10–14s
    setTimeout(() => {
      showNextSP();
      setInterval(showNextSP, 11000);
    }, 8000);
  }


  // =========================================================
  // 19. TIMELINE DOT ANIMATION
  // =========================================================
  const dotObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('dot-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.timeline-dot').forEach(dot => dotObserver.observe(dot));


  // =========================================================
  // 21. SCROLL JOURNEY DOTS
  // =========================================================
  const scrollDotsNav = document.getElementById('scrollDots');
  if (scrollDotsNav) {
    // Collect all major sections
    const sections = Array.from(document.querySelectorAll('section, .hero-vogue, footer')).filter(s => s.offsetHeight > 100);

    sections.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-hidden', 'true');
      scrollDotsNav.appendChild(dot);
    });

    const dots = scrollDotsNav.querySelectorAll('.scroll-dot');

    const dotScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target);
          if (idx !== -1) {
            dots.forEach(d => d.classList.remove('active'));
            if (dots[idx]) dots[idx].classList.add('active');
          }
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => dotScrollObserver.observe(s));
  }


  // (Slot-machine counter upgrade removed — motion.js's initCounters
  // does a calm gsap.to count-up with tabular-nums instead; a jittery
  // random-digit cycle is exactly the kind of busy effect this pass
  // is supposed to remove, not duplicate.)


  // =========================================================
  // 23. SCROLL-DRIVEN ORB PARALLAX
  // =========================================================
  const orbs = document.querySelectorAll('.gold-bg-orb');
  if (orbs.length && !prefersReducedMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const shift = (scrollY * 0.04 * dir) % 40;
          orb.style.transform = `translate(calc(-50% + ${shift}px), calc(-50% + ${scrollY * 0.02}px)) scale(${1 + scrollY * 0.00005})`;
        });
        ticking = false;
      });
    }, { passive: true });
  }


  // Removed waBubble logic


  // =========================================================
  // 24. SMOOTH SCROLL WITH EASING (nav anchor links)
  // Only on touch/reduced-motion — motion.js hooks these same links
  // through Lenis on desktop, and running both would double-scroll.
  // =========================================================
  const anchorScrollIsTouchOnly = window.matchMedia('(pointer: coarse)').matches || prefersReducedMotion;
  if (anchorScrollIsTouchOnly) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const id = anchor.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        const startY = window.scrollY;
        const endY = target.getBoundingClientRect().top + startY - 90;
        const diff = endY - startY;
        const duration = 700;
        const startTime = performance.now();

        const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = now => {
          const progress = Math.min((now - startTime) / duration, 1);
          window.scrollTo(0, startY + diff * easeInOutCubic(progress));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  }

  // =========================================================
  // 24. TRANSFORMATION SLIDER
  // =========================================================
  document.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('.next');
    const prevBtn = e.target.closest('.prev');
    if (nextBtn || prevBtn) {
      const sliderEl = (nextBtn || prevBtn).closest('.slider-main');
      const slider = sliderEl?.querySelector('.t-slider');
      if (slider) {
        const items = slider.querySelectorAll('.t-item');
        if (nextBtn) slider.appendChild(items[0]);
        if (prevBtn) slider.prepend(items[items.length - 1]);
        
        // Re-trigger animation on the new active slide (always 2nd child)
        const newActive = slider.querySelectorAll('.t-item')[1];
        if (newActive) {
          const content = newActive.querySelector('.t-content');
          if (content) {
            content.style.animation = 'none';
            content.offsetHeight; // reflow
            content.style.animation = '';
          }
        }
      }
    }
  });

});

// =========================================================
// GOLD DROPLETS — generate box-shadow stars on every page
// Each star uses a 2-stop box-shadow: solid core + soft glow,
// giving a crisp, luxurious gold particle that rises upward.
// =========================================================
(function () {
  // Use the actual viewport width so stars are spread edge-to-edge
  // no matter how wide the screen is. Height stays at 2000px to
  // match the CSS ::after offset / translate loop.
  var W = Math.max(window.innerWidth, 1400);
  var H = 2000;

  var goldCore = function () {
    // Subtle core — opacity 0.264–0.60 (20% brighter than before)
    var a = (Math.random() * 0.336 + 0.264).toFixed(2);
    return 'rgba(240,192,64,' + a + ')';
  };
  var goldGlow = function () {
    // Whisper halo — opacity 0.06–0.18 (20% brighter)
    var a = (Math.random() * 0.12 + 0.06).toFixed(2);
    return 'rgba(212,160,23,' + a + ')';
  };

  // Build one particle = core shadow + soft glow at same position
  var buildOne = function (glow) {
    var x = Math.floor(Math.random() * W);
    var y = Math.floor(Math.random() * H);
    var core = x + 'px ' + y + 'px 0 0 ' + goldCore();
    var halo = x + 'px ' + y + 'px ' + glow + 'px 0 ' + goldGlow();
    return core + ',' + halo;
  };

  var generateStars = function (n, glow) {
    var parts = [];
    for (var i = 0; i < n; i++) parts.push(buildOne(glow));
    return parts.join(',');
  };

  var s = document.createElement('style');
  // Reduced counts for smooth scroll / mouse performance
  s.textContent =
    '#stars1,#stars1::after{box-shadow:' + generateStars(111, 2) + '}' +
    '#stars2,#stars2::after{box-shadow:' + generateStars(39, 3) + '}' +
    '#stars3,#stars3::after{box-shadow:' + generateStars(18, 4) + '}';
  document.head.appendChild(s);
})();

/* =========================================================
   TIER 3 EXPANSION — Motion foundations
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  /* ── Scroll-progress: data-progress tooltip + temporary "active" on scroll ── */
  (function () {
    const bar = document.querySelector('.scroll-progress-bar');
    const wrap = document.querySelector('.scroll-progress-container');
    if (!bar || !wrap) return;
    let hideTimer = 0;
    const update = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0;
      bar.style.width = p + '%';
      bar.setAttribute('data-progress', p + '% read');
      wrap.classList.add('active');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => wrap.classList.remove('active'), 900);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  })();

  /* ── Custom cursor state morphing ── */
  if (!coarse) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      const linkSel = 'a, button, [role="button"], .btn, summary, label, input[type="submit"]';
      const imgSel  = '.hero-bg-img, .profile-img, .philosophy-img, .reports-card, .fm-grid img';
      const cardSel = '.glass-card, .blog-card, .vogue-hover-card, .pillar-card, .cat-card-vogue, .expert-card, .team-card, .recipe-card';
      document.addEventListener('mouseover', e => {
        cursor.classList.remove('cursor-link', 'cursor-image', 'cursor-card');
        const t = e.target;
        if (t.closest(linkSel))      cursor.classList.add('cursor-link');
        else if (t.closest(imgSel))  cursor.classList.add('cursor-image');
        else if (t.closest(cardSel)) cursor.classList.add('cursor-card');
      });
    }
  }

  /* ── Directional page-wipe — already-installed click handler will set the direction ── */
  (function () {
    const wipe = document.getElementById('page-wipe');
    if (!wipe) return;
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || a.target === '_blank') return;
      const r = a.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Direction = whichever edge the link is closest to.
      const distances = { left: cx, right: vw - cx, top: cy, bottom: vh - cy };
      const dir = Object.keys(distances).reduce((a, b) => distances[a] < distances[b] ? a : b);
      wipe.classList.remove('wipe-from-left', 'wipe-from-right', 'wipe-from-top', 'wipe-from-bottom');
      wipe.classList.add('wipe-from-' + dir);
    }, true);
  })();

  /* ── Scroll-staggered reveal — apply IntersectionObserver to .scroll-stagger
       containers AND set --i on children once. ── */
  (function () {
    const groups = document.querySelectorAll('.scroll-stagger');
    if (!groups.length) return;
    groups.forEach(g => {
      [...g.children].forEach((c, i) => c.style.setProperty('--i', i));
    });
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); o.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    groups.forEach(g => obs.observe(g));
  })();

  /* ── Generic "add .in-view on intersect" for .fm-art-takeaways, .cost-bar-card ── */
  (function () {
    const inObs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); o.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('.fm-art-takeaways, .cost-bar-card').forEach(el => inObs.observe(el));
    // Pre-set per-item --i on takeaways
    document.querySelectorAll('.fm-art-takeaways ul').forEach(ul => {
      [...ul.children].forEach((li, i) => li.style.setProperty('--i', i));
    });
  })();

  /* ── Sticky author chip (blog template) ── */
  (function () {
    const byline = document.querySelector('.fm-art-byline');
    const hero = document.querySelector('.fm-art-hero');
    if (!byline || !hero) return;
    const chip = document.createElement('div');
    chip.className = 'fm-byline-chip';
    chip.innerHTML = '<span class="fm-byline-chip-dot">A</span><span><span class="who">Dr. Abhishek Mane</span> &middot; reviewed</span>';
    document.body.appendChild(chip);
    const heroObs = new IntersectionObserver(entries => {
      entries.forEach(e => chip.classList.toggle('visible', !e.isIntersecting));
    }, { threshold: 0.05 });
    heroObs.observe(hero);
  })();

  /* ── Typewriter (data-typewriter attr) ── */
  (function () {
    const targets = document.querySelectorAll('[data-typewriter]');
    if (!targets.length || reduced) {
      targets.forEach(t => t.classList.add('done'));
      return;
    }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const full = el.getAttribute('data-typewriter');
        const speed = parseInt(el.getAttribute('data-typewriter-speed'), 10) || 38;
        el.textContent = '';
        let i = 0;
        const tick = () => {
          el.textContent = full.slice(0, ++i);
          if (i < full.length) setTimeout(tick, speed);
          else el.classList.add('done');
        };
        setTimeout(tick, 300);
        o.unobserve(el);
      });
    }, { threshold: 0.55 });
    targets.forEach(t => obs.observe(t));
  })();

  /* ── Word-by-word reveal helper ── */
  window.__fmWordWrap = function (el) {
    if (!el || el.dataset.fmWords === '1') return;
    const txt = el.textContent.trim();
    const words = txt.split(/\s+/);
    el.classList.add('fm-words');
    el.dataset.fmWords = '1';
    el.innerHTML = words.map((w, i) => `<span class="w" style="--w:${i}">${w}</span>`).join(' ');
  };

  /* ── Flip-card tap handler — toggles .is-flipped on click.
       On touch devices, :hover never fires, so this is the only way
       to see the back content. On desktop, hover already shows the
       back; the toggle here doesn't change the visible state because
       the pointer is hovering over the card when clicked. Tap again
       on touch to flip back. ── */
  document.addEventListener('click', e => {
    const card = e.target.closest('.flip-card');
    if (!card) return;
    // Don't intercept anchors/buttons inside the card.
    if (e.target.closest('a, button')) return;
    card.classList.toggle('is-flipped');
  });
});
