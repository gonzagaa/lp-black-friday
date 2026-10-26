// Captura a página inteira em várias larguras e confere o básico de cada uma.
// Uso: npm run shots -- <rotulo> [--pagina=componentes] [--porta=5500]
// Salva em shots/<rotulo>/<largura>.png. Roda com prefers-reduced-motion: reduce para a captura ser estável.
// Também relata: erros de console, requisições para fora do localhost, fontes baixadas e scroll horizontal.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const LARGURAS = [360, 390, 768, 1024, 1280, 1440, 1920];

const flags = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => {
    const [chave, valor = 'true'] = a.slice(2).split('=');
    return [chave, valor];
  }),
);
const rotulo = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!rotulo) {
  console.error('Informe o rótulo: npm run shots -- <rotulo> [--pagina=componentes]');
  process.exit(1);
}

const porta = flags.porta ?? '5500';
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
  const pagina = await contexto.newPage();
  const erros = [];
  const externas = [];
  const fontes = new Set();

  pagina.on('console', (msg) => { if (msg.type() === 'error') erros.push(msg.text()); });
  pagina.on('pageerror', (erro) => erros.push(erro.message));
  pagina.on('requestfailed', (req) => erros.push(`falhou: ${req.url()} (${req.failure()?.errorText})`));
  pagina.on('response', (res) => { if (res.status() >= 400) erros.push(`${res.status()}: ${res.url()}`); });
  pagina.on('request', (req) => {
    if (!ehLocal(req.url())) externas.push(req.url());
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
  await pagina.waitForFunction(() => [...document.images].every((img) => img.complete), null, { timeout: 15000 });

  const medidas = await pagina.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    altura: document.documentElement.scrollHeight,
  }));

  const arquivo = join(pasta, `${largura}.png`);
  await pagina.screenshot({ path: arquivo, fullPage: true });
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
