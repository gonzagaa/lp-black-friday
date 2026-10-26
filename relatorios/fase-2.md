# Fase 2: Nav + hero

## O que foi feito

Antes desta fase entrou o ajuste aprovado da Fase 1 (commit `fase 1 (ajuste): contraste`): o novo degradê do `.fbtn` (≥ 3:1 em toda a área do rótulo), `--cor-texto-4` em .5 e a exceção registrada na regra 9 do CLAUDE.md. Os detalhes estão no fim de `relatorios/fase-1.md`.

**Onde ver:** http://localhost:5501. A 5500 continua com o servidor do outro projeto. Abra a 5501 direto no navegador, sem o "Go Live" do VS Code.

Esta fase teve duas rodadas de ajustes do cliente, que valem por cima do print 01 (ver "Ajustes do cliente"). O texto abaixo descreve o estado **final**.

### Nav
- Container de 1240 px, padding `10px 10px 10px 22px`, raio `16px 0`, fundo `rgba(6,5,5,.62)` com blur de 16 px e borda `rgba(255,255,255,.1)`.
- À esquerda, o logo da Black (`assets/marca/completa-escuro.svg`, 46 px de altura) com link para `#topo`. À direita, Benefícios, Planos e Comunidade (âncoras), "Área do Trader" e o `.fbtn--sm` "Aproveitar" → `#planos`.
- Sticky: a 18 px do topo com a página parada (como no print) e a 16 px quando gruda.
- Depois de 80 px de rolagem, o fundo vai de .62 para .85.
- Rolagem suave por CSS (`scroll-behavior: smooth`), desligada com movimento reduzido. `scroll-padding-top` evita que a nav cubra o início da seção de destino.
- Abaixo de 900 px, os links e o CTA viram um botão de menu (`.ibtn--sm`, 44 × 44, com `aria-expanded` e `aria-controls`). Ele abre um painel de vidro em tela cheia (`<dialog>` modal) com os mesmos links e o CTA:
  - o foco fica preso no painel, com Tab e Shift+Tab girando dentro dele;
  - Esc, o botão de fechar e o clique na área vazia fecham o painel;
  - ao fechar, o foco volta para o botão de menu. Se o painel fechou por um link de âncora, o foco vai para a seção de destino;
  - o painel trava a rolagem da página e fecha sozinho se a janela passar para 900 px ou mais.

### Hero
- **Horizonte em CSS** com as camadas na ordem do protótipo: `.sky`, `.sky-grid` (grade de 72 px com máscara), `.rays`, `.glow-rise`, 7 `.star`, 2 `.sparkle` e `.planet`. Degradês, box-shadows e as animações `breathe` e `twinkle` são os do protótipo.
- **Posições a partir da base da hero** (variáveis `--arco`, `--brilho-base` e `--raios-base`): o arco fica a 150 px da base no desktop e a 144 px no mobile (ver "Ajustes do cliente").
- **Imagem de IA (P6):** o `<picture>` com `hero-bg-desktop` e `hero-bg-mobile` (avif e webp) está pronto e comentado no HTML, e o CSS do `.hero__fundo` já existe.
- **H1** em Jakarta 800, `clamp(50px, 7.6vw, 116px)` (47 px no mobile), tracking −.045em:
  - quebra em todas as larguras: "A maior black" / "da história." + selo;
  - a luz (degradê de texto e text-shadow) pega "da história." inteiro, e a linha 1 fica branca pura;
  - o ponto final tem `margin-left: -.07em`;
  - selo `.selo-hero` com 1.12em, −12°, "80%" e "OFF" a .33em e `aria-label="80% OFF"`, colado no ponto. Ele entra com a animação `stamp` (0,9 s, atraso de 0,5 s) e depois gira 360° a cada 40 s.
- **Subtítulo** e **CTA** "Aproveitar a Black" → `#planos`. A partir de 768 px o CTA usa a variante nova `.fbtn--escuro`; abaixo disso, o `.fbtn` laranja com largura total.
- **Sem contador** na hero (ajuste do cliente). `BLACK_FIM` continua no `js/config.js`, e o código do contador está isolado e sem uso em `js/modulos/contador.js`.

### Decisões que tomei (confira)

