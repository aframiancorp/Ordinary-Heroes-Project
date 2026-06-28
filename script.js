/* ============================================================
   THE ORDINARY HEROES PROJECT — script.js
   Full continuous scroll animation suite
   ============================================================ */

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateScrollProgress();
  toggleBackToTop();
  runScrollAnimations();
}, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 12, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
  position:fixed;top:0;left:0;height:3px;width:0%;
  background:linear-gradient(to right,#C8102E,#E8A020);
  z-index:9999;transition:width 0.08s linear;pointer-events:none;`;
document.body.prepend(progressBar);

function updateScrollProgress() {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}

// ===== BACK TO TOP =====
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.style.cssText = `
  position:fixed;bottom:32px;right:32px;width:48px;height:48px;
  background:#C8102E;color:#fff;border:none;border-radius:50%;
  font-size:1rem;cursor:pointer;z-index:999;
  opacity:0;transform:translateY(20px);
  transition:opacity .3s ease,transform .3s ease,background .2s ease,box-shadow .2s ease;
  box-shadow:0 4px 16px rgba(200,16,46,.4);`;
document.body.appendChild(backToTop);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
backToTop.addEventListener('mouseenter', () => { backToTop.style.background='#a00c24'; backToTop.style.boxShadow='0 8px 24px rgba(200,16,46,.6)'; backToTop.style.transform='translateY(0) scale(1.12)'; });
backToTop.addEventListener('mouseleave', () => { backToTop.style.background='#C8102E'; backToTop.style.boxShadow='0 4px 16px rgba(200,16,46,.4)'; backToTop.style.transform='translateY(0) scale(1)'; });

function toggleBackToTop() {
  const show = window.scrollY > 400;
  backToTop.style.opacity = show ? '1' : '0';
  backToTop.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
}

// ===== HERO TYPING EFFECT =====
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const text = heroSub.textContent.trim();
  heroSub.textContent = '';
  heroSub.style.cssText += 'border-right:2px solid rgba(255,255,255,.7);padding-right:4px;min-height:3em;';
  let i = 0;
  function type() {
    if (i < text.length) { heroSub.textContent += text[i++]; setTimeout(type, 26); }
    else { setTimeout(() => { heroSub.style.borderRight = 'none'; }, 1200); }
  }
  setTimeout(type, 800);
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement?.children || []).filter(el => el.classList.contains('reveal'));
      setTimeout(() => entry.target.classList.add('visible'), siblings.indexOf(entry.target) * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const frames = Math.round(2000 / (1000/60));
  let frame = 0;
  const ease = t => 1 - Math.pow(1-t, 3);
  const timer = setInterval(() => {
    frame++;
    const val = Math.round(target * ease(frame / frames));
    el.textContent = val >= 1000 ? val.toLocaleString() : val;
    if (frame === frames) { clearInterval(timer); el.textContent = target >= 1000 ? target.toLocaleString() : target; }
  }, 1000/60);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.counter').forEach(animateCounter); counterObserver.unobserve(e.target); } });
}, { threshold: 0.5 });
const statsBanner = document.querySelector('.stats-banner');
if (statsBanner) counterObserver.observe(statsBanner);

// ===== CONTINUOUS SCROLL-DRIVEN ANIMATIONS =====
// These run on every scroll event and drive animations based on scroll position

function runScrollAnimations() {
  const scrollY = window.scrollY;
  const winH = window.innerHeight;

  // 1. HERO PARALLAX — image drifts as you scroll
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.3}px)`;

  // 2. HERO CONTENT FADE OUT as you scroll away
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const heroH = heroSection.offsetHeight;
      const fade = Math.max(0, 1 - (scrollY / (heroH * 0.6)));
      heroContent.style.opacity = fade;
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }

  // 3. SECTION HEADINGS slide in from left as they enter viewport
  document.querySelectorAll('h2').forEach(h2 => {
    const rect = h2.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, 1 - (rect.top / winH)));
    if (progress > 0) {
      const slide = (1 - progress) * 40;
      h2.style.transform = `translateX(${-slide * (1 - Math.min(1, progress * 2))}px)`;
      h2.style.opacity = Math.min(1, progress * 2);
    }
  });

  // 4. MISSION QUOTE scale + fade on scroll
  const quote = document.querySelector('.mission-quote');
  if (quote) {
    const rect = quote.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, 1 - rect.top / winH));
    const scale = 0.92 + (progress * 0.08);
    quote.style.transform = `scale(${scale})`;
    quote.style.opacity = Math.min(1, progress * 1.5);
  }

  // 5. WHO WE ARE image — subtle float upward as you scroll past
  const whoImg = document.querySelector('.who-image img');
  if (whoImg) {
    const rect = whoImg.getBoundingClientRect();
    const progress = (winH - rect.top) / (winH + rect.height);
    whoImg.style.transform = `translateY(${-progress * 30}px)`;
  }

  // 6. WHY WE EXIST image — parallax drift opposite direction
  const whyImg = document.querySelector('.why-image img');
  if (whyImg) {
    const rect = whyImg.getBoundingClientRect();
    const progress = (winH - rect.top) / (winH + rect.height);
    whyImg.style.transform = `translateY(${progress * 20 - 10}px) scale(1.03)`;
  }

  // 7. STEP CARDS — each card slides up sequentially as section scrolls in
  const stepSection = document.querySelector('.how-it-works');
  if (stepSection) {
    const rect = stepSection.getBoundingClientRect();
    const sectionProgress = Math.min(1, Math.max(0, (winH - rect.top) / (winH * 0.8)));
    document.querySelectorAll('.step-card').forEach((card, i) => {
      const cardProgress = Math.min(1, Math.max(0, (sectionProgress - i * 0.18) / 0.3));
      const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      card.style.opacity = ease(cardProgress);
      card.style.transform = `translateY(${(1 - ease(cardProgress)) * 50}px)`;
    });
  }

  // 8. STAT ITEMS — glow on scroll-in
  document.querySelectorAll('.stat-item').forEach((item, i) => {
    const rect = item.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (winH - rect.top) / winH));
    const glow = progress > 0.7 ? (progress - 0.7) / 0.3 : 0;
    item.style.boxShadow = glow > 0 ? `inset 0 0 ${glow * 40}px rgba(232,160,32,${glow * 0.08})` : '';
  });

  // 9. JEWISH QUOTE BLOCK — border grows on scroll
  const quoteBlock = document.querySelector('.jewish-quote-block');
  if (quoteBlock) {
    const rect = quoteBlock.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (winH - rect.top) / winH));
    quoteBlock.style.borderLeftWidth = `${4 + progress * 8}px`;
    quoteBlock.style.paddingLeft = `${24 + progress * 8}px`;
  }

  // 10. INVOLVE CARDS — staggered rise as section scrolls in
  const involveSection = document.querySelector('.get-involved');
  if (involveSection) {
    const rect = involveSection.getBoundingClientRect();
    const sectionProgress = Math.min(1, Math.max(0, (winH - rect.top) / (winH * 0.7)));
    document.querySelectorAll('.involve-card').forEach((card, i) => {
      const p = Math.min(1, Math.max(0, (sectionProgress - i * 0.2) / 0.4));
      const ease = t => 1 - Math.pow(1-t, 3);
      card.style.opacity = ease(p);
      card.style.transform = `translateY(${(1 - ease(p)) * 60}px)`;
    });
  }

  // 11. FAQ ITEMS — slide in from right one by one
  document.querySelectorAll('.faq-item').forEach((item, i) => {
    const rect = item.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (winH - rect.top) / winH));
    const ease = t => 1 - Math.pow(1-t, 3);
    item.style.opacity = ease(progress);
    item.style.transform = `translateX(${(1 - ease(progress)) * 30}px)`;
  });

  // 12. FOOTER BRAND — zoom in gently as footer enters
  const footerBrand = document.querySelector('.footer-brand');
  if (footerBrand) {
    const rect = footerBrand.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (winH - rect.top) / winH));
    footerBrand.style.transform = `scale(${0.94 + progress * 0.06})`;
    footerBrand.style.opacity = Math.min(1, progress * 1.5);
  }

  // 13. CONTACT SECTION — form slides in from left, info from right
  const contactForm = document.querySelector('.contact-form-wrap');
  const contactInfo = document.querySelector('.contact-info');
  if (contactForm && contactInfo) {
    const rect = contactForm.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (winH - rect.top) / (winH * 0.7)));
    const ease = t => 1 - Math.pow(1-t, 3);
    contactForm.style.opacity = ease(p);
    contactForm.style.transform = `translateX(${(1-ease(p)) * -40}px)`;
    contactInfo.style.opacity = ease(p);
    contactInfo.style.transform = `translateX(${(1-ease(p)) * 40}px)`;
  }

  // 14. MISSION BACKGROUND PARALLAX
  const missionBg = document.querySelector('.mission-bg img');
  if (missionBg) {
    const rect = missionBg.closest('.mission')?.getBoundingClientRect();
    if (rect) {
      const progress = (winH - rect.top) / (winH + rect.height);
      missionBg.style.transform = `scale(1.1) translateY(${(progress - 0.5) * 40}px)`;
    }
  }

  // 15. EYEBROW LABELS — stretch letter-spacing on scroll in
  document.querySelectorAll('.section-eyebrow').forEach(el => {
    const rect = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (winH - rect.top) / winH));
    el.style.letterSpacing = `${0.08 + p * 0.12}em`;
    el.style.opacity = Math.min(1, p * 2);
  });
}

