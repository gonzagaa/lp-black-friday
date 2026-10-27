# Rodada de ajustes 2

Os 4 itens pedidos, um commit por item, mais 4 commits que surgiram no caminho:

- a resposta sobre o hover nas laterais;
- uma correção de CLS que já existia desde a Fase 6;
- o tamanho da seta do item 3;
- as capturas, que estavam disparando o tracking.

| Commit | O quê |
|---|---|
| `b6045f1` ajuste: comunidade, só o palco reage ao mouse | Resposta da pergunta da rodada anterior |
| `d6d3b99` ajuste: comparativo de preço no card de desconto | **Item 1** |
| `de12222` ajuste: seletor de mercado em destaque | **Item 2** |
| `d0eb3ef` ajuste: limite de perda subindo | **Item 3** |
| `f3d12fc` ajuste: planos sem deslocamento quando o carrossel arma na tela | Correção de CLS (já existia na Fase 6), achada na verificação do item 3 |
| `fbd4d6b` ajuste: limite de perda, seta com tamanho no HTML | Complemento do item 3 |
| `03d9f01` ajuste: capturas sem disparar o tracking | `npm run shots` mandava evento falso de localhost |
| `f2ef4e9` ajuste: comunidade em deriva contínua | **Item 4** |

---

## Resposta: só os cards do palco reagem ao mouse (`b6045f1`)

Os degradês das laterais (desktop) passaram a receber o ponteiro (`pointer-events: auto`). O card que está no degradê não acende, não toca e não apaga os do palco. O arraste continua em toda a faixa, porque o Swiper escuta o trilho inteiro.

| Teste (1280 e 1920) | Resultado |
|---|---|
| Mouse na lateral | 3 vídeos tocando, nenhum card apagado, nenhum `:hover` em card |
| Mouse no palco | 1 vídeo tocando, os outros apagados |
| Arrastar começando na lateral | o carrossel move |

---

## Item 1: comparativo de preço no card 01 (`d6d3b99`)

**O que foi feito:**

- Embaixo do texto, à esquerda do %, duas linhas no estilo do gráfico do card 02 (barras de 10 px, cantos de 3 px):
  - "Preço normal": valor riscado e barra cheia em `rgba(255,255,255,.14)`;
  - "Na Black": valor em branco e barra com `--grad-marca` (+ brilho), com o chip "−80%" na ponta (degradê da marca, sombra material, raio 8 px).
- **Os valores** são os do plano Sênior (Mini Índice): `oldPrice` e `avista` do modo que a seção de planos abre, lidos do `data/planos.json`. Nada fica no HTML.
  - Os números saem da conta: a barra encolhe até a proporção real (à vista ÷ preço antigo = 0,20) e o chip mostra 1 − 0,20 = −80%.
  - Se o JSON não trouxer os dois preços, o comparativo some e o card fica como era.
- **Animação:** ao entrar na tela (60% visível), a barra da Black nasce em 100% e encolhe por `transform: scaleX` (origem à esquerda, 1,2 s, `--curva`). O chip anda junto e o valor conta de R$ 3.047,00 até R$ 609,40, na mesma curva.
- **Movimento reduzido:** já aparece no estado final.
- **Uma leitura só do `planos.json`:** criei `js/modulos/dados-planos.js`, que a seção de planos (`blackPlanos`), o comparativo e o item 3 dividem. Tem o mesmo fallback no snapshot de antes.
- **Para leitor de tela:** o valor que conta fica `aria-hidden`; uma cópia `.sr-only` traz o valor final.

**Medidas:**

| Largura | Antes de entrar | Depois | Largura do comparativo | Sobre o %? |
|---|---|---|---|---|
| 390 | R$ 3.047,00, barra 100% | R$ 609,40, barra 20%, chip "−80%" | 172 px (folga de 18 px até o %) | não |
| 1440 | igual | igual | 384 px | não |
| 1920 | igual | igual | 384 px | não |
| 390 e 1440, movimento reduzido | já no final | — | — | não |

