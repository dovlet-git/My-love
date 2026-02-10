// ===== AUDIO PLAYER =====
const audio = document.getElementById('audio');
const toggle = document.getElementById('toggle');
const icon = document.getElementById('icon');
const btnText = document.getElementById('btnText');
const barFill = document.getElementById('barFill');
const tCur = document.getElementById('tCur');
const tDur = document.getElementById('tDur');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

function fmt(sec){
  if (!Number.isFinite(sec)) return "0:00";
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec/60);
  const s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

function setUI(playing){
  if(icon) icon.textContent = playing ? "⏸" : "▶";
  if(btnText) btnText.textContent = playing ? "Пауза" : "Нажми, чтобы включить нашу музыку";
}

// ===== Fullscreen helpers (iPhone: limited by Safari, still safe to try) =====
async function tryFullscreen(){
  const el = document.documentElement;
  try{
    if (!document.fullscreenElement && el.requestFullscreen) {
      await el.requestFullscreen();
    }
  }catch(_){}
}

function vibrate(ms){
  try{ if (navigator.vibrate) navigator.vibrate(ms); }catch(_){}
}

// ===== Main music button =====
if (toggle){
  toggle.addEventListener('click', async () => {
    await tryFullscreen(); // will likely be ignored on iPhone Safari — ok
    try{
      if (audio.paused){
        await audio.play();
        setUI(true);
      } else {
        audio.pause();
        setUI(false);
      }
    }catch(e){
      alert("Не удалось запустить музыку.");
    }
  });
}

if (audio){
  audio.addEventListener('loadedmetadata', () => {
    if(tDur) tDur.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if(tCur) tCur.textContent = fmt(audio.currentTime);
    const p = audio.duration ? (audio.currentTime / audio.duration) : 0;
    if(barFill) barFill.style.width = `${Math.min(100, Math.max(0, p*100))}%`;
  });

  audio.addEventListener('pause', () => setUI(false));
  audio.addEventListener('play', () => setUI(true));
}

// ===== MODAL LETTER =====
const modal = document.getElementById('modal');
const openLetter = document.getElementById('openLetter');
if (openLetter && modal){
  openLetter.addEventListener('click', () => modal.showModal());
}

// ===== CONSTANT FALLING HEARTS ❤️ =====
let heartsOn = true;

function spawnHeart(){
  if (!heartsOn) return;
  const h = document.createElement('span');
  h.className = 'fallHeart';
  h.textContent = Math.random() > 0.18 ? '❤' : '✨';
  const x = Math.random() * window.innerWidth;
  const size = 14 + Math.random() * 22;
  const dur = 4 + Math.random() * 4.5;
  const drift = (Math.random() * 140) - 70;

  h.style.left = `${x}px`;
  h.style.fontSize = `${size}px`;
  h.style.setProperty('--dur', `${dur}s`);
  h.style.setProperty('--drift', `${drift}px`);
  document.body.appendChild(h);

  setTimeout(() => h.remove(), (dur * 1000) + 200);
}
setInterval(spawnHeart, 240); // slightly lighter for iPhone battery

// ===== CONFETTI (small burst) =====
function burst(){
  const n = 34;
  for (let i=0;i<n;i++){
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = Math.random() > .5 ? '❤' : '✨';
    const x = (window.innerWidth * 0.5) + (Math.random()*240-120);
    const y = (window.innerHeight * 0.35) + (Math.random()*140-70);
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.setProperty('--dx', `${Math.random()*320-160}px`);
    s.style.setProperty('--dy', `${- (Math.random()*300+200)}px`);
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 1400);
  }
}

// ===== “MUAH” SOUND 💋 =====
const kissAudio = new Audio('kiss.mp3');
kissAudio.preload = 'auto';
kissAudio.playsInline = true;

async function playKiss(){
  try{
    kissAudio.currentTime = 0;
    await kissAudio.play();
  }catch(_){}
}

// ===== BIG KISS OVERLAY 😘 =====
function showKiss(){
  const el = document.createElement('div');
  el.className = 'kissOverlay';
  el.innerHTML = `
    <div class="kissInner">
      <div class="kiss">😘</div>
      <div class="kissText">Muah!</div>
    </div>
  `;
  document.body.appendChild(el);

  setTimeout(() => el.classList.add('on'), 10);
  setTimeout(() => el.classList.remove('on'), 1200);
  setTimeout(() => el.remove(), 1600);
}

