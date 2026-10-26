// Porta o CSS da seção de planos da home (https://zero7.com.br/home/) para css/secoes/planos.css.
// Uso: node scripts/portar-planos-css.mjs   (precisa de rede; a home é só lida)
//
// Como funciona:
// 1. Abre a home sem rastreamento: trava a variável `rastrear` da própria home em false (GTM, Pixel e Gateway
//    dependem dela) e bloqueia domínios de terceiros.
// 2. Percorre todas as folhas da home e guarda as regras que casam com a section#plan ou com algo dentro dela,
//    nos dois mercados (índice e bitcoin) e com os estados (:hover, :focus-visible, ::before...) ignorados no teste.
// 3. Reescreve: #plan -> #planos; regra que não cita .planos ganha o escopo :where(#planos) (sem mudar a
//    especificidade); "header h2" -> "header .js-plan-title" (na LP o título do mercado é h3).
// 4. A home usa outra raiz de rem (8 px; 10 px a partir de 1080). Cada Xrem vira calc(X * var(--rem)), e --rem
//    replica essa raiz. Os tokens do :root da home vão para dentro de #planos.
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOME = 'https://zero7.com.br/home/';
const PERMITIDOS = /^https:\/\/(zero7\.com\.br|www\.zero7\.com\.br|unpkg\.com|cdnjs\.cloudflare\.com|code\.jquery\.com)\//;

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
await ctx.route('**/*', (r) => (r.request().url().startsWith('data:') || PERMITIDOS.test(r.request().url()) ? r.continue() : r.abort()));
await ctx.addInitScript(() => Object.defineProperty(window, 'rastrear', { get: () => false, set: () => {} }));
const pag = await ctx.newPage();
await pag.goto(HOME, { waitUntil: 'networkidle', timeout: 60000 });
await pag.waitForFunction(() => window.swiper4 && window.swiper11, null, { timeout: 15000 });