- **Mobile:** o comparativo fica abaixo do texto e o % continua no canto de baixo. Com ~170 px ao lado do %, o rótulo e o valor ficam numa linha (valor em 16 px). De 360 a 414 não há sobreposição; em 768 a folga é de 6 px.
- **Altura do card 01:** em 390 passou de 300 para 319 px. Ela já nasce assim, então não gera deslocamento.

---

## Item 2: seletor de mercado em destaque (`de12222`)

**O que foi feito:**

- **Contêiner:** vidro escuro, raio `16px 0`, borda de 1 px `rgba(255,255,255,.1)` e uma linha de luz laranja bem sutil no topo (degradê de 1 px).
- **Abas:** 60 px de altura no desktop e 52 no mobile, 16 px / 600, mais respiro lateral (34 px) e a mesma largura nas duas.
- **Aba ativa:** o indicador é o `.seg__blob` da home, agora com `--grad-marca` + `--grad-marca-brilho` + `--sombra-material`, texto branco e um glow laranja embaixo. Ele **desliza** entre as abas: só `transform` anima, em .35 s com a curva da página, porque as duas abas têm a mesma largura.
- **Aba inativa:** branco .72, com hover .95.
- Sem ícones. A semântica é a da home: `radiogroup` com `aria-checked`.

**Medidas:**

| Largura | Contêiner | Cada aba | Linhas do rótulo | Indicador ao trocar |
|---|---|---|---|---|
| 360 | 322 × 66 | 154 × 52 | 2 ("Mini Índice / Dólar" quebra) | desliza de 7 a 161 px |
| 390 | 352 × 66 | 169 × 52 | 1 | 7 → 176 px |
| 768 | 624 × 74 | 305 × 60 | 1 | 7 → 312 px |
| 1440 / 1920 | 429 × 74 | 207 × 60 | 1 | 7 → 214 px |

- **Foco visível:** contorno de 2 px na cor de foco.
- **Setas do teclado:** trocam o mercado.
- **Área de toque:** no mínimo 52 px.

**Contraste (ver a pergunta 1):**

- O axe não acusa nada, porque não consegue ler o degradê e deixa o caso "para revisão".
- Medido pixel a pixel atrás do rótulo, o branco sobre o indicador dá **3,12:1 no mínimo e 3,89:1 em média** (3,21 / 3,88 em 1440).
- É a mesma faixa da exceção do `.fbtn`. Mas a regra 9 do CLAUDE.md só permite essa exceção no `.fbtn`, e 16 px / 600 não conta como texto grande.

---

## Item 3: limite de perda subindo (`d0eb3ef` e `fbd4d6b`)

### O efeito original existe na home

Procurei no histórico de `../Zero7`, só lendo:

- `git log --all -S "perda"`: 30 commits.
- `git log --all -p -G "(limite|perda).*(anim|count|…)"`.
- Busca nos JS/CSS atuais e antigos.

Achei **`script/limiteAlta.js` + `css/limiteAlta.css`**, a "entrada animada do 'Limite de perda total' que aumentou":

| Commit da home | Data | O quê |
|---|---|---|
| `5bedb6b` | 10/09/2026 | Cria o efeito (marcação em `topic-box`) |
| `08edf5e` | 21/09/2026 | Ajustes |
| `750f810` | 08/10/2026 | Marcação no `.chip` (a que a LP usa) |
| `5665cd4` | 15/10/2026 | Tira a marcação `.limite-alta` dos cards |

Hoje o script continua carregado na home, mas sem nenhum card marcado. Os valores do histórico são exatamente os da Black (997 → 1.200, 9.997 → 15.000…).

**A ideia original:** quando o card entra na tela, o valor volta para o antigo, dá uma piscada vermelha e conta até o novo (1,4 s, desacelerando). Ele fica verde com a seta ▲, que "respira", e a célula dá um pulso.

### O porte com a pele da Black

