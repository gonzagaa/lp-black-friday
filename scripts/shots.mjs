// Captura a página inteira em várias larguras e confere o básico de cada uma.
// Uso: npm run shots -- <rotulo> [--pagina=componentes] [--porta=5501] [--larguras=414,390]
// Salva em shots/<rotulo>/<largura>.png. Roda com prefers-reduced-motion: reduce para a captura ser estável.
// Também relata: erros de console, requisições para fora do localhost, fontes baixadas e scroll horizontal.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const flags = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => {
    const [chave, valor = 'true'] = a.slice(2).split('=');
    return [chave, valor];
  }),
);
const LARGURAS = flags.larguras ? flags.larguras.split(',').map(Number) : [360, 390, 768, 1024, 1280, 1440, 1920];
const rotulo = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!rotulo) {
  console.error('Informe o rótulo: npm run shots -- <rotulo> [--pagina=componentes]');
  process.exit(1);
}

const porta = flags.porta ?? '5501';
const caminho = flags.pagina && flags.pagina !== 'index' ? `/${flags.pagina}.html` : '/';
const url = `http://localhost:${porta}${caminho}`;
const pasta = join(RAIZ, 'shots', rotulo);
await mkdir(pasta, { recursive: true });

const ehLocal = (endereco) => /^(data:|blob:|about:)/.test(endereco) || /^(https?|wss?):\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(endereco);

const navegador = await chromium.launch();
const resultados = [];

for (const largura of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  // Tracking: a rolagem da captura conta como interação e carregaria o GTM (e o container dele: Meta, Google Ads,
  // RD Station, Hotjar), e o POST da API de Conversões sairia no DOMContentLoaded. Na captura, nada disso sai:
  // não se manda evento falso de localhost. O que é bloqueado aqui não aparece nos erros nem nas externas.
  const TRACKING = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|google\.com(\.br)?\/(rmkt|ccm|pagead)|facebook\.(net|com)|rdstation\.com\.br|d335luupugsy2\.cloudfront\.net|hotjar\.com|backend-api-zero7\.vercel\.app/;
  await contexto.route(TRACKING, (rota) => rota.abort('blockedbyclient'));
  const pagina = await contexto.newPage();
  const erros = [];
  const externas = [];
  const fontes = new Set();

  pagina.on('console', (msg) => { if (msg.type() === 'error' && !/ERR_BLOCKED_BY_CLIENT/.test(msg.text())) erros.push(msg.text()); });
  pagina.on('pageerror', (erro) => erros.push(erro.message));
  pagina.on('requestfailed', (req) => { if (!TRACKING.test(req.url())) erros.push(`falhou: ${req.url()} (${req.failure()?.errorText})`); });
  pagina.on('response', (res) => { if (res.status() >= 400) erros.push(`${res.status()}: ${res.url()}`); });
  pagina.on('request', (req) => {
    if (!ehLocal(req.url()) && !TRACKING.test(req.url())) externas.push(req.url());
    if (req.resourceType() === 'font') fontes.add(req.url().split('/').pop());
  });

  try {
    await pagina.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    await pagina.goto(url, { waitUntil: 'load', timeout: 30000 });
  }
  // A página pode avisar que ainda está montando algo (ex.: a vitrine buscando o sprite)
  await pagina.waitForFunction(() => !document.documentElement.hasAttribute('data-carregando'), null, { timeout: 10000 });
  await pagina.evaluate(() => document.fonts.ready);

  // Rola a página inteira como um usuário, para as imagens com loading="lazy" carregarem, e volta ao topo
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((pronto) => setTimeout(pronto, 80));
    }
    scrollTo(0, 0);
  });
  // só as imagens que aparecem: a etiqueta dos cards fora da tela e o mercado escondido nunca carregam (lazy)
  await pagina.waitForFunction(() => [...document.images].filter((img) => img.checkVisibility({ visibilityProperty: true })).every((img) => img.complete), null, { timeout: 15000 });

  const medidas = await pagina.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    altura: document.documentElement.scrollHeight,
  }));

  // Página inteira em fatias do tamanho da janela, emendadas. O modo fullPage do Chromium desenha errado os
  // carrosséis com scroll-snap + máscara (mostra outra posição de rolagem). Na foto, a nav deixa de grudar,
  // para não se repetir em cada fatia (o lugar dela no fluxo é o mesmo). A barra fixa do mobile sai da foto
  // pelo mesmo motivo (ela tem capturas próprias no relatório da Fase 6).
  await pagina.addStyleTag({ content: '.cabecalho{position:relative!important;top:auto!important}.barra-mobile{display:none!important}' });
  const altura = medidas.altura;
  const fatias = [];
  for (let y = 0; y < altura; y += 900) {
    await pagina.evaluate((y) => scrollTo(0, y), y);
    await pagina.waitForTimeout(150);
    const topo = await pagina.evaluate(() => scrollY); // a última fatia para no fim da página
    fatias.push({ input: await pagina.screenshot(), top: topo, left: 0 });
  }
  const arquivo = join(pasta, `${largura}.png`);
  await sharp({ create: { width: largura, height: altura, channels: 3, background: '#050404' } })
    .composite(fatias)
    .png()
    .toFile(arquivo);
  resultados.push({ largura, arquivo, erros, externas, fontes: [...fontes], ...medidas });
  await contexto.close();
}

await navegador.close();

console.log(`\n${url} -> ${relative(RAIZ, pasta).replaceAll('\\', '/')}/\n`);
console.log('Largura | Altura | Scroll horizontal | Erros no console | Req. externas');
console.log('---|---|---|---|---');
for (const r of resultados) {
  const scroll = r.scrollWidth > r.clientWidth ? `SIM (${r.scrollWidth}px)` : 'não';
  console.log(`${r.largura} | ${r.altura}px | ${scroll} | ${r.erros.length} | ${r.externas.length}`);
}

const todosErros = [...new Set(resultados.flatMap((r) => r.erros))];
const todasExternas = [...new Set(resultados.flatMap((r) => r.externas))];
const todasFontes = [...new Set(resultados.flatMap((r) => r.fontes))];
console.log(`\nFontes baixadas: ${todasFontes.length ? todasFontes.join(', ') : 'nenhuma'}`);
if (todosErros.length) console.log(`\nErros:\n- ${todosErros.join('\n- ')}`);
if (todasExternas.length) console.log(`\nRequisições externas:\n- ${todasExternas.join('\n- ')}`);
