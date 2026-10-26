# Fase 1: Fundação

## O que foi feito

Base da LP pronta. Nenhuma seção foi montada: o `index.html` tem só o esqueleto, e os componentes estão na vitrine `componentes.html`.

**Onde ver agora:** http://localhost:5501 (página vazia) e http://localhost:5501/componentes.html (vitrine). A 5500 está ocupada pelo live-server de outro projeto ("De Desprezado a Respeitado"). Por decisão do Gustavo, ele continua de pé e a Black roda na 5501 por enquanto. O `npm run dev` continua configurado para a 5500, como pede a especificação: quando a porta estiver livre, é só rodá-lo.

1. **Controle de versão.** Rodei `git init` e criei o `.gitignore` com `node_modules/`, `shots/` e `_brandkit/`.
2. **Estrutura.** Todas as pastas e arquivos da lista. Os CSS de `css/secoes/` têm uma linha de comentário cada (topo, beneficios, planos, comunidade, fechamento, rodape) e já estão ligados no `index.html`. As pastas ainda vazias (`js/modulos/`, `assets/video/`, `assets/img/`) levam um `.gitkeep`.
3. **Ferramentas.** As devDependencies são sharp 0.35.5, playwright 1.64.1 e live-server 1.2.2, mais os três pacotes do @fontsource. Scripts: `dev`, `imagens`, `shots` e um extra, `fontes` (ver "Decisões"). O Chromium do Playwright (build 1248) já estava instalado, então não precisei rodar `playwright install`.
4. **Fontes locais.** Descompactei o `02-Tipografia.zip` em `_brandkit/tipografia/`. Ele traz só TTF (Barlow Condensed 800 e 900 e Inter variável), **nenhum woff2 e nenhuma Plus Jakarta Sans**, então os 6 woff2 vieram do @fontsource, subset latin: Jakarta 700 e 800, Barlow 700, 800 e 900 e Inter variável. Copiei as licenças OFL das três famílias para `assets/fonts/`. O `@font-face` (em `base.css`) usa `font-display: swap`. O preload no `index.html` é só da Jakarta 800 e da Inter.
5. **Assets** (`npm run imagens`, que pode ser rodado de novo e sempre sobrescreve):
   - os 24 PNGs 3D foram cortados pela caixa do alfa (> 0), sem sobra transparente, e saíram em AVIF e WebP com 320 e 640 px de largura, com nomes em kebab-case (o " (1)" do nome do 09 caiu): 96 arquivos;
   - SVGs da marca copiados;
   - `zero7-branco.svg` gerado a partir de `../Zero7/assets/logo zero7.svg`: os 5 `fill` ficaram `#ffffff` e o degradê azul (`<defs>`) foi removido;
   - os avif de pagamento 1 a 6 e as texturas foram copiados.
6. **Tokens** (`css/tokens.css`): cores, raios, espaços (múltiplos de 4), container e gutter, as três famílias, a escala do protótipo, a curva e as durações. Acrescentei só `--cor-tinta: #0a0706` (o texto escuro sobre laranja que o protótipo usa no selo do plano).
7. **Componentes** (`css/componentes.css`): `.fbtn` (com `--sm` e `--block`), `.lbtn`, `.ibtn`, `.tag`, `.card-z` (com `__n`, `__t`, `__d` e `__3d`), `.selo-hero`, `.selo-plano`, `.div-candles`, `.div-picote` e `.grade`. O `.grao` ficou em `base.css`, como pede a estrutura.
8. **Selo.** Há um único `<symbol id="selo-serrilhado">` (o polígono de 36 pontos) no `index.html`, junto com os três degradês (`#selo-hero-cor`, `#selo-hero-brilho` e `#selo-plano-cor`), num sprite que não usa `display:none` (senão os degradês somem). Para usar: `<svg><use href="#selo-serrilhado" fill="url(#selo-hero-cor)"/></svg>`.
9. **Dados e JS.** `data/planos.json` é a cópia de hoje de `../Zero7/script/planos.json` (o `cmp` confirmou que é idêntica). O `js/config.js` tem `BLACK_FIM` e `PLANOS_URL` com `// TODO: confirmar`, e o `js/main.js` só marca `<html class="js">`.

