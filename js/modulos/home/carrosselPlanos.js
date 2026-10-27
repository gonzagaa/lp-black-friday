/* PORTE dos carrosséis de planos de ../Zero7/script/global.js (mySwiper4 e mySwiper11, paginação com o nome
   do plano, slides fora da tela inert, Sênior como slide inicial).
   Mudanças em relação à home, e só estas:
   - módulo ES; o Swiper 11.2.10 vem de vendor/ (exceção da regra 10 do CLAUDE.md, só para esta seção) e é
     carregado aqui, sob demanda: depois do load, em idle (o portão da home) e com a seção a ~1200 px da tela;
   - além do load, espera o planos.json preencher os cards (o blackPlanos pode retirar card sem preço, e o
     loop e a paginação do Swiper precisam nascer com a lista final). Por isso o índice do slide inicial é lido na
     hora de armar, não no parse;
   - a largura do slide inicial é lida na hora de armar (na home, window.innerWidth no parse: dá no mesmo);
   - loop só quando há cards suficientes (loopOuCentro); senão, cards centralizados e sem aviso do Swiper;
   - ajuste do cliente: o Sênior não tem mais destaque (.card--copa saiu). Ele continua sendo o slide inicial,
     marcado no HTML com data-inicial. */

const SWIPER_JS = 'vendor/swiper-11.2.10/swiper-bundle.min.js';

const BP_SM = 640;
const BP_LG = 1080;
const SEM_MOVIMENTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Também usado pela comunidade (js/modulos/comunidade.js): um só script do Swiper na página.
export function carregarSwiper() {
  if (window.Swiper) return Promise.resolve(window.Swiper);
  return new Promise((ok, falha) => {
    const s = document.createElement('script');
    s.src = SWIPER_JS;
    s.onload = () => ok(window.Swiper);
    s.onerror = () => falha(new Error(`Não carregou ${SWIPER_JS}`));
    document.head.appendChild(s);
  });
}

/* Indicadores com o nome do plano no lugar das bolinhas de 8px. Cada um é um
   <button> com o mesmo texto do título do card — nada de copy nova — e 44px
   de altura. Os planos que estão na tela ficam acesos: um no celular, dois no
   tablet, três no desktop. O bloco mora logo depois do .swiper, fora dele.

   Os slides fora da tela ficam inert: sem isso o Tab entrava no CTA de um card
   escondido, o loop reordenava os slides no DOM e o teclado não saía mais do
   carrossel. */
function paginacaoDePlanos(carrossel) {
  const nomes = Array.from(
    document.querySelectorAll(carrossel + " .swiper-slide .title h3"),
    (h) => h.textContent.trim()
  );
  return {
    el: carrossel + " + .swiper-pagination",
    clickable: true,
    renderBullet: (i, classe) =>
      '<button type="button" class="' + classe + '">' + (nomes[i] || i + 1) + "</button>",
  };
}

function marcarPlanosNaTela(sw) {
  const naTela = new Set();
  sw.slides.forEach((slide, i) => {
    if (!slide.classList.contains("swiper-slide-visible")) return;
    const real = slide.getAttribute("data-swiper-slide-index");
    naTela.add(real === null ? i : Number(real));
  });

  // Carrossel escondido (o ativo que não está selecionado) não tem slide
  // visível; nada fica inert até ele aparecer e ser medido de novo.
  sw.slides.forEach((slide, i) => {
    const real = slide.getAttribute("data-swiper-slide-index");
    slide.inert = naTela.size > 0 && !naTela.has(real === null ? i : Number(real));
  });

  const indicadores = sw.indicadoresProprios || (sw.pagination && sw.pagination.bullets) || [];
  indicadores.forEach((b, i) => b.classList.toggle("is-na-tela", naTela.has(i)));
}

const EVENTOS_DO_CARROSSEL_DE_PLANOS = {
  init: marcarPlanosNaTela,
  update: marcarPlanosNaTela,
  resize: marcarPlanosNaTela,
  slideChange: marcarPlanosNaTela,
  transitionEnd: marcarPlanosNaTela,
  loopFix: marcarPlanosNaTela,
  paginationRender: marcarPlanosNaTela,
  paginationUpdate: marcarPlanosNaTela,
};

// rótulos de acessibilidade do Swiper em português (os padrões vêm em inglês)
const A11Y = {
  prevSlideMessage: "Plano anterior",
  nextSlideMessage: "Próximo plano",
  firstSlideMessage: "Este é o primeiro plano",
  lastSlideMessage: "Este é o último plano",
  // vazio: o card guarda o próprio aria-label ("80% de desconto"); o Swiper só o troca se houver mensagem
  slideLabelMessage: "",
  slideRole: "group",
};

// LP: loop só com cards suficientes (o Swiper pede pelo menos 2 × slidesPerView). Com menos (o Bitcoin tem 2),
// a home liga o loop mesmo assim: aviso no console e ordem instável. Aqui o loop desliga, os cards ficam
// centralizados, as setas somem quando todos cabem (watchOverflow) e a paginação com os nomes continua
// (planos-black.css mantém a paginação à vista mesmo travada).
function loopOuCentro(seletor, breakpoints) {
  const n = document.querySelectorAll(`${seletor} .swiper-wrapper > .swiper-slide`).length;
  const maxNaTela = Math.max(1, ...Object.values(breakpoints).map(b => b.slidesPerView));
  return n >= maxNaTela * 2
    ? { loop: true }
    : { loop: false, centerInsufficientSlides: true, watchOverflow: true, pagination: false };
}

