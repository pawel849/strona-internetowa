const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#main-nav');
const loadCalendar = document.querySelector('#load-calendar');
const calendarFrame = document.querySelector('#calendar-frame');
const calendarGate = document.querySelector('[data-calendar-gate]');

const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 12);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const closeNav = ({ restoreFocus = false } = {}) => {
  nav?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  const label = navToggle?.querySelector('.sr-only');
  if (label) label.textContent = 'Otwórz menu';
  document.body.classList.remove('menu-open');
  if (restoreFocus) navToggle?.focus();
};

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeNav();
    return;
  }
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.querySelector('.sr-only').textContent = 'Zamknij menu';
  nav?.classList.add('open');
  document.body.classList.add('menu-open');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeNav());
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    closeNav({ restoreFocus: true });
  }
});

loadCalendar?.addEventListener('click', () => {
  const source = calendarFrame?.dataset.src;
  if (!source || !calendarFrame) return;
  calendarFrame.src = source;
  calendarFrame.hidden = false;
  calendarFrame.classList.add('is-loaded');
  calendarGate?.classList.add('hidden');
  loadCalendar.setAttribute('aria-expanded', 'true');
  window.setTimeout(() => calendarFrame.focus(), 300);
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
  reveals.forEach((item) => observer.observe(item));
}

document.querySelectorAll('[data-year]').forEach((item) => {
  item.textContent = new Date().getFullYear();
});
