// Cache busting da LP e do quiz: grava a versão do deploy em js/versao.js e põe ?v=<versão> em toda referência local.
//
//   npm run versao                 versão nova = data e hora de Brasília (AAAAMMDDHHMM). Rode antes de cada deploy.
//   npm run versao -- 2026110415   usa esta versão (letras, números, ponto e hífen)
//   npm run versao -- --conferir   não grava nada: lista as referências locais sem ?v= (ou com outra versão) e sai com
//                                  erro se houver alguma
//
// Onde entra o ?v=:
// - HTML (index.html e quiz/index.html): src, href, srcset (cada candidato), poster, data-src/data-poster e o
//   content das metas de imagem do próprio domínio (og:image); também os url() de <style>/style="";
// - CSS (css/**, quiz/*.css): url() de fontes, imagens, texturas e grão;
// - JS (js/**, quiz/*.js): os import/export ... from, import '...' e import() entre módulos (senão o módulo filho fica
//   preso no cache). Os endereços que o JS monta em tempo de execução usam comVersao() de js/versao.js.
// Fica de fora: links de página (.html, pastas, #âncoras), endereços externos, data/planos.json (buscado com no-cache) e
// quiz/api/lead.php (sem cache). vendor/ não é alterado (os arquivos de lá são pedidos com ?v= por quem os carrega).
//
// Depois de regenerar um arquivo gerado (css/secoes/planos.css, motion-logo-*.js, planos-snapshot.js), rode de novo.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(fileURLToPath(import.meta.url), '..', '..');
const EXT = /\.(css|m?js|png|jpe?g|webp|avif|gif|svg|ico|woff2?|mp4|webm)$/i;
const DOMINIO = 'https://zero7.com.br/a-maior-black/';
const ARQUIVO_VERSAO = join(RAIZ, 'js', 'versao.js');

const args = process.argv.slice(2);
const conferir = args.includes('--conferir');
const atual = readFileSync(ARQUIVO_VERSAO, 'utf8').match(/export const VERSAO = '([^']*)'/)[1];

function agoraBrasilia() {
  const d = new Date(Date.now() - 3 * 60 * 60 * 1000); // UTC−3
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

const pedida = args.find((a) => !a.startsWith('--'));
const versao = conferir ? atual : (pedida || agoraBrasilia());
if (!/^[\w.-]+$/.test(versao)) {
  console.error(`Versão inválida: "${versao}" (use letras, números, ponto e hífen).`);
  process.exit(1);
}

// ---------- uma URL ----------
function ehLocal(url) {
  if (!url || url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('javascript:')) return false;
  if (/^(https?:)?\/\//i.test(url)) return url.startsWith(DOMINIO); // do próprio domínio (og:image), sim
  return true;
}

function versionar(url) {
  if (!ehLocal(url)) return url;
  const iFrag = url.indexOf('#');
  const frag = iFrag >= 0 ? url.slice(iFrag) : '';
  const semFrag = iFrag >= 0 ? url.slice(0, iFrag) : url;
  const iQ = semFrag.indexOf('?');
  const caminho = iQ >= 0 ? semFrag.slice(0, iQ) : semFrag;
  if (!EXT.test(caminho) || /\/api\//.test(caminho)) return url;
  const outros = (iQ >= 0 ? semFrag.slice(iQ + 1).split('&') : []).filter((q) => q && !q.startsWith('v='));
  return `${caminho}?${[...outros, `v=${versao}`].join('&')}${frag}`;
}

const versionarSrcset = (valor) => valor.split(',').map((cand) => {
  const m = cand.match(/^(\s*)(\S+)(.*)$/s);
  return m ? `${m[1]}${versionar(m[2])}${m[3]}` : cand;
}).join(',');

const versionarUrlsCss = (texto) => texto.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (todo, aspas, url) => `url(${aspas}${versionar(url.trim())}${aspas})`);

// ---------- por tipo de arquivo ----------
function html(texto) {
  let t = texto.replace(/(\s(?:src|href|poster|data-src|data-poster)=")([^"]*)(")/g, (_, a, url, b) => `${a}${versionar(url)}${b}`);
  t = t.replace(/(\s(?:srcset|data-srcset)=")([^"]*)(")/g, (_, a, valor, b) => `${a}${versionarSrcset(valor)}${b}`);
  // metas de imagem do próprio domínio (og:image, twitter:image)
  t = t.replace(/(<meta\s[^>]*(?:property|name)="(?:og:image|og:image:url|og:image:secure_url|twitter:image)"[^>]*\scontent=")([^"]*)(")/g, (_, a, url, b) => `${a}${versionar(url)}${b}`);
  return versionarUrlsCss(t);
}

const css = (texto) => versionarUrlsCss(texto);

function js(texto) {
  const espec = (url) => (/^\.{1,2}\//.test(url) ? versionar(url) : url); // só os relativos (módulos locais)
  return texto
    .replace(/(\bfrom\s*)(['"])([^'"]+)\2/g, (_, a, q, url) => `${a}${q}${espec(url)}${q}`)
    .replace(/(^|[;\n]\s*)(import\s*)(['"])([^'"]+)\3/g, (_, ini, a, q, url) => `${ini}${a}${q}${espec(url)}${q}`)
    .replace(/(\bimport\s*\(\s*)(['"])([^'"]+)\2/g, (_, a, q, url) => `${a}${q}${espec(url)}${q}`);
}

// ---------- arquivos ----------
function listar(dir, filtro, saida = []) {
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) listar(p, filtro, saida);
    else if (filtro.test(nome)) saida.push(p);
  }
  return saida;
}

const alvos = [
  ...['index.html', join('quiz', 'index.html')].map((f) => [join(RAIZ, f), html]),
  ...listar(join(RAIZ, 'css'), /\.css$/).map((f) => [f, css]),
  ...listar(join(RAIZ, 'quiz'), /\.css$/).map((f) => [f, css]),
  ...listar(join(RAIZ, 'js'), /\.m?js$/).map((f) => [f, js]),
  ...listar(join(RAIZ, 'quiz'), /\.m?js$/).map((f) => [f, js]),
];

const mudados = [];
for (const [arquivo, transformar] of alvos) {
  const antes = readFileSync(arquivo, 'utf8');
  const depois = transformar(antes);
  if (depois !== antes) {
    mudados.push(relative(RAIZ, arquivo).split(sep).join('/'));
    if (!conferir) writeFileSync(arquivo, depois);
  }
}

if (conferir) {
  if (mudados.length) {
    console.error(`Referências locais sem ?v=${versao} (ou com outra versão) em:\n  ${mudados.join('\n  ')}\nRode: npm run versao`);
    process.exit(1);
  }
  console.log(`OK: toda referência local está com ?v=${versao}.`);
} else {
  const v = readFileSync(ARQUIVO_VERSAO, 'utf8');
  writeFileSync(ARQUIVO_VERSAO, v.replace(/export const VERSAO = '[^']*'/, `export const VERSAO = '${versao}'`));
  console.log(`Versão ${versao} (antes: ${atual}). Arquivos alterados: ${mudados.length}`);
  mudados.forEach((m) => console.log(`  ${m}`));
}
