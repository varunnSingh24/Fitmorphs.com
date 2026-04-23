// FitMorphs — Premium Script V3

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 0-A. PAGE WIPE TRANSITION (all pages)
  // =========================================================
  const pageWipe = document.getElementById('page-wipe');
  if (pageWipe) {
    // Wipe out on arrival (reveal page)
    requestAnimationFrame(() => {
      pageWipe.classList.add('wipe-out');
    });

    // Intercept navigation links for wipe-in
    document.querySelectorAll(
      'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="javascript"])'
    ).forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('//')) {
          e.preventDefault();
          e.stopPropagation(); // prevent double-fire with existing handler
          pageWipe.classList.remove('wipe-out');
          pageWipe.classList.add('wipe-in');
          setTimeout(() => { window.location.href = href; }, 420);
        }
      }, true); // capture phase so it fires before the existing handler
    });
  }


  // =========================================================
  // 0-B. HOMEPAGE INTRO SEQUENCE (first visit per session)
  // =========================================================
  const fmIntro    = document.getElementById('fm-intro');
  const fmWordmark = document.getElementById('fmWordmark');
  const fmRule     = document.getElementById('fmRule');

  if (fmIntro && fmWordmark && fmRule) {
    const alreadySeen = sessionStorage.getItem('fm_intro_seen');

    if (alreadySeen) {
      // Skip intro — remove immediately
      fmIntro.style.display = 'none';
    } else {
      sessionStorage.setItem('fm_intro_seen', '1');
      // Prevent body scroll during intro
      document.body.style.overflow = 'hidden';

      // Timeline:
      // 0ms    — wordmark fades + scales in
      // 300ms  — rule expands
      // 900ms  — rule collapses, wordmark fades out
      // 1200ms — intro fades out, page revealed
      setTimeout(() => {
        fmWordmark.classList.add('reveal');
        setTimeout(() => {
          fmRule.classList.add('expand');
          setTimeout(() => {
            fmRule.classList.remove('expand');
            fmWordmark.style.opacity = '0';
            fmWordmark.style.transform = 'scale(1.04)';
            setTimeout(() => {
              fmIntro.classList.add('fade-out');
              document.body.style.overflow = '';
              setTimeout(() => { fmIntro.style.display = 'none'; }, 520);
            }, 300);
          }, 700);
        }, 300);
      }, 200);
    }
  }


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
  // 1. PAGE LOAD TRANSITION
  // =========================================================
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('loaded')));


  // =========================================================
  // 2. SMOOTH PAGE TRANSITIONS
  // =========================================================
  document.querySelectorAll(
    'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="javascript"])'
  ).forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('//')) {
        e.preventDefault();
        document.body.classList.add('page-exit');
        document.body.classList.remove('loaded');
        setTimeout(() => { window.location.href = href; }, 380);
      }
    });
  });


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
  const navLinks  = document.querySelector('.nav-links');

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
  const navbar      = document.querySelector('.navbar');
  const progressBar = document.querySelector('.scroll-progress-bar');

  const handleScroll = () => {
    const scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);
    if (progressBar && scrollHeight > 0) progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // =========================================================
  // 6. CUSTOM CURSOR
  // =========================================================
  const cursor  = document.querySelector('.custom-cursor');
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


  // =========================================================
  // 7. GOLD PARTICLE CANVAS SYSTEM
  // =========================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // Track mouse for parallax
  let mouseParallaxX = 0, mouseParallaxY = 0;
  if (!isTouch) {
    document.addEventListener('mousemove', e => {
      mouseParallaxX = (e.clientX / window.innerWidth  - 0.5) * 2;  // -1 to 1
      mouseParallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  function initGoldParticles(canvas) {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    const isHeroCanvas = canvas.closest('.hero-vogue') !== null;

    function resize() {
      const parent = canvas.offsetParent || canvas.parentElement;
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      createParticles();
    }

    function createParticles() {
      const count = isMobile
        ? Math.floor(Math.random() * 9) + 20    // 20–28 on mobile
        : Math.floor(Math.random() * 16) + 55;   // 55–70 on desktop (increased)
      particles = [];
      for (let i = 0; i < count; i++) particles.push(makeParticle());
    }

    function makeParticle() {
      return {
        x:          Math.random() * canvas.width,
        y:          Math.random() * canvas.height,
        r:          Math.random() * 2.2 + 0.8,               // slightly smaller: 0.8–3px
        speed:      Math.random() * 0.85 + 0.2,              // 0.2–1.05 px/frame
        opacity:    Math.random() * 0.37 + 0.08,             // 0.08–0.45
        swayAmp:    Math.random() * 20 + 15,                 // 15–35 px
        swayPeriod: Math.random() * 5000 + 3000,             // 3–8 s
        swayOffset: Math.random() * Math.PI * 2,
        parallaxFactor: Math.random() * 18 + 6,              // 6–24 px max mouse offset
      };
    }

    function drawFrame(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Parallax offset for hero canvas only
      const px_offset = isHeroCanvas && !isTouch ? mouseParallaxX : 0;
      const py_offset = isHeroCanvas && !isTouch ? mouseParallaxY : 0;

      particles.forEach(p => {
        const sway = Math.sin(ts / p.swayPeriod + p.swayOffset) * p.swayAmp;
        const px = p.x + sway + px_offset * p.parallaxFactor;
        const py = p.y       + py_offset * p.parallaxFactor * 0.4;

        // Glow halo
        ctx.beginPath();
        ctx.arc(px, py, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 184, 58, 0.03)';
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 184, 58, ${p.opacity})`;
        ctx.fill();

        // Move downward
        p.y += p.speed;

        // Reset when leaving bottom
        if (p.y > canvas.height + p.r * 4) {
          p.y = -p.r * 4;
          p.x = Math.random() * canvas.width;
        }
      });

      if (!prefersReducedMotion) animId = requestAnimationFrame(drawFrame);
    }

    resize();

    if (prefersReducedMotion) {
      // Draw static frame once
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 184, 58, ${p.opacity})`;
        ctx.fill();
      });
    } else {
      animId = requestAnimationFrame(drawFrame);
    }

    // Pause animation when canvas is off-screen (CPU savings)
    let isVisible = true;
    const visObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !prefersReducedMotion) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(drawFrame);
      }
    }, { rootMargin: '100px' });
    visObserver.observe(canvas);

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    // Override drawFrame to check visibility
    const _drawFrame = drawFrame;
    function drawFrame(ts) {
      if (!isVisible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const px_offset = isHeroCanvas && !isTouch ? mouseParallaxX : 0;
      const py_offset = isHeroCanvas && !isTouch ? mouseParallaxY : 0;
      particles.forEach(p => {
        const sway = Math.sin(ts / p.swayPeriod + p.swayOffset) * p.swayAmp;
        const px = p.x + sway + px_offset * p.parallaxFactor;
        const py = p.y       + py_offset * p.parallaxFactor * 0.4;
        ctx.beginPath(); ctx.arc(px, py, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226, 184, 58, 0.03)'; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 184, 58, ${p.opacity})`; ctx.fill();
        p.y += p.speed;
        if (p.y > canvas.height + p.r * 4) { p.y = -p.r * 4; p.x = Math.random() * canvas.width; }
      });
      if (!prefersReducedMotion) animId = requestAnimationFrame(drawFrame);
    }
  }

  document.querySelectorAll('canvas.gold-particles').forEach(initGoldParticles);


  // =========================================================
  // 8. INTERSECTION OBSERVER — FADE IN
  // =========================================================
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-in-section').forEach(el => fadeObserver.observe(el));


  // =========================================================
  // 9. STAGGERED CHILDREN
  // =========================================================
  const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('stagger-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));


  // =========================================================
  // 10. ANIMATED COUNTERS
  // =========================================================
  const counters = document.querySelectorAll('.counter-val[data-target]');

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = String(target).includes('.');
        const duration  = 2000;
        const startTime = performance.now();

        const animate = now => {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          const current  = target * eased;
          el.textContent = isDecimal ? current.toFixed(1) : Math.ceil(current).toLocaleString('en-IN');
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.6 });

    counters.forEach(c => counterObserver.observe(c));
  }


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
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          const cats  = item.getAttribute('data-category') || '';
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
      const duration  = 2500;
      const startTime = performance.now();
      const animate = now => {
        const elapsed = Math.min(now - startTime, duration);
        const eased   = 1 - Math.pow(1 - elapsed / duration, 3);
        hba1cEl.textContent = (startVal - (startVal - endVal) * eased).toFixed(1);
        if (elapsed < duration) requestAnimationFrame(animate);
        else hba1cEl.textContent = endVal.toFixed(1);
      };
      requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.5 });
    hba1cObserver.observe(hba1cEl);
  }


  // =========================================================
  // 14. MAGNETIC CTA BUTTONS
  // =========================================================
  if (!isTouch) {
    document.querySelectorAll('.btn-primary, .btn-shimmer').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.12;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.12;
        btn.style.transform = `translate(${Math.max(-5, Math.min(5, x))}px, ${Math.max(-5, Math.min(5, y))}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }


  // =========================================================
  // 15. 3D TILT ON CARDS
  // =========================================================
  if (!isTouch) {
    document.querySelectorAll('.card, .team-card, .result-card, .scroll-card, .dark-cat-card, .story-card, .expert-card').forEach(card => {
      card.style.perspective = '1000px';
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
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


  // =========================================================
  // 16. HERO WORD-BY-WORD ANIMATION
  // =========================================================
  const heroH1 = document.querySelector('.hero-global h1');
  // Only split if no pre-wrapped spans exist
  if (heroH1 && !prefersReducedMotion && !heroH1.querySelector('span')) {
    const words = heroH1.innerHTML.split(/(\s+)/);
    heroH1.innerHTML = words.map(w =>
      w.trim() ? `<span class="hero-word" style="display:inline-block;opacity:0;transform:translateY(25px);filter:blur(6px);transition:opacity 0.5s ease,transform 0.5s ease,filter 0.5s ease;">${w}</span>` : w
    ).join('');

    document.querySelectorAll('.hero-word').forEach((word, i) => {
      setTimeout(() => {
        word.style.opacity  = '1';
        word.style.transform = 'translateY(0)';
        word.style.filter   = 'blur(0)';
      }, 200 + i * 80);
    });
  }


  // =========================================================
  // 17. HERO PARALLAX
  // =========================================================
  const heroEl      = document.querySelector('.hero-global');
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
  const spText  = document.getElementById('spText');

  if (spToast && spText) {
    const spMessages = [
      { name: 'Rahul', city: 'Mumbai',    msg: 'just started his transformation journey' },
      { name: 'Priya', city: 'Pune',      msg: 'reduced her HbA1c by 3.2 points' },
      { name: 'Suresh', city: 'Delhi',    msg: 'reversed Type 2 Diabetes in 87 days' },
      { name: 'Meera', city: 'Hyderabad', msg: 'lost 18kg and is off all medications' },
      { name: 'Arun', city: 'Bangalore',  msg: 'completed his 90-day program today' },
      { name: 'Neha', city: 'Chennai',    msg: 'reversed her PCOD symptoms naturally' },
      { name: 'Vikram', city: 'Ahmedabad',msg: 'dropped his fasting glucose to 92 mg/dL' },
      { name: 'Sunita', city: 'Kolkata',  msg: 'is now insulin-free after 3 months' },
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


  // =========================================================
  // 22. ENHANCED COUNTER — easeOutExpo + slot machine digits
  // =========================================================
  document.querySelectorAll('.counter-val[data-target]').forEach(el => {
    // Already handled by section 10 — upgrade in-place with slot effect for shimmer-text counters
    if (!el.classList.contains('shimmer-text')) return;

    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = String(target).includes('.');
    let started = false;

    const upObserver = new IntersectionObserver(([entry], obs) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      obs.disconnect();

      const duration = 1800;
      const startTime = performance.now();

      // easeOutExpo
      const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      const tick = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = easeOutExpo(progress);
        const current = target * eased;

        if (progress < 0.85) {
          // Slot machine: random digits cycling
          const randSuffix = isDecimal
            ? (Math.random() * target).toFixed(1)
            : Math.floor(Math.random() * target).toLocaleString('en-IN');
          el.textContent = randSuffix;
        } else {
          el.textContent = isDecimal
            ? current.toFixed(1)
            : Math.ceil(current).toLocaleString('en-IN');
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
          // Pop in the suffix
          const suffix = el.getAttribute('data-suffix');
          if (suffix) el.textContent += suffix;
        }
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });

    upObserver.observe(el);
  });


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


  // =========================================================
  // 25. WHATSAPP CHAT BUBBLE (first visit, after 5s)
  // =========================================================
  const waBubble = document.getElementById('waBubble');
  const waBubbleClose = document.getElementById('waBubbleClose');

  if (waBubble && !sessionStorage.getItem('fm_wa_dismissed')) {
    setTimeout(() => {
      waBubble.classList.add('visible');
      // Auto-dismiss after 8s
      setTimeout(() => {
        if (waBubble.classList.contains('visible')) {
          waBubble.classList.remove('visible');
        }
      }, 8000);
    }, 5000);

    if (waBubbleClose) {
      waBubbleClose.addEventListener('click', () => {
        waBubble.classList.remove('visible');
        sessionStorage.setItem('fm_wa_dismissed', '1');
      });
    }
  }


  // =========================================================
  // 24. SMOOTH SCROLL WITH EASING (nav anchor links)
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const startY = window.scrollY;
      const endY   = target.getBoundingClientRect().top + startY - 90;
      const diff   = endY - startY;
      const duration = 700;
      const startTime = performance.now();

      const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

      const step = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        window.scrollTo(0, startY + diff * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  });

});