1. **O `<header>` saiu de dentro da hero.** No protótipo a nav fica dentro da `section`, que tem `overflow:hidden`, e assim o sticky não funcionaria fora da hero.
   - Agora o header fica antes do `<main>` (também é o lugar certo do landmark `banner`), com altura fixa (70 px; 62 px no mobile), e a hero sobe por baixo dele com margem negativa.
   - O `body` ganhou `display: flow-root` para a margem do header não "vazar" (senão o grão global começaria 18 px abaixo do topo).
2. **LCP no H1 em todas as larguras.** No protótipo, "história." fica num `inline-block` e vira um bloco de texto próprio; no mobile ele era maior que o resto do H1 e virava o LCP.
   - Agora o trecho da linha 2 é `inline` dentro do H1, e o selo se apoia num "pino" de largura zero colado depois do ponto.
   - O deslocamento óptico da linha 2 também não pode usar `transform` nem `position:relative` (ver o ajuste 5).
3. **Preload da Jakarta 700**, além da 800 e da Inter.
   - Ela é o rótulo dos dois botões da primeira dobra. Sem o preload, o rótulo trocava de fonte depois da pintura e o botão mudava 4 px de largura (CLS).
   - Isso vai além do texto da Fase 1 ("só 800 e Inter"), mas segue a regra 10 do CLAUDE.md (preload das fontes usadas na hero). São 12 KB a mais.
4. **Mobile pelo `Mobile.dc.html`** (é o que gera o print 03):
   - planeta de 1100 × 800 com o topo a 144 px da base;
   - raios, brilho, céu e máscara da grade nos valores do mobile;
   - H1 com line-height 1.02 e gap de 22 px;
   - nav com logo de 38 px e padding de 8 px.

   Mantive as 7 estrelas e os 2 brilhos (o canvas mobile tem 3 estrelas e nenhum brilho) e a grade de 72 px (pendência 4 da Fase 1).
5. **"Área do Trader" abre em nova aba** (`target="_blank" rel="noopener"`), como na home oficial. O protótipo não diz.
6. **Toque de 44 px nos links da nav.** O protótipo tem 42 px (padding de 14 px); mantive o visual e garanti os 44 px.
7. **Painel do menu.** O protótipo não tem esse desenho, então criei um:
   - mesmo vidro da nav, com o grão;
   - o botão de fechar no lugar exato do botão de abrir;
   - links em Barlow 800 caixa alta, com seta e divisórias finas;
   - CTA "Aproveitar" com largura total.

   Capturas em `shots/fase-2/menu-390.png` e `menu-768.png`. **Confira e aprove.**
8. **Bug do protótipo corrigido no contador** (que hoje está fora da página): o shorthand `font:` do `.cd b` zerava o `tabular-nums`, e o contador mudava de largura a cada segundo. A correção fica registrada no `contador.js` para quando ele voltar.

## Ajustes do cliente

### 1ª rodada (botão escuro, quebra do H1, altura, sem contador)

Capturas lado a lado: `shots/fase-2/ajustes/antes-depois-1440x900.png`, `antes-depois-1920x1080.png` e `antes-depois-390x844.png` (e as avulsas `antes-*` e `depois-*` na mesma pasta).

1. **Botão da hero no desktop: `.fbtn--escuro`.**
   - Corpo fumê, luz laranja que percorre a borda (`@property --ang`, degradê cônico recortado na borda de 1 px, 3,6 s, desligada com movimento reduzido) e seta `#0a0706` na gota laranja.
   - No hover, o botão sobe 2 px, a borda acende, a varredura atravessa e a seta avança 3 px. Valores exatamente os do pedido.
   - A variante só vale a partir de 768 px (as regras dela estão dentro de `@media (min-width: 768px)`). Abaixo disso, o mesmo botão é o `.fbtn` laranja.
   - Os outros botões (nav e os das próximas fases) não mudam. Está na vitrine, sobre um fundo de luz, com normal, hover, foco e ativo.
   - Contraste do rótulo: o branco sobre o fumê passa de 14:1, então a exceção da regra 9 não se aplica a esse botão.
