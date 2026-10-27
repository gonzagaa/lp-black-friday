# LP Black Friday Zero7 2026: instruções permanentes

## O que é este projeto

Landing page da Black Friday 2026 da Zero7 Tesouraria, uma mesa proprietária de day trade. É feita em HTML, CSS e JS puros, sem framework e sem etapa de build obrigatória.

A página usa a **identidade da campanha Black** (preto + laranja do brand kit), e não a identidade azul da home. Em compensação, carrega o **DNA de forma** da home: o raio diagonal e o divisor de candles.

A direção visual já foi aprovada e está em `_referencia/`. Comece pelo `_referencia/README.md`.

## Fluxo de trabalho (obrigatório)

1. O trabalho está dividido em fases em `PROMPTS-LP-BLACK.md`. **Faça somente a fase que foi pedida.**
2. Ao terminar a fase:
   - rode as capturas;
   - escreva o relatório em `relatorios/fase-N.md` e repita o resumo no chat;
   - **PARE**.
3. Só comece a fase seguinte depois de receber, por escrito, **"Fase N aprovada"**. Se vierem correções, aplique, gere um novo relatório e pare de novo.
4. Faça um commit por fase, com a mensagem `fase N: <resumo>`. Correções da mesma fase vão em commits `fase N (ajuste): ...`.
5. Se algo exigir uma decisão que não está escrita (um texto, um dado, um comportamento), **pergunte e não invente**. Registre a pergunta no relatório.

## Fontes da verdade (em ordem)

1. `_referencia/copy/LPBlack.html`: a copy. Os textos são lei.
2. `_referencia/prints/`: como a página tem que ficar.
3. `_referencia/canvas/*.dc.html`: o CSS desses arquivos traz os valores exatos aprovados.
4. `../Zero7/`: a home oficial (planos, lógica de preços, rodapé). **Só leitura. Nunca altere nada fora desta pasta.**

### Hero aprovada na Fase 2 (vale por cima do print 01 e do canvas)

O cliente ajustou a hero depois do print. As próximas fases partem destes valores, não dos do `01-hero-desktop.png`:

- Altura: `min-height: clamp(640px, 82svh, 860px)` no desktop e `clamp(620px, 86svh, 740px)` no mobile. O conteúdo pode fazer a hero crescer (em 1440 × 900 ela tem 825 px).
- Arco do planeta: na variável `--arco` (`css/secoes/topo.css`): 150 px acima da base no desktop e 144 px no mobile. Brilho e raios derivam dela. Qualquer seção que encoste na hero (ex.: a sobreposição dos benefícios) usa `--arco`, nunca um número fixo.
- H1: "A maior black" / "da história." em todas as larguras, com a luz em "da história." inteiro. Selo com `top: -.05em` e `margin-left: -.1em`; a linha 2 é deslocada .41em para a esquerda.
- CTA da hero: `.fbtn--escuro` a partir de 768 px (laranja no mobile).
- Sem contador na hero (o módulo `js/modulos/contador.js` está guardado; a decisão sobre a barra mobile fica para a Fase 6).

### Planos (Fase 4 refeita: porte da home + ajustes do cliente; vale por cima do canvas e do print 05)

- Layout é o da home **portado literalmente**: HTML (`scripts/portar-planos-html.mjs`), CSS (`css/secoes/planos.css`, GERADO por `scripts/portar-planos-css.mjs`; não edite à mão) e JS (`js/modulos/home/`). A pele fica só em `css/secoes/planos-black.css`. Aceite: `node scripts/medir-planos.mjs` (home × LP, ±2 px).
- Seção preta e neutra: o laranja aparece só nas etiquetas 3D (`22-etiqueta-de-oferta`, exceção à regra 8) e nos CTAs. Nenhum card tem destaque; o Sênior só é o slide inicial (`data-inicial`).
- Preço: valores em branco; "12x", "ou" e "à vista" em branco .42 (20 px bold, texto grande: 4:1 sobre o card).
- Cards com o raio da home (`30px 30px 30px 0`), não o da regra 4.
- CTAs dos cards: o `.fbtn` laranja (degradê da marca) na caixa do `.z7-btnx` da home (largura total, 70 px, raio 20px 0). O `.fbtn--escuro` (tokens `--escuro-*`) existe só no CTA da hero a partir de 768 px.
- Degradê da marca: todo laranja cheio usa `--grad-marca` + `--grad-marca-brilho` e a `--sombra-material` (`tokens.css`); textos laranja, topos dos candles e o selo da hero não mudam.
- Título bicolor como o dos benefícios: "80% OFF para garantir" em branco e "o seu plano perfeito." em branco .42 (linha própria a partir de 768 px).
- Loop do carrossel só com cards suficientes (≥ 2 × slidesPerView). Com menos (o Bitcoin), sem loop, cards centralizados, setas escondidas quando todos cabem, indicadores com o nome de cada plano e ordem do `planos.json` (aqui NÃO se replica o defeito da home).