### Decisões que tomei (confira)

- **`scripts/fontes.mjs` + `npm run fontes`.** A cópia das fontes ficou num script próprio, para não misturar com o de imagens. Ele procura woff2 no kit primeiro e só depois usa o @fontsource.
- **`shots.mjs` faz mais do que capturar.** Ele aceita `--porta=` (por causa da 5500 ocupada), rola a página inteira antes da captura (sem isso, as imagens com `loading="lazy"` não apareciam nas larguras pequenas) e lista erros de console, requisições externas, fontes baixadas e scroll horizontal em cada largura.
- **Rótulo das capturas: `fase-1`**, a convenção `shots/fase-N/` do CLAUDE.md, e não `fase1` como no comando de aceite.
- **`.fbtn`:**
  - a varredura de luz anima só na ida. No protótipo ela também anima na volta, então varria de novo ao tirar o mouse, e o pedido é "atravessa uma vez";
  - criei o `:active` (volta ao lugar e a moldura apaga), que o protótipo não define;
  - em ≤ 600 px, o botão usa os valores do `Mobile.dc.html` (58 px de altura e rótulo de 14 px).
- **`.card-z`:** a linha de luz do topo acende por opacidade. O protótipo troca o `background` com degradê, e degradê não anima.
- **`.ibtn` desabilitado:** criei o estado (apagado e sem relevo), útil para as setas no fim de um carrossel. O protótipo não define.
- **Vitrine:**
  - ela não duplica o selo: busca o sprite do `index.html`;
  - os estados congelados (hover, foco, ativo) são cópias automáticas das regras reais, feitas por script, então não divergem do CSS de produção;
  - o hover do `.fbtn` mostra a varredura parada no meio, como na prancha 04.
- **`index.html`:** título provisório, favicon vazio (`data:,`, para evitar o 404 do `/favicon.ico`) e `color-scheme: dark`. A nav vai para o `#topo` na Fase 2.

## Arquivos criados/alterados

Criados (nenhum arquivo fora desta pasta foi alterado):

- `.gitignore`, `package.json`, `package-lock.json`
- `index.html`, `componentes.html`
- `css/tokens.css`, `css/base.css`, `css/componentes.css`
- `css/secoes/topo.css`, `beneficios.css`, `planos.css`, `comunidade.css`, `fechamento.css`, `rodape.css`
- `js/config.js`, `js/main.js`, `js/modulos/.gitkeep`
- `data/planos.json`
- `scripts/imagens.mjs`, `scripts/fontes.mjs`, `scripts/shots.mjs`
- `assets/fonts/` (6 woff2 + 3 licenças), `assets/3d/` (96), `assets/marca/` (5), `assets/pagamento/` (6), `assets/texturas/` (3), `assets/video/.gitkeep`, `assets/img/.gitkeep`
- `relatorios/fase-1.md`
- fora do git: `_brandkit/tipografia/` (zip descompactado)

### Peso de cada arquivo gerado

**Elementos 3D** (96 arquivos, 2.323,4 KB no total; a LP só vai usar 19, 11 e 17, e no máximo um tamanho de cada por tela):

