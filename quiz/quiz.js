// Quiz da Black: uma pergunta por tela, os dados de contato e o envio para quiz/api/lead.php (que repassa para a RD
// Station; a chave da RD nunca vem para o navegador).
// - Ao escolher uma opção, avança sozinho. Quem "Ainda não opero" pula a P2 (a experiência vai como "Não opera"),
//   e a contagem e a barra se ajustam (3 perguntas).
// - O foco vai para o título de cada passo; tudo funciona por teclado (as opções são <button>).
// - As UTMs (e fbclid/gclid) da URL de entrada ficam guardadas na sessão ao abrir a página.
// - Deu certo: tela de sucesso e dataLayer.push({ event: 'quiz_lead', quiz_e_trader, quiz_mercado }), sem nenhum dado
//   pessoal. Deu erro: mensagem e o botão liberado.
import { iniciarTracking } from '../js/modulos/tracking.js';
import { iniciarRodape } from '../js/modulos/rodape.js';

const NAO_OPERA = 'Ainda não opero';
const EXPERIENCIA_NAO_OPERA = 'Não opera';
const ERRO_ENVIO = 'Não conseguimos enviar agora. Tente de novo.';
const CHAVE_ORIGEM = 'quiz-black-origem';
const PARAMETROS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'fbclid', 'gclid'];

iniciarTracking();
iniciarRodape();
const grao = () => document.documentElement.classList.add('grao-pronto');
if (document.readyState === 'complete') grao(); else window.addEventListener('load', grao, { once: true });

// ---------- origem: UTMs da URL de entrada ----------
function guardarOrigem() {
  const url = new URLSearchParams(window.location.search);
  const daUrl = {};
  PARAMETROS.forEach((p) => { const v = url.get(p); if (v) daUrl[p] = v.slice(0, 200); });
  try {
    if (Object.keys(daUrl).length) sessionStorage.setItem(CHAVE_ORIGEM, JSON.stringify(daUrl));
    return JSON.parse(sessionStorage.getItem(CHAVE_ORIGEM) || '{}');
  } catch {
    return daUrl;
  }
}
const origem = guardarOrigem();

// Cookie de rastreamento da RD (_rdtrk; em alguns scripts, rdtrk): um JSON com o "id", ou o id direto
function idDeRastreioRd() {
  const cookies = document.cookie.split(';').map((c) => c.trim());
  const bruto = cookies.find((c) => c.startsWith('_rdtrk=') || c.startsWith('rdtrk='));
  if (!bruto) return '';
  let valor = bruto.slice(bruto.indexOf('=') + 1);
  try { valor = decodeURIComponent(valor); } catch { /* fica como veio */ }
  try {
    const obj = JSON.parse(valor);
    if (obj && typeof obj.id === 'string') valor = obj.id;
  } catch { /* não é JSON: o id direto */ }
  return /^[A-Za-z0-9-]{8,64}$/.test(valor) ? valor : '';
}

// ---------- passos ----------
const painel = document.querySelector('[data-painel]');
const cabecalho = document.querySelector('[data-cabecalho]');
const passos = Object.fromEntries([...document.querySelectorAll('[data-passo]')].map((el) => [el.dataset.passo, el]));
const voltar = document.querySelector('[data-voltar]');
const contagem = document.querySelector('[data-contagem]');
const barra = document.querySelector('[data-barra]');
const respostas = {};
const historico = [];
let atual = null;

const perguntas = () => (respostas.e_trader === NAO_OPERA
  ? ['e_trader', 'mercado', 'desafio']
  : ['e_trader', 'experiencia', 'mercado', 'desafio']);

function mostrar(passo, { focar = true } = {}) {
  Object.values(passos).forEach((el) => { el.hidden = el.dataset.passo !== passo; });
  atual = passo;
  const lista = perguntas();
  const total = lista.length + 1; // as perguntas + os dados de contato
  const posicao = passo === 'dados' || passo === 'sucesso' ? total : lista.indexOf(passo) + 1;
  const pct = Math.round((posicao / total) * 100);
  barra.style.setProperty('--progresso', `${pct}%`);
  barra.setAttribute('aria-valuenow', String(pct));
  contagem.textContent = lista.includes(passo) ? `Pergunta ${posicao} de ${lista.length}` : '';
  voltar.hidden = historico.length === 0 || passo === 'sucesso';
  document.querySelector('[data-topo]').hidden = passo === 'sucesso';
  cabecalho.hidden = passo === 'sucesso';
  if (focar) passos[passo].querySelector('.quiz__pergunta').focus();
}

function avancar() {
  const lista = perguntas();
  const i = lista.indexOf(atual);
  historico.push(atual);
  mostrar(i >= 0 && i < lista.length - 1 ? lista[i + 1] : 'dados');
}

