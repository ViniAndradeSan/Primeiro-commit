document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------------------*/
  const elementoCanvas = document.getElementById("space");
  if (!elementoCanvas) return;

  const contextoCanvas = elementoCanvas.getContext("2d");
  const cursorPersonalizado = document.getElementById("mira");
  const conteudoPrincipal = document.querySelector(".conteudo");

  /* ------------------------------------------------------------------------*/
  let larguraCanvas, alturaCanvas;
  const TOTAL_ESTRELAS = 700;
  let campoEstrelas = [];

  function redimensionarCanvas() {
    larguraCanvas = elementoCanvas.width = window.innerWidth;
    alturaCanvas = elementoCanvas.height = window.innerHeight;
    gerarEstrelas();
  }

  window.addEventListener("resize", redimensionarCanvas);

  /* ------------------------------------------------------------------------*/
  function gerarEstrelas() {
    campoEstrelas = [];
    for (let i = 0; i < TOTAL_ESTRELAS; i++) {
      campoEstrelas.push({
        posicaoX: Math.random() * larguraCanvas,
        posicaoY: Math.random() * alturaCanvas,
        profundidade: Math.random(),
        tamanho: Math.random() * 1.5 + 0.3,
        opacidade: Math.random(),
      });
    }
  }

  /* ------------------------------------------------------------------------*/
  let alvoMouseX = window.innerWidth / 2;
  let alvoMouseY = window.innerHeight / 2;

  let cursorSuavizadoX = alvoMouseX;
  let cursorSuavizadoY = alvoMouseY;

  let deslocamentoParallaxX = 0;
  let deslocamentoParallaxY = 0;

  let alvoScrollY = 0;
  let scrollSuavizadoY = 0;

  /* ------------------------------------------------------------------------*/
  window.addEventListener("mousemove", (evento) => {
    alvoMouseX = evento.clientX;
    alvoMouseY = evento.clientY;
  });

  window.addEventListener("scroll", () => {
    alvoScrollY = window.scrollY;
  });

  document.addEventListener("mousedown", () => cursorPersonalizado?.classList.add("click"));
  document.addEventListener("mouseup", () => cursorPersonalizado?.classList.remove("click"));

  /* ------------------------------------------------------------------------*/
  function desenharNebulosa() {
    const gradienteRadial = contextoCanvas.createRadialGradient(
      larguraCanvas * 0.5,
      alturaCanvas * 0.5,
      0,
      larguraCanvas * 0.5,
      alturaCanvas * 0.5,
      larguraCanvas * 0.9
    );

    gradienteRadial.addColorStop(0, "rgba(122,48,255,0.15)");
    gradienteRadial.addColorStop(1, "transparent");

    contextoCanvas.fillStyle = gradienteRadial;
    contextoCanvas.fillRect(0, 0, larguraCanvas, alturaCanvas);
  }

  /* ------------------------------------------------------------------------*/
  function desenharEstrelas() {
    contextoCanvas.fillStyle = "white";

    for (let estrela of campoEstrelas) {
      let posicaoRenderX =
        (estrela.posicaoX + deslocamentoParallaxX * estrela.profundidade * 60 + larguraCanvas) % larguraCanvas;

      let posicaoRenderY =
        (estrela.posicaoY +
          deslocamentoParallaxY * estrela.profundidade * 60 +
          scrollSuavizadoY * estrela.profundidade * 0.4 +
          alturaCanvas) % alturaCanvas;

      contextoCanvas.globalAlpha = estrela.opacidade;
      contextoCanvas.beginPath();
      contextoCanvas.arc(posicaoRenderX, posicaoRenderY, estrela.tamanho, 0, Math.PI * 2);
      contextoCanvas.fill();
    }

    contextoCanvas.globalAlpha = 1;
  }

  /* ------------------------------------------------------------------------*/
  function loopAnimacao() {
    contextoCanvas.clearRect(0, 0, larguraCanvas, alturaCanvas);

    cursorSuavizadoX += (alvoMouseX - cursorSuavizadoX) * 0.18;
    cursorSuavizadoY += (alvoMouseY - cursorSuavizadoY) * 0.18;

    const mouseNormalizadoX = alvoMouseX / larguraCanvas - 0.5;
    const mouseNormalizadoY = alvoMouseY / alturaCanvas - 0.5;

    deslocamentoParallaxX += (mouseNormalizadoX - deslocamentoParallaxX) * 0.05;
    deslocamentoParallaxY += (mouseNormalizadoY - deslocamentoParallaxY) * 0.05;

    scrollSuavizadoY += (alvoScrollY - scrollSuavizadoY) * 0.08;

    if (cursorPersonalizado) {
      const escalaCursor = cursorPersonalizado.classList.contains("click") ? 0.85 : 1;
      cursorPersonalizado.style.transform =
        `translate3d(${cursorSuavizadoX}px, ${cursorSuavizadoY}px, 0) translate(-50%, -50%) scale(${escalaCursor})`;
    }

    if (conteudoPrincipal) {
      conteudoPrincipal.style.transform =
        `translate3d(${deslocamentoParallaxX * 10}px, ${deslocamentoParallaxY * 10}px, 0)`;
    }

    desenharNebulosa();
    desenharEstrelas();

    requestAnimationFrame(loopAnimacao);
  }

  /* ------------------------------------------------------------------------*/
  redimensionarCanvas();
  loopAnimacao();

  /* ------------------------------------------------------------------------*/
  const elementosFade = document.querySelectorAll(".desaparecer");

  elementosFade.forEach(elemento => {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        elemento.classList.toggle("hidden", !entrada.isIntersecting);
      });
    }, {
      threshold: 0.2 
    });

    observador.observe(elemento);
  });

});

/* ------------------------------------------------------------------------*/
function mostrarCard(idCard) {
  const secoesTexto = document.querySelectorAll(".texto");
  const secaoAlvo = document.getElementById(idCard);

  if (!secaoAlvo) return;

  const jaEstaAberto = secaoAlvo.classList.contains("ativo");

  secoesTexto.forEach(secao => secao.classList.remove("ativo"));

  if (!jaEstaAberto) {
    secaoAlvo.classList.add("ativo");

    setTimeout(() => {
      secaoAlvo.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  }
}

/* ------------------------------------------------------------------------*/
function fecharCards() {
  const secoesTexto = document.querySelectorAll(".texto");
  secoesTexto.forEach(secao => secao.classList.remove("ativo"));

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}