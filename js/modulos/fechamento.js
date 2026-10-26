// Fechamento: a logo da campanha se monta (Motion V02) quando a seção entra na tela.
// - Antes do JS, com movimento reduzido ou sem IntersectionObserver: fica o quadro final estático do HTML.
// - O módulo da animação (~45 KB com a cena) só é importado com a seção a ~600 px da tela.
// - Toca uma vez, com ~40% da área da logo visível (a área tem altura fixa; observar a seção inteira falharia
//   numa janela baixa, em que 40% dela nunca cabem na tela).

export function iniciarFechamento() {
  const secao = document.getElementById('fechamento');
  const lugar = secao && secao.querySelector('[data-motion-logo]');
  if (!lugar) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  let carregando = null;
  const carregar = () => {
    carregando ??= import('./motion-logo.js').then((m) => {
      const logo = m.criarLogoAnimada(lugar);
      logo.preparar();
      return logo;
    });
    return carregando;
  };

  const perto = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    perto.disconnect();
    carregar().catch(console.error);
  }, { rootMargin: '600px 0px 600px 0px' });
  perto.observe(secao);

  const naTela = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    naTela.disconnect();
    carregar().then((logo) => logo.tocar()).catch(console.error);
  }, { threshold: 0.4 });
  naTela.observe(lugar);
}
