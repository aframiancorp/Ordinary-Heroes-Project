/* ============================================================
   THE ORDINARY HEROES PROJECT — script.js
   ============================================================ */

// ===== NAVBAR: Sticky + Mobile Toggle =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateScrollProgress();
  toggleBackToTop();
});

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
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight + 12;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(to right, #C8102E, #E8A020);
  z-index: 9999;
  transition: width 0.1s linear;
`;
document.body.prepend(progressBar);

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}

// ===== BACK TO TOP BUTTON =====
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.id = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.style.cssText = `
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 48px;
  height: 48px;
  background: #C8102E;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  z-index: 999;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
  box-shadow: 0 4px 16px rgba(200,16,46,0.4);
`;
document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseenter', () => {
  backToTop.style.background = '#a00c24';
  backToTop.style.transform = 'translateY(0) scale(1.1)';
});
backToTop.addEventListener('mouseleave', () => {
  backToTop.style.background = '#C8102E';
  backToTop.style.transform = 'translateY(0) scale(1)';
});

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.style.opacity = '1';
    backToTop.style.transform = 'translateY(0)';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.transform = 'translateY(16px)';
  }
}

// ===== HERO TYPING EFFECT =====
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const originalText = heroSub.textContent.trim();
  heroSub.textContent = '';
  heroSub.style.borderRight = '2px solid rgba(255,255,255,0.7)';
  heroSub.style.paddingRight = '4px';

  let i = 0;
  const typeSpeed = 28;

  function type() {
    if (i < originalText.length) {
      heroSub.textContent += originalText.charAt(i);
      i++;
      setTimeout(type, typeSpeed);
    } else {
      // Blink cursor then remove it
      setTimeout(() => {
        heroSub.style.borderRight = 'none';
      }, 1200);
    }
  }

  // Start typing after hero fade-in
  setTimeout(type, 900);
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement
        ? Array.from(entry.target.parentElement.children).filter(el => el.classList.contains('reveal'))
        : [];
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 100;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const timer = setInterval(() => {
    frame++;
    const progress = easeOut(frame / totalFrames);
    const current = Math.round(target * progress);
    el.textContent = current >= 1000 ? current.toLocaleString() : current;
    if (frame === totalFrames) {
      clearInterval(timer);
      el.textContent = target >= 1000 ? target.toLocaleString() : target;
    }
  }, frameDuration);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(counter => animateCounter(counter));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBanner = document.querySelector('.stats-banner');
if (statsBanner) counterObserver.observe(statsBanner);

// ===== STAT ITEMS PULSE ON HOVER =====
document.querySelectorAll('.stat-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transition = 'transform 0.2s ease';
    item.style.transform = 'scale(1.04)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'scale(1)';
  });
});

// ===== STEP CARDS: Sequential entrance =====
const stepCards = document.querySelectorAll('.step-card');
const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      stepCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 150);
      });
      stepObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

stepCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

if (stepCards.length) stepObserver.observe(stepCards[0]);

// ===== LOGO HEARTBEAT =====
const logoImg = document.querySelector('.nav-logo-img');
if (logoImg) {
  setInterval(() => {
    logoImg.style.transition = 'transform 0.15s ease';
    logoImg.style.transform = 'scale(1.06)';
    setTimeout(() => {
      logoImg.style.transform = 'scale(1)';
      setTimeout(() => {
        logoImg.style.transform = 'scale(1.04)';
        setTimeout(() => {
          logoImg.style.transform = 'scale(1)';
        }, 150);
      }, 150);
    }, 150);
  }, 3000);
}

// ===== INVOLVE CARDS: Tilt on mouse move =====
document.querySelectorAll('.involve-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) {
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').classList.remove('open');
      }
    });

    btn.setAttribute('aria-expanded', !isOpen);
    answer.classList.toggle('open', !isOpen);
  });
});

// ===== FORM SUBMISSIONS =====
// Forms submit directly to Formspree via action attribute.

// ===== PARALLAX on hero =====
const heroImg = document.querySelector('.hero-img');
if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}

// ===== ACTIVE NAV LINK on scroll =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => activeNavObserver.observe(sec));

// ===== INJECTED STYLES =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14%       { transform: scale(1.06); }
    28%       { transform: scale(1); }
    42%       { transform: scale(1.04); }
    70%       { transform: scale(1); }
  }
  .nav-links a.active {
    color: var(--red) !important;
  }
  .nav-links a.active::after {
    right: 0;
  }
  .involve-card {
    transition: transform 0.15s ease, box-shadow 0.3s ease !important;
  }
`;
document.head.appendChild(style);
