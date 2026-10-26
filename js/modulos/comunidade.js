// Comunidade: palco com abas, carrossel de cards 9:16, legenda, setas, barra de progresso e modal de vídeo.
// Matemática do carrossel: renderVals de _referencia/canvas/Main.dc.html. Para cada card, d = distância circular
// até o ativo (−3 a 2); o CSS posiciona com --d e --ad (translateX(-50% + d × passo), scale(1 − |d| × .16)).
//
// MÍDIA (pendência P5): para pôr um vídeo novo, basta preencher a entrada abaixo.
// - video.card: o vídeo do card (9:16), mudo e em loop; { mp4, webm? }.
// - video.modal: opcional, o vídeo do modal no mobile (9:16). Sem ele, o modal usa o do card.
// - video.modalDesktop: opcional, o vídeo do modal a partir de 768 px (16:9), com o poster dele.
// - poster: a imagem do card (9:16). audio: false quando o arquivo não tem trilha de áudio (o modal fica mudo).
// - Sem video: o card fica em "Vídeo em breve" (número gigante em contorno, sem botão de play).
//
// Comportamento:
// - nada baixa antes de a seção chegar perto (~600 px): os posters entram nessa hora;
// - só o card ATIVO toca (mudo, loop, playsinline) e só com a seção na tela; os outros ficam pausados,
//   com preload="none". O arquivo de cada vídeo só é pedido quando ele vai tocar: com o <source> já preenchido,
//   o Chrome ignorava o preload="none" e baixava todos os vídeos da seção. Com movimento reduzido, nada toca
//   sozinho e nenhum vídeo de card é baixado (fica o poster);
// - o play (gota de vidro) abre o modal com o vídeo grande e controles; a fonte do modal é escolhida por
//   matchMedia na hora em que ele abre. Foco preso, Esc fecha e o foco volta ao botão.

