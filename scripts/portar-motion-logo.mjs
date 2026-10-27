// Porta o Motion V02 da logo da campanha (_brandkit/motion/Fonte/) para módulos ES da LP:
// - js/modulos/motion-logo-cena.js: a cena (scene-assets.json), só os campos que o motion usa;
// - js/modulos/motion-logo-core.js: o createMotion de motion-core.cjs, com estas trocas e só estas (a adaptação
//   para fundo escuro já testada em _brandkit/motion/prova-fundo-escuro.png):
//     * ink '#070607' → '#FFFFFF';
//     * sem o <rect> de fundo branco (o fundo é o eclipse);
//     * viewBox recortada só na área da marca: o retângulo 150 165 1306 646 da logo (o mesmo viewBox de
//       assets/marca/completa-escuro.svg), na escala e na posição do quadro 4:3. Com overflow visível, o
//       ingresso entra voando de fora da área;
//     * título e rótulo acessível da LP; module.exports → export.
// - assets/marca/assinatura-escuro.svg: o quadro final estático do fechamento (completa-escuro.svg com o lettering a
//   .92, como no SVG animado; ajuste do cliente: a logo é uma assinatura e não pode competir com a frase).
// O controle (tocar uma vez, parar no quadro final) fica em js/modulos/motion-logo.js, escrito à mão.
// Uso: node scripts/portar-motion-logo.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONTE = join(RAIZ, '_brandkit', 'motion', 'Fonte');

// Cena
const fonte = JSON.parse(await readFile(join(FONTE, 'scene-assets.json'), 'utf8'));
const cena = { defs: fonte.defs, ticket: fonte.ticket, letters: fonte.letters };
const jsCena = `// GERADO por scripts/portar-motion-logo.mjs a partir de _brandkit/motion/Fonte/scene-assets.json. Não edite.
// Cena do Motion V02 (Black Friday ZERO7): <defs>, curvas do ingresso e das 11 letras (BLACK FRIDAY).
export default ${JSON.stringify(cena)};
`;
await writeFile(join(RAIZ, 'js', 'modulos', 'motion-logo-cena.js'), jsCena);

// Núcleo
let core = await readFile(join(FONTE, 'motion-core.cjs'), 'utf8');
const trocas = [
  ["ink='#070607'", "ink='#FFFFFF'"],
  ['<rect width="${W}" height="${H}" fill="#FFFFFF"/>', ''],
  [
    'viewBox="0 0 ${W} ${H}" width="${options.width||W}" height="${options.height||H}" role="img" aria-label="Black Friday ZERO7 — motion revisado"><title>Black Friday ZERO7 — Motion V02</title>',
    'viewBox="${num(logoX+150*scale)} ${num(logoY+165*scale)} ${num(1306*scale)} ${num(646*scale)}" width="100%" height="100%" overflow="visible" role="img" aria-label="Black Friday Zero7"><title>Black Friday Zero7</title>',
  ],
  ['function createMotion(A) {', 'export function createMotion(A) {'],
  ["if(typeof module!=='undefined')module.exports=createMotion;", ''],
];
for (const [de, para] of trocas) {
  if (!core.includes(de)) throw new Error(`Troca sem efeito no motion-core.cjs: ${de.slice(0, 60)}`);
  core = core.replace(de, para);
}
const jsCore = `// GERADO por scripts/portar-motion-logo.mjs a partir de _brandkit/motion/Fonte/motion-core.cjs. Não edite.
// Trocas em relação ao original (adaptação para fundo escuro): tinta branca, sem o fundo branco, viewBox recortada
// na área da marca com overflow visível, rótulo da LP e export de módulo ES. O resto é o código do brand kit.
${core.trim()}
`;
await writeFile(join(RAIZ, 'js', 'modulos', 'motion-logo-core.js'), jsCore);

// Quadro final estático com o lettering a .92
const estatico = await readFile(join(RAIZ, 'assets', 'marca', 'completa-escuro.svg'), 'utf8');
if (!estatico.includes('<g id="tipografia"')) throw new Error('não achei o lettering no completa-escuro.svg');
await writeFile(join(RAIZ, 'assets', 'marca', 'assinatura-escuro.svg'), estatico.replace('<g id="tipografia"', '<g id="tipografia" opacity=".92"'));

console.log(`motion-logo-cena.js: ${(jsCena.length / 1024).toFixed(1)} KB, ${cena.letters.length} letras | motion-logo-core.js: ${(jsCore.length / 1024).toFixed(1)} KB`);
