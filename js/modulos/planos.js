// Seção de planos: a mesma lógica da home, com a pele Black.
// - Dados: PLANOS_URL (js/config.js). Se o fetch falhar, usa o snapshot embutido e avisa no console.
// - Modos: como o blackPlanos.js (config.modes ativos, defaultMode, hideButtonsWhenSingleMode, footnote).
// - Cards: preço, "Máximo de dias" e checkout vêm do JSON; o HTML só tem a estrutura e as specs fixas.
//   Card sem preço ou sem checkout válido não aparece (nem a aba dele).
// - Mercado: seletor em pílula como o planosAtivo.js (radiogroup, setas do teclado, ?ativo=bitcoin).
import { PLANOS_URL } from '../config.js';
import SNAPSHOT from './planos-snapshot.js';
import { separarParcela, separarAvista, comQueryAtual, checkoutValido } from './precos.js';

const MERCADOS = {
  indice: { titulo: 'Mini índice / Dólar' },
  bitcoin: { titulo: 'Contrato Futuro de Bitcoin' },
};

function modosAtivos(db) {
  const modos = Array.isArray(db?.config?.modes) ? db.config.modes : [];
  return modos
    .filter((m) => m && m.active === true && m.id)
    .map((m) => ({ id: String(m.id), label: m.label ? String(m.label) : String(m.id), footnote: typeof m.footnote === 'string' ? m.footnote : '' }));
}

async function carregar() {
  try {
    const resposta = await fetch(PLANOS_URL, { cache: 'no-cache' });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const db = await resposta.json();
    if (!modosAtivos(db).length) throw new Error('nenhum modo ativo em config.modes');
    return db;
  } catch (erro) {
    console.warn(`[planos] Não consegui usar ${PLANOS_URL} (${erro.message}). Usando o snapshot embutido.`);
    return SNAPSHOT;
  }
}

export async function iniciarPlanos() {
  const secao = document.getElementById('planos');
  if (!secao) return;

  const cards = [...secao.querySelectorAll('.card[data-plan]')];
  const caixaModos = secao.querySelector('[data-modos]');
  const botoesModos = secao.querySelector('[data-modos-botoes]');
  const textosModos = [...secao.querySelectorAll('[data-modos-textos] [data-modo]')];

  iniciarMercado(secao);

  const db = await carregar();
  const ativos = modosAtivos(db);
  const escondeUi = ativos.length === 1 && db.config?.hideButtonsWhenSingleMode === true;
  caixaModos.hidden = escondeUi;
  if (!escondeUi) {
    botoesModos.replaceChildren(...ativos.map((modo) => {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.dataset.modo = modo.id;
      botao.textContent = modo.label;
      botao.setAttribute('aria-pressed', 'false');
      botao.addEventListener('click', () => aplicarModo(modo.id));
      return botao;
    }));
  }

  function aplicarModo(id) {
    const modo = ativos.find((m) => m.id === id);
    if (!modo) return;
    botoesModos.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modo === id)));
    textosModos.forEach((p) => { p.hidden = p.dataset.modo !== id; });

    const tabela = db[id];
    if (!tabela) console.warn(`[planos] Modo ativo sem dados no planos.json: ${id}`);
    cards.forEach((card) => preencherCard(card, tabela?.[card.dataset.plan], modo.footnote));
    secao.dispatchEvent(new CustomEvent('planos:atualizados', { bubbles: true }));
  }

  const padrao = ativos.some((m) => m.id === db.config?.defaultMode) ? db.config.defaultMode : ativos[0].id;
  aplicarModo(padrao);
}

function preencherCard(card, cfg, nota) {
  const parcela = separarParcela(cfg?.parcel);
  const avista = separarAvista(cfg?.avista);
  const ok = cfg && typeof cfg.oldPrice === 'string' && cfg.oldPrice.trim() && parcela && avista && checkoutValido(cfg.checkout);
  if (!ok) {
    console.warn(`[planos] Card escondido, sem preço ou checkout válido: ${card.dataset.plan}`);
    card.hidden = true;
    return;
  }

  const q = (seletor) => card.querySelector(seletor);
  q('.js-old-price').textContent = cfg.oldPrice;
  q('.js-parcelas').textContent = parcela.parcelas;
  q('.js-parcela-valor').textContent = parcela.valor;
  q('.js-avista-valor').textContent = avista.valor;
  if (typeof cfg.maxDias !== 'undefined') q('.js-max-dias').textContent = String(cfg.maxDias);
  q('.js-checkout').href = comQueryAtual(cfg.checkout, window.location.search);
  const elNota = q('.js-nota');
  elNota.textContent = nota;
  elNota.hidden = !nota;
  card.hidden = false;
  card.classList.add('is-pronto');
}

// Seletor de mercado (Mini Índice / Dólar × Futuro de Bitcoin)
function iniciarMercado(secao) {
  const seg = secao.querySelector('[data-seg]');
  const opcoes = [...seg.querySelectorAll('[role="radio"]')];
  const titulo = secao.querySelector('[data-mercado-titulo]');
  const blocos = [...secao.querySelectorAll('.planos__ativo')];
  let atual = null;

  function definir(id, { focar = false } = {}) {
    if (!MERCADOS[id] || id === atual) return;
    atual = id;
    opcoes.forEach((botao) => {
      const ligado = botao.dataset.ativo === id;
      botao.setAttribute('aria-checked', String(ligado));
      botao.tabIndex = ligado ? 0 : -1;
      if (ligado && focar) botao.focus();
    });
    titulo.textContent = MERCADOS[id].titulo;
    blocos.forEach((bloco) => { bloco.hidden = bloco.dataset.ativo !== id; });
    secao.dispatchEvent(new CustomEvent('planos:mercado', { bubbles: true, detail: { ativo: id } }));
  }

  opcoes.forEach((botao) => botao.addEventListener('click', () => definir(botao.dataset.ativo)));
  seg.addEventListener('keydown', (evento) => {
    const i = opcoes.indexOf(document.activeElement);
    if (i === -1) return;
    const teclas = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: opcoes.length - 1 };
    if (!(evento.key in teclas)) return;
    evento.preventDefault();
    const alvo = (teclas[evento.key] + opcoes.length) % opcoes.length;
    definir(opcoes[alvo].dataset.ativo, { focar: true });
  });

  const pedido = new URLSearchParams(window.location.search).get('ativo');
  definir(MERCADOS[pedido] ? pedido : 'indice');
}