| Elemento | 320 AVIF | 320 WebP | 640 AVIF | 640 WebP |
|---|---:|---:|---:|---:|
| 01-moeda-zero7 | 9,1 KB | 16,3 KB | 21,7 KB | 41,6 KB |
| 02-pilha-de-moedas | 11,1 KB | 19,4 KB | 30,3 KB | 55,2 KB |
| 03-candles-de-trade | 9,2 KB | 15,7 KB | 19,6 KB | 34,8 KB |
| 04-volume-e-tendencia | 10,9 KB | 18,1 KB | 25,6 KB | 42,2 KB |
| 05-touro-do-mercado | 9,3 KB | 15,6 KB | 20,4 KB | 35,7 KB |
| 06-urso-do-mercado | 10,7 KB | 16,4 KB | 25,0 KB | 38,8 KB |
| 07-seta-de-alta | 8,0 KB | 11,5 KB | 17,4 KB | 27,0 KB |
| 08-seta-de-baixa | 7,0 KB | 10,2 KB | 14,6 KB | 23,0 KB |
| 09-alvo-de-precisao | 9,5 KB | 16,9 KB | 22,2 KB | 39,6 KB |
| 10-escudo-zero7 | 11,5 KB | 19,1 KB | 27,0 KB | 47,1 KB |
| 11-cofre-de-capital | 7,0 KB | 12,4 KB | 15,5 KB | 28,7 KB |
| 12-cadeado-zero7 | 12,0 KB | 21,1 KB | 31,8 KB | 58,8 KB |
| 13-painel-de-trade | 7,1 KB | 11,8 KB | 16,7 KB | 28,3 KB |
| 14-cronometro | 12,2 KB | 22,2 KB | 28,0 KB | 55,6 KB |
| 15-ampulheta | 18,5 KB | 35,7 KB | 47,4 KB | 95,6 KB |
| 16-tecla-reiniciar | 7,9 KB | 12,9 KB | 17,5 KB | 28,5 KB |
| 17-cavalo-de-estrategia | 14,2 KB | 24,9 KB | 42,7 KB | 73,8 KB |
| 18-selo-de-conquista | 10,8 KB | 19,2 KB | 24,5 KB | 45,8 KB |
| 19-percentual | 14,6 KB | 22,8 KB | 32,9 KB | 55,5 KB |
| 20-presente-black | 10,0 KB | 16,5 KB | 26,1 KB | 42,3 KB |
| 21-raio-de-oportunidade | 10,6 KB | 17,3 KB | 23,5 KB | 41,4 KB |
| 22-etiqueta-de-oferta | 12,9 KB | 21,6 KB | 29,7 KB | 55,8 KB |
| 23-cartao-de-acesso | 6,3 KB | 9,5 KB | 12,8 KB | 20,7 KB |
| 24-cursor-de-execucao | 10,4 KB | 16,3 KB | 22,7 KB | 37,3 KB |

**Fontes, marca, pagamento e texturas** (23 arquivos, 346,7 KB no total):

| Arquivo | Peso |
|---|---:|
| assets/fonts/plus-jakarta-sans-latin-700-normal.woff2 | 12,0 KB |
| assets/fonts/plus-jakarta-sans-latin-800-normal.woff2 | 11,6 KB |
| assets/fonts/barlow-condensed-latin-700-normal.woff2 | 21,9 KB |
| assets/fonts/barlow-condensed-latin-800-normal.woff2 | 21,9 KB |
| assets/fonts/barlow-condensed-latin-900-normal.woff2 | 21,5 KB |
| assets/fonts/inter-latin-wght-normal.woff2 | 47,1 KB |
| assets/fonts/OFL-plus-jakarta-sans.txt | 4,4 KB |
| assets/fonts/OFL-barlow-condensed.txt | 6,0 KB |
| assets/fonts/OFL-inter.txt | 4,4 KB |
| assets/marca/completa-claro.svg | 35,8 KB |
| assets/marca/completa-escuro.svg | 35,8 KB |
| assets/marca/lettering-claro.svg | 3,0 KB |
| assets/marca/lettering-escuro.svg | 3,0 KB |
| assets/marca/zero7-branco.svg | 2,8 KB |
| assets/pagamento/1.avif | 3,2 KB |
| assets/pagamento/2.avif | 2,4 KB |
| assets/pagamento/3.avif | 3,2 KB |
| assets/pagamento/4.avif | 3,5 KB |
| assets/pagamento/5.avif | 5,3 KB |
| assets/pagamento/6.avif | 2,3 KB |
| assets/texturas/candles-mask.svg | 8,7 KB |
| assets/texturas/candles-tops.svg | 9,9 KB |
| assets/texturas/grain.png | 77,0 KB |

Fontes da hero (preload): 58,7 KB (Jakarta 800 + Inter).

## Capturas (caminhos em shots/fase-1/)

Comando: `npm run shots -- fase-1 --pagina=componentes --porta=5501`

- `shots/fase-1/360.png`, `390.png`, `768.png`, `1024.png`, `1280.png`, `1440.png`, `1920.png`: a vitrine inteira em cada largura.
- `shots/fase-1/comparacao-botao.png`: o `.fbtn` ao lado do botão do `01-hero-desktop.png`, ampliado 2×.

