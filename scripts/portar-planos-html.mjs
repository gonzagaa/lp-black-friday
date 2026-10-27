// Porta o HTML da section#plan da home (../Zero7/index.html, só leitura) para a seção #planos do index.html.
// Uso: node scripts/portar-planos-html.mjs
// Transformações (todas documentadas no relatório da Fase 4):
// - id plan -> planos (âncoras da LP); classes de divisor da home -> .div-candles (transição da LP)
// - saem as imagens de fundo e o cupom; no lugar do cupom entra o cabeçalho de seção da LP
// - o título do mercado vira h3 (o h2 da seção é o título "80% OFF ...")
// - saem os data-aos (a LP não usa AOS) e a nota da Profit One (P4)
// - preços, "Máximo de dias" e checkout saem do HTML (regra 2): o planos.json preenche
// - o CTA perde role="button" e href="" (é link de navegação; sem href até o JSON chegar)
// - cada card ganha a etiqueta 3D de oferta e um rótulo acessível com o desconto
// - ajuste do cliente: o Sênior perde o destaque (sai a tarja, a bandeira e a classe .card--copa). Ele só
//   continua sendo o slide inicial, marcado com data-inicial (o carrossel lê esse atributo)
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const home = await readFile(join(RAIZ, '..', 'Zero7', 'index.html'), 'utf8');
const ini = home.indexOf('<section id="plan"');
let s = home.slice(ini, home.indexOf('</section>', ini) + '</section>'.length);

const cabecalho = `<div class="cabecalho-secao planos__cabecalho">
          <span class="tag">Planos Black Friday</span>
          <h2 class="titulo-secao planos__h2" id="planos-titulo">80% OFF para garantir <span>o seu plano perfeito<span class="ponto">.</span></span></h2>
        </div>`;

const etiqueta = `<img class="card-etiqueta" src="assets/3d/22-etiqueta-de-oferta-320.webp" srcset="assets/3d/22-etiqueta-de-oferta-320.avif" width="320" height="616" alt="" loading="lazy" decoding="async">`;

const trocas = [
  [/<section id="plan" class="planos tema secao--divisor-candles secao--divisor-desce" data-asset="indice">/, '<section id="planos" class="planos tema div-candles" data-asset="indice" aria-labelledby="planos-titulo">'],
  [/\s*<img [^>]*class="bg [^>]*>/g, ''],
  [/<div class="planos-topo-grid">[\s\S]*?<\/div>\s*<\/div>\s*(?=\n\s*<div class="planos-topo-conteudo")/, `<div class="planos-topo-grid">\n        ${cabecalho}\n      </div>\n`],
  [/ data-aos="[^"]*"/g, ''],
  [/<h2 class="js-plan-title">([^<]*)<\/h2>/, '<h3 class="js-plan-title">$1</h3>'],
  [/\s*<p class="obs">[\s\S]*?<\/p>/g, ''],
  [/(<span class="js-old-price">)[^<]*(<\/span>)/g, '$1&nbsp;$2'],
  [/(<p class="js-price-parcel"><span>12x<\/span>)[^<]*(<\/p>)/g, '$1 &nbsp;$2'],
  [/(<p class="js-price-avista"><span>ou<\/span>)[^<]*(<span>à vista<\/span><\/p>)/g, '$1 &nbsp; $2'],
  [/(<span class="chip__valor js-max-dias">)[^<]*(<\/span>)/g, '$1&nbsp;$2'],
  [/<a target="_blank" rel="noopener" href="" class="z7-btnx js-checkout([^"]*)" role="button"/g, '<a target="_blank" rel="noopener" class="z7-btnx js-checkout$1"'],
  // etiqueta 3D logo depois da aba do título, e o desconto no rótulo acessível do card
  [/(<div class="card swiper-slide[^"]*" data-plan="[^"]*")>/g, '$1 aria-label="80% de desconto">'],
  [/(<div class="title"><h3>[^<]*<\/h3><\/div>)/g, `$1\n            ${etiqueta}`],
  // Sênior sem destaque (ajuste do cliente)
  [/<div class="card swiper-slide card--copa"( data-plan="senior")/, '<div class="card swiper-slide"$1 data-inicial'],
  [/\s*<div class="card-copa-flag"[^>]*><\/div>/, ''],
  [/\s*<div class="card-tarja">[^<]*<\/div>/, ''],
  // seta do CTA: o SVG de traço 2,4 px do .fbtn no lugar do caractere "→" (ajuste do cliente nos botões escuros)
  [/<span class="z7-btnx__arrow btn__arrow">→<\/span>/g, '<span class="z7-btnx__arrow btn__arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'],
];
// data-cta="plano-{chave}" em cada CTA (para configurar o tracking depois, P7): a chave é a do data-plan do card
trocas.push([/(data-plan="([^"]+)"[\s\S]*?)<a target="_blank" rel="noopener" class="z7-btnx js-checkout/g, '$1<a data-cta="plano-$2" target="_blank" rel="noopener" class="z7-btnx js-checkout']);
// "Limite de perda total": o efeito de alta que a home já teve (script/limiteAlta.js e css/limiteAlta.css, commit
// 5bedb6b; a marcação no .chip é a do commit 750f810, e a home a tirou dos cards em 5665cd4), com a pele da Black.
// Aqui só a estrutura, sem valor: o padrão (o da home) e o da Black vêm do planos.json (limitePerdaTotal) e são
// escritos por js/modulos/limite-alta.js. A seta tem o espaço reservado desde o início (CLS 0).
trocas.push([
  /<div class="chip"><span class="chip__rotulo">Limite de perda total<\/span><span class="chip__valor">[^<]*<\/span><\/div>/g,
  '<div class="chip limite-alta"><span class="chip__rotulo">Limite de perda total</span><span class="chip__valor"><span class="limite-alta__seta"><svg width="10" height="8" viewBox="0 0 10 8" role="img" aria-label="Aumentou"><path d="M5 0 10 8H0z"/></svg></span><span class="limite-alta__valor">&nbsp;</span></span></div>',
]);
for (const [de, para] of trocas) {
  const antes = s;
  s = s.replace(de, para);
  if (s === antes) throw new Error(`Troca sem efeito: ${de}`);
}

const comentario = `<!-- PLANOS: PORTE da section#plan da home (../Zero7/index.html), gerado por scripts/portar-planos-html.mjs.
         CSS da home em css/secoes/planos.css (gerado) e a pele Black em css/secoes/planos-black.css.
         Preços, checkout, modo e prazo vêm do planos.json (js/modulos/home/blackPlanos.js). -->\n    `;

const pagina = await readFile(join(RAIZ, 'index.html'), 'utf8');
const a = pagina.indexOf('<!-- PLANOS:');
const b = pagina.indexOf('</section>', pagina.indexOf('<section id="planos"')) + '</section>'.length;
if (a === -1 || b < a) throw new Error('não achei a seção #planos atual no index.html');
await writeFile(join(RAIZ, 'index.html'), pagina.slice(0, a) + comentario + s + pagina.slice(b));
console.log(`#planos substituída: ${(s.match(/data-plan=/g) || []).length} cards, ${(s.match(/chip__rotulo/g) || []).length} chips.`);
