// Aceite de layout da seção de planos: mede com getBoundingClientRect a home (https://zero7.com.br/home/, só
// leitura e sem rastreamento) e a LP (http://localhost:5501) nas mesmas larguras e compara, com tolerância de ±2 px.
// Uso: node scripts/medir-planos.mjs [--porta=5501] [--larguras=1920,1440,1024,768,390] [--pele] [--saida=arquivo.md]
//
// - Origem das medidas: x a partir da borda esquerda da janela; y a partir do topo do .swiper do ativo
//   (o que fica acima do carrossel é diferente de propósito: a LP tem o próprio cabeçalho de seção).
// - Sem --pele, a LP é medida como a home: as fontes da home (../Zero7/css/fonts) entram SÓ no teste, por uma
//   rota do Playwright, a pele Black (planos-black.css) é desligada e a etiqueta 3D sai do fluxo.
// - Os dois mercados (Mini Índice / Dólar e Futuro de Bitcoin). Cards: os que estão na tela, da esquerda para a direita.
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ZERO7 = join(RAIZ, '..', 'Zero7');
const arg = (n, padrao) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || '').split('=')[1] || padrao;
const PORTA = arg('porta', '5501');
const LARGURAS = arg('larguras', '1920,1440,1024,768,390').split(',').map(Number);
const PELE = process.argv.includes('--pele');
const SAIDA = arg('saida', '');
const TOL = 2;
const REMOVIDOS = / (tarja|bandeira copa)$/;
const HOME = 'https://zero7.com.br/home/';
const PERMITIDOS = /^https:\/\/(zero7\.com\.br|www\.zero7\.com\.br|unpkg\.com|cdnjs\.cloudflare\.com|code\.jquery\.com)\//;

// @font-face da home (css/index.css), com as URLs apontando para a rota de teste
const css = await readFile(join(ZERO7, 'css', 'index.css'), 'utf8');
const fontesHome = (css.match(/@font-face\s*\{[^}]*\}/g) || []).join('\n').replace(/url\("fonts\//g, 'url("/__home/fonts/');

async function abrirHome(nav, largura) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 1000 }, reducedMotion: 'reduce' });
  await ctx.route('**/*', (r) => (r.request().url().startsWith('data:') || PERMITIDOS.test(r.request().url()) ? r.continue() : r.abort()));
  await ctx.addInitScript(() => Object.defineProperty(window, 'rastrear', { get: () => false, set: () => {} }));
  const pag = await ctx.newPage();
  await pag.goto(HOME, { waitUntil: 'networkidle', timeout: 60000 });
  await pag.waitForFunction(() => window.swiper4 && window.swiper4.initialized, null, { timeout: 15000 });
  return { ctx, pag, secao: '#plan' };
}

async function abrirLP(nav, largura) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: 1000 }, reducedMotion: 'reduce' });
  const erros = [];
  if (!PELE) {
    await ctx.route(`http://localhost:${PORTA}/`, async (r) => {
      const resp = await r.fetch();
      const html = (await resp.text())
        .replace('</head>', '<link rel="stylesheet" href="/__home/fontes.css"><style>#planos .card-etiqueta{display:none!important}</style></head>')
        .replace(/<link[^>]*planos-black\.css[^>]*>/, '');
      await r.fulfill({ response: resp, body: html });
    });
    await ctx.route('**/__home/fontes.css', (r) => r.fulfill({ contentType: 'text/css', body: fontesHome }));
    await ctx.route('**/__home/fonts/**', async (r) => {
      const nome = decodeURIComponent(new URL(r.request().url()).pathname.split('/').pop());
      r.fulfill({ contentType: 'font/woff2', body: await readFile(join(ZERO7, 'css', 'fonts', nome)) });
    });
  }
  const pag = await ctx.newPage();
  pag.on('pageerror', (e) => erros.push(e.message));
  pag.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('WebSocket')) erros.push(m.text()); }); // (o live reload não conecta com a rota de teste)
  await pag.goto(`http://localhost:${PORTA}/`, { waitUntil: 'networkidle' });
  await pag.waitForFunction(() => window.swiper4 && window.swiper4.initialized, null, { timeout: 15000 });
  return { ctx, pag, secao: '#planos', erros };
}

