/* ============== LENIS SMOOTH SCROLL ============== */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

/* ============== GSAP REGISTRATION ============== */
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ============== STARS ============== */
(function() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = 'left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;--d:'+(2+Math.random()*4)+'s;--delay:'+(Math.random()*4)+'s;--op:'+(0.2+Math.random()*0.8)+';';
    container.appendChild(s);
  }
})();

/* ============== FLOATING HEARTS ============== */
function launchHeart(emoji) {
  const h = document.createElement('div');
  h.className = 'fheart';
  h.textContent = emoji || ['💜','💕','✨','💫','🌸','💖'][Math.floor(Math.random()*6)];
  h.style.left = Math.random()*100 + '%';
  h.style.fontSize = (14+Math.random()*16) + 'px';
  const dur = 4 + Math.random() * 4;
  h.style.setProperty('--rot', (Math.random()*60-30) + 'deg');
  h.style.animation = 'rise ' + dur + 's linear forwards';
  document.getElementById('hearts').appendChild(h);
  setTimeout(function(){ h.remove(); }, dur * 1000);
}
setInterval(launchHeart, 1600);

/* ============== CURSOR TRAIL ============== */
let trailCount = 0;
function spawnTrail(x, y) {
  trailCount++;
  if (trailCount % 4 !== 0) return;
  const t = document.createElement('div');
  t.className = 'cursor-trail';
  t.style.left = x + 'px';
  t.style.top = y + 'px';
  t.textContent = ['💜','💕','✨'][Math.floor(Math.random()*3)];
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 900);
}
document.addEventListener('mousemove', e => spawnTrail(e.clientX, e.clientY));
document.addEventListener('touchmove', e => {
  const t = e.touches[0]; if (t) spawnTrail(t.clientX, t.clientY);
}, {passive:true});

/* ============== DAY COUNTER ============== */
(function() {
  const startDate = new Date(2023, 5, 1); // <-- TROCA AQUI: ano, mês-1, dia
  const days = Math.floor((new Date() - startDate) / (1000*60*60*24));
  const el = document.getElementById('daysCount');
  if (!el) return;
  const target = days > 0 ? days : 365;
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target, duration: 2, ease: 'power2.out',
    onUpdate: () => { el.textContent = Math.floor(obj.v); }
  });
})();

/* ============== SPLIT TEXT (h1 letter-by-letter) ============== */
function splitText() {
  document.querySelectorAll('.split').forEach(h => {
    const original = h.innerHTML;
    // Process: keep <span> tags intact, split text outside
    const tmp = document.createElement('div');
    tmp.innerHTML = original;
    const result = document.createElement('span');
    function walk(node) {
      if (node.nodeType === 3) { // text
        const text = node.textContent;
        for (const ch of text) {
          const s = document.createElement('span');
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          result.appendChild(s);
        }
      } else if (node.nodeType === 1) {
        const wrap = document.createElement(node.tagName);
        if (node.className) wrap.className = node.className;
        for (const ch of node.textContent) {
          const s = document.createElement('span');
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          wrap.appendChild(s);
        }
        result.appendChild(wrap);
      }
    }
    Array.from(tmp.childNodes).forEach(walk);
    h.innerHTML = '';
    h.appendChild(result);
  });
}
splitText();

