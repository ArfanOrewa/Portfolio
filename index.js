// Custom cursor
const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  c1.style.left = mx + 'px';
  c1.style.top = my + 'px';
});

(function animCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  c2.style.left = cx + 'px';
  c2.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();

// Scroll progress bar
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = pct + '%';
});

// Nav scroll class
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// Hamburger menu
const ham = document.getElementById('ham');
const nLinks = document.getElementById('nLinks');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  nLinks.classList.toggle('open');
});

// Close menu on nav link click
nLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open');
    nLinks.classList.remove('open');
  });
});

// Reveal on scroll (Intersection Observer)
const reveals = document.querySelectorAll('.au, .au-l, .au-r');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => io.observe(el));

// Skill bar animation
const bars = document.querySelectorAll('.skb-fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w;
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
bars.forEach(b => barObs.observe(b));