### Comunidade, fechamento e rodapé (Fase 5)

- Comunidade: cabeçalho no padrão de título de seção (centralizado a partir de 768 px, Jakarta, bicolor: "Faça parte da comunidade com mais de 19 mil traders" em branco e o resto em branco .42). Sem o bloco "19K". Mídia no array `MIDIA` de `js/modulos/comunidade.js`; o arquivo de vídeo de um card só é pedido quando ele vai tocar.
- Fechamento: a logo da campanha é o Motion V02 do brand kit portado (`scripts/portar-motion-logo.mjs` gera `motion-logo-core.js` e `motion-logo-cena.js`; não edite os gerados). Quadro final = `assets/marca/completa-escuro.svg` (idêntico, pixel a pixel).
- Rodapé: textos e links iguais aos da home (`node scripts/diff-rodape.mjs`); o selo do Reclame Aqui usa o mesmo script da home, sem alteração.

## Regras invioláveis

1. **Copy.** Use os textos da copy palavra por palavra, incluindo pontuação. Os textos que não vieram da copy estão listados na seção "Textos a aprovar" do `PROMPTS-LP-BLACK.md`. Pode usá-los, mas sinalize no relatório.
2. **Planos.** O layout é igual ao da home e só muda a pele. Preço, checkout, modo e prazo vêm do `planos.json`. **Nunca escreva URL de checkout ou preço fixo no HTML.**
3. **Cor.** O preto domina (cerca de 82%), o branco conduz e o laranja `#FF6A1A` aparece **só** nestes pontos:
   - CTA;
   - preço ("12x", "ou", "à vista");
   - um destaque por seção;
   - luz do horizonte e do eclipse;
   - topo dos candles;
   - aba ativa;
   - números dos cards de benefício;
   - selo de desconto.

   O vermelho `#E52B24` entra só no fim de degradês. O amarelo `#FFC83D` é só luz: brilho interno do botão e foco.
