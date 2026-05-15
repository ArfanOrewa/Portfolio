// ─── Config ────────────────────────────────────────────────────────────────
const WISHES = [
  "🌸 Happy Birthday HANI  🌸",
  "May this day be as beautiful as you are 💞",
  "Wishing you joy beyond measure 🎂",
  "May every dream of yours come true 🌟",
  "You make the world a better place 🌺",
  "May Allah Bless You 🌸",
  "Here's to YOU — forever & always ❤️"
];

const W = window.innerWidth;
const H = window.innerHeight;

// ─── Stars ─────────────────────────────────────────────────────────────────
const sc = document.getElementById('stars-canvas');
sc.width = W; sc.height = H;
const sctx = sc.getContext('2d');
const stars = Array.from({length:180}, () => ({
  x: Math.random()*W, y: Math.random()*H,
  r: Math.random()*1.4+0.3,
  a: Math.random(),
  speed: Math.random()*0.008+0.002
}));

(function drawStars() {
  sctx.clearRect(0,0,W,H);
  stars.forEach(s => {
    s.a += s.speed;
    const opacity = 0.3 + 0.7 * Math.abs(Math.sin(s.a));
    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    sctx.fillStyle = `rgba(255,220,240,${opacity})`;
    sctx.fill();
  });
  requestAnimationFrame(drawStars);
})();

// ─── Tree ──────────────────────────────────────────────────────────────────
const tc = document.getElementById('canvas');
tc.width = 700; tc.height = 500;
tc.style.width  = Math.min(700, W) + 'px';
tc.style.height = Math.min(500, H * 0.7) + 'px';
const ctx = tc.getContext('2d');

const branches = [];
let blooms = [];
let treeGrown = false;
let blooming = false;

function drawBranch(x1, y1, angle, length, depth, delay) {
  if (depth === 0 || length < 2) return;
  setTimeout(() => {
    const x2 = x1 + Math.cos(angle) * length;
    const y2 = y1 + Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = depth > 3
      ? `rgba(${80+depth*5}, ${40+depth*3}, ${20+depth*2}, 0.9)`
      : `rgba(${130+depth*10}, ${70+depth*8}, ${50+depth*5}, 0.85)`;
    ctx.lineWidth = Math.max(1, depth * 0.9);
    ctx.lineCap = 'round';
    ctx.stroke();

    if (depth <= 2) {
      blooms.push({x: x2, y: y2, drawn: false, delay: delay + 80});
    }

    const spread = Math.PI / (4 + Math.random()*2);
    drawBranch(x2, y2, angle - spread, length * 0.72, depth-1, delay + 60);
    drawBranch(x2, y2, angle + spread, length * 0.72, depth-1, delay + 60);
    if (depth > 3 && Math.random() > 0.5) {
      drawBranch(x2, y2, angle - spread*0.4 + Math.random()*0.2, length * 0.6, depth-1, delay + 80);
    }
  }, delay);
}

function growTree() {
  ctx.clearRect(0, 0, tc.width, tc.height);
  blooms = [];
  drawBranch(tc.width/2, tc.height, -Math.PI/2, 90, 9, 0);
  setTimeout(() => {
    treeGrown = true;
    bloomFlowers();
  }, 2200);
}

function bloomFlowers() {
  blooming = true;
  blooms.sort((a,b) => a.delay - b.delay);
  blooms.forEach(b => {
    setTimeout(() => drawFlower(b.x, b.y), b.delay);
  });
  setTimeout(showMessages, blooms.length > 0 ? blooms[blooms.length-1].delay + 600 : 800);
}

function drawFlower(x, y) {
  const petals = 5 + Math.floor(Math.random()*3);
  const r = 5 + Math.random()*5;
  const hue = 320 + Math.random()*40 - 20;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    const px = x + Math.cos(angle) * r * 0.7;
    const py = y + Math.sin(angle) * r * 0.7;
    ctx.beginPath();
    ctx.ellipse(px, py, r*0.5, r*0.35, angle, 0, Math.PI*2);
    ctx.fillStyle = `hsla(${hue}, 90%, 75%, 0.85)`;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, r*0.3, 0, Math.PI*2);
  ctx.fillStyle = `hsla(50, 100%, 75%, 0.9)`;
  ctx.fill();
}

