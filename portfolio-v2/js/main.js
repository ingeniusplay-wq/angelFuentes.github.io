/* =====================
   CURSOR PERSONALIZADO
===================== */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
  setTimeout(() => {
    cursorTrail.style.left = mouseX + 'px';
    cursorTrail.style.top  = mouseY + 'px';
  }, 80);
});

document.querySelectorAll('a, button, .carousel-btn, .carousel-dot').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform      = 'translate(-50%, -50%) scale(2)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform      = 'translate(-50%, -50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

/* =====================
   PARTÍCULAS
===================== */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function rand(a, b) { return Math.random() * (b - a) + a; }

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = rand(0, W);
    this.y     = rand(0, H);
    this.r     = rand(0.5, 2);
    this.vx    = rand(-0.15, 0.15);
    this.vy    = rand(-0.25, -0.05);
    this.alpha = rand(0.1, 0.5);
    this.color = Math.random() > 0.5 ? '167,139,250' : '96,165,250';
  }

  update() {
    this.x     += this.vx;
    this.y     += this.vy;
    this.alpha -= 0.0008;
    if (this.alpha <= 0 || this.y < -10) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 120 }, () => new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* =====================
   TYPEWRITER
===================== */
const phrases = [
  'Junior Unity Game Developer',
  'Mobile Game Developer',
  'Android · Unity · C#',
  'Creador de experiencias jugables'
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeLoop() {
  const phrase = phrases[phraseIndex];

  if (!deleting) {
    typeEl.textContent = phrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 75);
  } else {
    typeEl.textContent = phrase.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting     = false;
      phraseIndex  = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 40);
  }
}
typeLoop();

/* =====================
   NAVBAR AL SCROLL
===================== */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

/* =====================
   SCROLL REVEAL
===================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =====================
   CARRUSEL
   Uso: initCarousel(wrapperEl, slides)
   slides = array de rutas de imagen o null para placeholder
   Ejemplo: initCarousel(el, ['img/necromancer/1.jpg', 'img/necromancer/2.jpg'])
===================== */
function initCarousel(wrapper, slides, placeholder = '💀') {
  const track = wrapper.querySelector('.carousel-track');
  const dotsEl = wrapper.querySelector('.carousel-dots');
  let current = 0;

  // Crear slides
  slides.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Screenshot ${i + 1}`;
      img.loading = 'lazy';
      slide.appendChild(img);
    } else {
      const glow = document.createElement('div');
      glow.className = 'carousel-glow';
      const icon = document.createElement('span');
      icon.className = 'carousel-placeholder';
      icon.textContent = placeholder;
      slide.appendChild(glow);
      slide.appendChild(icon);
    }

    track.appendChild(slide);
  });

  // Crear dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  wrapper.querySelector('.carousel-btn.prev').addEventListener('click', () => goTo(current - 1));
  wrapper.querySelector('.carousel-btn.next').addEventListener('click', () => goTo(current + 1));

  // Swipe táctil
  let startX = 0;
  wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Auto-avance cada 4s si hay más de 1 slide
  if (slides.length > 1) {
    setInterval(() => goTo(current + 1), 4000);
  }
}

/* =====================
   INICIALIZAR CARRUSELES
   
   INSTRUCCIONES PARA AÑADIR FOTOS:
   - Crea una carpeta por juego dentro de img/
   - Pon las fotos ahí (jpg, png, webp)
   - Sustituye null por la ruta: 'img/necromancer/foto1.jpg'
   - Puedes poner tantas fotos como quieras por juego
   - Si dejas null se muestra el emoji de placeholder
===================== */
document.addEventListener('DOMContentLoaded', () => {

  // NECROMANCER — sustituye null por tus rutas de imagen
  initCarousel(
    document.getElementById('carousel-necromancer'),
    [
         'img/necromancer/pantallaDeInicio.png',
         'img/necromancer/roadMap.jpeg',
         'img/necromancer/gamePlay1.png',
         'img/necromancer/gamePlay2.PNG',
         'img/necromancer/gamePlay3.PNG',
         'img/necromancer/gamePlay4.PNG',
         'img/necromancer/spinWheel.png',
         'img/necromancer/shopNecro.jpeg',
         
    ],
    '💀'
  );

  // JOHN GUNNER
  initCarousel(
    document.getElementById('carousel-johngünner'),
    [
      'img/johngünner/jhon1.PNG',
      'img/johngünner/jhon2.PNG',
      'img/johngünner/jhon3.PNG',
    ],
    '🔫'
  );

  // SWORD REBIRTH
  initCarousel(
    document.getElementById('carousel-swordrebirth'),
    [
      'img/swordrebirth/s1.PNG',
      'img/swordrebirth/s2.PNG',
      'img/swordrebirth/s3.PNG',
      'img/swordrebirth/s4.PNG',
      'img/swordrebirth/s5.PNG',
      'img/swordrebirth/s6.PNG',
    ],
    '⚔️'
  );

  // RUNNER 2D
  initCarousel(
    document.getElementById('carousel-runner'),
    [
     'img/runner/runner1.PNG',
     'img/runner/runner2.PNG',
    ],
    '🏃'
  );

  // TOWER DEFENSE
  initCarousel(
    document.getElementById('carousel-towerdefense'),
    [
      'img/towerdefense/tw1.PNG',
      'img/towerdefense/tw2.PNG',
    ],
    '🗼'
  );

  // SHOOTER
  initCarousel(
    document.getElementById('carousel-shooter'),
    [
      'img/shooter/s1.PNG',
      'img/shooter/s2.PNG',
      'img/shooter/s3.PNG',
      'img/shooter/s4.PNG',
    ],
    '🎯'
  );

  // TOWER BOX
  initCarousel(
    document.getElementById('carousel-towerbox'),
    [
      'img/towerbox/t1.PNG',
      'img/towerbox/t2.PNG',
      'img/towerbox/t3.PNG',
    ],
    '🏗️'
  );

});