Não capturei o `index.html`: nesta fase ele é uma página preta vazia.

## Conferência com a referência (o que bate, o que diverge e por quê)

**Botão × `01-hero-desktop.png`** (`comparacao-botao.png`): **bate**.
- Medidas: 275,8 × 62 px na vitrine; no print, o corpo laranja começa em x=583 e o botão inteiro também tem cerca de 276 px.
- Visual: o mesmo degradê vertical, a mesma moldura de vidro seguindo o raio `16px 0`, o mesmo brilho âmbar na base, o mesmo rótulo em Jakarta 700 caixa alta e a mesma gota branca com a seta laranja.
- A `.fbtn--sm` tem rótulo de 13 px com tracking .12em, mais espaçado que o do botão grande, como o "APROVEITAR" da nav no print.
- Única diferença: o fundo atrás do botão (céu da hero no print, caixa da vitrine aqui).

**Vitrine × `04-sistema-visual.png`:**
- **Botões: bate.** Normal e hover iguais à prancha, com a varredura parada no meio no hover. Também mostro foco, ativo, `--sm`, `--block`, `.lbtn` e `.ibtn` em todos os estados.
- **Raios: bate.** Mesmas amostras e medidas (16 0, 24 24 24 0, gota, 40 0 40 0), mais `--raio-sm` e `--raio-chip`.
- **Selo do plano: bate** no desenho (serrilha, degradê, anel tracejado, 12°). Diferença de tamanho: a prancha mostra o selo com 84 px e texto de 25 px, mas a fase pede 74 px e 22 px (os valores do `Main.dc.html`), e foi o que usei.
- **Divisores: bate.** Candles com topos acesos e picote com linha tracejada, usando as mesmas cores de bloco da prancha.

**Onde a prancha 04 e o `Main.dc.html` divergem, e qual segui** (sempre o Main, que é a página):
- `.lbtn`: na prancha o sublinhado aparece inteiro e o texto branco. No Main ele começa em 35% e cresce no hover, com o texto a 78%, que é o que a fase descreve ("cresce no hover");
- linha do picote: `.18` na prancha, `.14` no Main;
- a prancha usa grade de 36 px na caixa dos botões; a LP usa 72 px.

## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)

**Vitrine** (`npm run shots`, Chromium, `prefers-reduced-motion: reduce`):

| Largura | Scroll horizontal | Erros no console | Requisições externas |
|---|---|---|---|
| 360 | não | 0 | 0 |
| 390 | não | 0 | 0 |
| 768 | não | 0 | 0 |
| 1024 | não | 0 | 0 |
| 1280 | não | 0 | 0 |
| 1440 | não | 0 | 0 |
| 1920 | não | 0 | 0 |

- **Fontes baixadas:** as 6, todas de `localhost` (nenhuma requisição ao Google Fonts ou a qualquer outro domínio).
- **`index.html`** (Playwright, 1440 px):
  - console: só `[log] Live reload enabled.`, que é do próprio live-server, sem nenhum erro ou aviso;
  - requisições: todas para `localhost` e todas com 200 (documento, 9 CSS, `main.js`, as 2 fontes pré-carregadas e o `grain.png`);
  - DOM: `lang="pt-BR"`, `theme-color #070607`, seções `topo, beneficios, planos, comunidade, fechamento` nessa ordem, `footer#rodape`, um `symbol#selo-serrilhado` com 36 pontos e a classe `.js` aplicada.
  - Possível aviso: como a página ainda não tem texto, o Chrome normal pode mostrar o *aviso* (não erro) "preloaded but not used" para as duas fontes. No Chromium headless ele não apareceu, e some na Fase 2, quando o H1 passar a usá-las.
- `data/planos.json` idêntico ao da home (`cmp`).
- Logo branca: 5 `fill="#ffffff"`, sem `<defs>` e sem `stop-color`.
- Recorte dos 3D conferido a olho no `19-percentual-640` (rente, sem halo).
- `npm audit`: 10 alertas (6 moderados, 4 altos), todos em dependências antigas do live-server. É só ferramenta de desenvolvimento e não sobe para o servidor.

## Textos a aprovar usados nesta fase

