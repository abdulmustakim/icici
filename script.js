const header = document.getElementById('siteHeader');
const scrollTopBtn = document.getElementById('scrollTop');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  scrollTopBtn.classList.toggle('show', window.scrollY > 650);
});

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animated counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const duration = 1000;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.count').forEach(el => counterObserver.observe(el));

// Card tilt effect
const creditCard = document.getElementById('creditCard');
if (creditCard) {
  creditCard.addEventListener('mousemove', (event) => {
    const rect = creditCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    creditCard.style.animation = 'none';
    creditCard.style.transform = `rotateX(${(-y * 18).toFixed(2)}deg) rotateY(${(x * 20).toFixed(2)}deg) translateY(-10px)`;
  });
  creditCard.addEventListener('mouseleave', () => {
    creditCard.style.transform = '';
    creditCard.style.animation = '';
  });
}

// Magnetic button effect
const magneticButtons = document.querySelectorAll('.magnetic');
magneticButtons.forEach(button => {
  button.addEventListener('mousemove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

// Benefit card spotlight
const benefitCards = document.querySelectorAll('.benefit-card');
benefitCards.forEach(card => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--y', `${event.clientY - rect.top}px`);
  });
});

// Cashback calculator
const amazonSpend = document.getElementById('amazonSpend');
const paySpend = document.getElementById('paySpend');
const otherSpend = document.getElementById('otherSpend');
const monthlyReward = document.getElementById('monthlyReward');
const yearlyReward = document.getElementById('yearlyReward');
const heroEstimate = document.getElementById('heroEstimate');
const memberButtons = document.querySelectorAll('[data-member]');
let memberType = 'prime';

function rupee(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function calculateReward() {
  const amazon = Math.max(Number(amazonSpend.value) || 0, 0);
  const pay = Math.max(Number(paySpend.value) || 0, 0);
  const other = Math.max(Number(otherSpend.value) || 0, 0);

  // Demo estimate based on public headline reward rates. Actual rewards depend on official eligible categories and exclusions.
  const amazonRate = memberType === 'prime' ? 0.05 : 0.03;
  const payRate = 0.02;
  const otherRate = 0.01;
  const monthly = amazon * amazonRate + pay * payRate + other * otherRate;

  monthlyReward.textContent = rupee(monthly);
  yearlyReward.textContent = `Estimated yearly rewards: ${rupee(monthly * 12)}`;
  if (heroEstimate) heroEstimate.textContent = `${rupee(monthly)} / month`;
}

[amazonSpend, paySpend, otherSpend].forEach(input => input.addEventListener('input', calculateReward));
memberButtons.forEach(button => {
  button.addEventListener('click', () => {
    memberButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    memberType = button.dataset.member;
    calculateReward();
  });
});
calculateReward();

// Particle background canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width = 0;
let height = 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  createParticles();
}

function createParticles() {
  const count = Math.min(80, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: (Math.random() * 2.2 + 0.7) * window.devicePixelRatio,
    vx: (Math.random() - 0.5) * 0.35 * window.devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.35 * window.devicePixelRatio,
    a: Math.random() * 0.45 + 0.12
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 183, 3, ${p.a})`;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const other = particles[j];
      const dx = p.x - other.x;
      const dy = p.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const max = 135 * window.devicePixelRatio;
      if (distance < max) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(66, 214, 255, ${0.12 * (1 - distance / max)})`;
        ctx.lineWidth = 1 * window.devicePixelRatio;
        ctx.stroke();
      }
    }
  });

  if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawParticles();
