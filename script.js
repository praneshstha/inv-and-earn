// Shortcuts
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// ======================
// Theme Toggle
// ======================
const themeToggle = $('#themeToggle');
function setTheme(light) {
  if (light) {
    document.body.classList.add('light');
    themeToggle.textContent = '🌞';
  } else {
    document.body.classList.remove('light');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem('site-theme', light ? 'light' : 'dark');
}
const savedTheme = localStorage.getItem('site-theme');
setTheme(savedTheme === 'light');

themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('light'));
});

// ======================
// Mobile Menu
// ======================
const menuBtn = $('#menuBtn');
const mobileMenu = $('#mobileMenu');

menuBtn.addEventListener('click', () => {
  const shown = mobileMenu.classList.toggle('show');
  mobileMenu.setAttribute('aria-hidden', !shown);
});

$$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('show');
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

// ======================
// Smooth Scroll
// ======================
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = $(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

$('.btn.primary')?.addEventListener('click', () => $('#features')?.scrollIntoView({ behavior: 'smooth' }));
$('.btn.secondary')?.addEventListener('click', () => $('#pricing')?.scrollIntoView({ behavior: 'smooth' }));

// ======================
// Fade-in Animation on Scroll
// ======================
const fades = $$('.fade');
const io = new IntersectionObserver(entries => {
  entries.forEach(ent => {
    if (ent.isIntersecting) ent.target.classList.add('visible');
  });
}, { threshold: 0.25 });
fades.forEach(f => io.observe(f));

// ======================
// Parallax & Shrinking Header
// ======================
const parallaxEls = $$('.parallax');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.4;
    const offset = (scrollY - el.offsetTop) * speed;
    el.style.backgroundPosition = `center ${offset * 0.08}px`;
  });

  const header = $('#siteHeader');
  if (scrollY > 40) header.classList.add('shrink');
  else header.classList.remove('shrink');
});

// ======================
// Ripple Effect
// ======================
document.addEventListener('pointerdown', (e) => {
  const btn = e.target.closest('.ripple');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * 1.6;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  ripple.className = 'ripple-el';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

const rippleStyle = document.createElement('style');
rippleStyle.innerHTML = `
.ripple-el {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  opacity: 0.35;
  background: rgba(0,0,0,0.15);
  pointer-events: none;
  animation: rippleAnim 620ms linear;
}
@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }
.ripple { position: relative; overflow: hidden; }
`;
document.head.appendChild(rippleStyle);

// ======================
// Feature Modal
// ======================
const featureModal = $('#featureModal');
const featureTitle = $('#modalTitle');
const featureDesc = $('#modalDescription');
const closeBtn = $('.close-btn');

const featureData = {
  fast: { title: "Fast Performance", description: "Experience lightning-fast transactions and seamless navigation." },
  secure: { title: "Secure Platform", description: "Your funds and data are protected with industry-leading security." },
  analytics: { title: "Analytics Dashboard", description: "Track your earnings and progress with real-time insights." },
  support: { title: "24/7 Support", description: "Get assistance anytime from our dedicated customer support team." },
  interface: { title: "Easy Interface", description: "User-friendly design to make investing and earning simple." },
  global: { title: "Global Access", description: "Access your account securely from anywhere in the world." }
};

$$('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const feature = btn.dataset.feature;
    featureTitle.textContent = featureData[feature].title;
    featureDesc.textContent = featureData[feature].description;
    featureModal.style.display = 'block';
  });
});

closeBtn.addEventListener('click', () => featureModal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === featureModal) featureModal.style.display = 'none'; });

// ======================
// Contact Form
// ======================
const contactForm = $('#contactForm');
const formMsg = $('#formMsg');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();

  if (!name || name.length < 2) { formMsg.textContent = 'Enter a valid name'; return; }
  if (!email.includes('@')) { formMsg.textContent = 'Enter a valid email'; return; }
  if (!message || message.length < 10) { formMsg.textContent = 'Message too short'; return; }

  formMsg.style.color = 'var(--accent)';
  formMsg.textContent = 'Sending...';

  try {
    const res = await fetch('http://localhost:5000/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    formMsg.style.color = data.success ? 'lightgreen' : 'red';
    formMsg.textContent = data.msg;
    if (data.success) contactForm.reset();
  } catch (err) {
    formMsg.style.color = 'red';
    formMsg.textContent = 'Server error. Try again later.';
  }
});

// ======================
// Pricing Subscription Modal
// ======================
const pricingModal = document.createElement('div');
pricingModal.className = 'modal';
pricingModal.innerHTML = `
<div class="modal-content">
  <span class="close-btn">&times;</span>
  <h3>Subscribe to a Plan</h3>
  <form id="pricingForm">
    <input type="text" name="name" placeholder="Your Name" required />
    <input type="email" name="email" placeholder="Your Email" required />
    <input type="text" name="bankAcc" placeholder="Bank Account Number" required />
    <input type="text" name="planAmount" placeholder="Plan Amount" readonly />
    <button type="submit" class="btn ripple">Subscribe</button>
  </form>
  <div id="pricingMsg"></div>
</div>
`;
document.body.appendChild(pricingModal);

const pricingForm = $('#pricingForm');
const pricingMsg = $('#pricingMsg');
const pricingClose = pricingModal.querySelector('.close-btn');

$$('.choose-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.parentElement.querySelector('h3').textContent;
    pricingForm.planAmount.value = plan;
    pricingModal.style.display = 'block';
  });
});

pricingClose.addEventListener('click', () => pricingModal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === pricingModal) pricingModal.style.display = 'none'; });

pricingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: pricingForm.name.value.trim(),
    email: pricingForm.email.value.trim(),
    bankAcc: pricingForm.bankAcc.value.trim(),
    bankIFSC: pricingForm.bankIFSC.value.trim(),
    planAmount: pricingForm.planAmount.value
  };

  pricingMsg.style.color = 'var(--accent)';
  pricingMsg.textContent = 'Submitting...';

  try {
    const res = await fetch('http://localhost:5000/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    pricingMsg.style.color = result.success ? 'lightgreen' : 'red';
    pricingMsg.textContent = result.msg;
    if (result.success) pricingForm.reset();
  } catch (err) {
    pricingMsg.style.color = 'red';
    pricingMsg.textContent = 'Server error. Try again later.';
  }
});

// ======================
// Footer Year
// ======================
$('#year').textContent = new Date().getFullYear();