// Run once on load
runScrollAnimations();

// ===== LOGO HEARTBEAT =====
const logoImg = document.querySelector('.nav-logo-img');
if (logoImg) {
  setInterval(() => {
    logoImg.style.transition = 'transform 0.12s ease';
    logoImg.style.transform = 'scale(1.07)';
    setTimeout(() => { logoImg.style.transform = 'scale(1)';
      setTimeout(() => { logoImg.style.transform = 'scale(1.04)';
        setTimeout(() => { logoImg.style.transform = 'scale(1)'; }, 120);
      }, 120);
    }, 120);
  }, 2800);
}

// ===== INVOLVE CARDS 3D TILT =====
document.querySelectorAll('.involve-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});

// ===== STAT ITEMS PULSE ON HOVER =====
document.querySelectorAll('.stat-item').forEach(item => {
  item.addEventListener('mouseenter', () => { item.style.transition='transform .2s ease'; item.style.transform='scale(1.05)'; });
  item.addEventListener('mouseleave', () => { item.style.transform='scale(1)'; });
});

// ===== STEP CARD ICON SPIN ON HOVER =====
document.querySelectorAll('.step-icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.style.transition = 'transform 0.4s ease';
    icon.style.transform = 'rotate(360deg) scale(1.15)';
  });
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = 'rotate(0deg) scale(1)';
  });
});