2. **Quebra do H1:** "A maior black" / "da história." + selo em todas as larguras.
3. **Altura da hero.**
   - Desktop: `min-height: clamp(640px, 82svh, 860px)`. Mobile: `clamp(620px, 86svh, 740px)`.
   - Padding acima do H1: de 110 para 72 px no desktop e de 150 para 128 px no mobile, proporcional à redução da altura.
   - **Onde não deu para seguir o 82svh à risca:** em 1440 px o conteúdo (nav, H1 de 109 px em duas linhas, subtítulo e CTA) ocupa cerca de 480 px. Para o CTA ficar fora da parte mais quente do brilho, a base dele precisa ficar a pelo menos 175 px do centro do brilho (é onde ficava o contador aprovado no print 01). Por isso:
     - o arco desceu de 210 para **150 px** da base. Os mesmos degradês e a mesma intensidade continuam; só aparece menos corpo do planeta;
     - o padding de baixo garante essa folga, e o clamp passa a ser a altura mínima. Onde ele não comporta o conteúdo, a hero cresce o necessário.
   - Medidas (luz = luminância do fundo ao lado do CTA, na altura dele, em % do pico logo acima do arco):

     | Tela | Hero antes | Hero agora | Base do CTA ao centro do brilho | Luz na altura do CTA |
     |---|---:|---:|---:|---:|
     | 1440 × 900 | 935 px | **825 px** (92% da tela) | 175 px | 13% |
     | 1440 × 1000 | 1000 px | **825 px** (83%) | 175 px | 13% |
     | 1920 × 1080 | 1080 px | **860 px** (80%) | 197 px | 9% |
     | 1280 × 720 | 907 px | **797 px** | 175 px | 13% |
     | 390 × 844 | 844 px | **726 px** (86%) | 183 px | 19% |

     Régua do print 01 aprovado: o CTA ficava em 3% do pico e o contador em 17%. Em telas baixas (1280 × 720, 1440 × 900) a hero é maior que o clamp porque o conteúdo, com a folga do brilho, exige isso. Antes dos ajustes ela já passava da altura da tela nesses casos (935 e 907 px).
4. **Contador removido da hero.** Saíram o bloco `.cd` e o CSS dele. O `BLACK_FIM` continua no `js/config.js`. O `js/modulos/contador.js` está isolado e sem uso (não é importado), com a estrutura de HTML que ele espera documentada no topo, para voltar na barra fixa da Fase 6 se for decidido. Sem o contador, a Barlow 700 nem é baixada na primeira dobra.

### 2ª rodada (equilíbrio da linha 2 e luz em "da história.")

Capturas lado a lado: `shots/fase-2/ajustes-2/antes-depois-390x844.png`, `antes-depois-1440x900.png` e `antes-depois-1920x1080.png`.

5. **Equilíbrio da linha 2.**
   - **a) Selo colado no ponto:** `margin-left: -.1em` (era .02em), como pedido. O `top` sugerido como ponto de partida, **−.2em, não é possível**: a linha 1 ("A maior black") é mais larga e fica por cima do selo. Medição da sobreposição com o "ck" de "black":

     | `top` | Folga até a letra mais próxima |
     |---|---|
     | −.2em | sobrepõe até 11,7 px |
     | −.12em | sobrepõe 2,4 px |
     | −.08em | 1,4 px |
     | **−.05em** (usado) | **≥ 2,6 px** em qualquer largura |

     O valor usado é um pouco mais alto que o anterior (−.04em). O selo pode encostar no ponto; em nenhuma letra.
   - **b) Deslocamento óptico:** a linha 2 inteira vai **0,41em para a esquerda**, o mesmo valor em todos os breakpoints, porque tudo é medido em em.
     - Implementei com `padding-right: .82em` no trecho da linha 2: como a linha é centralizada, a sobra à direita empurra o texto 0,41em para a esquerda, com o mesmo efeito visual de um `translateX(-.41em)`.
     - Não usei `transform` porque ele não vale em elemento inline. Também testei `position: relative; left: -.41em`, que funcionaria, mas o Chrome passou a contar o trecho como um LCP separado do H1, então descartei.
   - **Critério medido** (`getBoundingClientRect` da caixa que une "da história." e o selo, comparada à linha 1; a meta é de 0,10 a 0,20em à direita):

     | Largura | Antes | Depois | Folga do selo até a letra mais próxima |
     |---|---:|---:|---:|
     | 390 | 0,622em | **0,152em** | 3,0 px |
     | 768 | 0,622em | **0,152em** | 3,2 px |
     | 1440 | 0,622em | **0,152em** | 5,3 px |
     | 1920 | 0,622em | **0,152em** | 5,7 px |

     Na varredura completa (163 larguras de 360 a 1920), o desvio é sempre 0,152em, a menor folga é 2,6 px (em 680 px) e o selo nunca sai da tela.
