// Comunidade: fileira de cards 9:16 sangrada na largura da tela (Swiper com slidesPerView 'auto', loop, arrastar
// e toque), com o texto da copy por cima de cada card, setas .ibtn e uma barra de progresso de 6 segmentos.
// O trilho anda sozinho, contínuo e linear (deriva; ver "deriva contínua" abaixo), e o usuário retoma o controle
// a qualquer momento.
//
// MÍDIA: cada card tem o seu vídeo (P5 resolvida).
// - video: { mp4, webm? } do card (9:16), mudo e em loop, sem controles; poster: a imagem do card.
// - O estado "Vídeo em breve" saiu do código e do CSS: um item sem video fica só com o fundo escuro do card.
//
// Vídeos (desempenho):
// - nada é pedido antes de o card chegar perto da tela (~300 px): aí entram o poster e o arquivo;
// - só tocam os cards que estão na tela; ao sair, pausam;
// - desktop com mouse (DESKTOP, o mesmo media query do CSS): sem hover, tocam só os 3 cards do palco (os do degradê
//   das laterais pausam); com hover, só o card sob o mouse, e os outros pausam no quadro em que estavam;
// - com movimento reduzido, nada toca e nenhum vídeo é baixado: fica o poster.
// O "perto" e o "na tela" de cada card são calculados pela posição dele (o carrossel recorta os cards de fora no
// eixo X, e um IntersectionObserver com margem não enxerga além desse recorte).

import { carregarSwiper } from './home/carrosselPlanos.js';

export const MIDIA = [
  {
    titulo: 'HUB Zero7',
    descricao: 'Evento para conectar traders e trocar ideias sobre o dia a dia no mercado acompanhado de boa gastronomia.',
    video: { mp4: 'assets/video/hub-zero7-9x16-540.mp4' },
    poster: 'assets/video/hub-zero7-9x16-poster.webp',
  },
  {
    titulo: 'Trading e Performance',
    descricao: 'Imersão de 3 dias focada na sua carreira enquanto trader para se tornar um profissional.',
    video: { mp4: 'assets/video/trading-performance-1.mp4', webm: 'assets/video/trading-performance-1.webm' },
    poster: 'assets/video/trading-performance-1-poster.avif',
  },
  {
    titulo: 'Lives',
    descricao: 'Encontros diários, com panoramas, insights educacionais e bate papo.',
    video: { mp4: 'assets/video/lives-zero7-9x16-540.mp4' },
    poster: 'assets/video/lives-zero7-9x16-poster.webp',
  },
  {
    titulo: 'Academy',
    descricao: 'Plataforma com + de 170 aulas educacionais com mentores como Fabrício Gonçalves, Iago Vieira, entre outros nomes do mercado, com o objetivo de acelerar a sua evolução como trader.',
    video: { mp4: 'assets/video/academy-9x16-540.mp4' },
    poster: 'assets/video/academy-9x16-poster.webp',
  },
  {
    titulo: 'Comunidade no WhatsApp',
    descricao: 'Acompanhamento do mercado em tempo real e ofertas em primeira mão.',
    video: { mp4: 'assets/video/comunidade-9x16-540.mp4' },
    poster: 'assets/video/comunidade-9x16-poster.webp',
  },
  {
    titulo: 'Gamification',
    descricao: 'Programa de recompensas para clientes engajados, garantindo experiências exclusivas.',
    video: { mp4: 'assets/video/gamification-9x16-540.mp4' },
    poster: 'assets/video/gamification-9x16-poster.webp',
  },
];

// O loop com slidesPerView 'auto' precisa de mais cards do que cabem na tela (em 1920 px cabem ~6): a série entra
// 3 vezes. As cópias ficam fora da árvore de acessibilidade.
const COPIAS = 3;
const PERTO = 300; // px
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
// Desktop com mouse (css/secoes/comunidade.css): palco de 3 cards, 28 px entre eles e hover
const DESKTOP = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
const espaco = () => (DESKTOP.matches ? 28 : 20);