// ===== BENEFIT LIST ITEMS — staggered on hover of parent =====
const hostBenefits = document.querySelector('.host-benefits');
if (hostBenefits) {
  hostBenefits.querySelectorAll('li').forEach((li, i) => {
    li.style.transition = `transform 0.3s ease ${i * 0.05}s, color 0.2s ease`;
    li.addEventListener('mouseenter', () => { li.style.transform = 'translateX(8px)'; li.style.color = '#C8102E'; });
    li.addEventListener('mouseleave', () => { li.style.transform = 'translateX(0)'; li.style.color = ''; });
  });
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item').forEach(other => {
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      other.querySelector('.faq-answer').classList.remove('open');
    });
    btn.setAttribute('aria-expanded', !isOpen);
    answer.classList.toggle('open', !isOpen);
  });
});

// ===== ACTIVE NAV LINK =====
const activeNavObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(sec => activeNavObserver.observe(sec));

// ===== SOCIAL ICONS — bounce on hover =====
document.querySelectorAll('.social-links a').forEach(a => {
  a.addEventListener('mouseenter', () => {
    a.style.transition = 'transform 0.2s ease, background 0.2s ease';
    a.style.transform = 'translateY(-6px) scale(1.15)';
  });
  a.addEventListener('mouseleave', () => { a.style.transform = ''; });
});

// ===== FOOTER LINKS — slide right on hover =====
document.querySelectorAll('.footer-links a').forEach(a => {
  a.style.transition = 'transform 0.2s ease, color 0.2s ease';
  a.style.display = 'inline-block';
  a.addEventListener('mouseenter', () => { a.style.transform = 'translateX(6px)'; a.style.color = '#fff'; });
  a.addEventListener('mouseleave', () => { a.style.transform = ''; a.style.color = ''; });
});

// ===== INJECTED STYLES =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .nav-links a.active { color:var(--red) !important; }
  .nav-links a.active::after { right:0; }
  h2 { will-change: transform, opacity; }
  .faq-item { will-change: transform, opacity; }
  .involve-card { will-change: transform; }
  .mission-quote { will-change: transform, opacity; }
  .section-eyebrow { will-change: letter-spacing, opacity; }
`;
document.head.appendChild(style);