/* ============== SCROLL ANIMATIONS - REVEAL ============== */
gsap.utils.toArray('section').forEach((section, i) => {
  if (section.id === 'hero') {
    gsap.set(section.querySelectorAll('.reveal, .reveal-x, .reveal-r, .reveal-zoom'), {
      opacity: 1, x: 0, y: 0, scale: 1
    });
    gsap.set(section.querySelectorAll('.split span'), {
      opacity: 1, y: 0, rotate: 0
    });
    return;
  }

  // Reveal generic
  const reveals = section.querySelectorAll('.reveal, .reveal-x, .reveal-r, .reveal-zoom');
  reveals.forEach(el => {
    let from = { opacity: 0, y: 30 };
    if (el.classList.contains('reveal-x')) from = { opacity: 0, x: -40 };
    if (el.classList.contains('reveal-r')) from = { opacity: 0, x: 40 };
    if (el.classList.contains('reveal-zoom')) from = { opacity: 0, scale: 0.85 };
    gsap.fromTo(el, from, {
      opacity: 1, x: 0, y: 0, scale: 1,
      duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });

  // Stagger reveal-x (motivos lista)
  const items = section.querySelectorAll('.reason-item');
  if (items.length) {
    gsap.fromTo(items, { opacity: 0, x: -40 }, {
      opacity: 1, x: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: items[0], start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  }

  // Why cards stagger w/ slight rotation
  const whyCards = section.querySelectorAll('.why-card');
  if (whyCards.length) {
    gsap.fromTo(whyCards, { opacity: 0, y: 50, rotateX: -10 }, {
      opacity: 1, y: 0, rotateX: 0, stagger: 0.18, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: whyCards[0], start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // Polaroids: random rotation + stagger
  const pols = section.querySelectorAll('.polaroid');
  if (pols.length) {
    pols.forEach((p, idx) => {
      const rot = parseFloat(p.dataset.rot || 0);
      gsap.fromTo(p, { opacity: 0, scale: 0.7, rotation: rot * 4 }, {
        opacity: idx === 4 ? 0.55 : 1, scale: 1, rotation: rot, duration: 0.8, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none reverse' },
        delay: idx * 0.08
      });
    });
  }

  // Split-text H1 letter stagger
  const splits = section.querySelectorAll('.split span span');
  if (splits.length) {
    gsap.to(splits, {
      opacity: 1, y: 0, rotate: 0,
      duration: 0.5, ease: 'back.out(1.6)', stagger: 0.025,
      scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }
});

/* ============== BG COLOR TRANSITION ============== */
const bgColor = document.getElementById('bgColor');
gsap.utils.toArray('section[data-bg]').forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => gsap.to(bgColor, { backgroundColor: section.dataset.bg, duration: 1.2, ease: 'power2.inOut' }),
    onEnterBack: () => gsap.to(bgColor, { backgroundColor: section.dataset.bg, duration: 1.2, ease: 'power2.inOut' })
  });
});

/* ============== BRIDGE FOCUS MODE ============== */
const bridgeSection = document.getElementById('bridge');
if (bridgeSection) {
  ScrollTrigger.create({
    trigger: bridgeSection,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => document.body.classList.add('bridge-active'),
    onEnterBack: () => document.body.classList.add('bridge-active'),
    onLeave: () => document.body.classList.remove('bridge-active'),
    onLeaveBack: () => document.body.classList.remove('bridge-active')
  });
}

/* ============== HERO FIXED VIA CSS STICKY ============== */

/* ============== HERO TO MEMORY BOAT TRANSITION ============== */
const liteMobileTransitions = window.matchMedia('(max-width: 768px)').matches;
(function() {
  if (liteMobileTransitions) return;
  const source = document.querySelector('#boat svg');
  const hero = document.getElementById('hero');
  const boat = document.getElementById('boat');
  if (!source || !hero || !boat) return;

  const overlay = document.createElement('div');
  overlay.className = 'boat-transition';
  overlay.innerHTML = source.outerHTML;
  document.body.appendChild(overlay);

  const overlayBoat = overlay.querySelector('svg');
  gsap.set(overlay, { opacity: 0 });
  gsap.set(overlayBoat, { scale: 1, rotation: 0, opacity: 1, filter: 'blur(0px)' });

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: '65% top',
      end: 'bottom top',
      scrub: 1.2
    }
  })
    .to(boat, { opacity: 0, duration: 0.08, ease: 'none' }, 0)
    .to(overlay, { opacity: 1, duration: 0.08, ease: 'none' }, 0)
    .to(overlayBoat, {
      rotation: 540,
      scale: 9,
      opacity: 0.08,
      filter: 'blur(4px)',
      duration: 0.72,
      ease: 'none'
    }, 0.08)
    .to(overlay, { opacity: 0, duration: 0.2, ease: 'none' }, 0.8);
})();

/* ============== MEMORY TO REASONS WIPE ============== */
(function() {
  if (liteMobileTransitions) return;
  const memory = document.getElementById('memory');
  const reasons = document.getElementById('reasons');
  if (!memory || !reasons) return;

  const wipe = document.createElement('div');
  wipe.className = 'frame-wipe';
  wipe.innerHTML = '<div class="frame-wipe-core"></div>';
  document.body.appendChild(wipe);

  const core = wipe.querySelector('.frame-wipe-core');

  gsap.timeline({
    scrollTrigger: {
      trigger: reasons,
      start: 'top 92%',
      end: 'top 18%',
      scrub: 1.1
    }
  })
    .to(wipe, { opacity: 1, duration: 0.18, ease: 'none' }, 0)
    .fromTo(core,
      { scale: 0.18, rotation: 0, opacity: 0.78, filter: 'blur(2px)' },
      { scale: 8, rotation: 24, opacity: 1, filter: 'blur(18px)', duration: 0.62, ease: 'none' },
      0.08
    )
    .to(core, { scale: 12, filter: 'blur(28px)', duration: 0.18, ease: 'none' }, 0.7)
    .to(wipe, { opacity: 0, duration: 0.22, ease: 'none' }, 0.78);
})();

/* ============== REASONS TO SCRATCH PORTAL ============== */
(function() {
  if (liteMobileTransitions) return;
  const reasons = document.getElementById('reasons');
  const scratch = document.getElementById('scratch');
  if (!reasons || !scratch) return;

  const portal = document.createElement('div');
  portal.className = 'frame-portal';
  portal.innerHTML = '<div class="frame-portal-core"></div>';
  document.body.appendChild(portal);

  const core = portal.querySelector('.frame-portal-core');

  gsap.timeline({
    scrollTrigger: {
      trigger: scratch,
      start: 'top 95%',
      end: 'top 22%',
      scrub: 1.1
    }
  })
    .to(portal, { opacity: 1, duration: 0.12, ease: 'none' }, 0)
    .fromTo(core,
      { scaleX: 0.08, scaleY: 0.7, opacity: 0.9, filter: 'blur(1px)' },
      { scaleX: 1.35, scaleY: 12, opacity: 1, filter: 'blur(14px)', duration: 0.66, ease: 'none' },
      0.08
    )
    .to(core, { opacity: 0.25, duration: 0.14, ease: 'none' }, 0.74)
    .to(portal, { opacity: 0, duration: 0.18, ease: 'none' }, 0.82);
})();

/* ============== SCRATCH TO MUSIC HEART TRANSITION ============== */
(function() {
  if (liteMobileTransitions) return;
  const scratch = document.getElementById('scratch');
  const music = document.getElementById('music');
  if (!scratch || !music) return;

  const heart = document.createElement('div');
  heart.className = 'frame-heart';
  heart.innerHTML = '<div class="frame-heart-core">💜</div>';
  document.body.appendChild(heart);

  const core = heart.querySelector('.frame-heart-core');

  gsap.timeline({
    scrollTrigger: {
      trigger: music,
      start: 'top 96%',
      end: 'top 24%',
      scrub: 1.05
    }
  })
    .to(heart, { opacity: 1, duration: 0.08, ease: 'none' }, 0)
    .fromTo(core,
      { scale: 0.2, rotation: 0, opacity: 0.95, filter: 'blur(0.5px)' },
      { scale: 10.5, rotation: -12, opacity: 1, filter: 'blur(10px)', duration: 0.66, ease: 'none' },
      0.06
    )
    .to(heart, { opacity: 0, duration: 0.18, ease: 'none' }, 0.78);
})();

/* ============== MUSIC TO WHYYOU BLOOM TRANSITION ============== */
(function() {
  if (liteMobileTransitions) return;
  const music = document.getElementById('music');
  const whyyou = document.getElementById('whyyou');
  if (!music || !whyyou) return;

  const bloom = document.createElement('div');
  bloom.className = 'frame-bloom';
  bloom.innerHTML = '<span class="frame-bloom-heart">💜</span><span class="frame-bloom-heart">💖</span><span class="frame-bloom-heart">💕</span><span class="frame-bloom-heart">💜</span><span class="frame-bloom-heart">💗</span>';
  document.body.appendChild(bloom);

  const hearts = bloom.querySelectorAll('.frame-bloom-heart');
  const bursts = [
    { x: 0, y: 0, s: 10, r: 0 },
    { x: -180, y: -140, s: 5.2, r: -18 },
    { x: 180, y: -120, s: 5, r: 16 },
    { x: -150, y: 150, s: 5.4, r: -14 },
    { x: 160, y: 155, s: 5.1, r: 20 }
  ];

  gsap.timeline({
    scrollTrigger: {
      trigger: whyyou,
      start: 'top 96%',
      end: 'top 24%',
      scrub: 1.06
    }
  })
    .to(bloom, { opacity: 1, duration: 0.12, ease: 'none' }, 0)
    .to(hearts, {
      x: i => bursts[i].x,
      y: i => bursts[i].y,
      scale: i => bursts[i].s,
      rotation: i => bursts[i].r,
      opacity: i => i === 0 ? 0.28 : 0.92,
      duration: 0.68,
      ease: 'none',
      stagger: { each: 0.02, from: 'center' }
    }, 0.06)
    .to(bloom, { opacity: 0, duration: 0.18, ease: 'none' }, 0.8);
})();

/* ============== H1 PARALLAX (subtle) ============== */
gsap.utils.toArray('section:not(#hero) h1').forEach(h => {
  gsap.to(h, {
    y: -30, ease: 'none',
    scrollTrigger: { trigger: h.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
});

/* ============== SCROLL PROGRESS BAR ============== */
const scrollProgress = document.getElementById('scrollProgress');
ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: self => { scrollProgress.style.width = (self.progress * 100) + '%'; }
});

/* ============== SCROLL-TOP BUTTON ============== */
const scrollTopBtn = document.getElementById('scrollTop');
ScrollTrigger.create({
  start: 'top -600',
  onUpdate: self => {
    if (self.scroll() > 600) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  }
});
scrollTopBtn.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.5 }));