const numero = (i) => String(i + 1).padStart(2, '0');
const escapar = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function htmlDoCard(item, i, copia) {
  let midia = '';
  if (item.video) {
    const fontes = ['webm', 'mp4'].filter((t) => item.video[t])
      .map((t) => `<source data-src="${escapar(item.video[t])}" type="video/${t}">`).join('');
    midia = `<video class="cslide__video" autoplay muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true"${item.poster ? ` data-poster="${escapar(item.poster)}"` : ''}>${fontes}</video>`;
  }
  return `<div class="swiper-slide cslide" data-i="${i}"${copia ? ' aria-hidden="true"' : ''}>
      ${midia}
      <span class="cslide__sombra" aria-hidden="true"></span>
      <div class="cslide__texto">
        <span class="cslide__n">${numero(i)}</span>
        <h3 class="cslide__titulo">${escapar(item.titulo)}</h3>
        <p class="cslide__desc">${escapar(item.descricao)}</p>
      </div>
    </div>`;
}

export function iniciarComunidade() {
  const secao = document.getElementById('comunidade');
  const trilho = secao && secao.querySelector('[data-comunidade]');
  if (!trilho) return;

  const wrapper = trilho.querySelector('.swiper-wrapper');
  const progresso = secao.querySelector('.comunidade__progresso');
  const anterior = secao.querySelector('[data-anterior]');
  const proximo = secao.querySelector('[data-proximo]');
  const n = MIDIA.length;

  let html = '';
  for (let c = 0; c < COPIAS; c++) html += MIDIA.map((m, i) => htmlDoCard(m, i, c > 0)).join('');
  wrapper.innerHTML = html;
  progresso.innerHTML = MIDIA.map((m, i) => `<button type="button" aria-pressed="${i === 0}" aria-label="Ir para ${escapar(m.titulo)}" data-i="${i}"><i></i></button>`).join('');
  const segmentos = [...progresso.children];

  let secaoPerto = false;
  let secaoNaTela = false;
  let swiper = null;

  // ---------- vídeos ----------
  function prepararVideo(video) {
    if (video.dataset.carregado) return;
    video.dataset.carregado = 'sim';
    if (video.dataset.poster) video.poster = video.dataset.poster;
    video.querySelectorAll('source[data-src]').forEach((s) => { s.src = s.dataset.src; });
    video.load();
  }

  let cardSobMouse = null; // desktop: o card sob o mouse (só ele toca)

  function avaliar() {
    const largura = window.innerWidth;
    // palco (desktop): o card do centro e os dois vizinhos, pelo centro de cada card
    const tr = trilho.getBoundingClientRect();
    const meio = tr.left + tr.width / 2;
    const primeiro = trilho.querySelector('.cslide');
    const alcance = primeiro ? primeiro.offsetWidth + espaco() + 2 : 0;
    trilho.querySelectorAll('.cslide__video').forEach((video) => {
      const r = video.getBoundingClientRect();
      const perto = secaoPerto && r.right > -PERTO && r.left < largura + PERTO;
      let naTela = secaoNaTela && r.right > 0 && r.left < largura;
      if (naTela && DESKTOP.matches) {
        naTela = cardSobMouse ? video.closest('.cslide') === cardSobMouse : Math.abs(r.left + r.width / 2 - meio) <= alcance;
      }
      if (semMovimento.matches) {
        // movimento reduzido: nada toca e nenhum vídeo é baixado; só o poster, quando perto
        if (perto && video.dataset.poster && !video.getAttribute('poster')) video.poster = video.dataset.poster;
        if (!video.paused) video.pause();
        return;
      }
      if (perto) prepararVideo(video);
      if (naTela && video.dataset.carregado) {
        if (video.paused) video.play().catch(() => {}); // autoplay mudo pode ser recusado: fica o poster
      } else if (video.dataset.carregado && (!video.paused || video.autoplay)) {
        // pause() também desliga o autoplay do elemento até o próximo play()
        video.pause();
      }
    });
  }

  let pedido = null;
  let derivando = false; // a deriva move o trilho a cada quadro; ela mesma chama o avaliar() a cada 200 ms
  const avaliarNoQuadro = () => {
    if (pedido || derivando) return;
    pedido = requestAnimationFrame(() => { pedido = null; avaliar(); });
  };

  // ---------- carrossel ----------
  function marcarProgresso() {
    const ativo = swiper ? swiper.realIndex % n : 0;
    segmentos.forEach((b, i) => b.setAttribute('aria-pressed', i === ativo ? 'true' : 'false'));
  }

  function armar(Swiper) {
    swiper = new Swiper(trilho, {
      slidesPerView: 'auto',
      spaceBetween: espaco(),
      loop: true,
      centeredSlides: true,
      grabCursor: true,
      // arrastar a partir de qualquer ponto do trilho, inclusive do vão entre dois cards (o wrapper deslocado não
      // cobre a tela inteira)
      touchEventsTarget: 'container',
      speed: semMovimento.matches ? 0 : 500,
      watchSlidesProgress: true,
      a11y: {
        prevSlideMessage: 'Conteúdo anterior',
        nextSlideMessage: 'Próximo conteúdo',
        slideLabelMessage: '{{index}} de {{slidesLength}}',
      },
      on: {
        slideChange: marcarProgresso,
        setTranslate: avaliarNoQuadro,
        transitionEnd: () => { avaliarNoQuadro(); soltar('clique'); },
        resize: () => { marcarCortes(); avaliarNoQuadro(); },
        // arrastar pega o carrossel na hora; a deriva volta 2,5 s depois de soltar
        touchStart: () => pausar('arraste'),
        touchEnd: () => soltar('arraste'),
      },
    });
    marcarProgresso();
    avaliar();
    ligarDeriva();
  }

  // ---------- deriva contínua ----------
  // O trilho anda sozinho para a esquerda, em velocidade constante (40 px/s no desktop com mouse, 30 no resto),
  // quadro a quadro com o setTranslate do Swiper (nada de transição CSS). O loop do Swiper (slidesPerView 'auto')
  // é refeito como no mousewheel com freeMode do próprio Swiper: loopFix com byMousewheel move os cards do começo
  // para o fim e compensa o translate no mesmo quadro, sem emenda. Ele só roda quando o card do centro muda (o
  // loopFix remede todos os slides).
  // Pausa: arraste, setas e progresso (deslizam com a curva normal de 500 ms), hover num card do palco, foco de
  // teclado no carrossel, seção fora da tela e aba oculta. Retoma 2,5 s depois da última interação, com a
  // velocidade subindo em rampa de 600 ms. Com movimento reduzido, não há deriva.
  // Durante a deriva, a decisão de quais vídeos tocam (avaliar) roda a cada 200 ms, não a cada quadro.
  const pausas = new Set();
  const deriva = { v: 0, ultimo: 0, quadro: 0, retomarEm: 0, avaliadoEm: 0, ativo: -1, relogio: 0 };
  const velocidade = () => (DESKTOP.matches ? 40 : 30) / 1000; // px por ms
  const RAMPA = 600;
  const RETOMADA = 2500;

  const podeDerivar = () => swiper && !swiper.destroyed && !semMovimento.matches && secaoNaTela && !document.hidden
    && pausas.size === 0 && performance.now() >= deriva.retomarEm;

  function pausar(motivo) {
    pausas.add(motivo);
    deriva.v = 0;
  }

  // solta uma pausa (se existir) e marca a retomada para 2,5 s depois
  function soltar(motivo) {
    if (!pausas.delete(motivo)) return;
    deriva.retomarEm = performance.now() + RETOMADA;
    clearTimeout(deriva.relogio);
    deriva.relogio = setTimeout(ligarDeriva, RETOMADA + 20);
  }

  function ligarDeriva() {
    if (deriva.quadro || !podeDerivar()) return;
    deriva.v = 0;
    deriva.ultimo = 0;
    deriva.quadro = requestAnimationFrame(passo);
  }

  function passo(agora) {
    deriva.quadro = 0;
    if (!podeDerivar()) { deriva.v = 0; avaliar(); return; }
    const dt = deriva.ultimo ? Math.min(64, agora - deriva.ultimo) : 0;
    deriva.ultimo = agora;
    const alvo = velocidade();
    deriva.v = Math.min(alvo, deriva.v + (alvo * dt) / RAMPA);
    if (dt) mover(-deriva.v * dt);
    if (agora - deriva.avaliadoEm >= 200) { deriva.avaliadoEm = agora; avaliar(); }
    deriva.quadro = requestAnimationFrame(passo);
  }

  function mover(dx) {
    derivando = true;
    swiper.setTransition(0);
    swiper.setTranslate(swiper.translate + dx);
    swiper.updateProgress();
    swiper.updateActiveIndex();
    if (swiper.activeIndex !== deriva.ativo) {
      swiper.updateSlidesClasses();
      swiper.loopFix({ direction: 'next', byMousewheel: true });
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
      deriva.ativo = swiper.activeIndex;
      marcarProgresso();
    }
    derivando = false;
  }

  // ---------- desktop: texto em 2 linhas e hover ----------
  // data-corta nas descrições com mais de 2 linhas: só nelas entra a máscara do fim da 2ª linha (CSS). O
  // scrollHeight é a altura do texto inteiro, com o card fechado ou aberto.
  function marcarCortes() {
    trilho.querySelectorAll('.cslide__desc').forEach((d) => {
      const linha = parseFloat(getComputedStyle(d).lineHeight);
      d.toggleAttribute('data-corta', d.scrollHeight > linha * 2 + 1);
    });
  }
  marcarCortes();
  if (document.fonts) document.fonts.ready.then(marcarCortes);

  // hover num card do palco (os das laterais ficam sob o degradê, que recebe o ponteiro): pausa a deriva
  trilho.addEventListener('pointerover', (e) => {
    if (!DESKTOP.matches || e.pointerType !== 'mouse') return;
    const card = e.target.closest('.cslide');
    if (card === cardSobMouse) return;
    cardSobMouse = card;
    if (card) pausar('hover'); else soltar('hover');
    avaliar();
  });
  trilho.addEventListener('pointerleave', () => {
    if (!cardSobMouse) return;
    cardSobMouse = null;
    soltar('hover');
    avaliar();
  });

  // foco de teclado no carrossel (cards, setas e progresso): pausa enquanto o foco estiver ali
  secao.addEventListener('focusin', (e) => {
    if ((trilho.contains(e.target) || e.target.closest('.comunidade__nav')) && e.target.matches(':focus-visible')) pausar('foco');
  });
  secao.addEventListener('focusout', (e) => {
    const destino = e.relatedTarget;
    if (destino && (trilho.contains(destino) || destino.closest?.('.comunidade__nav'))) return;
    soltar('foco');
  });

  DESKTOP.addEventListener('change', () => {
    cardSobMouse = null;
    if (swiper) { swiper.params.spaceBetween = espaco(); swiper.update(); }
    marcarCortes();
    avaliar();
  });

  // setas e progresso: param a deriva e deslizam com a curva normal (500 ms); a retomada conta do fim da transição
  const navegar = (acao) => () => {
    if (!swiper) return;
    pausar('clique');
    acao();
    if (!swiper.animating) soltar('clique'); // já estava no lugar (ou movimento reduzido, sem transição)
  };
  anterior.addEventListener('click', navegar(() => swiper.slidePrev()));
  proximo.addEventListener('click', navegar(() => swiper.slideNext()));
  segmentos.forEach((b, i) => b.addEventListener('click', navegar(() => swiper.slideToLoop(i))));

  // ---------- visibilidade ----------
  // Perto (300 px): o Swiper é armado e os vídeos dos cards perto recebem o arquivo; na tela: tocam.
  let armando = null;
  new IntersectionObserver((entradas) => {
    secaoPerto = entradas.some((e) => e.isIntersecting);
    if (secaoPerto && !armando) armando = carregarSwiper().then(armar).catch(console.error);
    avaliar();
  }, { rootMargin: `${PERTO}px 0px ${PERTO}px 0px` }).observe(trilho);

  new IntersectionObserver((entradas) => {
    secaoNaTela = entradas.some((e) => e.isIntersecting);
    avaliar();
    ligarDeriva(); // fora da tela, o próprio passo() para
  }).observe(trilho);

  document.addEventListener('visibilitychange', ligarDeriva);
  window.addEventListener('resize', avaliarNoQuadro, { passive: true });
  semMovimento.addEventListener('change', () => { avaliar(); ligarDeriva(); });
}
