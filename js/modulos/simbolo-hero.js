// Símbolo da Zero7 no horizonte da hero (css/secoes/topo.css, .hero__simbolo): aparece depois do LCP (o H1), uma
// vez só, subindo 24 px em 1,6 s com a curva da página. Até lá ele fica invisível e não é pintado, para não pesar
// na primeira pintura. Com movimento reduzido, a classe é a mesma e o CSS tira a transição: aparece parado.
// O símbolo é SVG em linha (não entra na disputa do LCP).

export function iniciarSimboloHero() {
  const hero = document.querySelector('.hero');
  const simbolo = hero && hero.querySelector('.hero__simbolo');
  if (!simbolo) return;
  const corpo = simbolo.querySelector('.hero__simbolo-corpo');
  const sub = hero.querySelector('.hero__sub');

  // Área do subtítulo dentro do corpo do símbolo (para o CSS apagar o corpo só ali e o texto manter 4,5:1).
  // Medida na posição final: a entrada sobe 24 px por transform, que é descontado.
  function medirFuro() {
    if (!corpo || !sub) return;
    const rg = document.createRange();
    rg.selectNodeContents(sub);
    const t = rg.getBoundingClientRect();
    const c = corpo.getBoundingClientRect();
    const deslocamento = new DOMMatrixReadOnly(getComputedStyle(simbolo).transform).m42;
    const topoFinal = c.top - deslocamento;
    corpo.style.setProperty('--furo-x', `${Math.round(t.left + t.width / 2 - c.left)}px`);
    corpo.style.setProperty('--furo-y', `${Math.round(t.top + t.height / 2 - topoFinal)}px`);
    corpo.style.setProperty('--furo-l', `${Math.round(t.width * 0.9)}px`);
    corpo.style.setProperty('--furo-a', `${Math.round(t.height * 1.1)}px`);
  }

  let feito = false;
  // dois quadros depois do LCP: a pintura do H1 já foi para a tela quando a entrada começa
  const mostrar = () => {
    if (feito) return;
    feito = true;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      hero.classList.add('simbolo-pronto');
      medirFuro();
    }));
  };
  let pedido = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(pedido);
    pedido = requestAnimationFrame(medirFuro);
  }, { passive: true });
  if (document.fonts) document.fonts.ready.then(medirFuro);

  const temLcp = 'PerformanceObserver' in window
    && (PerformanceObserver.supportedEntryTypes || []).includes('largest-contentful-paint');
  if (temLcp) {
    const observador = new PerformanceObserver((lista) => {
      if (!lista.getEntries().length) return;
      observador.disconnect();
      mostrar();
    });
    observador.observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(mostrar, 4000); // rede de segurança
  } else if (document.readyState === 'complete') {
    mostrar();
  } else {
    window.addEventListener('load', mostrar, { once: true });
  }
}
