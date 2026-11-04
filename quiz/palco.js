// Quiz da Black: só visual. Ouve o evento quiz:passo (quiz.js) e troca o palco de mídia e os segmentos do progresso.
// - Uma cena por etapa (vídeo 9:16 + legenda + objeto 3D). Só o vídeo da etapa atual baixa e toca: a cena que sai
//   perde o src (o download para). Da próxima etapa, só o POSTER é pré-carregado.
// - O poster da P1 está no HTML (é o LCP); o vídeo da P1 só entra depois do load, em idle.
// - Movimento reduzido ou economia de dados: só o poster, sem vídeo (e o CSS desliga as animações).
// - Palco fora da tela (no mobile, ao rolar até o formulário): o vídeo pausa.
const V = '../assets/video/';
const OBJ = '../assets/3d/';
const CENAS = {
  e_trader: { video: 'hub-zero7-9x16-540', poster: 'hub-zero7-9x16-poster.webp', titulo: 'HUB Zero7', desc: 'Encontros presenciais da comunidade.', obj: ['01-moeda-zero7', 344] },
  experiencia: { video: 'academy-9x16-540', poster: 'academy-9x16-poster.webp', titulo: 'Academy', desc: '+170 aulas com mentores do mercado.', obj: ['18-selo-de-conquista', 399] },
  mercado: { video: 'lives-zero7-9x16-540', poster: 'lives-zero7-9x16-poster.webp', titulo: 'Lives diárias', desc: 'Panorama e mercado ao vivo, todo dia.', obj: ['03-candles-de-trade', 408] },
  desafio: { video: 'trading-performance-1', webm: true, poster: 'trading-performance-1-poster.avif', titulo: 'Trading e Performance', desc: 'Imersão de 3 dias na sua carreira de trader.', obj: ['09-alvo-de-precisao', 315] },
  dados: { video: 'comunidade-9x16-540', poster: 'comunidade-9x16-poster.webp', titulo: 'Comunidade no WhatsApp', desc: 'Mercado em tempo real e ofertas em primeira mão.', obj: ['12-cadeado-zero7', 543] },
  sucesso: { video: 'gamification-9x16-540', poster: 'gamification-9x16-poster.webp', titulo: 'Gamification', desc: 'Recompensas para quem participa.', obj: ['20-presente-black', 312] },
};
const SAIDA_MS = 500; // um pouco mais que a transição de .45 s do CSS

const palco = document.querySelector('[data-palco]');
const cenas = palco.querySelector('[data-cenas]');
const legenda = palco.querySelector('[data-legenda]');
const legendaTitulo = palco.querySelector('[data-legenda-titulo]');
const legendaDesc = palco.querySelector('[data-legenda-desc]');
const obj = palco.querySelector('[data-obj]');
const barra = document.querySelector('[data-barra]');

const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const economia = Boolean(navigator.connection && navigator.connection.saveData);
const podeVideo = !reduzido && !economia;

let atual = 'e_trader';
let carregou = false;
let visivel = true;
const preCarregados = new Set([CENAS.e_trader.poster]);

function criarVideo(cena) {
  const v = document.createElement('video');
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.playsInline = true;
  v.preload = 'auto';
  ['muted', 'playsinline', 'disablepictureinpicture', 'disableremoteplayback'].forEach((a) => v.setAttribute(a, ''));
  const fontes = cena.webm ? [['webm', 'video/webm'], ['mp4', 'video/mp4']] : [['mp4', 'video/mp4']];
  fontes.forEach(([ext, tipo]) => {
    const s = document.createElement('source');
    s.src = `${V}${cena.video}.${ext}`;
    s.type = tipo;
    v.append(s);
  });
  // o vídeo só aparece quando já tem quadro: até lá, fica o poster por baixo (sem piscar preto)
  v.addEventListener('playing', () => v.classList.add('is-tocando'), { once: true });
  return v;
}

function tocar(el) {
  const v = el && el.querySelector('video');
  if (v && visivel) v.play().catch(() => {});
}

