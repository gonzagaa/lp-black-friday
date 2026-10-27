// Comunidade: fileira de cards 9:16 sangrada na largura da tela (Swiper com slidesPerView 'auto', loop, arrastar
// e toque), com o texto da copy por cima de cada card, setas .ibtn e uma barra de progresso de 6 segmentos.
//
// MÍDIA (pendência P5): para pôr um vídeo novo, basta preencher a entrada abaixo.
// - video: { mp4, webm? } do card (9:16), mudo e em loop, sem controles; poster: a imagem do card.
// - Sem video: o card fica em "Vídeo em breve" (fundo escuro com brilho laranja, número gigante em contorno), com o
//   mesmo texto por cima.
//
// Vídeos (desempenho):
// - nada é pedido antes de o card chegar perto da tela (~300 px): aí entram o poster e o arquivo;
// - só tocam os cards que estão na tela; ao sair, pausam;
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
  },
  {
    titulo: 'Lives',
    descricao: 'Encontros diários, com panoramas, insights educacionais e bate papo.',
  },
  {
    titulo: 'Academy',
    descricao: 'Plataforma com + de 170 aulas educacionais com mentores como Fabrício Gonçalves, Iago Vieira, entre outros nomes do mercado, com o objetivo de acelerar a sua evolução como trader.',
    video: { mp4: 'assets/video/academy-1.mp4', webm: 'assets/video/academy-1.webm' },
    poster: 'assets/video/academy-1-poster.avif',
  },
  {
    titulo: 'Comunidade no WhatsApp',
    descricao: 'Acompanhamento do mercado em tempo real e ofertas em primeira mão.',
  },
  {
    titulo: 'Gamification',
    descricao: 'Programa de recompensas para clientes engajados, garantindo experiências exclusivas.',
  },
];

// O loop com slidesPerView 'auto' precisa de mais cards do que cabem na tela (em 1920 px cabem ~6): a série entra
// 3 vezes. As cópias ficam fora da árvore de acessibilidade.
const COPIAS = 3;
const PERTO = 300; // px
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

const numero = (i) => String(i + 1).padStart(2, '0');
const escapar = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function htmlDoCard(item, i, copia) {
  let midia;
  if (item.video) {
    const fontes = ['webm', 'mp4'].filter((t) => item.video[t])
      .map((t) => `<source data-src="${escapar(item.video[t])}" type="video/${t}">`).join('');
    midia = `<video class="cslide__video" autoplay muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true"${item.poster ? ` data-poster="${escapar(item.poster)}"` : ''}>${fontes}</video>`;
  } else {
    midia = `<span class="cslide__ph" aria-hidden="true"></span><span class="cslide__num-grande" aria-hidden="true">${numero(i)}</span><span class="cslide__breve">Vídeo em breve</span>`;
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

  function avaliar() {
    const largura = window.innerWidth;
    trilho.querySelectorAll('.cslide__video').forEach((video) => {
      const r = video.getBoundingClientRect();
      const perto = secaoPerto && r.right > -PERTO && r.left < largura + PERTO;
      const naTela = secaoNaTela && r.right > 0 && r.left < largura;
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
  const avaliarNoQuadro = () => {
    if (pedido) return;
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
      spaceBetween: 20,
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
        transitionEnd: avaliarNoQuadro,
        resize: avaliarNoQuadro,
      },
    });
    marcarProgresso();
    avaliar();
  }

  anterior.addEventListener('click', () => swiper && swiper.slidePrev());
  proximo.addEventListener('click', () => swiper && swiper.slideNext());
  segmentos.forEach((b, i) => b.addEventListener('click', () => swiper && swiper.slideToLoop(i)));

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
  }).observe(trilho);

  window.addEventListener('resize', avaliarNoQuadro, { passive: true });
  semMovimento.addEventListener('change', avaliar);
}