6. **Luz em "da história."**: o degradê de texto e o text-shadow passaram a envolver "da história." inteiro. A linha 1 continua branca pura.

## Arquivos criados/alterados

- `index.html`: header com a nav, painel do menu (`<dialog>`), hero (horizonte, H1, selo, subtítulo e CTA escuro) e preload da Jakarta 700
- `css/secoes/topo.css`: nav, menu e hero (desktop e mobile), com a geometria do horizonte em variáveis
- `css/componentes.css`: `.ibtn--sm` (44 × 44) e `.fbtn--escuro` (com `@property --ang`)
- `css/base.css`: `scroll-behavior` (desligado com movimento reduzido) e `body { display: flow-root }`
- `js/main.js`: importa a nav
- `js/modulos/nav.js` (novo): opacidade com a rolagem e menu
- `js/modulos/contador.js` (novo): contador, isolado e sem uso
- `componentes.html`: amostras do `.ibtn--sm` e do `.fbtn--escuro`
- `relatorios/fase-2.md`

## Capturas (caminhos em shots/fase-2/)

- `ajustes/antes-depois-*.png` e `ajustes-2/antes-depois-*.png`: as duas rodadas de ajustes, em 390 × 844, 1440 × 900 e 1920 × 1080.
- `comparacao-1440.png`: print 01 ao lado da página atual em 1440 × 1000. Ela agora diverge do print de propósito, por causa dos ajustes do cliente.
- `comparacao-1440-pre-ajustes.png`: a mesma comparação antes dos ajustes, quando a hero batia com o print (diferença média de 2,74 em 255 por canal).
- `hero-1440x1000.png`: a página sozinha.
- `360.png` a `1920.png`: página inteira (por enquanto, só a hero).
- `menu-390.png`, `menu-768.png`: painel do menu aberto.
- Vitrine: `shots/fase-2-componentes/*.png`.

## Conferência com a referência (o que bate, o que diverge e por quê)

**Antes dos ajustes**, a hero em 1440 × 1000 batia com o `01-hero-desktop.png` (`comparacao-1440-pre-ajustes.png`): nav, H1, selo, subtítulo, botão, contador, raios e arco nas mesmas posições.

**Agora**, ela diverge do print 01 por decisão do cliente:
- quebra "A maior black" / "da história.";
- luz em "da história.";
- CTA escuro no desktop;
- sem contador;
- hero mais baixa, com o arco a 150 px da base;
- selo colado no ponto e linha 2 deslocada.

Continuam iguais ao print: nav, tipografia, tamanho do H1, desenho do selo, subtítulo, raios, brilho e o desenho do planeta.

**Mobile:** segue o topo do `03-mobile-completo.png` (nav em caixa, H1 em duas linhas com o selo, CTA laranja de largura total, arco curvo). Mudam a altura (726 px em vez de 844) e o equilíbrio da linha 2.

**Copy:** a copy original escreve "A maior BLACK da história." (BLACK em caixa alta). Usei "black" em caixa baixa, como no prompt da fase e nos prints aprovados.

## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)

Todas rodadas de novo depois da 2ª rodada de ajustes.

**Capturas** (`npm run shots -- fase-2 --porta=5501`): nas 7 larguras, de 360 a 1920 px, não há scroll horizontal, nem erro de console, nem requisição externa. Fontes baixadas: Jakarta 800 e 700 e Inter, todas locais. A vitrine passa nas mesmas checagens.

**Selo × letras:** em 163 larguras, a menor folga é de 2,6 px (o ponto final pode encostar, como pedido) e o selo nunca é cortado. A medida usa o círculo que circunscreve o selo, então vale em qualquer ângulo do giro. Durante a entrada (`stamp`, escala 1,9), ele passa por cima das letras por alguns décimos de segundo; é a animação aprovada.