export const MIDIA = [
  {
    titulo: 'HUB Zero7',
    descricao: 'Evento para conectar traders e trocar ideias sobre o dia a dia no mercado acompanhado de boa gastronomia.',
    video: {
      card: { mp4: 'assets/video/hub-zero7-9x16-540.mp4' },
      modal: { mp4: 'assets/video/hub-zero7-9x16-720.mp4' },
      modalDesktop: { mp4: 'assets/video/hub-zero7-16x9-720.mp4', poster: 'assets/video/hub-zero7-16x9-poster.webp' },
    },
    poster: 'assets/video/hub-zero7-9x16-poster.webp',
    audio: false,
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
    video: {
      card: { mp4: 'assets/video/academy-1.mp4', webm: 'assets/video/academy-1.webm' },
    },
    poster: 'assets/video/academy-1-poster-560.avif',
    audio: false,
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

const INICIAL = 3; // Academy, como no protótipo
const ARRASTE_MINIMO = 40;
const ICONE_PLAY = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.5v13l11-6.5z"/></svg>';

const numero = (i) => String(i + 1).padStart(2, '0');
const escapar = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function htmlDoCard(item, i) {
  const temVideo = !!(item.video && item.video.card);
  let midia;
  if (temVideo) {
    const fontes = ['webm', 'mp4'].filter((t) => item.video.card[t])
      .map((t) => `<source data-src="${escapar(item.video.card[t])}" type="video/${t}">`).join('');
    midia = `<video class="slide__video" muted loop playsinline preload="none" disablepictureinpicture aria-hidden="true"${item.poster ? ` data-poster="${escapar(item.poster)}"` : ''}>${fontes}</video>`;
  } else if (item.poster) {
    midia = `<img class="slide__poster" data-src="${escapar(item.poster)}" alt="" width="298" height="530" decoding="async">`;
  } else {
    midia = `<span class="slide__ph" aria-hidden="true"></span><span class="slide__num-grande" aria-hidden="true">${numero(i)}</span><span class="slide__breve">Vídeo em breve</span>`;
  }
  return `<div class="slide" data-i="${i}">
      ${midia}
      <span class="slide__sombra" aria-hidden="true"></span>
      ${temVideo ? `<button type="button" class="slide__play play" aria-label="Assistir: ${escapar(item.titulo)}">${ICONE_PLAY}</button>` : ''}
      <span class="slide__rotulo"><span class="slide__n">${numero(i)}</span><span class="slide__titulo">${escapar(item.titulo)}</span></span>
      <button type="button" class="slide__ativar" tabindex="-1" aria-label="Mostrar ${escapar(item.titulo)}"></button>
    </div>`;
}

export function iniciarComunidade() {
  const secao = document.getElementById('comunidade');
  const palco = secao && secao.querySelector('[data-comunidade]');
  if (!palco) return;

  const abas = palco.querySelector('.palco__abas');
  const trilho = palco.querySelector('.palco__trilho');
  const legenda = palco.querySelector('.palco__legenda');
  const progresso = palco.querySelector('.palco__progresso');
  const anterior = palco.querySelector('[data-anterior]');
  const proximo = palco.querySelector('[data-proximo]');
  const modal = document.getElementById('video-modal');
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 768px)');

  const n = MIDIA.length;
  let ativo = INICIAL;
  let perto = false; // a seção já chegou perto: mídia liberada
  let naTela = false;

  abas.innerHTML = MIDIA.map((m, i) => `<button type="button" class="palco__aba" aria-pressed="false" data-i="${i}">${escapar(m.titulo)}</button>`).join('');
  trilho.insertAdjacentHTML('beforeend', MIDIA.map(htmlDoCard).join(''));
  progresso.innerHTML = MIDIA.map((m, i) => `<button type="button" aria-pressed="false" aria-label="Ir para ${escapar(m.titulo)}" data-i="${i}"><i></i></button>`).join('');

  const botoesAba = [...abas.children];
  const cards = [...trilho.querySelectorAll('.slide')];
  const botoesProgresso = [...progresso.children];
  const videoDo = (i) => cards[i].querySelector('.slide__video');

  // ---------- mídia ----------
  function liberarMidia() {
    if (perto) return;
    perto = true;
    cards.forEach((card) => {
      const video = card.querySelector('.slide__video');
      if (video && video.dataset.poster) video.poster = video.dataset.poster;
      const img = card.querySelector('img[data-src]');
      if (img) img.src = img.dataset.src;
    });
  }

  // O arquivo do vídeo entra na primeira vez em que ele vai tocar
  function carregarVideo(video) {
    if (video.dataset.carregado) return;
    video.dataset.carregado = 'sim';
    video.querySelectorAll('source[data-src]').forEach((s) => { s.src = s.dataset.src; });
    video.load();
  }

  function atualizarVideos() {
    cards.forEach((card, i) => {
      const video = videoDo(i);
      if (!video) return;
      const tocar = i === ativo && naTela && perto && !semMovimento.matches && !modal.open;
      if (tocar) {
        carregarVideo(video);
        video.play().catch(() => {}); // autoplay mudo pode ser recusado (economia de dados etc.): fica o poster
      } else if (!video.paused) {
        video.pause();
      }
    });
  }

  // ---------- estado ----------
  function ativar(i, { focarAba = false } = {}) {
    ativo = (i + n) % n;
    cards.forEach((card, j) => {
      const d = ((j - ativo + n + 3) % n) - 3;
      const ad = Math.abs(d);
      card.style.setProperty('--d', d);
      card.style.setProperty('--ad', ad);
      card.classList.toggle('slide--on', ad === 0);
      card.classList.toggle('slide--perto', ad === 1);
      card.classList.toggle('slide--longe', ad > 2);
      card.setAttribute('aria-hidden', ad === 0 ? 'false' : 'true');
      const play = card.querySelector('.slide__play');
      if (play) play.tabIndex = ad === 0 ? 0 : -1;
    });
    botoesAba.forEach((b, j) => b.setAttribute('aria-pressed', j === ativo ? 'true' : 'false'));
    botoesProgresso.forEach((b, j) => b.setAttribute('aria-pressed', j === ativo ? 'true' : 'false'));
    legenda.innerHTML = `<b>${escapar(MIDIA[ativo].titulo)}</b> ${escapar(MIDIA[ativo].descricao)}`;

    // aba ativa à vista quando as abas rolam (mobile)
    const aba = botoesAba[ativo];
    const meio = aba.offsetLeft - (abas.clientWidth - aba.offsetWidth) / 2;
    abas.scrollTo({ left: meio, behavior: semMovimento.matches ? 'auto' : 'smooth' });
    if (focarAba) aba.focus({ preventScroll: true });

    atualizarVideos();
  }

  botoesAba.forEach((b, i) => b.addEventListener('click', () => ativar(i)));
  botoesProgresso.forEach((b, i) => b.addEventListener('click', () => ativar(i)));
  anterior.addEventListener('click', () => ativar(ativo - 1));
  proximo.addEventListener('click', () => ativar(ativo + 1));

  // Teclado: setas trocam o conteúdo (nas abas, o foco acompanha a aba ativa)
  palco.addEventListener('keydown', (evento) => {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
    evento.preventDefault();
    const naAba = botoesAba.includes(document.activeElement);
    ativar(ativo + (evento.key === 'ArrowRight' ? 1 : -1), { focarAba: naAba });
  });

  // Ponteiro: clicar num card lateral ativa ele; arrastar para o lado troca (swipe)
  let inicioX = null;
  let arrastou = false;
  trilho.addEventListener('pointerdown', (evento) => {
    inicioX = evento.clientX;
    arrastou = false;
  });
  trilho.addEventListener('pointerup', (evento) => {
    if (inicioX === null) return;
    const dx = evento.clientX - inicioX;
    inicioX = null;
    if (Math.abs(dx) < ARRASTE_MINIMO) return;
    arrastou = true;
    ativar(ativo + (dx < 0 ? 1 : -1));
  });
  trilho.addEventListener('pointercancel', () => { inicioX = null; });
  trilho.addEventListener('click', (evento) => {
    if (arrastou) { // o clique que fecha um arraste não ativa nem abre nada
      evento.stopPropagation();
      evento.preventDefault();
      arrastou = false;
      return;
    }
    const lateral = evento.target.closest('.slide__ativar');
    if (lateral) ativar(Number(lateral.closest('.slide').dataset.i));
  }, true);

  // ---------- modal ----------
  const videoModal = modal.querySelector('.video-modal__video');
  const tituloModal = modal.querySelector('.video-modal__titulo');
  let voltaFoco = null;

  function abrirModal(i, botao) {
    const item = MIDIA[i];
    const grande = desktop.matches && item.video.modalDesktop;
    const fonte = grande ? item.video.modalDesktop : (item.video.modal || item.video.card);
    videoModal.innerHTML = ['webm', 'mp4'].filter((t) => fonte[t])
      .map((t) => `<source src="${escapar(fonte[t])}" type="video/${t}">`).join('');
    videoModal.poster = (grande ? item.video.modalDesktop.poster : item.poster) || '';
    videoModal.muted = item.audio === false;
    modal.classList.toggle('video-modal--16x9', !!grande);
    modal.classList.toggle('video-modal--sem-audio', item.audio === false);
    tituloModal.textContent = item.titulo;
    voltaFoco = botao;
    modal.showModal();
    document.documentElement.classList.add('modal-aberto');
    videoModal.load();
    videoModal.play().catch(() => {});
    atualizarVideos();
  }

  function aoFechar() {
    videoModal.pause();
    videoModal.removeAttribute('poster');
    videoModal.innerHTML = '';
    videoModal.load(); // solta o arquivo
    document.documentElement.classList.remove('modal-aberto');
    if (voltaFoco) voltaFoco.focus({ preventScroll: true });
    voltaFoco = null;
    atualizarVideos();
  }

  trilho.addEventListener('click', (evento) => {
    const play = evento.target.closest('.slide__play');
    if (!play) return;
    abrirModal(Number(play.closest('.slide').dataset.i), play);
  });
  modal.querySelector('.video-modal__fechar').addEventListener('click', () => modal.close());
  modal.addEventListener('close', aoFechar);
  // clique fora da caixa do vídeo fecha
  modal.addEventListener('click', (evento) => { if (evento.target === modal) modal.close(); });
  // foco preso: Tab e Shift+Tab giram entre o botão de fechar e o vídeo
  modal.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Tab') return;
    const lista = [...modal.querySelectorAll('button, video[controls]')];
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

  // ---------- visibilidade ----------
  if ('IntersectionObserver' in window) {
    const chegando = new IntersectionObserver((entradas) => {
      if (!entradas.some((e) => e.isIntersecting)) return;
      chegando.disconnect();
      liberarMidia();
      atualizarVideos();
    }, { rootMargin: '600px 0px 600px 0px' });
    chegando.observe(secao);

    new IntersectionObserver((entradas) => {
      naTela = entradas.some((e) => e.isIntersecting);
      atualizarVideos();
    }, { threshold: 0.25 }).observe(trilho);
  } else {
    liberarMidia();
    naTela = true;
  }
  semMovimento.addEventListener('change', atualizarVideos);

  ativar(ativo);
}