- **`js/modulos/limite-alta.js`:** mesmos tempos e mesmos estados da home:
  - 0,9 s no valor padrão;
  - 0,45 s de piscada;
  - 1,4 s de contagem em ease-out cúbico;
  - estados `is-antigo` → `is-queda` → `is-subindo` → `is-alta`.
- **A pele (`css/secoes/planos-black.css`)** troca as cores, pela regra 3:
  - no lugar do verde, a seta fica num chip com `--grad-marca` e a célula ganha a borda laranja sutil;
  - a piscada é de opacidade, sem vermelho;
  - o pulso no fim é laranja.
- **Dados:** os dois valores (padrão e Black) ficam no `planos.json`, em `limitePerdaTotal` (8 planos). O HTML gerado pelo porte tem só a estrutura, com `&nbsp;`. Novo teste: cada plano do modo ativo tem os dois valores, e o da Black é maior.
- **Quando roda:** uma vez por card, quando ele aparece de verdade (60%), inclusive ao arrastar o carrossel. Roda de novo na troca de mercado: o bloco que some volta ao valor padrão e anima quando reaparece. Os 8 cards nunca animam ao mesmo tempo fora da tela.
- **Quem já está na tela ao carregar** fica no valor final, como na home.
- **Movimento reduzido:** estado final direto.
- **CLS 0:**
  - a seta tem o lugar reservado desde o início (só `opacity`/`transform`);
  - a caixa do valor tem a largura do valor da Black, com o texto à esquerda, então "R$ 9.997,00" → "R$ 15.000,00" não empurra nada;
  - o SVG tem `width`/`height` no HTML (sem a folha da pele, ele ia para 300 × 150).
- **Célula estreita** (menos de 112 px: 360–390, 768 e 1080–1279): a seta sobe para cima do valor, por container query. Vale para as 8 células desde o início. Em 390, o card passou de 508 para 526 px.
- **Diferenças em relação à home** (listadas no cabeçalho do módulo):
  - roda em todas as larguras (na home, só a partir de 1080);
  - os valores vêm do JSON;
  - não usa vermelho nem verde;
  - a seta tem o lugar reservado;
  - roda de novo na troca de mercado.

### Linha do tempo medida (card Sênior)

| Largura | 0,3 s | 1,1 s | 1,6 s | 2,4 s | 3,6 s | Altura do card |
|---|---|---|---|---|---|---|
| 390 | antigo, R$ 9.997,00 | antigo | piscada | subindo, R$ 13.548,07 | **R$ 15.000,00** | 526 px o tempo todo |
| 1440 | antigo | antigo | piscada | subindo, R$ 12.941,39 | **R$ 15.000,00** | 606 px o tempo todo |
| 1920 | antigo | antigo | piscada | subindo, R$ 13.849,19 | **R$ 15.000,00** | 625 px o tempo todo |

- **Troca de mercado:** o BIT 8 vai de R$ 997,00 a R$ 1.200,00. De volta ao Índice, o Sênior vai de novo de R$ 9.997,00 a R$ 15.000,00.
- **Cabe na célula** (seta + valor, todos os cards, os dois mercados): a menor folga até a borda vai de 4 px (360) a 24 px (1920).
- **CLS durante o efeito:** 0,0000 em 390, 1440 e 1920.

---

## Correção encontrada no caminho: CLS ao armar o carrossel dos planos (`f3d12fc`)

**O problema:**

- Na verificação do item 3, apareceu um CLS de 0,09 sem relação com o efeito.
- Quando o carrossel dos planos arma com a seção já na tela, o Swiper troca o card da frente (do Iniciante para o Sênior) à vista. Isso acontece numa recarga com a rolagem restaurada nos planos, ou num salto sem clique.
- **Já existia na Fase 6.** Testei o commit `a96fe17` numa cópia separada.