- Na vitrine (que não sobe), como amostra dos componentes: os rótulos `.tag` "O pacote da Black", "Planos Black Friday" e "Ecossistema Zero7", o `.lbtn` "Ir direto para os planos" e o `.fbtn--sm` "Aproveitar".
- No `index.html`: o `<title>` provisório "Black Friday Zero7". Ele não está na copy nem na lista de textos a aprovar e será trocado na Fase 6 (título e descrição saem da copy).

## Perguntas / pendências

1. **Contraste do botão principal.** O texto branco sobre o laranja do `.fbtn` dá **2,23:1** no topo (#FF9152), **2,87:1** no meio (#FF6A1A) e **3,52:1** na base (#F2511A). A regra 9 pede 4,5:1, e o rótulo de 15 px não conta como texto grande. O guia do brand kit (`Guia-Tipografico-ZERO7.md`) diz "Para botões laranja, usar texto #070607", que dá **7,06:1**. Copiei o branco, como pede a fase e como está no protótipo aprovado. Mantemos o branco ou trocamos para #070607?
2. **`--cor-texto-4` (branco .45)** dá **4,46:1** sobre #050404, um pouco abaixo de 4,5:1. No protótipo ele aparece em textos pequenos (as letras D, H, M e S do contador e "Termina em"). Subo para .5 (5,33:1) quando esses textos entrarem, ou mantenho?
3. **Constantes com `// TODO: confirmar`** (`js/config.js`):
   - `BLACK_FIM = '2026-11-27T23:59:59-03:00'`: valor provisório, o fim do dia da Black Friday 2026 (P1);
   - `PLANOS_URL = 'data/planos.json'`: o snapshot local; em produção deve apontar para o painel da home (P3).
4. **Grade no mobile.** O `Mobile.dc.html` usa grade de 48 px, e mantive 72 px em todas as larguras, como diz o CLAUDE.md. Confirmar na Fase 6.
5. **"∞" do card 07 (Fase 3).** A Fase 3 pede o símbolo em Barlow Condensed 300, peso que não está na lista de fontes da Fase 1. A decidir na Fase 3: incluir o peso 300 (mais um woff2) ou desenhar o ∞ em SVG.
6. **Porta 5500.** Ocupada pelo live-server de outro projeto. Por enquanto a Black roda em http://localhost:5501.

Aguardando aprovação para a Fase 2.

---

## Ajuste pós-aprovação (commit "fase 1 (ajuste): contraste")

1. **Contraste do `.fbtn`.** O texto continua branco.
   - Por que o exemplo não bastava: o rótulo ocupa de 35% a 63% da altura do botão, e o pior ponto ficava na metade de cima dele, acima do stop do meio (#FF6A1A em 52%). Escurecer só a base (#F2511A → #E2470F) não muda essa faixa: medi e continuou em 2,68:1.
   - O que mudou: o degradê passou a **#FF9152 0% → #FF6A1A 20% → #E2470F 100%**. O stop do meio subiu e a base é a sugerida, então o rótulo cai na faixa mais escura.
   - Contraste mínimo do branco, medido pixel a pixel no fundo renderizado (sem o grão), em 1440 e 390 px:

     | Variação | Caixa do rótulo: antes | Caixa do rótulo: depois | Letras: depois |
     |---|---:|---:|---:|
     | `.fbtn` | 2,67 | 3,08 | 3,15 |
     | `.fbtn--sm` | 2,63 | **3,04** (pior caso) | 3,09 |
     | `.fbtn--block` | 2,67 | 3,06 | 3,13 |

   - Comparação visual (print 01, antes e depois): `shots/fase-1/comparacao-botao-ajuste.png`. O aspecto geral se mantém; o laranja fica um tom mais encorpado embaixo, e o realce do topo, mais curto.
   - O CLAUDE.md, regra 9, agora registra o `.fbtn` como exceção consciente aprovada pelo cliente.
2. **`--cor-texto-4`** passou de branco .45 para **.5** (5,33:1 sobre #050404). A legenda da vitrine foi atualizada.
3. `BLACK_FIM` e `PLANOS_URL` continuam como estão, com `// TODO: confirmar` (P1 e P3).