/* ============== MEMORY GAME ============== */
const memPairs = [
  { emoji: '✨', label: 'Tem um jeitinho único' },
  { emoji: '❤️', label: 'É incrível' },
  { emoji: '🌟', label: 'É especial' },
  { emoji: '🌸', label: 'É dedicada' },
  { emoji: '😄', label: 'Me faz rir' },
  { emoji: '🪄', label: 'Me faz feliz' }
];
let memCards = [], memFlipped = [], memMatched = 0, memMoves = 0, memWinTimeout = null;
function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5); }

function initMemory() {
  memFlipped = []; memMatched = 0; memMoves = 0;
  if (memWinTimeout) { clearTimeout(memWinTimeout); memWinTimeout = null; }
  document.getElementById('memMoves').textContent = '0';
  document.getElementById('memPairsFound').textContent = '0';
  document.getElementById('memWin').classList.remove('show');
  document.getElementById('memGrid').style.display = 'grid';
  const items = shuffle(memPairs.concat(memPairs));
  const grid = document.getElementById('memGrid');
  grid.innerHTML = '';
  memCards = [];
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.value = item.label;
    card.innerHTML = '<div class="mem-front"><span class="heart-bg">💜</span></div>' +
                     '<div class="mem-back"><div class="emoji">'+item.emoji+'</div>'+item.label+'</div>';
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
    memCards.push(card);
  });
}
function flipCard(card) {
  if (card.classList.contains('flipped') || card.classList.contains('matched') || memFlipped.length >= 2) return;
  card.classList.add('flipped');
  memFlipped.push(card);
  if (memFlipped.length === 2) { memMoves++; document.getElementById('memMoves').textContent = memMoves; checkMatch(); }
}
function checkMatch() {
  const a = memFlipped[0], b = memFlipped[1];
  if (a.dataset.value === b.dataset.value) {
    a.classList.add('matched'); b.classList.add('matched');
    memMatched++;
    document.getElementById('memPairsFound').textContent = memMatched;
    memFlipped = [];
    for (let i = 0; i < 5; i++) setTimeout(launchHeart, i*60);
    if (memMatched === memPairs.length) {
      memWinTimeout = setTimeout(() => {
        document.getElementById('memWin').classList.add('show');
        confettiBurst(40);
      }, 3000);
    }
  } else {
    setTimeout(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); memFlipped = []; }, 900);
  }
}
const memWin = document.getElementById('memWin');
if (memWin) {
  memWin.addEventListener('click', e => {
    if (e.target === memWin) memWin.classList.remove('show');
  });
}
window.initMemory = initMemory;
initMemory();

