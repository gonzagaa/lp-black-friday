// Rolagem suave com o Lenis 1.1.14, os mesmos parâmetros da home (duration 1.1, easing 1 − (1 − t)^4).
// - Local (vendor/lenis-1.1.14/, caminho relativo), carregado depois do load, em idle: não pesa na primeira dobra.
//   Até ele chegar (e com movimento reduzido), vale a rolagem nativa com o scroll-behavior do base.css.
// - Com prefers-reduced-motion: sem Lenis.
// - Âncoras da página (#planos etc.): o Lenis 1.1.14 não as trata; aqui elas rolam com lenis.scrollTo até o
//   alvo, descontando o scroll-padding-top do <html> (a nav fixa), e o endereço ganha o #.
// - Menu aberto (html.menu-aberto) e qualquer [data-lenis-prevent]: o Lenis para e a rolagem de dentro dele é a
//   nativa.
// - Diferente da home: sem o console.log de cada evento de rolagem, e o laço de requestAnimationFrame só roda enquanto
//   há rolagem (acorda com rodinha, toque, teclado ou scrollTo e dorme quando o Lenis para). Na home ele roda a cada
//   quadro, sempre: no Lighthouse mobile isso aparecia como segundos de trabalho na thread principal.

const LENIS_JS = 'vendor/lenis-1.1.14/lenis.min.js';
const easing = (t) => 1 - Math.pow(1 - t, 4);

function carregarLenis() {
  if (window.Lenis) return Promise.resolve(window.Lenis);
  return new Promise((ok, falha) => {
    const s = document.createElement('script');
    s.src = LENIS_JS;
    s.onload = () => ok(window.Lenis);
    s.onerror = () => falha(new Error(`Não carregou ${LENIS_JS}`));
    document.head.appendChild(s);
  });
}

function armar(Lenis) {
  const lenis = new Lenis({ duration: 1.1, easing });
  window.lenis = lenis;

  let rodando = false;
  let acordouEm = 0;
  const quadro = (tempo) => {
    lenis.raf(tempo);
    // segue enquanto rola (e uns 300 ms depois de acordar, para o Lenis começar a animar)
    if (lenis.isScrolling || tempo - acordouEm < 300) requestAnimationFrame(quadro);
    else rodando = false;
  };
  const acordar = () => {
    acordouEm = performance.now();
    if (rodando) return;
    rodando = true;
    requestAnimationFrame(quadro);
  };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((tipo) => window.addEventListener(tipo, acordar, { passive: true }));
  const scrollToOriginal = lenis.scrollTo.bind(lenis);
  lenis.scrollTo = (...args) => { acordar(); return scrollToOriginal(...args); };
  acordar();

  // Menu aberto: a página não rola por baixo
  const html = document.documentElement;
  const acompanharMenu = () => (html.classList.contains('menu-aberto') ? lenis.stop() : lenis.start());
  new MutationObserver(acompanharMenu).observe(html, { attributes: true, attributeFilter: ['class'] });

  // Âncoras: o clique chega aqui depois do nav.js (que fecha o menu e devolve a rolagem)
  document.addEventListener('click', (evento) => {
    if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
    const link = evento.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    const alvo = href.length > 1 ? document.getElementById(decodeURIComponent(href.slice(1))) : null;
    if (!alvo) return;
    evento.preventDefault();
    const folga = parseFloat(getComputedStyle(html).scrollPaddingTop) || 0;
    const y = alvo.getBoundingClientRect().top + window.scrollY - folga;
    lenis.scrollTo(y, { force: true });
    history.pushState(null, '', href);
  });

  return lenis;
}

export function iniciarRolagem() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const carregado = new Promise((ok) => {
    if (document.readyState === 'complete') ok();
    else window.addEventListener('load', ok, { once: true });
  });
  const emIdle = () => new Promise((ok) => (typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback(ok, { timeout: 3000 })
    : setTimeout(ok, 800)));

  carregado.then(emIdle).then(carregarLenis).then(armar).catch(console.error);
}
