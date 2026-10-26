// Carrossel dos planos, sem biblioteca: CSS scroll-snap + este controle.
// - Cards visíveis vêm do CSS (--visiveis: 3, 2 ou 1 + espiada).
// - Plano ativo: o do meio quando cabem 3; o primeiro da tela quando cabem 1 ou 2.
// - Setas e abas mudam o ativo; as abas acompanham a rolagem (swipe nativo); setas do teclado com o trilho em foco.
// - Abre no plano de data-inicial (Sênior no índice) e volta para ele ao trocar de mercado.

const ESPERA_ROLAGEM = 120;

export function iniciarCarrosseis() {
  document.querySelectorAll('[data-carrossel]').forEach(criar);
}

function criar(raiz) {
  const bloco = raiz.closest('.planos__ativo');
  const trilho = raiz.querySelector('[data-trilho]');
  const anterior = raiz.querySelector('[data-anterior]');
  const proximo = raiz.querySelector('[data-proximo]');
  const abas = [...bloco.querySelectorAll('[data-aba]')];
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ativo = 0;
  let pedido = null; // ativo escolhido por aba/seta/teclado, mantido enquanto estiver na tela
  let espera;

  const cards = () => [...trilho.querySelectorAll('.card[data-plan]:not([hidden])')];
  const visiveis = () => parseInt(getComputedStyle(trilho).getPropertyValue('--visiveis'), 10) || 1;
  const deslocamento = () => (visiveis() >= 3 ? 1 : 0);
  const limitar = (n, min, max) => Math.max(min, Math.min(max, n));

  function inicioPara(i) {
    const n = cards().length;
    return limitar(i - deslocamento(), 0, Math.max(0, n - visiveis()));
  }

  function rolarPara(inicio, suave) {
    const lista = cards();
    if (!lista.length) return;
    const left = lista[inicio].offsetLeft - lista[0].offsetLeft;
    trilho.scrollTo({ left, behavior: suave && !reduzido.matches ? 'smooth' : 'auto' });
  }

  function marcar() {
    const lista = cards();
    const chave = lista[ativo]?.dataset.plan;
    abas.forEach((aba) => {
      const visivel = lista.some((c) => c.dataset.plan === aba.dataset.aba);
      aba.hidden = !visivel;
      if (aba.dataset.aba === chave) aba.setAttribute('aria-current', 'true');
      else aba.removeAttribute('aria-current');
    });
    anterior.disabled = ativo <= 0;
    proximo.disabled = ativo >= lista.length - 1;
    // Tudo cabe na tela (ex.: os 2 planos de bitcoin no desktop): sem setas e sem abas, como a home
    raiz.classList.toggle('carrossel--cabe', lista.length <= visiveis());
    bloco.classList.toggle('carrossel--cabe', lista.length <= visiveis());
  }

  function definir(i, { suave = true } = {}) {
    const n = cards().length;
    if (!n) return;
    ativo = limitar(i, 0, n - 1);
    pedido = ativo;
    rolarPara(inicioPara(ativo), suave);
    marcar();
  }

  function indiceInicial() {
    const i = cards().findIndex((c) => c.dataset.plan === trilho.dataset.inicial);
    return i === -1 ? 0 : i;
  }

  // Rolagem pelo usuário (swipe, trackpad): as abas acompanham quando ela para
  trilho.addEventListener('scroll', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      const lista = cards();
      if (lista.length < 2) return;
      const passo = lista[1].offsetLeft - lista[0].offsetLeft;
      const inicio = Math.round(trilho.scrollLeft / passo);
      const naTela = (i) => i >= inicio && i < inicio + visiveis();
      ativo = pedido !== null && naTela(pedido) ? pedido : limitar(inicio + deslocamento(), 0, lista.length - 1);
      pedido = null;
      marcar();
    }, ESPERA_ROLAGEM);
  }, { passive: true });

  anterior.addEventListener('click', () => definir(ativo - 1));
  proximo.addEventListener('click', () => definir(ativo + 1));
  abas.forEach((aba) => aba.addEventListener('click', () => {
    definir(cards().findIndex((c) => c.dataset.plan === aba.dataset.aba));
  }));

  trilho.addEventListener('keydown', (evento) => {
    const alvos = { ArrowRight: ativo + 1, ArrowLeft: ativo - 1, Home: 0, End: cards().length - 1 };
    if (!(evento.key in alvos)) return;
    evento.preventDefault();
    definir(alvos[evento.key]);
  });

  // Dados aplicados (cards podem ter sumido) e troca de mercado: volta ao plano inicial, sem animar
  document.addEventListener('planos:atualizados', () => definir(indiceInicial(), { suave: false }));
  // O bloco acabou de aparecer: medir agora já força o layout (sem esperar um quadro, que desfaria uma seta apertada logo depois)
  document.addEventListener('planos:mercado', (evento) => {
    if (evento.detail.ativo === bloco.dataset.ativo) definir(indiceInicial(), { suave: false });
  });

  let largura = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === largura) return;
    largura = window.innerWidth;
    requestAnimationFrame(() => definir(ativo, { suave: false }));
  });

  marcar();
}
