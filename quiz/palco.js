// Quiz da Black: só visual. Ouve o evento quiz:passo (quiz.js) e troca o palco de mídia e os segmentos do progresso.
// - Uma cena por etapa (vídeo 9:16 + objeto 3D), sem texto por cima do vídeo. Só o vídeo da etapa atual baixa e toca: a cena que sai
//   perde o src (o download para). Da próxima etapa, só o POSTER é pré-carregado.
// - O poster da P1 está no HTML (é o LCP); o vídeo da P1 só entra depois do load, em idle.
// - Movimento reduzido ou economia de dados: só o poster, sem vídeo (e o CSS desliga as animações).
// - Palco fora da tela (no mobile, ao rolar até o formulário): o vídeo pausa.
// - foco: a altura do recorte (object-position), para os vídeos com gente não cortarem o rosto no vídeo baixo do
//   celular (260 px). Sem foco, o centro.
// - 3D: só onde aparece (MOSTRA_3D, o layout de desktop). Abaixo disso (vídeo de fundo) o CSS esconde e a imagem nem
//   é pedida; se a janela crescer, carrega.
// - inicio (opcional): o vídeo começa (e volta, a cada volta do loop) nesse segundo. Hoje nenhuma cena usa: o hub da P1
//   é um arquivo reexportado só com o trecho limpo (hub-zero7-9x16-540-limpo.mp4, sem a abertura preta, a colagem e a
//   comida e bebida; ver relatorios/quiz-ajustes.md), e o poster é o primeiro quadro dele.
import { comVersao } from '../js/versao.js?v=202611151823';

const V = '../assets/video/';
const OBJ = '../assets/3d/';
const CENAS = {
  e_trader: { video: 'hub-zero7-9x16-540-limpo', foco: '22%', poster: 'hub-zero7-9x16-limpo-poster.webp', obj: ['01-moeda-zero7', 344] },
  experiencia: { video: 'academy-9x16-540', poster: 'academy-9x16-poster.webp', obj: ['18-selo-de-conquista', 399] },
  mercado: { video: 'lives-zero7-9x16-540', foco: '15%', poster: 'lives-zero7-9x16-poster.webp', obj: ['03-candles-de-trade', 408] },
  desafio: { video: 'trading-performance-1', foco: '18%', webm: true, poster: 'trading-performance-1-poster.avif', obj: ['09-alvo-de-precisao', 315] },
  dados: { video: 'comunidade-9x16-540', poster: 'comunidade-9x16-poster.webp', obj: ['12-cadeado-zero7', 543] },
  sucesso: { video: 'gamification-9x16-540', poster: 'gamification-9x16-poster.webp', obj: ['20-presente-black', 312] },
};
const SAIDA_MS = 500; // um pouco mais que a transição de .45 s do CSS
const MOSTRA_3D = window.matchMedia('(min-width: 1080px)'); // o mesmo corte do quiz.css (abaixo, o vídeo de fundo, sem 3D)

const palco = document.querySelector('[data-palco]');
const cenas = palco.querySelector('[data-cenas]');
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
  const trecho = cena.inicio ? `#t=${cena.inicio}` : ''; // o navegador já pede o arquivo a partir daí
  fontes.forEach(([ext, tipo]) => {
    const s = document.createElement('source');
    s.src = comVersao(`${V}${cena.video}.${ext}${trecho}`); // ?v= antes do #t=
    s.type = tipo;
    v.append(s);
  });
  if (cena.inicio) {
    // o loop nativo voltaria ao 0: aqui ele volta ao início escolhido
    v.loop = false;
    const aoInicio = () => { if (v.currentTime < cena.inicio) v.currentTime = cena.inicio; };
    v.addEventListener('loadedmetadata', aoInicio, { once: true });
    v.addEventListener('ended', () => { v.currentTime = cena.inicio; v.play().catch(() => {}); });
  }
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
  if (c.foco) el.style.setProperty('--foco', c.foco);
  const img = new Image(540, 960);
  img.alt = '';
  img.decoding = 'async';
  img.src = comVersao(V + c.poster);
  el.append(img);
  return el;
}

// reinicia a animação de entrada do 3D sem depender de timers
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

  carregarObjeto(c.obj, true);
}

let objAtual = CENAS.e_trader.obj;
function carregarObjeto(dados, animar) {
  objAtual = dados;
  if (!MOSTRA_3D.matches) return;
  const [nome, altura] = dados;
  obj.querySelector('source').srcset = comVersao(`${OBJ}${nome}-320.avif`);
  const img = obj.querySelector('img');
  img.src = comVersao(`${OBJ}${nome}-320.webp`);
  img.height = altura;
  if (animar) reanimar(obj);
}
carregarObjeto(objAtual, false);
MOSTRA_3D.addEventListener('change', () => carregarObjeto(objAtual, false));

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
  img.src = comVersao(V + CENAS[passo].poster);
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
