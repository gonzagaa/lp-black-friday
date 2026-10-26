// Gera os assets otimizados da LP a partir do brand kit, da referência e da home oficial.
// Pode ser rodado de novo sem problema: sempre sobrescreve as saídas.
// Uso: npm run imagens
import sharp from 'sharp';
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRANDKIT = join(RAIZ, '_brandkit');
const HOME = join(RAIZ, '..', 'Zero7');
const ASSETS = join(RAIZ, 'assets');

const LARGURAS_3D = [320, 640];
const AVIF = { quality: 55, effort: 6 };
const WEBP = { quality: 80, alphaQuality: 90, effort: 6 };

const gerados = [];

// "09-Alvo-de-Precisao (1).png" -> "09-alvo-de-precisao"
function kebab(nome) {
  return nome
    .replace(/\.[^.]+$/, '')
    .replace(/\s*\(\d+\)\s*$/, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function registrar(arquivo) {
  const { size } = await stat(arquivo);
  gerados.push({ arquivo: relative(RAIZ, arquivo).replaceAll('\\', '/'), size });
}

async function copiar(origem, destino) {
  await mkdir(dirname(destino), { recursive: true });
  await copyFile(origem, destino);
  await registrar(destino);
}

// Caixa dos pixels com alfa > 0. Mais previsível que o trim() do sharp,
// que também compara o RGB dos pixels transparentes.
async function caixaDoAlfa(arquivo) {
  const { data, info } = await sharp(arquivo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 0) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

async function elementos3d() {
  const pasta = join(ASSETS, '3d');
  await mkdir(pasta, { recursive: true });
  const pngs = (await readdir(BRANDKIT)).filter((f) => f.toLowerCase().endsWith('.png')).sort();
  for (const png of pngs) {
    const origem = join(BRANDKIT, png);
    const caixa = await caixaDoAlfa(origem);
    const recortado = await sharp(origem).extract(caixa).png().toBuffer();
    for (const largura of LARGURAS_3D) {
      const base = sharp(recortado).resize({ width: largura, withoutEnlargement: true });
      const nome = `${kebab(png)}-${largura}`;
      await base.clone().avif(AVIF).toFile(join(pasta, `${nome}.avif`));
      await registrar(join(pasta, `${nome}.avif`));
      await base.clone().webp(WEBP).toFile(join(pasta, `${nome}.webp`));
      await registrar(join(pasta, `${nome}.webp`));
    }
    console.log(`3d  ${png} -> ${kebab(png)} (recorte ${caixa.width}x${caixa.height})`);
  }
}

async function marca() {
  const pasta = join(ASSETS, 'marca');
  const svgs = (await readdir(BRANDKIT)).filter((f) => f.toLowerCase().endsWith('.svg')).sort();
  for (const svg of svgs) await copiar(join(BRANDKIT, svg), join(pasta, `${kebab(svg)}.svg`));

  // Logo Zero7 toda branca: a original tem o 7 em degradê azul, que não cabe na Black.
  const original = await readFile(join(HOME, 'assets', 'logo zero7.svg'), 'utf8');
  const branca = original
    .replace(/<defs>[\s\S]*?<\/defs>\s*/g, '')
    .replace(/fill="[^"]*"/g, 'fill="#ffffff"');
  const destino = join(pasta, 'zero7-branco.svg');
  await writeFile(destino, branca);
  await registrar(destino);
}

async function pagamento() {
  for (let i = 1; i <= 6; i++) {
    await copiar(join(HOME, 'assets', 'pagamento', `${i}.avif`), join(ASSETS, 'pagamento', `${i}.avif`));
  }
}

async function texturas() {
  const pasta = join(RAIZ, '_referencia', 'texturas');
  for (const f of (await readdir(pasta)).sort()) await copiar(join(pasta, f), join(ASSETS, 'texturas', f));
}

await elementos3d();
await marca();
await pagamento();
await texturas();

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log('\nArquivo | Peso');
console.log('---|---:');
for (const { arquivo, size } of gerados) console.log(`${arquivo} | ${kb(size)}`);
console.log(`\n${gerados.length} arquivos, ${kb(gerados.reduce((t, g) => t + g.size, 0))} no total.`);