4. **Forma: raio diagonal da Zero7.** Botões, nav e pílulas usam `16px 0`. Cards usam `24px 24px 24px 0`. A seta do botão fica na "gota" `999px 0 999px 999px`. O palco da comunidade usa `40px 0 40px 0`. Chips usam `8px`. Não use cantos iguais nos quatro lados, a não ser em chips e no seletor de mercado (pílula).
5. **Fundo nunca liso.** Toda seção tem textura: grão global, grade de 72 px com máscara, linhas de gráfico ou luz.
6. **Transição nunca seca.** Entre seções use sempre uma destas: horizonte (o planeta vira o fundo da próxima seção), candles (a seção sobe recortada), picote de ingresso ou fusão por máscara ou degradê.
   - Exceção aprovada pelo cliente: fechamento → rodapé é fusão de cor (o fechamento termina na base #050404, a mesma do rodapé) com uma única linha fina (`border-top: 1px rgba(255,255,255,.06)` no rodapé), sem candles e sem marca d'água.
7. **Tipografia.**
   - Plus Jakarta Sans 800 para o H1 da hero, os **títulos de seção (h2)** e a frase do fechamento. Nos títulos de seção: caixa normal (sem uppercase), letter-spacing `-.04em`, line-height 1.02, `clamp(38px, 4.6vw, 64px)` e `text-wrap: balance`. Use `.titulo-secao` (`css/componentes.css`), com uma parte do título numa segunda cor (branco .42 ou o laranja do destaque da seção).
   - Barlow Condensed 700–900 em caixa alta só para títulos de card, nomes de plano, rótulos, números e botões de aba. Títulos de card: `clamp(34px, 3vw, 44px)` nos cards largos e `clamp(26px, 2.1vw, 30px)` nos normais (`--fs-card-destaque` e `--fs-card`). O título de seção fica ~1,5× o título de card largo, com outra fonte.
   - Cabeçalho de seção (rótulo, título e subtítulo): `.cabecalho-secao`, centralizado a partir de 768 px (max-width 900, margin-inline auto) e alinhado à esquerda abaixo de 768 px.
   - Inter 400–600 para o corpo do texto.
   - O ponto final depois de palavra em Jakarta leva `margin-left: -.07em`, porque a fonte deixa um vão.
8. **3D com parcimônia.** Os elementos 3D do brand kit aparecem só onde o protótipo usa: benefícios 01, 04 e 08 e o card Academy. Nada de 3D decorativo flutuando.
9. **Acessibilidade.**
   - Área de toque de no mínimo 44 × 44 px.
   - `:focus-visible` desenhado em tudo que recebe foco.
   - Contraste de 4,5:1 no texto.
     - Exceção consciente, aprovada pelo cliente: o `.fbtn` mantém o texto branco sobre o degradê da marca (`--grad-marca` + `--grad-marca-brilho`, `tokens.css`). Medido pixel a pixel atrás do rótulo: no mínimo 3,07:1 (hero mobile) e 3,10–3,19:1 nos outros (nav, benefícios, planos, fechamento); mediana ~3,7:1. Não use essa exceção em nenhum outro texto, e remeça (`fbtn`) se mudar o degradê.
   - `prefers-reduced-motion` desliga toda animação que não for essencial.
   - Use HTML semântico: `button` para ação, `a` para navegação.
10. **Performance.**
    - Imagens em AVIF/WebP com `width`/`height` e `loading="lazy"` abaixo da dobra.
    - Fontes locais em woff2, com preload só das usadas na hero.
    - Sem bibliotecas pesadas: o carrossel usa CSS scroll-snap e JS próprio, sem Swiper, GSAP ou Lenis.
      - Exceção aprovada pelo cliente: rolagem suave com o Lenis 1.1.14, como na home (`vendor/lenis-1.1.14/`, `js/modulos/rolagem.js`): carregado depois do load, em idle, e desligado com movimento reduzido. Modais e o menu levam `data-lenis-prevent`.
      - Exceção aprovada pelo cliente: a seção de planos usa o Swiper 11.2.10 da home (`vendor/swiper-11.2.10/`, carregado sob demanda depois do load, em idle), porque o carrossel é portado literalmente da home. Só ali.
    - Metas: LCP < 2,5 s no mobile, CLS < 0,05, primeira dobra < 800 KB.
11. **Tracking e terceiros.** Não adicione GTM, Pixel ou similares sem pedido explícito. O selo do Reclame Aqui entra igual à home (Fase 5).
12. **Datas e números de negócio.** A data de término do contador e qualquer número que não esteja na copy ficam em `js/config.js` como constantes com `// TODO: confirmar`. Liste todos no relatório.

## Verificação

- **Publicação:** https://zero7.com.br/a-maior-black/. Todo caminho é relativo (nada começa com "/"): CSS, JS, módulos, imagens, vídeos, fontes, vendor, dados. Teste com `node scripts/servir-subpasta.mjs` (http://localhost:5502/a-maior-black/; fora da subpasta tudo dá 404) e confira a aba de rede sem 404.

- `npm run dev` sobe a página em **http://localhost:5501**. Use sempre esta porta: o revisor abre a página nesse endereço, no navegador.
- `npm run shots -- <rotulo>` captura a página inteira em 360, 390, 768, 1024, 1280, 1440 e 1920 px e salva em `shots/<rotulo>/`.
- Toda fase termina comparando as capturas com `_referencia/prints/`. Aponte você mesmo, no relatório, onde a página ainda diverge do protótipo.

## Formato do relatório de cada fase

```
# Fase N: <nome>
## O que foi feito
## Arquivos criados/alterados
## Capturas (caminhos em shots/fase-N/)
## Conferência com a referência (o que bate, o que diverge e por quê)
## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)
## Textos a aprovar usados nesta fase
## Perguntas / pendências
Aguardando aprovação para a Fase N+1.
```