// Sem loop, a paginação do Swiper tem um indicador por posição, não por card (com os 2 cards do Bitcoin à
// vista, só um). Aqui os indicadores são montados um por card, com o nome do plano e as classes do Swiper.
function indicadoresPorCard(sw, carrossel) {
  if (sw.params.loop) return;
  const lugar = document.querySelector(carrossel + " + .swiper-pagination");
  if (!lugar) return;
  lugar.classList.add("swiper-pagination-clickable", "swiper-pagination-bullets", "swiper-pagination-horizontal");
  lugar.innerHTML = "";
  sw.indicadoresProprios = sw.slides.map((slide, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swiper-pagination-bullet";
    b.textContent = slide.querySelector(".title h3")?.textContent.trim() || String(i + 1);
    b.addEventListener("click", () => sw.slideTo(i));
    lugar.appendChild(b);
    return b;
  });
  marcarPlanosNaTela(sw);
}

function armarCarrosseis(Swiper) {
  // O bloco do mercado que não está selecionado fica escondido; o Swiper não mede um carrossel escondido (e o
  // loop dele avisava no console). Os dois aparecem só enquanto os carrosséis nascem, na mesma tarefa, sem pintar.
  const escondidos = Array.from(document.querySelectorAll("#planos .plano-asset[hidden]"));
  escondidos.forEach(bloco => { bloco.hidden = false; });

  // O card com data-inicial (o Sênior) é o slide inicial: primeiro no mobile, do meio no desktop.
  // (Na home, o slide inicial é o .card--copa.)
  const slidesDoCarrossel = Array.from(
    document.querySelectorAll(".mySwiper4 .swiper-wrapper > .swiper-slide")
  );
  const indiceInicial = slidesDoCarrossel.findIndex(el => el.hasAttribute("data-inicial"));
  const temInicial = indiceInicial >= 0;
  // Com 3 cards à vista o inicial precisa ser o do meio; com 1 ou 2, o primeiro.
  const slideInicial =
    window.innerWidth >= BP_LG ? Math.max(0, indiceInicial - 1) : indiceInicial;

  const breakpoints4 = {
    [BP_SM]: { slidesPerView: 2, spaceBetween: 20 },
    [BP_LG]: { slidesPerView: 3, spaceBetween: 60 },
  };
  window.swiper4 = new Swiper(".mySwiper4", {
    slidesPerView: 1,
    spaceBetween: 5,
    ...loopOuCentro(".mySwiper4", breakpoints4),
    grabCursor: true,
    speed: SEM_MOVIMENTO ? 0 : 300,
    watchSlidesProgress: true,
    ...(temInicial ? { initialSlide: slideInicial } : {}),
    breakpoints: breakpoints4,
    pagination: paginacaoDePlanos(".mySwiper4"),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    a11y: A11Y,
    on: EVENTOS_DO_CARROSSEL_DE_PLANOS,
  });

  // O carrossel de bitcoin só tem dois cards, então o teto dele é 2.
  const breakpoints11 = {
    [BP_SM]: { slidesPerView: 2, spaceBetween: 20 },
    [BP_LG]: { slidesPerView: 2, spaceBetween: 30 },
  };
  window.swiper11 = new Swiper(".mySwiper11", {
    slidesPerView: 1,
    spaceBetween: 5,
    ...loopOuCentro(".mySwiper11", breakpoints11),
    grabCursor: true,
    speed: SEM_MOVIMENTO ? 0 : 300,
    watchSlidesProgress: true,
    breakpoints: breakpoints11,
    pagination: paginacaoDePlanos(".mySwiper11"),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    a11y: A11Y,
    on: EVENTOS_DO_CARROSSEL_DE_PLANOS,
  });

  indicadoresPorCard(window.swiper4, ".mySwiper4");
  indicadoresPorCard(window.swiper11, ".mySwiper11");
  escondidos.forEach(bloco => { bloco.hidden = true; });

  mostrarCarrosseis();
  window.dispatchEvent(new CustomEvent("zero7:carrosseisProntos"));
}

// LP: até o Swiper armar, os carrosséis ficam invisíveis, ocupando o lugar (css/secoes/planos-black.css). Armado
// com a seção já na tela (recarga com a rolagem restaurada nos planos, salto sem clique), ele trocava o card da
// frente à vista e deslocava a página (CLS de 0,03 a 0,11). Se o Swiper não carregar, eles aparecem do mesmo jeito.
function mostrarCarrosseis() {
  document.getElementById("planos")?.classList.add("carrossel-armado");
}

// dadosProntos: a promessa do iniciarBlackPlanos()
export function iniciarCarrosselPlanos(dadosProntos) {
  if (!document.querySelector(".mySwiper4, .mySwiper11")) return;

  const carregado = new Promise(ok => {
    if (document.readyState === 'complete') ok();
    else window.addEventListener('load', ok, { once: true });
  });
  const emIdle = () => new Promise(ok => (typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback(ok, { timeout: 3000 })
    : setTimeout(ok, 800)));

  // LP: além do load e do idle, espera a seção chegar perto (~1200 px). O Swiper (151 KB) e a montagem dos dois
  // carrosséis eram uma tarefa longa de ~0,8 s no celular, mesmo para quem não chega aos planos. O idle vem antes
  // do "perto": com a seção se aproximando, o download começa na hora (armado tarde, com a seção já na tela, o
  // card da frente trocava do Iniciante para o Sênior à vista).
  const perto = new Promise(ok => {
    const secao = document.getElementById('planos');
    if (!secao || !('IntersectionObserver' in window)) return ok();
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { io.disconnect(); ok(); }
    }, { rootMargin: '1200px 0px 1200px 0px' });
    io.observe(secao);
  });

  Promise.all([carregado, Promise.resolve(dadosProntos)])
    .then(emIdle)
    .then(() => perto)
    .then(carregarSwiper)
    .then(armarCarrosseis)
    .catch(erro => { mostrarCarrosseis(); console.error(erro); });
}
