(function() {
  // ========== 3D ORBS + DYNAMIC BACKGROUND ==========
  const canvas = document.getElementById('orbCanvas');
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth, height = window.innerHeight;
  let particles = [];
  const PARTICLE_COUNT = 45;
  
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  
  class Orb {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 60 + 20;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.2;
      this.hue = Math.random() * 60 + 180;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if(this.x < -100) this.x = width + 50;
      if(this.x > width + 100) this.x = -50;
      if(this.y < -100) this.y = height + 50;
      if(this.y > height + 100) this.y = -50;
    }
    draw() {
      const grad = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius);
      grad.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 0.2)`);
      grad.addColorStop(1, `hsla(${this.hue+20}, 70%, 40%, 0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }
  
  function initOrbs() {
    particles = [];
    for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new Orb());
  }
  
  function animateOrbs() {
    if(!ctx) return;
    ctx.clearRect(0,0,width,height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateOrbs);
  }
  
  window.addEventListener('resize', () => {
    resizeCanvas();
    initOrbs();
  });
  resizeCanvas();
  initOrbs();
  animateOrbs();
  
  // ========== TYPEWRITER ==========
  const texts = [
    "Full-Stack Developer | ML Enthusiast",
    "Java • Python • React • Problem Solver",
    "Building next-gen digital experiences"
  ];
  let idx = 0, charIdx = 0, isDeleting = false;
  const typedEl = document.getElementById('typedText');
  function typeEffect() {
    const current = texts[idx];
    if(isDeleting) {
      typedEl.textContent = current.substring(0, charIdx-1);
      charIdx--;
    } else {
      typedEl.textContent = current.substring(0, charIdx+1);
      charIdx++;
    }
    if(!isDeleting && charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
    if(isDeleting && charIdx === 0) {
      isDeleting = false;
      idx = (idx+1) % texts.length;
      setTimeout(typeEffect, 300);
      return;
    }
    setTimeout(typeEffect, isDeleting ? 40 : 80);
  }
  setTimeout(typeEffect, 500);
  
  // ========== SKILL BAR ANIMATION (Intersection Observer) ==========
  const skillFills = document.querySelectorAll('.skill-fill');
  const observerSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const fillEl = entry.target;
        const percent = fillEl.getAttribute('data-skill');
        if(percent) fillEl.style.width = percent + '%';
        observerSkills.unobserve(fillEl);
      }
    });
  }, { threshold: 0.5 });
  skillFills.forEach(fill => observerSkills.observe(fill));
  
  // ========== SCROLL PROGRESS & HEADER HIDE/SHOW ==========
  const progress = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progress.style.width = scrolled + '%';
    
    const header = document.getElementById('mainHeader');
    if(winScroll > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
  
  // ========== MOBILE MENU ==========
  const menuBtn = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });
  
  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  
  // ========== PROJECT & CARD TILT EFFECT ==========
  const cards = document.querySelectorAll('.project-card, .glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width/2;
      const centerY = rect.height/2;
      const rotateX = (y - centerY)/20;
      const rotateY = (centerX - x)/20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
  
  console.log("✨ Immersive Portfolio Loaded — Innovation meets Aesthetic");
})();
