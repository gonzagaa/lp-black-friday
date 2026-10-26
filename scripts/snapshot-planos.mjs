// Gera js/modulos/planos-snapshot.js a partir de data/planos.json.
// É o fallback embutido da seção de planos: usado quando o fetch do PLANOS_URL falha.
// Rode de novo sempre que o planos.json mudar: npm run planos:snapshot
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = JSON.parse(await readFile(join(RAIZ, 'data', 'planos.json'), 'utf8'));
const hoje = new Date().toISOString().slice(0, 10);

const saida = `// GERADO por scripts/snapshot-planos.mjs a partir de data/planos.json em ${hoje}. Não edite à mão.
// Fallback da seção de planos: usado só quando o fetch do PLANOS_URL (js/config.js) falha.
export default ${JSON.stringify(json, null, 2)};
`;
await writeFile(join(RAIZ, 'js', 'modulos', 'planos-snapshot.js'), saida);
console.log(`js/modulos/planos-snapshot.js gerado (${Object.keys(json).length - 1} modos).`);
