/* PORTE dos carrosséis de planos de ../Zero7/script/global.js (mySwiper4 e mySwiper11, paginação com o nome
   do plano, slides fora da tela inert, Sênior como slide inicial).
   Mudanças em relação à home, e só estas:
   - módulo ES; o Swiper 11.2.10 vem de vendor/ (exceção da regra 10 do CLAUDE.md, só para esta seção) e é
     carregado aqui, sob demanda, no mesmo portão da home (depois do load, em idle);
   - além do load, espera o planos.json preencher os cards (o blackPlanos pode retirar card sem preço, e o
     loop e a paginação do Swiper precisam nascer com a lista final). Por isso o índice do slide inicial é lido na
     hora de armar, não no parse;
   - a largura do slide inicial é lida na hora de armar (na home, window.innerWidth no parse: dá no mesmo);
   - ajuste do cliente: o Sênior não tem mais destaque (.card--copa saiu). Ele continua sendo o slide inicial,
     marcado no HTML com data-inicial. */

const SWIPER_JS = 'vendor/swiper-11.2.10/swiper-bundle.min.js';

const BP_SM = 640;
const BP_LG = 1080;
const SEM_MOVIMENTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function carregarSwiper() {
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

  const indicadores = (sw.pagination && sw.pagination.bullets) || [];
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

function armarCarrosseis(Swiper) {
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

  window.swiper4 = new Swiper(".mySwiper4", {
    slidesPerView: 1,
    spaceBetween: 5,
    loop: true,
    grabCursor: true,
    speed: SEM_MOVIMENTO ? 0 : 300,
    watchSlidesProgress: true,
    ...(temInicial ? { initialSlide: slideInicial } : {}),
    breakpoints: {
      [BP_SM]: { slidesPerView: 2, spaceBetween: 20 },
      [BP_LG]: { slidesPerView: 3, spaceBetween: 60 },
    },
    pagination: paginacaoDePlanos(".mySwiper4"),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    a11y: A11Y,
    on: EVENTOS_DO_CARROSSEL_DE_PLANOS,
  });

  // O carrossel de bitcoin só tem dois cards, então o teto dele é 2.
  window.swiper11 = new Swiper(".mySwiper11", {
    slidesPerView: 1,
    spaceBetween: 5,
    loop: true,
    grabCursor: true,
    speed: SEM_MOVIMENTO ? 0 : 300,
    watchSlidesProgress: true,
    breakpoints: {
      [BP_SM]: { slidesPerView: 2, spaceBetween: 20 },
      [BP_LG]: { slidesPerView: 2, spaceBetween: 30 },
    },
    pagination: paginacaoDePlanos(".mySwiper11"),
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    a11y: A11Y,
    on: EVENTOS_DO_CARROSSEL_DE_PLANOS,
  });

  window.dispatchEvent(new CustomEvent("zero7:carrosseisProntos"));
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

  Promise.all([carregado, Promise.resolve(dadosProntos)])
    .then(emIdle)
    .then(carregarSwiper)
    .then(armarCarrosseis)
    .catch(console.error);
}