const resultado = await pag.evaluate(() => {
  const secao = document.getElementById('plan');
  const dentro = (el) => el === secao || secao.contains(el);
  const ESTADOS = /::?(before|after|placeholder|selection|marker|-webkit-[\w-]+)|:(hover|focus-visible|focus-within|focus|active|visited)/g;
  const ESTADOS_SWIPER = /swiper-(button|pagination)-(lock|disabled|hidden)|swiper-slide-(active|visible|next|prev)|is-na-tela|is-swapping|flash-/;
  const SEM_USO = /card--copa|card-tarja|card-copa-flag/;

  // separa uma lista de seletores nas vírgulas de primeiro nível
  const partes = (lista) => {
    const res = []; let nivel = 0, atual = '';
    for (const c of lista) {
      if (c === '(') nivel++;
      if (c === ')') nivel--;
      if (c === ',' && nivel === 0) { res.push(atual.trim()); atual = ''; } else atual += c;
    }
    if (atual.trim()) res.push(atual.trim());
    return res;
  };
  const casa = (sel) => {
    const limpo = sel.replace(ESTADOS, '').replace(/\s+$/, '') || '*';
    try { return [...document.querySelectorAll(limpo)].some(dentro); } catch { return false; }
  };
  // a parte casa com a própria section (ex.: "section", "*"): a regra também vale para #planos, não só dentro
  const casaSecao = (sel) => {
    if (/#plan\b|\.planos\b/.test(sel)) return false;
    const limpo = sel.replace(ESTADOS, '').replace(/\s+$/, '') || '*';
    try { return secao.matches(limpo); } catch { return false; }
  };

  const PROPRIA = '@@secao@@';
  const usados = new Map(); // regra -> partes que casaram
  const raizes = []; // { media, props }
  const raizFonte = []; // { media, valor }
  const fontesIcone = new Set(); // @font-face do swiper-icons (setas)

  // cssText perde o shorthand que usa var() (sai "background-image: ;" etc.). O CSSOM não guarda o valor
  // original quando outra declaração da regra mexe num dos longhands, então ele é lido do texto da folha.
  const SHORTHANDS = ['background', 'font', 'border', 'margin', 'padding', 'inset', 'transition', 'animation',
    'flex', 'gap', 'outline', 'mask', 'text-decoration', 'place-items', 'grid-area', 'grid-template', 'overflow'];
  const textosDasFolhas = new Map();
  const textoDaFolha = (href) => {
    if (!textosDasFolhas.has(href)) {
      const x = new XMLHttpRequest();
      x.open('GET', href, false);
      x.send();
      textosDasFolhas.set(href, x.responseText);
    }
    return textosDasFolhas.get(href);
  };
  const compacto = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([>+~,{}:;()])\s*/g, '$1').trim();
  const textoDe = (r) => {
    const t = r.style.cssText;
    if (!/:\s*;/.test(t)) return t;
    const decl = t.split(/;\s*/).filter((d) => d.trim() && !/:\s*$/.test(d));
    const vazios = t.split(/;\s*/).filter((d) => /:\s*$/.test(d)).map((d) => d.split(':')[0].trim());
    const perdidos = SHORTHANDS.filter((sh) => vazios.some((v) => v.startsWith(sh + '-')));
    const fonte = compacto(textoDaFolha(r.parentStyleSheet.href));
    const sel = compacto(r.selectorText);
    // a regra inteira (não um pedaço de lista de seletores) e o valor com var(), que é o que o CSSOM perde
    let i = fonte.indexOf(sel + '{');
    while (i >= 0 && perdidos.length) {
      const corpo = fonte.slice(i + sel.length + 1, fonte.indexOf('}', i));
      if (i === 0 || '{}'.includes(fonte[i - 1])) perdidos.slice().forEach((sh) => {
        const m = corpo.match(new RegExp(`(?:^|;)${sh}:([^;]+)`));
        if (m && m[1].includes('var(')) { decl.unshift(`${sh}: ${m[1]}`); perdidos.splice(perdidos.indexOf(sh), 1); }
      });
      i = fonte.indexOf(sel + '{', i + 1);
    }
    if (perdidos.length) throw new Error(`Shorthand perdido em "${r.selectorText}": ${perdidos.join(', ')}`);
    return decl.join('; ') + ';';
  };

  function varrer(regras, media) {
    for (const r of regras) {
      if (r.type === CSSRule.MEDIA_RULE) { varrer(r.cssRules, [...media, r.conditionText]); continue; }
      if (r.type === CSSRule.SUPPORTS_RULE) { varrer(r.cssRules, [...media, `@supports ${r.conditionText}`]); continue; }
      if (r.type === CSSRule.FONT_FACE_RULE && /swiper-icons/.test(r.style.getPropertyValue('font-family'))) { fontesIcone.add(r.cssText); continue; }
      if (r.type !== CSSRule.STYLE_RULE) continue;
      const sel = r.selectorText;
      if (/^(:root|html)$/.test(sel.trim())) {
        const props = [...r.style].filter((p) => p.startsWith('--')).map((p) => `${p}: ${r.style.getPropertyValue(p).trim()}`);
        if (props.length) raizes.push({ media, props });
        if (r.style.fontSize && sel.trim() === ':root') raizFonte.push({ media, valor: r.style.fontSize });
        continue;
      }
      // ajuste do cliente: o Sênior não tem destaque na LP; as regras do card copa e da tarja não entram
      const ok = partes(sel).filter((p) => !SEM_USO.test(p) && (casa(p) || (ESTADOS_SWIPER.test(p) && /swiper|planos|plan\b|na-tela|flash/.test(p))));
      if (ok.length) {
        const chave = r;
        const ant = usados.get(chave) || { media, ok: new Set(), texto: textoDe(r) };
        ok.forEach((p) => { ant.ok.add(p); if (casaSecao(p)) ant.ok.add(PROPRIA + p); });
        usados.set(chave, ant);
      }
    }
  }

  const folhas = [...document.styleSheets];
  const passar = () => folhas.forEach((f) => { try { varrer(f.cssRules, []); } catch { /* outra origem */ } });
  // Com um modo só ativo, a home não desenha os botões de modo; dois botões provisórios (um selecionado)
  // fazem as regras deles entrarem no porte, para quando o planos.json ativar mais de um modo.
  const botoes = document.querySelector('#plan .botoes');
  const botoesAntes = botoes.innerHTML;
  botoes.innerHTML = '<button type="button" class="selecionado">A</button><button type="button">B</button>';
  // estado 1: índice
  passar();
  // estado 2: bitcoin (o planosAtivo troca as classes da seção)
  document.querySelector('#plan .seg__option[data-asset="bitcoin"]').click();
  passar();
  document.querySelector('#plan .seg__option[data-asset="indice"]').click();
  botoes.innerHTML = botoesAntes;

  // keyframes usados
  const nomesAnim = new Set();
  for (const { texto } of usados.values()) {
    const m = texto.match(/animation(?:-name)?:\s*([^;]+)/g) || [];
    m.forEach((d) => d.replace(/animation(?:-name)?:\s*/, '').split(',').forEach((a) => a.trim().split(/\s+/).forEach((t) => nomesAnim.add(t))));
  }
  const keyframes = [];
  folhas.forEach((f) => { try { for (const r of f.cssRules) if (r.type === CSSRule.KEYFRAMES_RULE && nomesAnim.has(r.name)) keyframes.push(r.cssText); } catch {} });

  return {
    regras: [...usados.values()].map((u) => ({ media: u.media, seletores: [...u.ok], texto: u.texto })),
    raizes, raizFonte, keyframes: [...new Set(keyframes)], fontesIcone: [...fontesIcone],
  };
});
await nav.close();

