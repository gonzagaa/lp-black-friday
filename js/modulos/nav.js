// Nav: fica mais opaca depois de 80 px de rolagem e, abaixo de 900 px, abre o menu em painel de tela cheia.
// O painel é um <dialog> modal: o resto da página fica inerte e o Esc fecha (nativo).
// Aqui entram a trava do Tab, o clique fora e o destino do foco ao fechar.

const LIMITE_ROLAGEM = 80;
const MENU_ATE = '(max-width: 899.98px)';

export function iniciarNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const atualizarFundo = () => nav.classList.toggle('nav--opaca', window.scrollY > LIMITE_ROLAGEM);
  atualizarFundo();
  window.addEventListener('scroll', atualizarFundo, { passive: true });

  const botao = nav.querySelector('.nav__menu');
  const menu = document.getElementById('menu');
  if (!botao || !menu) return;

  const conteudo = menu.querySelector('.menu__conteudo');
  let destino = null; // para onde o foco vai ao fechar (o botão, ou a seção escolhida no menu)

  const focaveis = () => [...menu.querySelectorAll('a[href], button:not([disabled])')];

  function limpar() {
    botao.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-aberto');
  }

  function abrir() {
    menu.showModal();
    botao.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-aberto');
  }

  // Limpa na hora (a rolagem precisa voltar antes de a âncora rolar a página)
  function fechar() {
    if (menu.open) menu.close();
    limpar();
  }

  botao.addEventListener('click', abrir);
  menu.querySelector('.menu__fechar').addEventListener('click', fechar);

  // Fechou por qualquer caminho (botão, Esc, link, clique fora)
  menu.addEventListener('close', () => {
    limpar();
    (destino ?? botao).focus({ preventScroll: true });
    destino = null;
  });

  // Clique fora: na área vazia do painel, fora dos links e do CTA
  menu.addEventListener('click', (evento) => {
    if (evento.target === menu || evento.target === conteudo) fechar();
  });

  // Foco preso: Tab e Shift+Tab giram dentro do painel
  menu.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Tab') return;
    const lista = focaveis();
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });

  // Links fecham o painel; numa âncora, o foco vai para a seção de destino (a página rola até ela)
  for (const link of menu.querySelectorAll('a[href]')) {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      const alvo = href.startsWith('#') ? document.querySelector(href) : null;
      if (alvo) {
        if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
        destino = alvo;
      }
      fechar();
    });
  }

  // Voltou para 900 px ou mais com o painel aberto: fecha
  window.matchMedia(MENU_ATE).addEventListener('change', (consulta) => {
    if (!consulta.matches) fechar();
  });
}