**CLS e LCP** (PerformanceObserver, 4 s depois da carga):

| Cenário | CLS | Elemento LCP |
|---|---:|---|
| 1440 × 1000 | 0,0000 | `h1#hero-titulo` (336 ms) |
| 390 × 844 | 0,0000 | `h1#hero-titulo` (212 ms) |
| 1440 × 1000, rede 1,6 Mbps + 150 ms, CPU 4× | 0,0000 | `h1#hero-titulo` (1.348 ms) |
| 390 × 844, rede 1,6 Mbps + 150 ms, CPU 4× | 0,0000 | `h1#hero-titulo` (1.192 ms) |

**Movimento reduzido:**
- com `prefers-reduced-motion: reduce`, `document.getAnimations()` volta vazio e nenhum pixel muda em 1,5 s;
- sem a preferência, as 13 animações estão ativas (`breathe`, `twinkle`, `stamp`, `spinSlow` e a borda `ang` do botão escuro).

**Menu só pelo teclado (390 px):**
1. Tab 1 cai no logo e Tab 2 no botão de menu; Enter abre o painel (`aria-expanded="true"`, rolagem travada, foco no botão de fechar).
2. 8× Tab e 8× Shift+Tab: o foco nunca sai do painel.
3. Esc fecha, devolve o foco ao botão de menu e solta a rolagem; Espaço reabre.
4. Enter no link "Planos" fecha o painel, vai para `#planos` e põe o foco na `section#planos`.
5. O clique na área vazia fecha; o clique dentro (no logo do painel) não fecha. Passar a janela para 1000 px fecha o painel.

**Nav:** com a página parada, ela fica a 18 px do topo com fundo .62. Rolando 79 px: 16 px e .62. Rolando 81, 600 e 2.500 px: 16 px e .85.

## Textos a aprovar usados nesta fase

**Da lista de "Textos a aprovar":** os links da nav "Benefícios", "Planos", "Comunidade" e "Área do Trader" e o botão "Aproveitar" (também no painel do menu). O "Termina em" saiu junto com o contador.

**Textos novos, só para leitor de tela (não aparecem na tela):**
- botão de menu: "Abrir menu"; botão do painel: "Fechar menu"; painel: "Menu";
- link do logo: "Black Friday Zero7 — início" (vem do protótipo).

"80% OFF" e "Aproveitar a Black" são da copy. O `<title>` continua o provisório da Fase 1.

## Perguntas / pendências

1. **Painel do menu:** o desenho é meu (decisão 7). Aprovar ou ajustar.
2. **Selo em −.05em** (ajuste 5a): é o mais alto possível sem encostar em "black". Confirmar.
3. **Altura e arco** (ajuste 3): em 1440 × 900 a hero ficou com 825 px (e não 738, os 82svh), para o CTA não cair no brilho. O arco está a 150 px da base. Confirmar.
4. **Para a Fase 3:** a seção de benefícios do protótipo sobe 200 px por cima da base da hero (`margin-top: -200px`, com degradê de transparente a `#030202` em 200 px). Com o arco agora a 150 px (144 no mobile), essa sobreposição cobriria o arco. Na Fase 3 vou amarrar a sobreposição a `--arco`, para o arco continuar aparecendo inteiro.
5. **Contador:** fora da página. Volta ou não na barra fixa mobile da Fase 6 (decisão pendente). `BLACK_FIM` provisório (27/11/2026 23:59, P1).
6. **Grade de 72 px no mobile:** pendência 4 da Fase 1, ainda aberta.

Aguardando aprovação para a Fase 3.

---

## Ajuste pós-aprovação (commit "fase 2 (ajuste): menu")

- O CTA do painel do menu passou a dizer "Aproveitar a Black" (texto completo da copy), já que ali tem largura. O CTA da nav continua "Aproveitar".
- O CLAUDE.md ganhou a seção "Hero aprovada na Fase 2", com os valores que as próximas fases usam no lugar dos do print 01 (altura, `--arco`, H1, selo, CTA escuro e contador guardado).