/* ============== SCRATCH CARDS ============== */
const scratchData = [
  { em: '💎', ttl: 'minha pessoa<br/>favorita' },
  { em: '🌹', ttl: 'a mais linda<br/>de todas' },
  { em: '🔥', ttl: 'meu lugar<br/>seguro' },
  { em: '✨', ttl: 'minha sorte<br/>do universo' }
];
function buildScratch() {
  const grid = document.getElementById('scratchGrid');
  grid.innerHTML = '';
  scratchData.forEach((d, idx) => {
    const card = document.createElement('div');
    card.className = 'scratch-card';
    card.dataset.idx = idx;
    card.innerHTML = '<div class="scratch-content"><div class="em">'+d.em+'</div><div class="ttl">'+d.ttl+'</div></div><canvas class="scratch-canvas"></canvas>';
    grid.appendChild(card);
  });
  requestAnimationFrame(initScratchCanvases);
}
function initScratchCanvases() {
  document.querySelectorAll('.scratch-card').forEach((card, idx) => {
    const canvas = card.querySelector('.scratch-canvas');
    const rect = card.getBoundingClientRect();
    if (rect.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#a855f7');
    grad.addColorStop(0.4, '#ec4899');
    grad.addColorStop(0.7, '#f59e0b');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(Math.random()*rect.width, Math.random()*rect.height, Math.random()*2.5, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 13px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RASPE AQUI', rect.width/2, rect.height/2 - 4);
    ctx.font = '20px serif';
    ctx.fillText('💜', rect.width/2, rect.height/2 + 22);
    let drawing = false, isDone = false;
    function getXY(e) {
      const r = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    }
    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI*2);
      ctx.fill();
    }
    function checkRevealed() {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0, total = 0;
      for (let i = 3; i < data.length; i += 40) { total++; if (data[i] < 100) cleared++; }
      if ((cleared/total) > 0.55 && !isDone) {
        isDone = true;
        canvas.classList.add('done');
        const pills = document.querySelectorAll('#scratchProgress .scratch-pill');
        if (pills[idx]) pills[idx].classList.add('done');
        // Animate the revealed content
        const content = card.querySelector('.scratch-content');
        gsap.fromTo(content, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
        if (navigator.vibrate) navigator.vibrate(60);
        if (document.querySelectorAll('#scratchProgress .scratch-pill.done').length === scratchData.length) {
          setTimeout(() => confettiBurst(50), 200);
        }
      }
    }
    function start(e) { drawing = true; const p = getXY(e); scratch(p.x, p.y); }
    function move(e) { if (!drawing) return; if (e.preventDefault) e.preventDefault(); const p = getXY(e); scratch(p.x, p.y); }
    function end() { if (!drawing) return; drawing = false; checkRevealed(); }
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start, {passive:true});
    canvas.addEventListener('touchmove', move, {passive:false});
    canvas.addEventListener('touchend', end);
  });
}
buildScratch();
window.addEventListener('resize', () => setTimeout(initScratchCanvases, 200));