function descartar(el) {
  const v = el.querySelector('video');
  if (v) {
    v.pause();
    v.querySelectorAll('source').forEach((s) => s.remove());
    v.removeAttribute('src');
    v.load(); // corta o download que estava em andamento
  }
  el.remove();
}

function ativa() {
  return cenas.querySelector('.palco__cena.is-ativa');
}

function comVideo(el, passo) {
  if (!podeVideo || !carregou || el.querySelector('video')) return;
  el.append(criarVideo(CENAS[passo]));
  tocar(el);
}

function novaCena(passo) {
  const c = CENAS[passo];
  const el = document.createElement('div');
  el.className = 'palco__cena';
  el.dataset.cena = passo;
  const img = new Image(540, 960);
  img.alt = '';
  img.decoding = 'async';
  img.src = V + c.poster;
  el.append(img);
  return el;
}

// reinicia a animação de entrada (legenda e 3D) sem depender de timers
function reanimar(el) {
  el.classList.remove('is-entrando');
  void el.offsetWidth;
  el.classList.add('is-entrando');
}

function trocarCena(passo) {
  if (passo === atual) return;
  atual = passo;
  const c = CENAS[passo];

  const velha = ativa();
  const nova = novaCena(passo);
  cenas.append(nova);
  comVideo(nova, passo);
  requestAnimationFrame(() => requestAnimationFrame(() => nova.classList.add('is-ativa')));
  if (velha) {
    velha.classList.remove('is-ativa');
    velha.classList.add('is-saindo');
    setTimeout(() => descartar(velha), reduzido ? 0 : SAIDA_MS);
  }

  legendaTitulo.textContent = c.titulo;
  legendaDesc.textContent = c.desc;
  reanimar(legenda);

  const [nome, altura] = c.obj;
  obj.querySelector('source').srcset = `${OBJ}${nome}-320.avif`;
  const img = obj.querySelector('img');
  img.src = `${OBJ}${nome}-320.webp`;
  img.height = altura;
  reanimar(obj);
}

function proximo(passo, perguntas) {
  const i = perguntas.indexOf(passo);
  if (i >= 0) return i < perguntas.length - 1 ? perguntas[i + 1] : 'dados';
  return passo === 'dados' ? 'sucesso' : null;
}

function preCarregarPoster(passo) {
  if (!passo || preCarregados.has(CENAS[passo].poster)) return;
  preCarregados.add(CENAS[passo].poster);
  const img = new Image();
  img.decoding = 'async';
  img.src = V + CENAS[passo].poster;
}

// Progresso em segmentos: os feitos cheios, o atual com 55%; no contato e no sucesso, todos cheios
function segmentos(passo, perguntas) {
  const total = perguntas.length;
  const i = perguntas.indexOf(passo);
  if (barra.children.length !== total) barra.replaceChildren(...Array.from({ length: total }, () => document.createElement('i')));
  [...barra.children].forEach((seg, n) => {
    const cheio = i < 0 || n < i ? 1 : n === i ? 0.55 : 0;
    seg.style.setProperty('--cheio', String(cheio));
  });
}

document.addEventListener('quiz:passo', (e) => {
  const { passo, perguntas } = e.detail;
  segmentos(passo, perguntas);
  trocarCena(passo);
  preCarregarPoster(proximo(passo, perguntas));
});

// Vídeo da etapa atual só depois do load, em idle (o poster da P1 é o LCP e não disputa banda com ele)
function depoisDoLoad() {
  carregou = true;
  const el = ativa();
  if (el) comVideo(el, el.dataset.cena);
}
const ocioso = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
if (document.readyState === 'complete') ocioso(depoisDoLoad);
else window.addEventListener('load', () => ocioso(depoisDoLoad), { once: true });

if ('IntersectionObserver' in window) {
  new IntersectionObserver((entradas) => {
    visivel = entradas.some((x) => x.isIntersecting);
    const v = ativa() && ativa().querySelector('video');
    if (!v) return;
    if (visivel) v.play().catch(() => {});
    else v.pause();
  }).observe(palco);
}
