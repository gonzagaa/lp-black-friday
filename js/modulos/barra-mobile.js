// Barra fixa do mobile (só abaixo de 768 px): o botão "Aproveitar a Black" → #planos, num vidro na base da tela.
// Sem contador (decisão da Fase 6; o js/modulos/contador.js continua guardado, sem uso).
// - aparece quando a hero sai da tela;
// - some quando a seção de planos ou o rodapé estão visíveis;
// - nunca cobre um CTA: some quando qualquer CTA da página (data-cta) entra na faixa de baixo da tela, onde ela fica.
// Escondida, a barra fica inert (fora do Tab e do leitor de tela).

const MOBILE = '(max-width: 767.98px)';
const FOLGA = 24; // px acima da barra que também contam como "embaixo dela"

export function iniciarBarraMobile() {
  const barra = document.querySelector('[data-barra-mobile]');
  const hero = document.getElementById('topo');
  const planos = document.getElementById('planos');
  const rodape = document.getElementById('rodape');
  if (!barra || !hero || !('IntersectionObserver' in window)) return;

  const mobile = window.matchMedia(MOBILE);
  const visiveis = new Set(); // hero, planos, rodapé na tela
  const ctasNaFaixa = new Set();

  function atualizar() {
    const mostrar = mobile.matches && !visiveis.size && !ctasNaFaixa.size;
    barra.classList.toggle('is-visivel', mostrar);
    barra.inert = !mostrar;
  }

  new IntersectionObserver((entradas) => {
    entradas.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
    atualizar();
  }).observe(hero);
  const secoes = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
    atualizar();
  });
  if (planos) secoes.observe(planos);
  if (rodape) secoes.observe(rodape);

  // Faixa de baixo da tela (a altura da barra + folga): o observador é refeito quando a janela muda de altura
  const ctas = [...document.querySelectorAll('[data-cta]')].filter((el) => !barra.contains(el) && !el.closest('.cabecalho, #menu'));
  let faixa = null;
  function observarFaixa() {
    if (faixa) faixa.disconnect();
    ctasNaFaixa.clear();
    const alturaFaixa = barra.offsetHeight + FOLGA + 12;
    const topo = Math.max(0, window.innerHeight - alturaFaixa);
    faixa = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? ctasNaFaixa.add(e.target) : ctasNaFaixa.delete(e.target)));
      atualizar();
    }, { rootMargin: `-${topo}px 0px 0px 0px` });
    ctas.forEach((el) => faixa.observe(el));
  }
  observarFaixa();

  let alturaAnterior = window.innerHeight;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerHeight - alturaAnterior) < 40) return; // barra de endereço do celular: ignora
    alturaAnterior = window.innerHeight;
    observarFaixa();
  }, { passive: true });
  mobile.addEventListener('change', atualizar);
  atualizar();
}
