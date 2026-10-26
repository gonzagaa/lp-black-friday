// Entrada por rolagem dos itens com [data-revelar]: fade + subida de 16 px, uma vez só,
// com 60 ms entre os itens que entram juntos. Com movimento reduzido, nada se esconde nem anima.
// A animação usa a propriedade translate (e não transform), para não brigar com o hover dos cards.

const DURACAO = 600;
const INTERVALO = 60;

export function iniciarRevelar() {
  const itens = [...document.querySelectorAll('[data-revelar]')];
  if (!itens.length) return;

  const revelar = (el) => el.classList.add('revelado');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    itens.forEach(revelar);
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    const visiveis = entradas
      .filter((entrada) => entrada.isIntersecting)
      .map((entrada) => entrada.target)
      .sort((a, b) => itens.indexOf(a) - itens.indexOf(b));
    visiveis.forEach((el, ordem) => {
      observador.unobserve(el);
      revelar(el);
      el.animate(
        [{ opacity: 0, translate: '0 16px' }, { opacity: 1, translate: '0 0' }],
        { duration: DURACAO, delay: ordem * INTERVALO, easing: 'cubic-bezier(.2, 0, 0, 1)', fill: 'backwards' },
      );
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  itens.forEach((el) => observador.observe(el));
  // Desliga a rede de segurança do CSS (que mostraria tudo em 3 s se este módulo não rodasse)
  document.documentElement.classList.add('revelar-pronto');
}