// mede tudo dentro da página; devolve { chave: [x, y, w, h] }
async function medir(pag, secao, ativo) {
  await pag.evaluate(() => document.fonts.ready);
  const nomeBloco = ativo === 'bitcoin' ? 'bit' : 'indice';
  await pag.evaluate(([s, a]) => document.querySelector(`${s} .seg__option[data-asset="${a}"]`).click(), [secao, ativo]);
  await pag.waitForTimeout(400);
  await pag.evaluate(([s, b]) => document.querySelector(`${s} .plano-asset--${b} .swiper`).scrollIntoView({ block: 'center' }), [secao, nomeBloco]);
  await pag.waitForTimeout(600);
  return pag.evaluate(([s, b]) => {
    const bloco = document.querySelector(`${s} .plano-asset--${b}`);
    const sw = bloco.querySelector('.swiper');
    const y0 = sw.getBoundingClientRect().top;
    const m = {};
    const r = (chave, el) => {
      if (!el) return;
      const b = el.getBoundingClientRect();
      if (!b.width && !b.height) return;
      m[chave] = [b.left, b.top - y0, b.width, b.height].map((v) => Math.round(v * 10) / 10);
    };
    r('faixa do carrossel (.wrapper.plano)', bloco.querySelector('.wrapper.plano'));
    r('swiper', sw);
    const cards = [...bloco.querySelectorAll('.swiper-slide-visible')]
      .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    cards.forEach((c, i) => {
      const nome = c.querySelector('.title h3')?.textContent.trim() || i;
      const k = `${i + 1}·${nome}`;
      r(`${k} card`, c);
      r(`${k} aba do título`, c.querySelector('.title'));
      r(`${k} título (h3)`, c.querySelector('.title h3'));
      r(`${k} bandeira copa`, c.querySelector('.card-copa-flag'));
      r(`${k} tarja`, c.querySelector('.card-tarja'));
      c.querySelectorAll('.chip').forEach((ch, j) => {
        r(`${k} chip ${j + 1}`, ch);
        r(`${k} chip ${j + 1} rótulo`, ch.querySelector('.chip__rotulo'));
        r(`${k} chip ${j + 1} valor`, ch.querySelector('.chip__valor'));
      });
      r(`${k} oldPrice`, c.querySelector('.oldPrice'));
      r(`${k} oldPrice valor`, c.querySelector('.js-old-price'));
      r(`${k} preço`, c.querySelector('.js-price-parcel'));
      r(`${k} "12x"`, c.querySelector('.js-price-parcel > span'));
      r(`${k} à vista (linha)`, c.querySelector('.js-price-avista'));
      r(`${k} "ou"`, c.querySelector('.js-price-avista > span:first-child'));
      r(`${k} "à vista"`, c.querySelector('.js-price-avista > span:last-child'));
      r(`${k} nota de rodapé`, c.querySelector('.js-plan-footnote'));
      r(`${k} botão`, c.querySelector('.z7-btnx'));
      r(`${k} botão rótulo`, c.querySelector('.z7-btnx__label'));
      r(`${k} botão gota`, c.querySelector('.z7-btnx__cap'));
    });
    r('seta anterior', bloco.querySelector('.swiper-button-prev'));
    r('seta próxima', bloco.querySelector('.swiper-button-next'));
    r('paginação', bloco.querySelector('.swiper-pagination'));
    bloco.querySelectorAll('.swiper-pagination-bullet').forEach((b, i) => r(`paginação ${i + 1} (${b.textContent.trim()})`, b));
    return m;
  }, [secao, nomeBloco]);
}

const nav = await chromium.launch();
const linhas = [];
let falhas = 0;
for (const w of LARGURAS) for (const ativo of ['indice', 'bitcoin']) {
  const h = await abrirHome(nav, w);
  const l = await abrirLP(nav, w);
  const [mh, ml] = [await medir(h.pag, h.secao, ativo), await medir(l.pag, l.secao, ativo)];
  const chaves = [...new Set([...Object.keys(mh), ...Object.keys(ml)])];
  let ok = 0, removidos = 0;
  const ruins = [];
  linhas.push(`\n### ${w} px · ${ativo === 'bitcoin' ? 'Futuro de Bitcoin' : 'Mini Índice / Dólar'}\n`, '| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |', '|---|---|---|---|---|');
  for (const k of chaves) {
    const a = mh[k], b = ml[k];
    // a tarja e a bandeira do Sênior saíram da LP a pedido do cliente: ficam na tabela, fora da conta
    if (REMOVIDOS.test(k) && a && !b) {
      linhas.push(`| ${k} | ${a.join(', ')} | — (removido a pedido do cliente) | — | ➖ |`);
      removidos++;
      continue;
    }
    const d = a && b ? Math.max(...a.map((v, i) => Math.abs(v - b[i]))) : Infinity;
    const passa = d <= TOL;
    if (passa) ok++; else { falhas++; ruins.push(k); }
    linhas.push(`| ${k} | ${a ? a.join(', ') : '—'} | ${b ? b.join(', ') : '—'} | ${Number.isFinite(d) ? d.toFixed(1) : 'falta'} | ${passa ? '✅' : '❌'} |`);
  }
  console.log(`${w} ${ativo}: ${ok}/${ok + ruins.length} dentro de ±${TOL}px${removidos ? ` (+${removidos} removido a pedido do cliente)` : ''}${ruins.length ? ' | fora: ' + ruins.join('; ') : ''}${l.erros.length ? ' | erros LP: ' + l.erros.join(' / ') : ''}`);
  await h.ctx.close();
  await l.ctx.close();
}
await nav.close();
if (SAIDA) await writeFile(SAIDA, linhas.join('\n') + '\n');
console.log(falhas ? `\n${falhas} medida(s) fora da tolerância.` : '\nTodas as medidas dentro da tolerância.');