// ===== FINAL SCREEN “ВЫХОДИ ЗА МЕНЯ” 👰 =====
function showProposal(){
  const el = document.createElement('div');
  el.className = 'proposalOverlay';
  el.innerHTML = `
    <div class="proposalCard">
      <div class="proposalTop">👰</div>
      <div class="proposalTitle">Выходи за меня</div>
      <div class="proposalSub">Я хочу всю жизнь быть рядом с тобой ❤️</div>
      <div class="proposalBtns">
        <button class="pBtn pYes" id="pYes">Да ❤️</button>
        <button class="pBtn pClose" id="pClose">Закрыть</button>
      </div>
      <div class="proposalHint">*Нажми «Да» 🙂</div>
    </div>
  `;
  document.body.appendChild(el);

  const yes = el.querySelector('#pYes');
  const close = el.querySelector('#pClose');

  yes.addEventListener('click', () => {
    burst(); burst();
    showKiss();
    vibrate(180);
    const msg = document.createElement('div');
    msg.className = 'proposalMsg';
    msg.textContent = 'Я самый счастливый ❤️';
    el.querySelector('.proposalCard').appendChild(msg);
    setTimeout(() => msg.remove(), 1400);
  });

  close.addEventListener('click', () => el.remove());
  el.addEventListener('click', (e) => { if (e.target === el) el.remove(); });
}

// ===== SURPRISE BUTTON =====
const confettiBtn = document.getElementById('confetti');
if (confettiBtn){
  confettiBtn.addEventListener('click', async () => {
    await tryFullscreen();
    await playKiss();
    showKiss();
    burst();
    vibrate(120);
    setTimeout(showProposal, 900);
  });
}

// ===== STYLES (injected) =====
const st = document.createElement('style');
st.textContent = `
.spark{
  position:fixed;
  z-index:30;
  font-size:18px;
  pointer-events:none;
  animation: fly 1.35s ease-out forwards;
  filter: drop-shadow(0 14px 26px rgba(255,61,127,.25));
}
@keyframes fly{
  from{ transform: translate(0,0) scale(1); opacity:1; }
  to{ transform: translate(var(--dx), var(--dy)) scale(.8); opacity:0; }
}

.fallHeart{
  position: fixed;
  top: -40px;
  z-index: 15;
  pointer-events: none;
  opacity: .9;
  animation: fall var(--dur) linear forwards;
  filter: drop-shadow(0 12px 28px rgba(255,61,127,.22));
}
@keyframes fall{
  from { transform: translate(0,0) rotate(0deg); opacity: .0; }
  10%  { opacity: .95; }
  to   { transform: translate(var(--drift), calc(100vh + 80px)) rotate(220deg); opacity: .0; }
}

.kissOverlay{
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,.45);
  opacity: 0;
  transform: scale(1.02);
  transition: opacity .25s ease, transform .25s ease;
  backdrop-filter: blur(6px);
}
.kissOverlay.on{ opacity: 1; transform: scale(1); }
.kissInner{ display:flex; flex-direction:column; align-items:center; gap:10px; }
.kiss{
  font-size: min(42vw, 240px);
  line-height: 1;
  animation: kissPop 1.2s ease-out forwards;
}
.kissText{
  font-weight: 900;
  letter-spacing: .5px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.08);
}
@keyframes kissPop{
  0%{ transform: scale(.6) rotate(-6deg); opacity: .2; }
  30%{ transform: scale(1.05) rotate(2deg); opacity: 1; }
  100%{ transform: scale(.95) rotate(0deg); opacity: 1; }
}

.proposalOverlay{
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,.62);
  backdrop-filter: blur(8px);
  padding: 18px;
}
.proposalCard{
  width: min(520px, 92vw);
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.16);
  background: rgba(10,12,22,.88);
  box-shadow: 0 30px 110px rgba(0,0,0,.65);
  padding: 18px 16px 16px;
  text-align: center;
}
.proposalTop{ font-size: 34px; margin-bottom: 6px; }
.proposalTitle{
  font-weight: 900;
  font-size: 28px;
  letter-spacing: .2px;
  margin: 0 0 8px;
}
.proposalSub{ color: rgba(255,255,255,.78); line-height: 1.5; margin-bottom: 14px; }
.proposalBtns{ display:flex; gap:10px; }
.pBtn{
  flex: 1;
  border-radius: 16px;
  padding: 12px 12px;
  font-weight: 900;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.08);
  color: white;
}
.pYes{
  border:none;
  background: linear-gradient(135deg, rgba(255,61,127,1), rgba(139,92,255,1));
}
.proposalHint{ margin-top: 10px; color: rgba(255,255,255,.62); font-weight: 800; font-size: 12px; }
.proposalMsg{
  margin-top: 12px;
  font-weight: 900;
  color: rgba(255,255,255,.9);
}
`;
document.head.appendChild(st);

// ===== BACKGROUND PARTICLES =====
const canvas = document.getElementById('bg');
if (canvas){
  const ctx = canvas.getContext('2d');
  let W=0,H=0, DPR=1;

  function resize(){
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.width = Math.floor(window.innerWidth * DPR);
    H = canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  const particles = Array.from({length: 56}, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    r: (Math.random()*3+1)*DPR,
    vx: (Math.random()-.5)*0.20*DPR,
    vy: (Math.random()-.5)*0.16*DPR,
    a: Math.random()*0.35 + 0.08,
  }));

  function tick(){
    ctx.clearRect(0,0,W,H);
    for (const p of particles){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -50) p.x = W+50;
      if (p.x > W+50) p.x = -50;
      if (p.y < -50) p.y = H+50;
      if (p.y > H+50) p.y = -50;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r*6, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${p.a*0.08})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
}
