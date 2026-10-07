const chapters = document.getElementById('chapters');
const birthdayTrigger = document.getElementById('birthday-trigger');
const scrollCue = document.getElementById('scroll-cue');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let unlocked = false;
let codeTyped = false;
let touchStartY = 0;

function blockLockedScroll(event) {
  if (!unlocked) event.preventDefault();
}

chapters.addEventListener('wheel', blockLockedScroll, { passive: false });
chapters.addEventListener('touchmove', blockLockedScroll, { passive: false });

chapters.addEventListener('touchstart', (event) => {
  touchStartY = event.touches[0].clientY;
}, { passive: true });

document.addEventListener('keydown', (event) => {
  const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
  if (!unlocked && scrollKeys.includes(event.key)) event.preventDefault();
});

function releaseParticles() {
  const rect = birthdayTrigger.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const maxDistance = Math.max(viewportW, viewportH) * 0.85;

  const symbols = [
    '♡', '✦', '·', '✧', '♡', '✦', '·', '✧',
    '♡', '✦', '·', '✧', '♡', '✦', '·', '✧',
    '♡', '✦', '·', '✧', '♡', '✦', '·', '✧',
    '♡', '✦', '♡', '✧', '·', '✦', '♡', '✦'
  ];

  symbols.forEach((symbol, index) => {
    const delay = (index % 8) * 30;
    setTimeout(() => {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * index) / symbols.length + (Math.random() * 0.4 - 0.2);
      const distance = maxDistance * (0.55 + Math.random() * 0.45);
      const size = 0.85 + Math.random() * 1.5;

      particle.className = 'particle';
      particle.textContent = symbol;
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.fontSize = size + 'rem';
      particle.style.color = pickColor();
      particle.style.setProperty('--x', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--y', Math.sin(angle) * distance + 'px');
      particle.style.setProperty('--r', ((Math.random() * 140) - 70) + 'deg');

      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove());
      setTimeout(() => { if (particle.parentNode) particle.remove(); }, 2600);
    }, delay);
  });

  setTimeout(() => {
    for (let i = 0; i < 32; i++) {
      const particle = document.createElement('span');
      const angle = Math.random() * Math.PI * 2;
      const distance = maxDistance * (0.4 + Math.random() * 0.6);
      const size = 0.65 + Math.random() * 1.3;
      const symbols2 = ['♡', '✦', '✧', '·'];

      particle.className = 'particle';
      particle.textContent = symbols2[Math.floor(Math.random() * symbols2.length)];
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.fontSize = size + 'rem';
      particle.style.color = pickColor();
      particle.style.setProperty('--x', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--y', Math.sin(angle) * distance + 'px');
      particle.style.setProperty('--r', ((Math.random() * 120) - 60) + 'deg');

      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove());
      setTimeout(() => { if (particle.parentNode) particle.remove(); }, 2600);
    }
  }, 200);
}

function pickColor() {
  const colors = ['#c2637d','#e8a0b0','#f0c4cc','#d4849a','#bf6d82','#f5d0d8','#a8556e'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function unlockExperience() {
  releaseParticles();
  if (!unlocked) {
    unlocked = true;
    document.body.classList.remove('is-locked');
    scrollCue.classList.add('is-visible');
  }
}

birthdayTrigger.addEventListener('click', unlockExperience);
birthdayTrigger.addEventListener('touchend', (event) => {
  const touchEndY = event.changedTouches[0].clientY;
  if (Math.abs(touchEndY - touchStartY) < 14) unlockExperience();
}, { passive: true });

function typeCodeOnce() {
  if (codeTyped) return;
  codeTyped = true;
  const output = document.getElementById('typing-output');
  const source = [
    'const myFavoritePerson = "You";',
    '',
    'while (true) {',
    '  love(myFavoritePerson);',
    '  choose(myFavoritePerson);',
    '  stay(myFavoritePerson);',
    '}'
  ].join('\n');

  if (reducedMotion) {
    output.textContent = source;
    return;
  }

  let index = 0;
  const interval = window.setInterval(() => {
    output.textContent = source.slice(0, index);
    index += 1;
    if (index > source.length) window.clearInterval(interval);
  }, 18);
}

const entryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-entered');
    if (entry.target.id === 'code-section') typeCodeOnce();
    entryObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

document.querySelectorAll('.chapter').forEach((chapter) => {
  entryObserver.observe(chapter);
});

if (window.lucide) lucide.createIcons();