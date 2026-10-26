// Copia as fontes locais (woff2, subset latin) e as licenças OFL para assets/fonts/.
// Regra da Fase 1: usar os woff2 do brand kit (_brandkit/tipografia/) quando existirem;
// o que faltar sai dos pacotes @fontsource. Hoje o kit só traz TTF, então tudo vem do @fontsource.
// Uso: npm run fontes
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const KIT = join(RAIZ, '_brandkit', 'tipografia');
const NPM = join(RAIZ, 'node_modules');
const DESTINO = join(RAIZ, 'assets', 'fonts');

const FONTES = [
  { arquivo: 'plus-jakarta-sans-latin-700-normal.woff2', pacote: '@fontsource/plus-jakarta-sans' },
  { arquivo: 'plus-jakarta-sans-latin-800-normal.woff2', pacote: '@fontsource/plus-jakarta-sans' },
  { arquivo: 'barlow-condensed-latin-700-normal.woff2', pacote: '@fontsource/barlow-condensed' },
  { arquivo: 'barlow-condensed-latin-800-normal.woff2', pacote: '@fontsource/barlow-condensed' },
  { arquivo: 'barlow-condensed-latin-900-normal.woff2', pacote: '@fontsource/barlow-condensed' },
  { arquivo: 'inter-latin-wght-normal.woff2', pacote: '@fontsource-variable/inter' },
];

const LICENCAS = [
  { de: '@fontsource/plus-jakarta-sans/LICENSE', para: 'OFL-plus-jakarta-sans.txt' },
  { de: '@fontsource/barlow-condensed/LICENSE', para: 'OFL-barlow-condensed.txt' },
  { de: '@fontsource-variable/inter/LICENSE', para: 'OFL-inter.txt' },
];

async function woff2DoKit() {
  if (!existsSync(KIT)) return [];
  const achados = [];
  const varrer = async (pasta) => {
    for (const item of await readdir(pasta, { withFileTypes: true })) {
      const caminho = join(pasta, item.name);
      if (item.isDirectory()) await varrer(caminho);
      else if (item.name.toLowerCase().endsWith('.woff2')) achados.push(caminho);
    }
  };
  await varrer(KIT);
  return achados;
}

await mkdir(DESTINO, { recursive: true });
const doKit = await woff2DoKit();
console.log(doKit.length ? `woff2 no kit: ${doKit.join(', ')}` : 'O kit não tem woff2 (só TTF): usando @fontsource.');

for (const { arquivo, pacote } of FONTES) {
  const noKit = doKit.find((f) => f.toLowerCase().endsWith(arquivo));
  const origem = noKit ?? join(NPM, pacote, 'files', arquivo);
  await copyFile(origem, join(DESTINO, arquivo));
  const { size } = await stat(join(DESTINO, arquivo));
  console.log(`${arquivo} | ${(size / 1024).toFixed(1)} KB | ${relative(RAIZ, origem).replaceAll('\\', '/')}`);
}

for (const { de, para } of LICENCAS) {
  await copyFile(join(NPM, de), join(DESTINO, para));
  console.log(`${para} | licença`);
}
