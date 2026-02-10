const audio = document.getElementById('audio');
const toggle = document.getElementById('toggle');
const icon = document.getElementById('icon');
const btnText = document.getElementById('btnText');
const barFill = document.getElementById('barFill');
const tCur = document.getElementById('tCur');
const tDur = document.getElementById('tDur');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

function fmt(sec){
  if (!Number.isFinite(sec)) return "0:00";
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec/60);
  const s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

function setUI(playing){
  icon.textContent = playing ? "⏸" : "▶";
  btnText.textContent = playing ? "Пауза" : "Нажми, чтобы включить нашу музыку";
}

toggle.addEventListener('click', async () => {
  try{
    if (audio.paused){
      await audio.play();
      setUI(true);
    } else {
      audio.pause();
      setUI(false);
    }
  }catch(e){
    // Some browsers require user gesture; we already have click; still could fail if no source
    alert("Не удалось запустить музыку. Проверь, что файл music.m4a (или music.mp3) рядом с index.html.");
  }
});

audio.addEventListener('loadedmetadata', () => {
  tDur.textContent = fmt(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  tCur.textContent = fmt(audio.currentTime);
  const p = audio.duration ? (audio.currentTime / audio.duration) : 0;
  barFill.style.width = `${Math.min(100, Math.max(0, p*100))}%`;
});

audio.addEventListener('pause', () => setUI(false));
audio.addEventListener('play', () => setUI(true));

/* Modal letter */
const modal = document.getElementById('modal');
document.getElementById('openLetter').addEventListener('click', () => modal.showModal());

/* Confetti-lite */
function burst(){
  const n = 32;
  for (let i=0;i<n;i++){
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = Math.random() > .5 ? '❤' : '✨';
    const x = (window.innerWidth * 0.5) + (Math.random()*220-110);
    const y = (window.innerHeight * 0.35) + (Math.random()*120-60);
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.setProperty('--dx', `${Math.random()*260-130}px`);
    s.style.setProperty('--dy', `${- (Math.random()*260+180)}px`);
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 1400);
  }
}
document.getElementById('confetti').addEventListener('click', burst);

// spark styles injected (kept in JS to keep CSS short)
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
}`;
document.head.appendChild(st);

/* Animated background: floating particles like bokeh */
const canvas = document.getElementById('bg');
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

const particles = Array.from({length: 60}, () => ({
  x: Math.random()*W,
  y: Math.random()*H,
  r: (Math.random()*3+1)*DPR,
  vx: (Math.random()-.5)*0.22*DPR,
  vy: (Math.random()-.5)*0.18*DPR,
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

    // soft glow
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