/* ============== MUSIC PLAYER ============== */
let playing = false, progress = 0, timer = null;
const totalSecs = 225;
const lyrics = [
  { t: 0, line: '♪ aperta o play e deixa rolar ♪' },
  { t: 6, line: '"Quer ser minha namorada?"' },
  { t: 18, line: 'A cada dia que passa eu te quero mais...' },
  { t: 35, line: 'Você me deixa louco, sabia?' },
  { t: 55, line: 'Quer ser minha namorada? 💜' },
  { t: 80, line: 'Eu te dou todo meu amor...' },
  { t: 110, line: 'É você quem eu quero pra mim' },
  { t: 145, line: 'Pra sempre, do meu lado 💕' },
  { t: 180, line: 'Diz que sim... só falta isso ✨' },
  { t: 220, line: '...então? 💜' }
];
function updateLyrics() {}
function fmt(s) { return Math.floor(s/60)+':'+(s%60).toString().padStart(2,'0'); }
function togglePlay() {}
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
if (playBtn && progressBar && prevBtn && nextBtn) {
  playBtn.addEventListener('click', togglePlay);
  progressBar.addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - r.left) / r.width;
    progress = Math.floor(totalSecs * pct);
  });
  prevBtn.addEventListener('click', () => {
    progress = Math.max(0, progress - 15);
  });
  nextBtn.addEventListener('click', () => {
    progress = Math.min(totalSecs, progress + 15);
  });
}

/* ============== TILT WHY CARDS ============== */
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotateY: x*8, rotateX: -y*8, duration: 0.3, transformPerspective: 800 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5 });
  });
});

/* ============== NO BUTTON ESCAPES ============== */
const noBtn = document.getElementById('noBtn');
let noClickAttempts = 0;
const naoLabels = ['não', 'tem certeza?', 'pensa de novo!', 'aiii nãoo', 'tá brincando né?', 'CLICA NO SIM 💜'];
function moveNoBtn() {
  const parent = noBtn.parentElement;
  const pr = parent.getBoundingClientRect();
  const newX = (Math.random() - 0.5) * (pr.width - 100);
  const newY = (Math.random() - 0.5) * 100;
  gsap.to(noBtn, { x: newX, y: newY, duration: 0.3, ease: 'power2.out' });
  noClickAttempts++;
  if (noClickAttempts < naoLabels.length) noBtn.textContent = naoLabels[noClickAttempts];
  else gsap.to(noBtn, { opacity: 0, scale: 0.5, duration: 0.4, onComplete: () => noBtn.style.display = 'none' });
}
noBtn.addEventListener('mouseenter', moveNoBtn);
noBtn.addEventListener('touchstart', moveNoBtn, {passive:true});
noBtn.addEventListener('click', moveNoBtn);

/* ============== YES BUTTON ============== */
const yesBtn = document.getElementById('yesBtn');
const yesAlert = document.getElementById('yesAlert');
let yesFlowStarted = false;
yesBtn.addEventListener('click', () => {
  if (yesFlowStarted) return;
  yesFlowStarted = true;

  if (yesAlert) yesAlert.classList.add('show');
  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

  setTimeout(() => {
    if (yesAlert) yesAlert.classList.remove('show');
    const finale = document.getElementById('finale-yes');
    finale.classList.add('show');
    document.body.classList.add('finale-open');
    ScrollTrigger.refresh();

    confettiBurst(120);
    setTimeout(() => confettiBurst(80), 500);
    setTimeout(() => confettiBurst(60), 1100);
    for (let i = 0; i < 24; i++) setTimeout(launchHeart, i * 90);
  }, 4000);
});

