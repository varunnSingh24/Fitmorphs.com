/* ============================================================
   FITMORPHS — UNIFIED MOTION SYSTEM
   One system owns all animation: GSAP + ScrollTrigger + SplitText
   for reveals and scrubs, Lenis for smooth scroll (desktop only).
   Every tween pulls its timing from MOTION — no ad-hoc durations.
   ============================================================ */
(function () {
  'use strict';

  // Body starts at opacity:0 (see styles.css `body`) so the page never
  // flashes unstyled content; this is what makes it visible. Double-rAF
  // lets the initial paint register so the fade actually transitions.
  // rAF is throttled to near-zero on hidden/backgrounded tabs, so a
  // timeout fallback guarantees the page never gets stuck invisible.
  (function revealBody() {
    var done = false;
    function reveal() {
      if (done) return;
      done = true;
      document.body.classList.add('loaded');
    }
    requestAnimationFrame(function () { requestAnimationFrame(reveal); });
    setTimeout(reveal, 150);
  })();

  var MOTION = {
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeGsap: 'expo.out',
    fast: 0.35,
    base: 0.7,
    slow: 1.1,
    stagger: 0.07,
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    touch: window.matchMedia('(pointer: coarse)').matches
  };
  window.MOTION = MOTION;

  var hasGSAP = typeof window.gsap !== 'undefined';
  if (!hasGSAP) {
    // GSAP failed to load (CDN down/offline) — reveal everything statically and stop.
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.documentElement.classList.add('motion-fallback');
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);

  gsap.defaults({ ease: MOTION.easeGsap });

  /* ------------------------------------------------------------
     LENIS — smooth scroll, desktop only. Reduced-motion and touch
     both get native scroll.
     ------------------------------------------------------------ */
  var lenis = null;
  if (!MOTION.reduced && !MOTION.touch && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    // Let Lenis handle in-page anchor scrolling instead of the old
    // manual easeInOutCubic implementation.
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = id && document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -90, duration: 1.2 });
      });
    });
  }
  window.__fmLenis = lenis;

  /* ------------------------------------------------------------
     REVEAL SYSTEM — data-reveal="lines|fade-up|image|stagger"
     One ScrollTrigger.batch call drives every reveal on the page.
     ------------------------------------------------------------ */
  function revealOne(el) {
    var type = el.getAttribute('data-reveal');
    if (type === 'lines' && SplitText) {
      // Gradient-clipped text (.text-gold-gradient etc.) clips against the
      // element's OWN text content — once SplitText moves that text into
      // child line-divs, the parent has nothing left to clip and the
      // gradient silently fails to paint. Re-apply the same background
      // treatment to each line so the effect survives the split.
      var elStyle = getComputedStyle(el);
      var needsGradientFix = elStyle.webkitBackgroundClip === 'text' || elStyle.backgroundClip === 'text';
      var split = new SplitText(el, { type: 'lines', linesClass: 'fm-split-line' });
      gsap.set(split.lines, { overflow: 'hidden' });
      if (needsGradientFix) {
        gsap.set(split.lines, {
          backgroundImage: elStyle.backgroundImage,
          webkitBackgroundClip: 'text',
          backgroundClip: 'text',
          webkitTextFillColor: 'transparent',
          color: 'transparent'
        });
      }
      split.lines.forEach(function (line) {
        var wrap = document.createElement('span');
        wrap.style.display = 'block';
        wrap.style.overflow = 'hidden';
        line.parentNode.insertBefore(wrap, line);
        wrap.appendChild(line);
      });
      gsap.fromTo(split.lines,
        { yPercent: 110 },
        { yPercent: 0, duration: MOTION.base, stagger: MOTION.stagger, ease: MOTION.easeGsap }
      );
    } else if (type === 'image') {
      var img = el.tagName === 'IMG' ? el : el.querySelector('img');
      var tl = gsap.timeline();
      tl.fromTo(el, { clipPath: 'inset(0 0 0 100% round 0px)' }, { clipPath: 'inset(0 0 0 0% round 0px)', duration: MOTION.slow, ease: MOTION.easeGsap });
      if (img) tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: MOTION.slow, ease: MOTION.easeGsap }, '<');
    } else if (type === 'stagger') {
      var children = el.children.length ? gsap.utils.toArray(el.children) : [el];
      gsap.fromTo(children, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: MOTION.base, stagger: MOTION.stagger, ease: MOTION.easeGsap
      });
    } else {
      gsap.to(el, { opacity: 1, y: 0, duration: MOTION.base, ease: MOTION.easeGsap });
    }
  }

  function initReveals() {
    var els = gsap.utils.toArray('[data-reveal]');

    if (MOTION.reduced) {
      els.forEach(function (el) {
        gsap.set(el, { y: 0, clearProps: 'transform,clipPath' });
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      });
    } else {
      // Prep initial (hidden) states before ScrollTrigger measures anything.
      els.forEach(function (el) {
        var type = el.getAttribute('data-reveal');
        if (type === 'lines') {
          gsap.set(el, { opacity: 1 });
        } else if (type === 'image') {
          gsap.set(el, { clipPath: 'inset(0 0 0 0 round 0px)', opacity: 1 });
          var img = el.tagName === 'IMG' ? el : el.querySelector('img');
          if (img) gsap.set(img, { scale: 1.06, transformOrigin: 'center' });
        } else if (type === 'stagger') {
          // children animate; parent itself stays visible
          gsap.set(el, { opacity: 1 });
        } else {
          gsap.set(el, { opacity: 0, y: 24 });
        }
      });

      // Anything already past the trigger point (above-the-fold content,
      // typically the hero) reveals immediately and synchronously — it
      // must never depend on a scroll event or a rAF tick to become
      // visible, since both can be delayed (slow devices, a backgrounded
      // tab during load). Only elements still below the fold join the
      // scroll-triggered batch.
      var triggerY = window.innerHeight * 0.85;
      var alreadyVisible = [];
      var belowFold = [];
      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        (rect.top < triggerY ? alreadyVisible : belowFold).push(el);
      });
      alreadyVisible.forEach(revealOne);

      if (belowFold.length && ScrollTrigger) {
        ScrollTrigger.batch(belowFold, {
          start: 'top 85%',
          once: true,
          onEnter: function (batch) { batch.forEach(revealOne); }
        });
      }
    }

    // Legacy reveal classes (fade-in-section, stagger-children, scroll-stagger)
    // predate this system and are still used across most pages. Rather than a
    // risky sitewide find/replace, this batch drives their existing CSS
    // transitions (same visual result) through the same ScrollTrigger timing
    // instead of three separate ad-hoc IntersectionObservers.
    if (!ScrollTrigger) {
      document.querySelectorAll('.fade-in-section').forEach(function (el) { el.classList.add('is-visible'); });
      document.querySelectorAll('.stagger-children').forEach(function (el) { el.classList.add('stagger-visible'); });
      document.querySelectorAll('.scroll-stagger').forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    ScrollTrigger.batch('.fade-in-section, .stagger-children, .scroll-stagger', {
      start: 'top 85%',
      once: true,
      onEnter: function (batch) {
        batch.forEach(function (el) {
          if (el.classList.contains('fade-in-section')) el.classList.add('is-visible');
          else if (el.classList.contains('stagger-children')) el.classList.add('stagger-visible');
          else if (el.classList.contains('scroll-stagger')) el.classList.add('in-view');
        });
      }
    });
  }

  /* ------------------------------------------------------------
     NAV — hide on scroll down, reveal on scroll up. Backdrop blur
     + hairline after 80px. Active link gets a sliding underline.
     ------------------------------------------------------------ */
  function initNav() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    var lastY = window.scrollY;
    var navHidden = false;

    if (ScrollTrigger && !MOTION.reduced) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: function (self) {
          var y = self.scroll();
          nav.classList.toggle('navbar-scrolled', y > 80);
          if (y < 80) {
            if (navHidden) { gsap.to(nav, { yPercent: 0, duration: MOTION.fast, ease: MOTION.easeGsap }); navHidden = false; }
            lastY = y;
            return;
          }
          var goingDown = y > lastY;
          if (goingDown && !navHidden) {
            gsap.to(nav, { yPercent: -100, duration: MOTION.fast, ease: MOTION.easeGsap });
            navHidden = true;
          } else if (!goingDown && navHidden) {
            gsap.to(nav, { yPercent: 0, duration: MOTION.fast, ease: MOTION.easeGsap });
            navHidden = false;
          }
          lastY = y;
        }
      });
    } else {
      window.addEventListener('scroll', function () {
        nav.classList.toggle('navbar-scrolled', window.scrollY > 80);
      }, { passive: true });
    }

    // Sliding gold underline that moves between nav links instead of
    // blinking on/off per-link.
    var links = Array.prototype.slice.call(nav.querySelectorAll('.nav-links a:not(.btn-nav)'));
    if (links.length) {
      var indicator = document.createElement('span');
      indicator.className = 'nav-underline';
      indicator.setAttribute('aria-hidden', 'true');
      var container = nav.querySelector('.nav-links');
      if (container) {
        container.style.position = container.style.position || 'relative';
        container.appendChild(indicator);

        var moveTo = function (el) {
          if (!el) { gsap.set(indicator, { opacity: 0 }); return; }
          var cRect = container.getBoundingClientRect();
          var r = el.getBoundingClientRect();
          gsap.to(indicator, {
            opacity: 1,
            x: r.left - cRect.left,
            width: r.width,
            duration: MOTION.fast,
            ease: MOTION.easeGsap
          });
        };

        var active = links.filter(function (a) { return a.classList.contains('active'); })[0];
        requestAnimationFrame(function () { moveTo(active); });

        links.forEach(function (a) {
          a.addEventListener('mouseenter', function () { moveTo(a); });
        });
        container.addEventListener('mouseleave', function () { moveTo(active); });
      }
    }
  }

  /* ------------------------------------------------------------
     MAGNETIC CTA — replaces the deleted infinite pulse. Cursor
     pull within 60px, spring back on leave.
     ------------------------------------------------------------ */
  function initMagnetic() {
    if (MOTION.touch) return;
    var targets = gsap.utils.toArray('.btn-hero-cta, .btn-magnetic');
    targets.forEach(function (btn) {
      var reach = 60;
      var quickX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
      var quickY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        var dist = Math.hypot(x, y);
        var pull = Math.max(0, 1 - dist / (reach + Math.max(r.width, r.height) / 2));
        quickX(x * 0.35 * pull);
        quickY(y * 0.35 * pull);
      });
      btn.addEventListener('mouseleave', function () {
        quickX(0);
        quickY(0);
      });
    });
  }

  /* ------------------------------------------------------------
     STAT COUNTERS — gsap.to + snap, tabular-nums so digits don't
     jitter. Units fade in after the number lands.
     ------------------------------------------------------------ */
  function initCounters() {
    var counters = gsap.utils.toArray('.counter-val[data-target], .impact-main-stat[data-target], .impact-small-stat[data-target]');
    if (!counters.length) return;
    counters.forEach(function (el) {
      el.style.fontVariantNumeric = 'tabular-nums';
      var target = parseFloat(el.getAttribute('data-target'));
      if (!isFinite(target)) return;
      var isDecimal = String(target).includes('.');
      var suffix = el.getAttribute('data-suffix') || '';
      var suffixEl = null;
      if (suffix) {
        suffixEl = document.createElement('span');
        suffixEl.textContent = suffix;
        suffixEl.style.opacity = '0';
        el.insertAdjacentElement('afterend', suffixEl);
      }
      if (MOTION.reduced) {
        el.textContent = (isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString('en-IN'));
        if (suffixEl) suffixEl.style.opacity = '1';
        return;
      }
      var obj = { val: 0 };
      var fmt = function (v) { return isDecimal ? v.toFixed(1) : Math.round(v).toLocaleString('en-IN'); };
      el.textContent = fmt(0);
      if (!ScrollTrigger) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: target,
            duration: MOTION.slow + 0.4,
            ease: 'power2.out',
            snap: isDecimal ? { val: 0.1 } : { val: 1 },
            onUpdate: function () { el.textContent = fmt(obj.val); },
            onComplete: function () {
              el.textContent = fmt(target);
              if (suffixEl) gsap.to(suffixEl, { opacity: 1, duration: MOTION.fast });
            }
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------
     PAGE TRANSITIONS — one gold-wipe timeline, promise-based
     navigation (navigate on onComplete, not setTimeout). Replaces
     the two competing setTimeout-based systems that used to fight
     over the same links. Respects modifier/middle-clicks so
     new-tab intents are never hijacked.
     ------------------------------------------------------------ */
  function initPageTransitions() {
    var wipe = document.getElementById('page-wipe');
    if (!wipe) return;

    if (MOTION.reduced) {
      gsap.set(wipe, { autoAlpha: 0 });
    } else {
      gsap.set(wipe, { xPercent: -101 });
      gsap.to(wipe, {
        xPercent: 101,
        duration: MOTION.slow - 0.1, // 0.6s reveal-in on arrival
        delay: 0.05,
        ease: MOTION.easeGsap,
        onComplete: function () { gsap.set(wipe, { xPercent: -101 }); }
      });
    }

    var selector = 'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="javascript"])';
    document.querySelectorAll(selector).forEach(function (link) {
      link.addEventListener('click', function (e) {
        // New-tab intents (middle-click, cmd/ctrl/shift/alt-click) navigate natively.
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('//')) return;
        e.preventDefault();
        if (MOTION.reduced) { window.location.href = href; return; }
        gsap.to(wipe, {
          xPercent: 0,
          duration: MOTION.fast + 0.1, // 0.45s cover-out before navigating
          ease: MOTION.easeGsap,
          onComplete: function () { window.location.href = href; }
        });
      });
    });
  }

  /* ------------------------------------------------------------
     SPLASH — one GSAP master timeline, plays once per session,
     skippable on click/keypress. Hands off into the hero reveal
     with a ~0.3s overlap so the exit and entrance read as one move.
     Returns a promise-like "onDone" callback invoker.
     ------------------------------------------------------------ */
  function initSplash(onDone) {
    var intro = document.getElementById('fm-intro');
    if (!intro) { onDone(); return; }

    var seen = sessionStorage.getItem('fm_intro_seen');
    if (seen || MOTION.reduced) {
      intro.style.display = 'none';
      onDone();
      return;
    }
    sessionStorage.setItem('fm_intro_seen', '1');
    document.body.style.overflow = 'hidden';

    var letters = intro.querySelectorAll('.fm-letter');
    var hairlines = intro.querySelectorAll('.fm-hairline');
    var sweep = intro.querySelector('.fm-sweep');
    var eyebrow = intro.querySelector('.fm-eyebrow');
    var tagline = intro.querySelector('.fm-tagline');
    var regMark = intro.querySelector('.fm-reg-small');

    gsap.set(letters, { opacity: 0, filter: 'blur(14px)' });
    gsap.set(hairlines, { scaleX: 0 });
    gsap.set([eyebrow, tagline], { opacity: 0, y: 10 });
    if (regMark) gsap.set(regMark, { opacity: 0 });
    if (sweep) gsap.set(sweep, { xPercent: -150 });

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      document.body.style.overflow = '';
      intro.style.display = 'none';
      onDone();
    }
    // Safety net: GSAP's ticker rides on requestAnimationFrame, which
    // browsers throttle to near-zero on hidden/backgrounded tabs. If the
    // timeline hasn't finished naturally within 3.5s, force the handoff
    // so the page can never get stuck behind the splash.
    setTimeout(finish, 3500);

    var tl = gsap.timeline({ onComplete: finish });

    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.4, ease: MOTION.easeGsap })
      .to(hairlines[0], { scaleX: 1, duration: 0.5, ease: MOTION.easeGsap }, '<0.1')
      .to(letters, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        stagger: 0.035,
        ease: MOTION.easeGsap
      }, '<0.1')
      .to(regMark, { opacity: 1, duration: 0.3 }, '>-0.2')
      .to(sweep, { xPercent: 150, duration: 0.55, ease: 'power2.inOut' }, '<')
      .to(hairlines[1], { scaleX: 1, duration: 0.4, ease: MOTION.easeGsap }, '<0.1')
      .to(tagline, { opacity: 1, y: 0, duration: 0.4, ease: MOTION.easeGsap }, '<0.1')
      // Hold, then curtain exit — hero reveal fires 0.3s before this
      // finishes so the handoff overlaps rather than hard-cutting.
      .to({}, { duration: 0.35 })
      .call(finish, null, '-=0.3')
      .to(intro, { autoAlpha: 0, duration: 0.5, ease: MOTION.easeGsap }, '-=0.1');

    // Skippable on click/keypress.
    function skip() {
      tl.progress(1);
      window.removeEventListener('keydown', skip);
      intro.removeEventListener('click', skip);
    }
    window.addEventListener('keydown', skip, { once: true });
    intro.addEventListener('click', skip, { once: true });
  }

  /* ------------------------------------------------------------
     MARQUEES — pause on hover (unified across all marquee tracks).
     ------------------------------------------------------------ */
  function initMarquees() {
    document.querySelectorAll('.fm-marquee-track, .fm-reports-marquee, .marquee-text').forEach(function (track) {
      track.addEventListener('mouseenter', function () { track.style.animationPlayState = 'paused'; });
      track.addEventListener('mouseleave', function () { track.style.animationPlayState = 'running'; });
    });
  }

  /* ------------------------------------------------------------
     FOOTER — columns settle in with a subtle stagger on scroll-in.
     Must run before initReveals() so the data-reveal attribute it
     adds is present when the batch scan happens.
     ------------------------------------------------------------ */
  function initFooter() {
    var grid = document.querySelector('footer .footer-grid');
    if (!grid || MOTION.reduced || grid.hasAttribute('data-reveal')) return;
    grid.setAttribute('data-reveal', 'stagger');
  }

  /* ------------------------------------------------------------
     TEAM CARDS — grayscale→color portrait reveal on scroll-in
     (pure CSS filter transition; this just toggles the class).
     ------------------------------------------------------------ */
  function initTeamCards() {
    var cards = gsap.utils.toArray('.team-card.flip-card');
    if (!cards.length) return;
    if (MOTION.reduced || !ScrollTrigger) {
      cards.forEach(function (c) { c.classList.add('in-view'); });
      return;
    }
    ScrollTrigger.batch('.team-card.flip-card', {
      start: 'top 85%',
      once: true,
      onEnter: function (batch) { batch.forEach(function (c) { c.classList.add('in-view'); }); }
    });
  }

  /* ------------------------------------------------------------
     SIGNATURE VITALS LINE (index.html only) — a thin gold ECG-style
     path that draws itself across the page as you scroll: erratic
     near the top (the problem), settling into a calm strong pulse by
     the time the page reaches the results section. Desktop only.
     ------------------------------------------------------------ */
  function initVitalsLine() {
    var path = document.getElementById('fm-vitals-path');
    if (!path || MOTION.touch || MOTION.reduced || !ScrollTrigger) return;
    var length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: function (self) {
        gsap.set(path, { strokeDashoffset: length * (1 - self.progress) });
      }
    });
  }

  /* ------------------------------------------------------------
     INIT — splash runs first (if present); everything else
     (including the hero's own data-reveal) starts once the splash
     hands off, so the exit and hero entrance overlap by design
     rather than the hero revealing invisibly underneath the splash.
     Pages with no splash start everything immediately.
     ------------------------------------------------------------ */
  function initRest() {
    initFooter();
    initReveals();
    initNav();
    initMagnetic();
    initPageTransitions();
    initCounters();
    initMarquees();
    initTeamCards();
    initVitalsLine();
    if (ScrollTrigger) ScrollTrigger.refresh();
  }

  function init() {
    initSplash(initRest);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
