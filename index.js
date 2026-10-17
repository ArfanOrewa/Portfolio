/* ============ ARFAN — THE SERIES · interactions ============ */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. INTRO IDENT ---------- */
  var intro = $('intro');
  var introDone = false;
  function finishIntro() {
    if (introDone) return;
    introDone = true;
    intro.classList.add('done');
    document.body.classList.remove('locked');
    showGate();
  }
  document.body.classList.add('locked');
  intro.addEventListener('click', finishIntro);
  $('introPlay').addEventListener('click', function (e) { e.stopPropagation(); finishIntro(); });
  // Auto-advance after the ident plays out (~4.2s), instant if reduced motion
  setTimeout(finishIntro, reducedMotion ? 100 : 4200);

  /* ---------- 2. PROFILE GATE ---------- */
  var gate = $('gate');
  var toast = $('toast');
  var toastTimer = null;
  var AVATAR_CLASS = { Arfan: 'av-1', Recruiter: 'av-2', Developer: 'av-3', Stalker: 'av-4' };
  var GREETINGS = {
    Arfan: 'Welcome back, Arfan. Enjoy the show.',
    Recruiter: 'Welcome, Recruiter. Grab your popcorn — the best parts are ahead.',
    Developer: 'Welcome, Developer. Yes, the code is on GitHub.',
    Stalker: 'Welcome… we see you. Everything you need is right here.'
  };
  function showGate() {
    // If a profile was picked before, skip the gate
    var saved = null;
    try { saved = localStorage.getItem('arfan_profile'); } catch (e) {}
    if (saved && AVATAR_CLASS[saved]) { enterSite(saved, false); return; }
    gate.classList.remove('done');
  }
  function enterSite(profile, greet) {
    try { localStorage.setItem('arfan_profile', profile); } catch (e) {}
    gate.classList.add('done');
    var chipAvatar = $('chipAvatar');
    chipAvatar.textContent = profile.charAt(0);
    chipAvatar.className = 'chip-avatar ' + AVATAR_CLASS[profile];
    if (greet !== false) showToast(GREETINGS[profile] || ('Welcome, ' + profile + '.'));
  }
  $$('.profile').forEach(function (btn) {
    btn.addEventListener('click', function () { enterSite(btn.getAttribute('data-profile')); });
  });
  $('profileChip').addEventListener('click', function () {
    gate.classList.remove('done');
    showToast('Switch profiles any time.');
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3400);
  }

  /* ---------- 3. NAV ---------- */
  var nav = $('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var hamburger = $('hamburger');
  var mobileMenu = $('mobileMenu');
  hamburger.addEventListener('click', function () { mobileMenu.classList.toggle('open'); });
  $$('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
  });

  $('navCta').addEventListener('click', function () {
    var el = $('contact');
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 4. MY LIST ---------- */
  var listBtn = $('listBtn');
  var listAdded = false;
  try { listAdded = localStorage.getItem('arfan_mylist') === '1'; } catch (e) {}
  function renderListBtn() {
    listBtn.classList.toggle('added', listAdded);
    listBtn.innerHTML = listAdded
      ? '<i class="fa-solid fa-check"></i><span>My List</span>'
      : '<i class="fa-solid fa-plus"></i><span>My List</span>';
  }
  renderListBtn();
  listBtn.addEventListener('click', function () {
    listAdded = !listAdded;
    try { localStorage.setItem('arfan_mylist', listAdded ? '1' : '0'); } catch (e) {}
    renderListBtn();
    showToast(listAdded ? 'Added to your list.' : 'Removed from your list.');
  });

  /* ---------- 5. PLAY INTRO REEL ---------- */
  var reelModal = $('reelModal');
  var slides = $$('.reel-slide');
  var dotsWrap = $('reelDots');
  var current = 0;
  var reelOpen = false;

  slides.forEach(function (_, i) {
    var d = document.createElement('span');
    d.addEventListener('click', function () { goSlide(i); });
    dotsWrap.appendChild(d);
  });
  var dots = $$('span', dotsWrap);

  function goSlide(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('active', k === current); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k === current); });
  }
  function openReel() {
    reelOpen = true;
    goSlide(0);
    reelModal.classList.add('open');
    document.body.classList.add('locked');
  }
  function closeReel() {
    reelOpen = false;
    reelModal.classList.remove('open');
    document.body.classList.remove('locked');
  }
  $('playBtn').addEventListener('click', openReel);
  $('reelClose').addEventListener('click', closeReel);
  $('reelPrev').addEventListener('click', function () { goSlide(current - 1); });
  $('reelNext').addEventListener('click', function () { goSlide(current + 1); });
  reelModal.addEventListener('click', function (e) { if (e.target === reelModal) closeReel(); });
  $('reelCta').addEventListener('click', closeReel);

  document.addEventListener('keydown', function (e) {
    if (!introDone && (e.key === 'Enter' || e.key === 'Escape')) { finishIntro(); return; }
    if (reelOpen) {
      if (e.key === 'Escape') closeReel();
      else if (e.key === 'ArrowRight') goSlide(current + 1);
      else if (e.key === 'ArrowLeft') goSlide(current - 1);
    }
  });

  /* ---------- 6. RAIL ARROWS ---------- */
  $$('.rail-wrap').forEach(function (wrap) {
    var rail = wrap.querySelector('.rail');
    var left = wrap.querySelector('.rail-arrow.left');
    var right = wrap.querySelector('.rail-arrow.right');
    if (!rail || !left || !right) return;
    var step = function () { return rail.clientWidth * 0.8; };
    left.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    right.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
  });

  /* ---------- 7. SCROLL REVEALS ---------- */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var d = en.target.getAttribute('data-delay');
        en.target.style.transitionDelay = d ? d + 'ms' : '0ms';
        en.target.classList.add('in');
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(function (el) { revealObs.observe(el); });

  /* ---------- 8. REAL WATCH PROGRESS ---------- */
  // Sections marked data-watch update their "Continue Exploring" progress bar
  // as they are actually viewed. Progress persists across visits.
  var watched = {};
  try { watched = JSON.parse(localStorage.getItem('arfan_watched') || '{}'); } catch (e) { watched = {}; }
  function paintProgress() {
    Object.keys(watched).forEach(function (key) {
      var bar = document.querySelector('[data-progress-for="' + key + '"]');
      if (bar) bar.style.width = Math.min(100, watched[key]) + '%';
    });
  }
  function saveWatched() {
    try { localStorage.setItem('arfan_watched', JSON.stringify(watched)); } catch (e) {}
  }
  paintProgress();
  var watchObs = new IntersectionObserver(function (entries) {
    var changed = false;
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var key = en.target.getAttribute('data-watch');
        var ratio = Math.round(en.intersectionRatio * 100);
        // viewed = at least 60% credit once the section is meaningfully on screen
        var credit = ratio > 25 ? 100 : Math.max(watched[key] || 0, 45);
        if ((watched[key] || 0) < credit) { watched[key] = credit; changed = true; }
      }
    });
    if (changed) { paintProgress(); saveWatched(); }
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  $$('[data-watch]').forEach(function (el) { watchObs.observe(el); });
})();
