document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("space");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const mira = document.getElementById("mira");
  const content = document.querySelector(".content");

  let w, h;
  const STAR_COUNT = 700;
  let stars = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createStars();
  }

  window.addEventListener("resize", resize);

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
      });
    }
  }

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let cursorX = targetX;
  let cursorY = targetY;
  let parallaxX = 0;
  let parallaxY = 0;
  let scrollY = 0;
  let currentScroll = 0;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  document.addEventListener("mousedown", () => mira?.classList.add("click"));
  document.addEventListener("mouseup", () => mira?.classList.remove("click"));

  function drawNebula() {
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.9);
    grad.addColorStop(0, "rgba(122,48,255,0.15)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStars() {
    ctx.fillStyle = "white";
    for (let s of stars) {
      // Movimento das estrelas com parallax e scroll
      let x = (s.x + parallaxX * s.z * 60 + w) % w;
      let y = (s.y + parallaxY * s.z * 60 + currentScroll * s.z * 0.4 + h) % h;

      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    cursorX += (targetX - cursorX) * 0.18;
    cursorY += (targetY - cursorY) * 0.18;

    const nx = targetX / w - 0.5;
    const ny = targetY / h - 0.5;
    parallaxX += (nx - parallaxX) * 0.05;
    parallaxY += (ny - parallaxY) * 0.05;

    currentScroll += (scrollY - currentScroll) * 0.08;

    if (mira) {
      const scale = mira.classList.contains("click") ? 0.85 : 1;
      mira.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${scale})`;
    }

    if (content) {
      content.style.transform = `translate3d(${parallaxX * 10}px, ${parallaxY * 10}px, 0)`;
    }

    drawNebula();
    drawStars();
    requestAnimationFrame(animate);
  }

  resize();
  animate();

  // Intersection Observer para efeitos de fade
  const elements = document.querySelectorAll('.fade-out');
  elements.forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        el.classList.toggle('hidden', !entry.isIntersecting);
      });
    }, { threshold: 0.2 });
    observer.observe(el);
  });
});

// --- FUNÇÕES DOS CARDS (FORA DO DOMCONTENTLOADED PARA O HTML ENXERGAR) ---

function mostrarCard(id) {
  const textos = document.querySelectorAll('.texto');
  const ativo = document.getElementById(id);

  if (!ativo) return;

  const jaAberto = ativo.classList.contains('ativo');

  // Fecha todos
  textos.forEach(t => t.classList.remove('ativo'));

  // Se não estava aberto, abre e rola a tela
  if (!jaAberto) {
    ativo.classList.add('ativo');
    setTimeout(() => {
      ativo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}

function fecharCards() {
  const textos = document.querySelectorAll('.texto');
  textos.forEach(t => t.classList.remove('ativo'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}