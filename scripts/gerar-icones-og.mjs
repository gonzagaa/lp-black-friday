// Gera os ícones e a imagem de compartilhamento a partir do brand kit e da própria página.
// - assets/marca/favicon.svg: só o ingresso ZERO7 de assets/marca/completa-escuro.svg (sem o lettering), num
//   quadrado com folga;
// - assets/marca/favicon-32.png e assets/marca/apple-touch-icon.png (180 × 180, fundo #070607: o iOS não usa
//   transparência);
// - assets/og/og-1200x630.jpg: a cena do hero (o mesmo código da página, servida em http://localhost:5501; rode o
//   npm run dev antes) com um enquadramento próprio, só na captura (ver OG_CSS abaixo).
// Uso: node scripts/gerar-icones-og.mjs [--porta=5501]
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = (process.argv.find((a) => a.startsWith('--porta=')) || '').split('=')[1] || '5501';
const marca = await readFile(join(RAIZ, 'assets', 'marca', 'completa-escuro.svg'), 'utf8');

const nav = await chromium.launch();
const pag = await nav.newPage();

// Caixa do ingresso, medida no próprio SVG
await pag.setContent(marca);
const caixa = await pag.evaluate(() => {
  const b = document.querySelector('#ticket').getBBox();
  return { x: b.x, y: b.y, w: b.width, h: b.height };
});
const lado = Math.max(caixa.w, caixa.h) * 1.08;
const vb = [caixa.x + caixa.w / 2 - lado / 2, caixa.y + caixa.h / 2 - lado / 2, lado, lado].map((v) => +v.toFixed(2)).join(' ');

// Sem o lettering; viewBox quadrado no ingresso
const semLettering = marca.replace(/<g id="tipografia"[\s\S]*?<\/g>\s*(?=<g id="ticket")/, '');
if (semLettering === marca) throw new Error('não achei o grupo da tipografia no completa-escuro.svg');
const favicon = semLettering
  .replace(/viewBox="[^"]*"/, `viewBox="${vb}"`)
  .replace(/\swidth="[^"]*"/, ' width="64"')
  .replace(/\sheight="[^"]*"/, ' height="64"');
await writeFile(join(RAIZ, 'assets', 'marca', 'favicon.svg'), favicon);
await sharp(Buffer.from(favicon), { density: 300 }).resize(32, 32).png().toFile(join(RAIZ, 'assets', 'marca', 'favicon-32.png'));
const icone = await sharp(Buffer.from(favicon), { density: 600 }).resize(148, 148).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#070607' } })
  .composite([{ input: icone, left: 16, top: 16 }]).png().toFile(join(RAIZ, 'assets', 'marca', 'apple-touch-icon.png'));

// Imagem OG (ajuste do cliente): enquadramento próprio, com a mesma cena e o mesmo código do hero. Só na captura:
// - sem a nav, o subtítulo e o CTA;
// - logo Zero7 com 160 px em cima;
// - H1 + selo maiores (pedido: ~15%). A escala é a maior até 1,15 em que logo, H1 e selo cabem no quadrado do
//   meio (630 × 630, onde o WhatsApp corta a miniatura pequena) com ~10 px de folga; em 1,15 o H1 + selo mediam
//   649 px. O conjunto é recentralizado: o selo e o recuo da linha 2 o deixavam 7 px à direita;
// - horizonte mais alto: --arco = 22% de 630 (o arco do planeta, a luz e o símbolo nascendo derivam dele);
// - o símbolo sem o "furo" atrás do subtítulo (não há subtítulo aqui).
const OG_ALTURA = 630;
const QUADRADO = 630;
const FOLGA = 10;
const OG_CSS = (escala, ajusteX) => `
  .cabecalho, .barra-mobile, .hero__sub, .hero__acoes { display: none !important; }
  main > section:not(.hero) { visibility: hidden !important; } /* os benefícios sobem por cima da base da hero */
  :root { --arco: ${Math.round(OG_ALTURA * 0.22)}px !important; }
  .hero { margin-top: 0 !important; min-height: ${OG_ALTURA}px !important; height: ${OG_ALTURA}px !important; }
  .hero__conteudo { justify-content: center !important; gap: 0 !important; padding: 24px var(--gutter) calc(var(--arco) + 24px) !important; }
  .hero__marca { width: 160px !important; margin-bottom: 26px !important; }
  .hero__titulo { font-size: calc(var(--fs-h1) * ${escala}) !important; translate: ${ajusteX}px 0; }
  .hero__simbolo-corpo { -webkit-mask-image: none !important; mask-image: none !important; }
`;
const ctx = await nav.newContext({ viewport: { width: 1200, height: OG_ALTURA }, reducedMotion: 'reduce' });
// sem tracking na captura: nada de evento falso saindo de localhost (como no scripts/shots.mjs)
await ctx.route(/googletagmanager\.com|google-analytics\.com|doubleclick\.net|facebook\.(net|com)|rdstation\.com\.br|hotjar\.com|backend-api-zero7\.vercel\.app/, (rota) => rota.abort('blockedbyclient'));
const p = await ctx.newPage();
await p.goto(`http://localhost:${PORTA}/`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const folha = await p.addStyleTag({ content: OG_CSS(1, 0) });
// caixa de logo + H1 + selo (o selo sai da caixa do texto)
const medirGrupo = () => p.evaluate(() => {
  const rg = document.createRange();
  rg.selectNodeContents(document.querySelector('.hero__titulo'));
  const caixas = [rg.getBoundingClientRect(), document.querySelector('.selo-hero').getBoundingClientRect(), document.querySelector('.hero__marca').getBoundingClientRect()];
  const esq = Math.min(...caixas.map((c) => c.left)), dir = Math.max(...caixas.map((c) => c.right));
  const topo = Math.min(...caixas.map((c) => c.top)), base = Math.max(...caixas.map((c) => c.bottom));
  return { esq, dir, topo, base, largura: dir - esq };
});
const base = await medirGrupo();
const escala = Math.min(1.15, ((QUADRADO - 2 * FOLGA) / base.largura));
await folha.evaluate((el, css) => { el.textContent = css; }, OG_CSS(escala, 0));
const g = await medirGrupo();
const ajusteX = Math.round(600 - (g.esq + g.dir) / 2);
await folha.evaluate((el, css) => { el.textContent = css; }, OG_CSS(escala, ajusteX));
await p.waitForTimeout(400);
const final = await medirGrupo();
await mkdir(join(RAIZ, 'assets', 'og'), { recursive: true });
await sharp(await p.screenshot()).jpeg({ quality: 86, mozjpeg: true }).toFile(join(RAIZ, 'assets', 'og', 'og-1200x630.jpg'));
console.log(`OG: H1 ${escala.toFixed(3)}× (H1 + selo: ${Math.round(g.largura)} px), recentralizado ${ajusteX} px | logo + H1 + selo x ${Math.round(final.esq)}–${Math.round(final.dir)}, y ${Math.round(final.topo)}–${Math.round(final.base)} (quadrado do meio: x ${600 - QUADRADO / 2}–${600 + QUADRADO / 2})`);
await nav.close();
console.log(`favicon: viewBox ${vb} | favicon-32.png, apple-touch-icon.png | og-1200x630.jpg`);