**A correção:** até o Swiper armar, os carrosséis ficam invisíveis, ocupando o lugar. No uso normal ele arma a ~1200 px da seção, então ninguém vê o vão. Se o Swiper falhar, eles aparecem do mesmo jeito.

| Cenário | Fase 6 (`a96fe17`) | Antes da correção | Depois |
|---|---|---|---|
| Recarga com a rolagem nos planos, 1440 | 0,052 / 0,059 | 0,031 / 0,034 | **0,0001 / 0,0001** |
| Recarga com a rolagem nos planos, 390 | 0,110 / 0,070 | 0,070 / 0,070 | **0,0000 / 0,0000** |
| Salto sem clique, movimento reduzido | 0,023 | 0,023 | **0,0000** |
| Clique em "Planos" na nav | 0 | 0 | 0 |

---

## Item 4: comunidade em deriva contínua (`f2ef4e9`)

**O que foi feito:**

- **Deriva:** contínua, para a esquerda, em velocidade constante: **40 px/s no desktop com mouse e 30 px/s no resto**.
  - É feita quadro a quadro com o `setTranslate` do Swiper, sem transição CSS.
  - O loop do Swiper (`slidesPerView: 'auto'`) é refeito como no mousewheel com `freeMode` do próprio Swiper: `loopFix({ byMousewheel: true })` move os cards do começo para o fim e compensa o translate no mesmo quadro.
  - Ele só roda quando o card do centro muda, porque o `loopFix` remede todos os slides.
- **O usuário no controle:**
  - arrastar pega na hora;
  - setas e progresso deslizam com a curva normal do Swiper (500 ms);
  - no desktop, o hover num card do palco pausa a deriva (o texto abre e o vídeo toca, como antes);
  - foco de teclado no carrossel (cards, setas, progresso) também pausa.
- **Retomada:** 2,5 s depois da última interação, com a velocidade subindo em rampa de 600 ms.
- **Outras pausas:** seção fora da tela e aba oculta (`visibilitychange`).
- **Movimento reduzido:** sem deriva.
- **Progresso:** marca o card mais perto do centro.
- **Vídeos:** durante a deriva, o `avaliar()` (quais vídeos tocam) roda a cada 200 ms, não a cada quadro. Fora da deriva, como antes.
- **Desempenho:** o wrapper ganhou `will-change: transform` (ver o fps abaixo).

### Continuidade e comportamento (Chrome real, seguindo um card quadro a quadro)

| Teste | 1920 × 1080 (40 s) | 390 × 844, toque (12–30 s) |
|---|---|---|
| Velocidade mediana | **40,0 px/s** | **30,0 px/s** |
| `loopFix` no período | 4× | 3× (30 s) |
| Saltos > 4 px num quadro (emenda/tranco) | **0** | **0** |
| Vídeos tocando ao mesmo tempo | no máximo **3** | no máximo **3** |
| Progresso fora do card do centro | 0 de 177 amostras | 0 de 143 |
| Hover num card do palco | 0 px/s | — |
| Ao sair do hover | 0 px/s até ~2,5 s; 8 px/s na rampa; depois 39,7 | — |
| Seta "próximo" | transição de 593 ms; depois parado; volta a 35,9 px/s | 543 ms; volta a 29,8 |
| Arrastar (segurando parado) | 0 px em 0,5 s | 0 px em 0,5 s (dedo, via CDP) |
| Foco de teclado nas setas | 0 px/s | — |
| Aba oculta / de volta | 0 / 35,3 px/s | 0 / 30,1 |
| Seção fora da tela | o trilho andou 0 px em 1,5 s | 0 px |
| Movimento reduzido | 0 px em 3 s, nenhum vídeo | 0 px, nenhum vídeo |
| Erros no console | nenhum | nenhum |

### FPS

O "antes" (medido antes de mexer, 1920, 2 cargas):

| Situação | fps |
|---|---|
| Parado | 72,2 / 72,1 |
| Passando de card | 39,0 / 37,1 |
| Hover | 56,4 / 55,8 |

**Por que comparar por A/B:**