document.querySelectorAll('.quiz__opcao').forEach((botao) => {
  botao.addEventListener('click', () => {
    const passo = botao.closest('[data-passo]').dataset.passo;
    respostas[passo] = botao.dataset.valor;
    botao.parentElement.querySelectorAll('.quiz__opcao').forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
    if (passo === 'e_trader') {
      if (respostas.e_trader === NAO_OPERA) {
        respostas.experiencia = EXPERIENCIA_NAO_OPERA;
      } else if (respostas.experiencia === EXPERIENCIA_NAO_OPERA) {
        delete respostas.experiencia;
        passos.experiencia.querySelectorAll('.quiz__opcao').forEach((b) => b.removeAttribute('aria-pressed'));
      }
    }
    avancar();
  });
});

voltar.addEventListener('click', () => {
  const anterior = historico.pop();
  if (anterior) mostrar(anterior);
});

// ---------- dados de contato ----------
const form = document.querySelector('[data-form]');
const campos = {
  nome: form.elements.nome,
  whatsapp: form.elements.whatsapp,
  email: form.elements.email,
  consentimento: form.elements.consentimento,
};
const enviar = form.querySelector('[data-enviar]');
const rotuloEnviar = form.querySelector('[data-enviar-rotulo]');
const erroGeral = form.querySelector('[data-erro-geral]');

const digitos = (valor) => {
  let d = String(valor).replace(/\D/g, '');
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2); // colou com o +55
  return d.slice(0, 11);
};

function mascarar(d) {
  if (!d) return '';
  if (d.length < 3) return `(${d}`;
  const ddd = d.slice(0, 2);
  const n = d.slice(2);
  if (n.length <= 4) return `(${ddd}) ${n}`;
  if (d.length <= 10) return `(${ddd}) ${n.slice(0, 4)}-${n.slice(4)}`;
  return `(${ddd}) ${n.slice(0, 5)}-${n.slice(5)}`;
}

campos.whatsapp.addEventListener('input', () => {
  campos.whatsapp.value = mascarar(digitos(campos.whatsapp.value));
});

const validacoes = {
  nome: (v) => ((v.match(/\p{L}/gu) || []).length >= 2 && /^[\p{L}\p{M}][\p{L}\p{M} '’.-]*$/u.test(v.trim())) || 'Digite seu nome.',
  whatsapp: (v) => {
    const d = digitos(v);
    const ok = /^[1-9][1-9]\d{8,9}$/.test(d) && (d.length === 10 || d[2] === '9');
    return ok || 'Digite um WhatsApp válido com DDD.';
  },
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Digite um e-mail válido.',
  consentimento: (_v, el) => el.checked || 'Marque a autorização para receber a oferta.',
};

function validar(nome) {
  const el = campos[nome];
  const resultado = validacoes[nome](el.value, el);
  const mensagem = resultado === true ? '' : resultado;
  form.querySelector(`[data-erro-de="${nome}"]`).textContent = mensagem;
  el.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  return !mensagem;
}

Object.keys(campos).forEach((nome) => {
  const el = campos[nome];
  // o erro aparece ao sair do campo (ou ao marcar a caixa) e some assim que o valor fica certo
  el.addEventListener(nome === 'consentimento' ? 'change' : 'blur', () => { if (el.value || nome === 'consentimento') validar(nome); });
  el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validar(nome); });
});

function travar(enviando) {
  enviar.disabled = enviando;
  rotuloEnviar.textContent = enviando ? 'Enviando…' : 'Quero minha oferta';
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erroGeral.textContent = '';
  const validos = Object.keys(campos).map(validar);
  const primeiroErro = Object.keys(campos)[validos.indexOf(false)];
  if (primeiroErro) {
    campos[primeiroErro].focus();
    return;
  }

  const corpo = {
    nome: campos.nome.value.trim(),
    whatsapp: digitos(campos.whatsapp.value),
    email: campos.email.value.trim(),
    consentimento: campos.consentimento.checked,
    respostas: {
      e_trader: respostas.e_trader,
      experiencia: respostas.experiencia,
      mercado: respostas.mercado,
      desafio: respostas.desafio,
    },
    utm: {
      source: origem.utm_source || '',
      medium: origem.utm_medium || '',
      campaign: origem.utm_campaign || '',
      term: origem.utm_term || '',
      content: origem.utm_content || '',
      id: origem.utm_id || '',
    },
    client_tracking_id: idDeRastreioRd(),
    site: form.elements.site.value,
  };

  travar(true);
  const limite = new AbortController();
  const relogio = setTimeout(() => limite.abort(), 15000);
  try {
    const resposta = await fetch('api/lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: limite.signal,
    });
    const json = await resposta.json().catch(() => ({}));
    if (!resposta.ok || json.ok !== true) throw new Error('envio');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'quiz_lead', quiz_e_trader: respostas.e_trader, quiz_mercado: respostas.mercado });
    historico.length = 0;
    mostrar('sucesso');
  } catch {
    erroGeral.textContent = ERRO_ENVIO;
    travar(false);
  } finally {
    clearTimeout(relogio);
  }
});

// ---------- início ----------
painel.hidden = false;
mostrar('e_trader', { focar: false });
