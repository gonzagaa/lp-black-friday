// Diff de texto e links do rodapé: home (../Zero7/index.html, blocos #footer, #pagamento e #author) × LP (#rodape).
// Compara, na ordem, cada texto visível e cada link (texto → href). Uso: node scripts/diff-rodape.mjs
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const home = await readFile(join(RAIZ, '..', 'Zero7', 'index.html'), 'utf8');
const lp = await readFile(join(RAIZ, 'index.html'), 'utf8');
const trecho = (html, de, ate) => html.slice(html.indexOf(de), html.indexOf(ate, html.indexOf(de)) + ate.length);
const blocosHome = trecho(home, '<footer id="footer">', '</footer>') + trecho(home, '<section id="pagamento">', '</section>') + trecho(home, '<section id="author">', '</section>');
const blocoLp = trecho(lp, '<footer id="rodape"', '</footer>');

const nav = await chromium.launch();
const pag = await nav.newPage();
async function extrair(html) {
  await pag.setContent(`<body>${html.replace(/<script[\s\S]*?<\/script>/g, '')}</body>`);
  return pag.evaluate(() => {
    const limpa = (s) => s.replace(/\s+/g, ' ').trim();
    const textos = [];
    const andar = (no) => {
      for (const filho of no.childNodes) {
        if (filho.nodeType === 3) { const t = limpa(filho.textContent); if (t) textos.push(t); }
        else if (filho.nodeType === 1 && !['SCRIPT', 'STYLE', 'SVG'].includes(filho.tagName.toUpperCase())) andar(filho);
      }
    };
    andar(document.body);
    const links = [...document.querySelectorAll('a')].map((a) => `${limpa(a.textContent) || a.getAttribute('aria-label')} → ${a.getAttribute('href')}${a.target ? ` (target ${a.target})` : ''}`);
    return { textos, links };
  });
}
const h = await extrair(blocosHome);
const l = await extrair(blocoLp);
await nav.close();

function diff(nome, a, b) {
  const linhas = [];
  const max = Math.max(a.length, b.length);
  let iguais = 0;
  for (let i = 0; i < max; i++) {
    if (a[i] === b[i]) { iguais++; linhas.push(`  = ${a[i]}`); }
    else { if (a[i] !== undefined) linhas.push(`  - home: ${a[i]}`); if (b[i] !== undefined) linhas.push(`  + LP:   ${b[i]}`); }
  }
  console.log(`\n${nome}: ${iguais}/${max} iguais\n${linhas.join('\n')}`);
}
diff('TEXTOS', h.textos, l.textos);
diff('LINKS', h.links, l.links);