- A máquina ficou mais lenta durante a rodada: com o mesmo carrossel parado, a medição caiu de ~72 para ~42 fps.
- Por isso, o número que separa o custo da deriva é um A/B intercalado na mesma página.
- O lado "parado" usa aba oculta simulada, que para só a deriva e mantém os mesmos vídeos tocando.
- 4 rodadas de 4 s de cada lado:

| 1920 × 1080 | Em deriva | Parada | Quadros de vídeo descartados (4 s) |
|---|---|---|---|
| Sem `will-change` | 21,9–22,3 fps | 41,9–42,2 fps | 82–101 × 34–44 |
| **Com `will-change: transform` (entregue)** | **30,9 fps** | **44,1 fps** | 59–63 × 10–37 |
| 1440 × 900, entregue | **34,8 fps** | **48,4 fps** | 36–68 × 21–36 |

**De onde vem o custo:**

- O JS da deriva custa **0,25 ms por quadro**.
- Sem os vídeos, a deriva fica nos mesmos ~23 fps. O custo é recompor a faixa em movimento neste Chrome sem GPU (headless, rasterização em software).
- O `will-change` tirou boa parte desse custo.
- Arredondar o translate para pixel inteiro dava +1 fps, mas a 40 px/s ele anda 1 px a cada ~1,5 quadro e trepida. Não usei.
- Num aparelho com GPU, mover uma camada já composta é barato. Vale conferir num celular de verdade (pergunta 4).

---

## Correção das capturas (`03d9f01`)

- **O problema:** a rolagem do `npm run shots` conta como interação. Ela carregava o GTM e o container dele (Meta, Google Ads, RD Station, Hotjar, 45–82 requisições), e o POST da API de Conversões saía no DOMContentLoaded. Era evento falso mandado de localhost.
- **A correção:** a captura bloqueia esses hosts, e eles não entram nos erros nem nas externas.
- O teste do tracking da rodada anterior já interceptava tudo; foi só o script de capturas que ficou de fora.

---

## Capturas (shots/rodada-2/)

| Item | Arquivos |
|---|---|
| 1 | `1-card01-390.png`, `1-card01-1440.png`, `1-card01-1920.png`, `1-card01-390-reduzido.png` |
| 2 | `2-seletor-{360,390,1440,1920}-indice.png`, `2-seletor-{390,1440,1920}-bitcoin.png` |
| 3 | `3-limite-390.png`, `3-limite-1440.png`, `3-limite-1920.png` (no fim, com o pulso), `3-limite-1440-reduzido.png` |
| 4 | `4-deriva-{390,1440,1920}-a.png` e `-b.png` (dois quadros com 2 s de intervalo), `4-deriva-{1440,1920}-hover.png` |
| Página inteira | `390.png`, `1440.png`, `1920.png` |

## Verificação geral

- **Console:** sem erros da LP. Os únicos são do selo do Reclame Aqui (CORS em localhost, como sempre).
- **Scroll horizontal:** nenhum em 390, 1440 e 1920.
- **CLS:**

| Cenário | Resultado |
|---|---|
| Rolagem normal até os planos, 390 com rede e CPU lentas | **0,0000** (LCP 2,1 s) |
| Rolagem normal até os planos, 1440 | **0,0000** |
| Recarga com a rolagem nos planos | 0,0000–0,0001 |
| Efeito do limite | 0 |

- **Testes dos planos:** `npm test` com 9 de 9 (um novo, para o `limitePerdaTotal`).
- **`node scripts/medir-planos.mjs`:** diverge onde a rodada mudou, de propósito.
  - A linha do "Limite de perda total" fica 8 px mais alta no esqueleto sem pele (a seta), e tudo que vem abaixo dela no card desce 8 px.
  - Os preços seguem diferentes da home, como desde a P2.
  - O Bitcoin em 390 segue diferente de propósito.
  - O resto bate.

## Textos a aprovar