// ---------- reescrita ----------
const rem = (t) => t.replace(/(-?\d*\.?\d+)rem\b/g, (_, n) => `calc(${n} * var(--rem))`);
const PROPRIA = '@@secao@@';
const escopo = (sel) => {
  // :where(#planos):is(X) mantém a especificidade de X, como na home
  // (pseudoelemento não entra no :is(); vai para o fim)
  if (sel.startsWith(PROPRIA)) {
    const [, base, pseudo = ''] = sel.slice(PROPRIA.length).match(/^(.*?)(::[\w-]+)?$/);
    return `:where(#planos):is(${base || '*'})${pseudo}`;
  }
  let s = sel.replace(/#plan(?![\w-])/g, '#planos').replace(/header h2/g, 'header .js-plan-title');
  if (!/\.planos(?![\w-])|#planos(?![\w-])/.test(s)) s = `:where(#planos) ${s}`;
  return s;
};
const envolver = (media, corpo) => media.reduceRight((acc, m) => (m.startsWith('@supports') ? `${m} {\n${acc}\n}` : `@media ${m} {\n${acc}\n}`), corpo);
const pct = (v) => (v.endsWith('%') ? `${(16 * parseFloat(v)) / 100}px` : v);

let css = `/* Seção #planos: PORTE da home (section#plan). GERADO por scripts/portar-planos-css.mjs a partir de
   ${HOME} em ${new Date().toISOString().slice(0, 10)}. Não edite à mão: a pele Black fica em planos-black.css.
   - Regras da home que casam com a seção (planosAtivo.css, sectionPlanos.css, sectionPlanosTematico.css,
     button.css, componentes.css, global.css, tokens.css e o CSS do Swiper que vem no pacote da home).
   - Escopo :where(#planos) nas regras que não citam .planos; #plan -> #planos. Regra da home que casa com a
     própria section (ex.: "section", "*") ganha também :where(#planos):is(...).
   - Escala: --rem replica a raiz da home; Xrem -> calc(X * var(--rem)).
   - Sem as regras do card Sênior em destaque (.card--copa, .card-tarja): na LP ele é igual aos outros. */\n\n`;

// raiz de rem e herança da home (html/body: corpo do texto, alinhamento e cor)
css += `#planos {\n  --rem: 8px;\n  font-size: var(--rem);\n  line-height: normal;\n  text-align: center;\n  color: #000;\n}\n`;
// As duas passadas (índice e bitcoin) e as folhas repetidas da home trazem os mesmos blocos: um de cada
const unicos = (blocos) => [...new Set(blocos)].join('\n') + '\n';
css += unicos(resultado.raizFonte.filter((r) => r.media.length).map(({ media, valor }) => envolver(media, `#planos {\n  --rem: ${pct(valor)};\n}`)));
css += '\n/* Tokens da home (moravam no :root), agora só dentro da seção */\n';
css += unicos(resultado.raizes.map(({ media, props }) => envolver(media, `#planos {\n  ${props.map(rem).join(';\n  ')};\n}`)));
css += '\n/* Regras */\n';
for (const r of resultado.regras) {
  const seletores = [...new Set(r.seletores.map(escopo))].join(',\n');
  css += envolver(r.media, `${seletores} {\n  ${rem(r.texto).replace(/;\s*/g, ';\n  ').trim()}\n}`) + '\n';
}
css += '\n/* Fonte de ícones do Swiper (setas), embutida no CSS do Swiper */\n' + resultado.fontesIcone.join('\n') + '\n';
css += '\n/* Animações usadas */\n' + resultado.keyframes.map(rem).join('\n') + '\n';

await writeFile(join(RAIZ, 'css', 'secoes', 'planos.css'), css);
console.log(`planos.css gerado: ${resultado.regras.length} regras, ${resultado.raizes.length} blocos de tokens, ${resultado.keyframes.length} keyframes, raiz: ${resultado.raizFonte.map((r) => `${r.valor}${r.media.length ? ' @' + r.media.join(' ') : ''}`).join(' | ')}`);
