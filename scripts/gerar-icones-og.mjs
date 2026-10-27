// Gera os ícones e a imagem de compartilhamento a partir do brand kit e da própria página.
// - assets/marca/favicon.svg: só o ingresso ZERO7 de assets/marca/completa-escuro.svg (sem o lettering), num
//   quadrado com folga;
// - assets/marca/favicon-32.png e assets/marca/apple-touch-icon.png (180 × 180, fundo #070607: o iOS não usa
//   transparência);
// - assets/og/og-1200x630.jpg: o topo da página (hero) em 1200 × 630, sem a nav, servido em
//   http://localhost:5501 (rode o npm run dev antes).
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

// Imagem OG: o topo da página em 1200 × 630, sem a nav e sem movimento
const ctx = await nav.newContext({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
const p = await ctx.newPage();
await p.goto(`http://localhost:${PORTA}/`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.addStyleTag({ content: '.cabecalho { display: none !important; }' });
await p.waitForTimeout(400);
await mkdir(join(RAIZ, 'assets', 'og'), { recursive: true });
await sharp(await p.screenshot()).jpeg({ quality: 86, mozjpeg: true }).toFile(join(RAIZ, 'assets', 'og', 'og-1200x630.jpg'));
await nav.close();
console.log(`favicon: viewBox ${vb} | favicon-32.png, apple-touch-icon.png | og-1200x630.jpg`);
