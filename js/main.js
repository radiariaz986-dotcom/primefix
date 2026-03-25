// ===========================
// PRIMEFIX — Shared JS
// ===========================

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Fade-up intersection observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Animated counters
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const raw = el.textContent.trim();
      const match = raw.match(/^(\d+)(.*)$/);
      if (match) {
        animateCount(el, parseInt(match[1]), match[2]);
        counterObserver.unobserve(el);
      }
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ===========================
// PHONE MODAL — Mobile calls, Desktop copy
// ===========================
function initPhoneLinks() {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  document.querySelectorAll('[data-phone]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const number = el.getAttribute('data-phone');
      const display = el.getAttribute('data-phone-display') || number;
      if (isMobile) showPhoneModal(number, display);
      else copyToClipboard(number, display, el);
    });
  });
}

function showPhoneModal(number, display) {
  const overlay = document.getElementById('phoneModal');
  const numEl = overlay.querySelector('.phone-modal .number');
  const callBtn = overlay.querySelector('.btn-call');
  numEl.textContent = display;
  callBtn.onclick = () => { window.location.href = `tel:${number}`; closePhoneModal(); };
  overlay.classList.add('active');
}

function closePhoneModal() {
  document.getElementById('phoneModal').classList.remove('active');
}

function copyToClipboard(number, display, triggerEl) {
  navigator.clipboard.writeText(number).then(() => {
    const tooltip = document.createElement('span');
    tooltip.textContent = '✓ Copied!';
    tooltip.style.cssText = 'color:#00C853;font-size:12px;font-weight:700;margin-left:8px;animation:fadeIn .2s ease;';
    triggerEl.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
  }).catch(() => { prompt('Copy this number:', number); });
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('phoneModal');
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closePhoneModal(); });
  initPhoneLinks();
});

// ===========================
// FORM SUBMISSION
// ===========================
function initForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.textContent = 'Submitting...';
    btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      const success = document.querySelector('.form-success');
      if (success) success.style.display = 'block';
    }, 1200);
  });
}