const loveLetter = document.getElementById('loveLetter');
document.querySelectorAll('.surprise-choice').forEach(choice => {
  choice.addEventListener('click', () => {
    if (loveLetter) loveLetter.classList.add('show');
    if (navigator.vibrate) navigator.vibrate(60);
  });
});

/* ============== BIG HEART ============== */
document.getElementById('bigHeart').addEventListener('click', () => {
  for (let i = 0; i < 12; i++) setTimeout(launchHeart, i*40);
  if (navigator.vibrate) navigator.vibrate(40);
});

/* ============== CONFETTI ============== */
const confettiColors = ['#ec4899','#7c3aed','#22d3ee','#f59e0b','#10b981','#a855f7','#f472b6'];
function confettiBurst(count) {
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = confettiColors[Math.floor(Math.random()*confettiColors.length)];
    const dur = 2 + Math.random()*2.5;
    const delay = Math.random()*0.4;
    c.style.transform = 'rotate('+(Math.random()*360)+'deg)';
    c.style.animation = 'confettiFall '+dur+'s '+delay+'s linear forwards';
    if (Math.random() > 0.5) c.style.borderRadius = '50%';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), (dur+delay)*1000+200);
  }
}

/* ============== REASON CLICK FX ============== */
document.querySelectorAll('.reason-item').forEach(item => {
  item.addEventListener('click', () => {
    gsap.fromTo(item, { scale: 1 }, { scale: 1.04, duration: 0.15, yoyo: true, repeat: 1 });
    for (let i = 0; i < 4; i++) setTimeout(launchHeart, i*40);
  });
});

/* ============== POLAROID UPLOAD ============== */
document.querySelectorAll('.polaroid').forEach((p) => {
  const img = p.querySelector('.photo-slot');
  const applyImageState = () => {
    if (img && img.getAttribute('src') && img.naturalWidth > 0) {
      img.style.display = 'block';
      p.classList.add('has-image');
    }
  };

  if (img) {
    if (img.complete) applyImageState();
    img.addEventListener('load', applyImageState);
  }

  if (p.classList.contains('fixed-photo')) return;
  p.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file || !img) return;
      const reader = new FileReader();
      reader.onload = ev => {
        img.src = ev.target.result;
        img.style.display = 'block';
        p.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
});

/* ============== SPACE = PLAY/PAUSE ============== */
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && document.activeElement.tagName !== 'BUTTON') {
    e.preventDefault();
    togglePlay();
  }
});