- ~~Item 1: "Preço normal" e "Na Black"~~: saíram com o comparativo (ver o adendo no fim).
- **Item 3:** o `aria-label="Aumentou"` da seta é o da home (`750f810`). Ele só é lido pelo leitor de tela.

## Perguntas

1. **Contraste da aba ativa:** o branco sobre o laranja do indicador dá no mínimo 3,12:1. A regra 9 pede 4,5:1 para esse tamanho; só o `.fbtn` tem a exceção. Estendo a exceção ao seletor (e registro na regra 9)? Ou o texto da aba ativa fica escuro (`#0a0706`, ~6:1)?
2. **`aria-pressed`:** o pedido falava em `aria-pressed`, mas o seletor é o da home: `radiogroup` com `role="radio"` e `aria-checked` (e setas do teclado). Mantive o da home. Se quiser `aria-pressed`, ele vira dois botões de alternância.
3. ~~Formato do comparativo~~: não vale mais, porque o comparativo saiu.
4. **Deriva no celular de verdade:** no teste sem GPU, a deriva custa ~30% do fps. Vale abrir num celular médio e conferir. Se pesar, dá para baixar a velocidade ou derivar só sem vídeo tocando.

---

## Adendo: o comparativo do item 1 saiu (commit "ajuste: marca d'água 80% no card 01")

**O que saiu:**

- o comparativo inteiro: HTML, CSS (`.cmp*`) e `js/modulos/comparativo.js`;
- `bezier`/`curvaPagina` do `js/modulos/contagem.js`, que só ele usava;
- "Preço normal" e "Na Black" dos textos a aprovar.

**O que ficou:** a leitura única do `planos.json` (`js/modulos/dados-planos.js`) e o `contar`/`formatarReais`, porque a seção de planos e o limite de perda (item 3) usam.

**No lugar, um "80%" gigante como marca d'água** (`.beneficio__marca`, `aria-hidden="true"`):

- **Posição:** ancorado no canto inferior esquerdo, atrás do texto (`z-index` 0 × 2) e do % 3D (que vem depois no HTML). A base dos números sai do card, e o `overflow: hidden` do card corta.
- **Tamanho:** Barlow Condensed 900, 260 px a partir de 768 e 150 px no mobile.
- **Duas camadas empilhadas:**
  - o brilho: o mesmo 80% preenchido com `--grad-marca`, opacity .10, `blur(24px)`, deslocado .05em/−.04em;
  - o contorno: `-webkit-text-stroke` de 1,5 px `rgba(255,255,255,.10)`, com preenchimento `background-clip: text` de `rgba(255,255,255,.06)` para transparente, de baixo para cima.
- **Máscara do conjunto:** `linear-gradient(30deg, #000 30%, rgba(0,0,0,.6) 55%, transparent 80%)`, opaca embaixo à esquerda e sumindo para cima e para a direita. A primeira versão (#000 22% → transparente aos 66%) apagava o "%" e quase o "80"; abri um pouco.
- **Estática:** sem animação.
- **Troca no card 01:** o "80" em contorno que já ficava ao fundo, à direita, atrás do %, saiu. Seriam dois números gigantes no mesmo card. O "100" do card 04 continua.

**Contraste** (fundo medido pixel a pixel atrás do texto, com o texto escondido e a cor do texto composta sobre cada pixel):

| Largura | Fonte da marca | Título | Descrição |
|---|---|---|---|
| 390 | 150 px | 17,88:1 | 7,52:1 |
| 768 | 260 px | 17,88:1 | 7,52:1 |
| 1024 | 260 px | 17,88:1 | 7,52:1 |
| 1440 | 260 px | 17,88:1 | 7,52:1 |
| 1920 | 260 px | 17,88:1 | 7,56:1 |

A tinta dos números começa uns 35 px abaixo da descrição em 1440. Nas capturas, nada encosta no texto.

**Capturas:** `shots/ajustes/card01-marca80-{390,768,1024,1440,1920}.png`.
