// ── SCROLL PROGRESS BAR ──
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
}

// ── NAV SCROLLED STATE ──
const navbar = document.getElementById('navbar');
function updateNavStyle() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function getActiveSection() {
  const scrollMid = window.scrollY + window.innerHeight / 2;
  let active = sections[0];
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMid) active = sec;
  });
  return active.id;
}

function updateActiveLink() {
  const activeId = getActiveSection();
  navLinks.forEach(link => {
    const isActive = link.dataset.section === activeId;
    link.classList.toggle('active', isActive);
  });
}

// ── SMOOTH SCROLL ON NAV CLICK ──
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.dataset.section;
    const target = document.getElementById(targetId);
    if (!target) return;

    // Close mobile menu if open
    hamburger.classList.remove('open');
    navLinksList.classList.remove('open');

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Smooth scroll for any href="#..." links inside the page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  if (anchor.classList.contains('nav-link')) return; // already handled
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksList.classList.toggle('open');
});

// Close mobile menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinksList.classList.remove('open');
  }
});

// ── SCROLL REVEAL ANIMATION ──
const revealEls = document.querySelectorAll(
  '.stat-card, .partner-card, .event-card, .division-card, .about-text, .section-intro, .contact-left, .contact-form'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ── ANIMATED COUNTERS ──
const counters = document.querySelectorAll('.stat-number');
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

const statsSection = document.getElementById('about');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counters.forEach(c => animateCounter(c));
  }
}, { threshold: 0.3 });
statsObserver.observe(statsSection);

// ── CONTACT FORM ──
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type=submit]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      contactForm.reset();
      formSuccess.style.display = 'block';
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    } else {
      alert('Something went wrong. Please try again.');
    }
  } catch {
    alert('Something went wrong. Please try again.');
  }
  btn.textContent = 'Send Message';
  btn.disabled = false;
});

// ── MAIN SCROLL HANDLER ──
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      updateNavStyle();
      updateActiveLink();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Initial calls
updateProgress();
updateNavStyle();
updateActiveLink();