// ─── Petals ────────────────────────────────────────────────────────────────
const pc = document.getElementById('petal-canvas');
pc.width = W; pc.height = H;
const pctx = pc.getContext('2d');

let petals = [];
function spawnPetal() {
  petals.push({
    x: Math.random() * W,
    y: -20,
    vx: (Math.random() - 0.5) * 1.2,
    vy: 0.8 + Math.random() * 1.4,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.07,
    size: 5 + Math.random() * 7,
    hue: 320 + Math.random() * 40,
    alpha: 0.6 + Math.random() * 0.4,
    wave: Math.random() * Math.PI * 2,
    waveSpeed: 0.02 + Math.random() * 0.02
  });
}

let petalInterval = null;
function startPetals() {
  petalInterval = setInterval(spawnPetal, 200);
}

(function animatePetals() {
  pctx.clearRect(0,0,W,H);
  petals = petals.filter(p => p.y < H + 30);
  petals.forEach(p => {
    p.y  += p.vy;
    p.wave += p.waveSpeed;
    p.x  += p.vx + Math.sin(p.wave) * 0.6;
    p.rot += p.vrot;
    pctx.save();
    pctx.translate(p.x, p.y);
    pctx.rotate(p.rot);
    pctx.beginPath();
    pctx.ellipse(0, 0, p.size, p.size*0.55, 0, 0, Math.PI*2);
    pctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha})`;
    pctx.fill();
    pctx.restore();
  });
  requestAnimationFrame(animatePetals);
})();

// ─── Messages ──────────────────────────────────────────────────────────────
const panel = document.getElementById('message-panel');
let msgIndex = 0;

function typewriterLine(el, text, cb) {
  el.classList.add('show');
  let i = 0;
  function tick() {
    el.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(tick, 55);
    else if (cb) setTimeout(cb, 400);
  }
  tick();
}

function showMessages() {
  panel.classList.add('visible');
  document.getElementById('hint').style.display = 'none';
  startPetals();
  launchBalloons();

  function next() {
    if (msgIndex >= WISHES.length) return;
    const el = document.getElementById('line' + msgIndex);
    typewriterLine(el, WISHES[msgIndex], () => {
      msgIndex++;
      setTimeout(next, 300);
    });
  }
  next();
}

// ─── Balloons ───────────────────────────────────────────────────────────────
const BALLOON_EMOJIS = ['🎈','🎉','🎊','💖','🌸','✨'];
function launchBalloons() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'balloon';
      el.textContent = BALLOON_EMOJIS[Math.floor(Math.random()*BALLOON_EMOJIS.length)];
      el.style.left = (Math.random() * 90 + 5) + 'vw';
      el.style.bottom = '-40px';
      const dur = 4 + Math.random() * 4;
      el.style.setProperty('--drift', ((Math.random()-0.5)*120)+'px');
      el.style.setProperty('--rot', ((Math.random()-0.5)*30)+'deg');
      el.style.animationDuration = dur + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000);
    }, i * 300 + Math.random()*200);
  }
}

// ─── Confetti on click ──────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
  if (!treeGrown && !blooming) {
    growTree();
    document.getElementById('hint').style.display = 'none';
    return;
  }
  // confetti burst
  const colors = ['#ff6fa8','#ffb347','#ffe4f0','#b3f0ff','#c8ff99','#ffd700'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = e.clientX + 'px';
    el.style.top  = e.clientY + 'px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    el.style.animationDuration = (1 + Math.random()*1.5) + 's';
    el.style.animationDelay = (Math.random()*0.3) + 's';
    el.style.transform = `translate(${(Math.random()-0.5)*60}px, ${(Math.random()-0.5)*60}px)`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
});
