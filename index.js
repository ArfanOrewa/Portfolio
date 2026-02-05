  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Typewriter effect
  const typewriterText = document.getElementById('typewriter');
  const texts = [
    "Passionate software developer with strong foundations in Java, Web Development, SQL, and Data Structures & Algorithms.",
    "Eager to apply academic knowledge and project experience to build scalable real-world applications.",
    "Specializing in Full Stack Development and Machine Learning solutions."
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isEnd = false;

  function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typewriterText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isEnd = true;
      isDeleting = true;
      setTimeout(typeWriter, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, 500);
    } else {
      const speed = isDeleting ? 50 : 100;
      setTimeout(typeWriter, speed);
    }
  }

  // Start typewriter after page loads
  setTimeout(typeWriter, 1000);

  // Scroll progress indicator
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
  });

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const width = skillBar.getAttribute('data-width');
        skillBar.style.width = width + '%';
        observer.unobserve(skillBar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observer.observe(bar));

  // Header hide/show on scroll
  let lastScroll = 0;
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      header.classList.remove('hidden');
      return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
      // Scrolling down
      header.classList.add('hidden');
    } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
      // Scrolling up
      header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  });

  // Create particles for hero section
  function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 4 + 1 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = 'rgba(37, 99, 235, 0.5)';
      particle.style.borderRadius = '50%';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      // Animation
      const duration = Math.random() * 10 + 10;
      particle.style.animation = `float ${duration}s infinite linear`;
      
      container.appendChild(particle);
    }
  }

  createParticles();

  // Add hover effect to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = (x - centerX) / 25;
      const rotateX = (centerY - y) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-20px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });

  // Parallax effect for background circles
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const circles = document.querySelectorAll('.bg-circle');
    
    circles.forEach((circle, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      circle.style.transform = `translateY(${yPos}px)`;
    });
  });