/* ============== INITIAL HERO INTRO TIMELINE ============== */
const heroIntro = gsap.timeline();
heroIntro
  .from('#hero .hero-sticker', { opacity: 0, scale: 0, rotation: -180, duration: 0.9, ease: 'back.out(1.7)' })
  .from('#hero .tag', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.6')
  .from('#hero h1', { opacity: 0, y: 28, scale: 0.96, duration: 0.8, ease: 'power3.out' }, '-=0.3')
  .from('#hero .subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
  .from('#hero .boat-wrapper', { opacity: 0, scale: 0.5, rotation: -10, duration: 1, ease: 'back.out(1.4)' }, '-=0.3')
  .from('#hero .hero-touch-hint', { opacity: 0, y: 10, duration: 0.5 }, '-=0.4')
  .from('#hero .hero-rotator', { opacity: 0, y: 15, duration: 0.6 }, '-=0.3')
  .from('#hero .hero-stat', { opacity: 0, y: 20, scale: 0.7, stagger: 0.12, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3')
  .from('#hero .cta-btn', { opacity: 0, y: 20, scale: 0.8, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.2')
  .from('.scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.2');

/* ============== WAVE CANVAS ANIMATION ============== */
(function() {
  const canvases = [];
  const heroCanvas = document.getElementById('waveCanvas');
  if (heroCanvas) canvases.push(heroCanvas);

  document.querySelectorAll('section[data-bg]:not(#hero)').forEach(section => {
    const canvas = document.createElement('canvas');
    canvas.className = 'wave-canvas';
    section.appendChild(canvas);
    canvases.push(canvas);
  });

  if (!canvases.length) return;
  const scenes = canvases.map(canvas => ({ canvas, ctx: canvas.getContext('2d'), w: 0, h: 0 }));
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    scenes.forEach(scene => {
      const rect = scene.canvas.parentElement.getBoundingClientRect();
      scene.w = rect.width; scene.h = rect.height;
      scene.canvas.width = scene.w * dpr; scene.canvas.height = scene.h * dpr;
      scene.canvas.style.width = scene.w + 'px'; scene.canvas.style.height = scene.h + 'px';
      scene.ctx.setTransform(1,0,0,1,0,0);
      scene.ctx.scale(dpr, dpr);
    });
  }

  function drawWave(scene, amplitude, speed, y0, color, alpha, t) {
    const { ctx, w, h } = scene;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const y = y0 + Math.sin((x * 0.012) + t * speed) + Math.cos((x * 0.006) + t * speed * 0.7) * (amplitude * 0.5);
      ctx.lineTo(x, y * amplitude / Math.max(amplitude, 1));
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  resize();
  window.addEventListener('resize', resize);
  let t = 0;
  function loop() {
    scenes.forEach(scene => {
      scene.ctx.clearRect(0, 0, scene.w, scene.h);
      drawWave(scene, 8, 0.04, scene.h - 60, '#7c3aed', 0.18, t);
      drawWave(scene, 10, 0.03, scene.h - 45, '#ec4899', 0.22, t);
      drawWave(scene, 7, 0.05, scene.h - 30, '#22d3ee', 0.28, t);
      drawWave(scene, 5, 0.07, scene.h - 15, '#a855f7', 0.35, t);
    });
    t++;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============== SHOOTING STARS ============== */
(function() {
  const container = document.getElementById('shootingStars');
  if (!container) return;
  function spawn() {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    const startX = Math.random() * 80 + 10;  // 10-90%
    const startY = Math.random() * 30 + 5;   // 5-35%
    s.style.left = startX + '%';
    s.style.top = startY + '%';
    const angle = -25 - Math.random() * 30; // -25 to -55deg
    s.style.setProperty('--ang', angle + 'deg');
    s.style.setProperty('--len', (80 + Math.random()*60) + 'px');
    container.appendChild(s);
    setTimeout(() => s.remove(), 1600);
  }
  // Spawn occasional shooting stars
  setInterval(() => { if (Math.random() < 0.6) spawn(); }, 2200);
  setTimeout(spawn, 800);
})();

/* ============== ROTATING PHRASE ============== */
(function() {
  const el = document.getElementById('rotatorText');
  if (!el) return;
  const phrases = [
    'a melhor parte do meu dia',
    'meu lugar favorito do mundo',
    'minha sorte do universo',
    'a paz que eu sempre quis',
    'minha aventura preferida',
    'o sorriso que me salva',
    'o motivo do meu sim'
  ];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % phrases.length;
    gsap.to(el, {
      opacity: 0, y: -10, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        el.textContent = phrases[i];
        gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      }
    });
  }, 2800);
})();

/* ============== MOTIVOS COUNT ============== */
(function() {
  const el = document.getElementById('motivosCount');
  if (!el) return;
  const obj = { v: 0 };
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        v: 1027, duration: 2.4, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.floor(obj.v); },
        onComplete: () => {
          // Switch to + symbol after settling
          setTimeout(() => { el.textContent = '1027+'; }, 200);
        }
      });
    }
  });
})();

/* ============== CTA BUTTON SCROLL ============== */
(function() {
  const btn = document.getElementById('ctaBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    lenis.scrollTo('#memory', { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 3) });
    for (let i = 0; i < 12; i++) setTimeout(launchHeart, i * 35);
    if (navigator.vibrate) navigator.vibrate(40);
  });
  // Magnetic-ish hover
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.25;
    const y = (e.clientY - r.top - r.height/2) * 0.25;
    gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  });
})();

/* ============== BOAT MOUSE TRACKING ============== */
(function() {
  const boat = document.getElementById('boat');
  if (!boat) return;
  const inner = boat.querySelector('.boat-inner') || boat;
  let isMoving = false;
  document.getElementById('hero').addEventListener('mousemove', e => {
    const r = boat.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;
    gsap.to(inner, {
      x: dx * 30, y: dy * 14,
      rotation: dx * 8,
      duration: 0.8, ease: 'power2.out'
    });
  });
  // Tap on boat = burst
  boat.addEventListener('click', e => {
    e.stopPropagation();
    gsap.fromTo(inner, { scale: 1 }, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
    for (let i = 0; i < 8; i++) setTimeout(() => launchHeart(['💜','💕','⭐','✨'][Math.floor(Math.random()*4)]), i*45);
    if (navigator.vibrate) navigator.vibrate(35);
  });
})();

/* ============== TAP HERO TO SPAWN HEARTS ============== */
(function() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  function burstAt(x, y) {
    const colors = ['💜','💕','✨','💖','🌟','💫'];
    for (let i = 0; i < 6; i++) {
      const h = document.createElement('div');
      h.className = 'tap-heart';
      h.textContent = colors[Math.floor(Math.random()*colors.length)];
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      const ang = (Math.PI * 2 * i / 6) + (Math.random() - 0.5) * 0.4;
      const dist = 40 + Math.random() * 60;
      h.style.setProperty('--tx', Math.cos(ang) * dist + 'px');
      h.style.setProperty('--ty', (Math.sin(ang) * dist - 20) + 'px');
      h.style.setProperty('--rot', (Math.random() * 360) + 'deg');
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1200);
    }
    if (navigator.vibrate) navigator.vibrate(20);
  }
  hero.addEventListener('click', e => {
    // Don't trigger when clicking buttons / interactive elements
    if (e.target.closest('button, .boat-wrapper, .hero-sticker, .hero-rotator, a, input')) return;
    burstAt(e.clientX, e.clientY);
  });
})();

/* ============== HERO STICKER CLICK ============== */
(function() {
  const sticker = document.getElementById('heroSticker');
  if (!sticker) return;
  sticker.addEventListener('click', e => {
    e.stopPropagation();
    gsap.fromTo(sticker, { scale: 1 }, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.out(2)' });
    for (let i = 0; i < 14; i++) setTimeout(() => launchHeart(), i*40);
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
  });
})();

/* ============== MAGNETIC YES BUTTON ============== */
(function() {
  const btn = document.getElementById('yesBtn');
  if (!btn) return;
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.4;
    const y = (e.clientY - r.top - r.height/2) * 0.4;
    gsap.to(btn, { x, y, duration: 0.25, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  });
})();

/* ============== DEVICE TILT (gyro) PARALLAX ============== */
(function() {
  if (!window.DeviceOrientationEvent) return;
  let active = false;
  function handler(e) {
    if (!active) return;
    const tx = (e.gamma || 0) * 0.3;  // left-right
    const ty = (e.beta || 0) * 0.15;  // forward-back
    const stars = document.getElementById('stars');
    const sticker = document.getElementById('heroSticker');
    if (stars) gsap.to(stars, { x: -tx, y: -ty, duration: 0.8, ease: 'power2.out' });
    if (sticker) gsap.to(sticker, { x: tx * 0.8, y: ty * 0.6, duration: 0.8, ease: 'power2.out' });
  }
  window.addEventListener('deviceorientation', handler);
  // First user interaction enables it (iOS requires permission)
  document.addEventListener('click', function activate() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(state => { if (state === 'granted') active = true; }).catch(() => {});
    } else {
      active = true;
    }
    document.removeEventListener('click', activate);
  }, { once: true });
})();

/* ============== KONAMI CODE EASTER EGG ============== */
(function() {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    const k = e.key;
    if (k === seq[pos]) {
      pos++;
      if (pos === seq.length) {
        pos = 0;
        // Mega love mode
        for (let i = 0; i < 60; i++) setTimeout(launchHeart, i * 25);
        confettiBurst(150);
        const msg = document.createElement('div');
        msg.textContent = 'MODO AMOR ATIVADO 💜';
        msg.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#ec4899,#7c3aed);color:#fff;padding:18px 28px;border-radius:20px;font-weight:900;letter-spacing:2px;z-index:99999;box-shadow:0 20px 60px rgba(236,72,153,.6);font-size:14px;';
        document.body.appendChild(msg);
        gsap.fromTo(msg, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
        setTimeout(() => { gsap.to(msg, { opacity: 0, y: -30, duration: 0.6, onComplete: () => msg.remove() }); }, 2500);
        if (navigator.vibrate) navigator.vibrate([100,50,100,50,100,50,300]);
      }
    } else {
      pos = (k === seq[0]) ? 1 : 0;
    }
  });
})();

/* ============== AMBIENT TYPING SOUND (visual) on cta-btn idle ============== */
(function() {
  const btn = document.getElementById('ctaBtn');
  if (!btn) return;
  // Subtle pulse every 4 seconds to attract attention
  setInterval(() => {
    if (window.scrollY < window.innerHeight * 0.5) {
      gsap.fromTo(btn, { scale: 1 }, { scale: 1.06, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.inOut' });
    }
  }, 4500);
})();

/* ============== SCROLL HINT - hide after first scroll ============== */
(function() {
  const hint = document.querySelector('.scroll-hint');
  if (!hint) return;
  let hidden = false;
  window.addEventListener('scroll', () => {
    if (!hidden && window.scrollY > 80) {
      hidden = true;
      gsap.to(hint, { opacity: 0, y: 20, duration: 0.5, onComplete: () => hint.style.display = 'none' });
    }
  });
})();
