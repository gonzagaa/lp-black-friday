# Quiz: design tema claro

O design aprovado pelo Gustavo, aplicado em `quiz/`, com o DNA da LP. Sem mudança na lógica, na validação nem na integração: o `lead.php` e o envio para a RD ficam como estavam.

**Nenhum envio real para a RD nos testes:** em todas as rodadas, o `lead.php` foi interceptado no navegador, que respondia `{"ok":true}` sem sair da máquina. O tracking ficou bloqueado.

## O que foi feito

### Tokens e fundo

- Os tokens ficam no escopo `.qz`, o `<body>` do quiz: `--papel`, `--papel-2`, `--card`, `--tinta`, `--tinta-2`, `--cinza`, `--linha`, `--sombra-card` e `--sombra-palco`, com os valores pedidos.
  - `--grad` é o `--grad-marca` da LP, com o reflexo `--grad-marca-brilho` e a `--sombra-material`.
- As fontes são as da LP:
  - Plus Jakarta 800 nos títulos;
  - Barlow Condensed 700/800 nos rótulos, nas letras das opções e na legenda;
  - Inter no resto.
- O fundo é o papel com:
  - a grade de 72 px em `--linha`, com máscara `radial(70% 70% at 70% 40%)`;
  - a luz laranja de 900 px no canto de cima à direita;
  - o grão da LP em multiply a .16.

### Topo

- A logo Zero7 vai em `#0E0B0A`: é o mesmo SVG da LP, com o branco trocado, em `assets/img/zero7-logo-tinta.svg`. Tem 30 px no desktop e 22 px no mobile.
- A marca "Black Friday ZERO7" é a versão do brand kit para fundo claro, com o lettering em `#0E0B0A` e o ticket igual, em `assets/marca/completa-papel.svg`. Tem 46 px no desktop e 34 px no mobile.

### Quiz

- **Layout:**
  - **Desktop (≥ 1080 px):** grid de 600 + 430 px, com gap de até 110 px, centralizado e alinhado ao centro na vertical. Abaixo de 1080 px vale o layout do mobile, com no máximo 560 px de largura.
  - **Acima do card, só no desktop:** o rótulo "QUIZ DA BLACK" com o quadradinho no degradê e o título "Sua oferta da Black" / "em 4 perguntas.". No sucesso, o título vira "Obrigado!" / "Bem-vindo à Black.". No mobile, o título fica só para o leitor de tela: é o `<h1>`.
- **Card:** branco, com raio `24px 24px 24px 0`, borda .06, `--sombra-card` e padding de 36/40/26 px (22/18/12 px no mobile).
- **Progresso:** um segmento por pergunta, de 4 px com raio `2px 0`. Os já respondidos ficam no degradê e o atual fica 55% cheio; no contato, todos cheios.
  - Embaixo, "PERGUNTA X DE 4" e "LEVA 30 SEGUNDOS", em Barlow 12 px.
  - Com a P2 pulada, a contagem é "de 3" e aparecem 3 segmentos.
- **Pergunta:** Jakarta 800, 34 px (28 no mobile), com −.045em e a parte final na segunda cor.
- **Opções:**
  - 60 px de altura (54 no mobile), raio `16px 0`, fundo `#FBFAF8` e a letra A/B/C/D num quadrado de 30 px com raio 8.
  - No hover: borda laranja .45, sobe 1 px, ganha sombra laranja e mostra a seta "→".
  - Escolhida: borda laranja e a letra no degradê, em branco.
- **Campos:** 52 px (48 no mobile), raio `14px 0` e fundo `#FBFAF8`. No foco, borda laranja e anel de 4 px `rgba(255,106,26,.14)`. O erro vai em `#C8261C`.
- **CTA:** o `.fbtn` da LP numa pele clara.
  - 62 px (56 no mobile), raio `16px 0`, degradê com o brilho de cima, sombra vermelha e a seta na gota branca.
  - Embaixo dele, o cadeado e "Seus dados ficam só com a Zero7.".
  - O "Enviando…" continua igual.
- **Sucesso:** o check num quadrado de 64 px com raio `20px 0 20px 20px`, no degradê. O botão do WhatsApp tem o formato do CTA, em verde (`#25D366 → #128C7E`).
- **"← Voltar":** numa linha reservada embaixo do card. O pedido não dizia onde.
- **Altura do card:** as quatro perguntas ocupam a mesma célula do grid. A escondida fica invisível, fora do Tab e do leitor de tela, então o card não pula de altura entre elas. No contato o card cresce, porque o formulário é mais alto.

### Palco de mídia (`quiz/palco.js`, só visual)

- **Moldura:**
  - raio `40px 0 40px 0` (`28px 0 28px 0` no mobile) e `--sombra-palco`;
  - vídeo 9:16 em cover, mudo, em loop, `playsinline` e sem controles;
  - o degradê escuro de baixo (de 50% a `rgba(10,6,5,.8)`) com a legenda: "ECOSSISTEMA ZERO7" em `#FF9A5C` (Barlow 12 px), título em Barlow 800 26 px e descrição em Inter 14 px. A descrição some no mobile.
- **Desktop:**
  - 430 × 720 px. Em telas baixas, encolhe até 560 px de altura para caber (ex.: 1280 × 720).
  - Atrás, o cartão fantasma branco, deslocado (34 px, −26 px) e girado 3°.
- **Mobile:** o palco fica em cima, com 400 px de altura (200 px no contato e no sucesso), e o card sobe 26 px por cima dele.
- **Objeto 3D:**
  - desktop: 132 px, à esquerda, girado −14°, acima da legenda (embaixo ele cobria o texto);
  - mobile: 70 px, no canto de cima à direita, girado 14°;
  - fica numa caixa fixa, então os mais altos, como o cadeado, encolhem;
  - todos vêm das versões otimizadas da LP (`assets/3d/*-320.avif|webp`). Nada vem do `_brandkit/`.
- **Conteúdo por etapa:** a tabela do pedido está no objeto `CENAS` do `palco.js`.
- **Troca de etapa:**
  - o vídeo atual sai em fade;
  - o próximo entra em fade com escala de 1.02 para 1, em .45 s;
  - a legenda e o 3D entram com um leve deslize.
- **Desempenho:**
  - Só o vídeo da etapa atual baixa e toca. A cena que sai perde o `src`, o que corta o download.
  - Da próxima etapa, só o poster é pré-carregado.
  - O poster da P1 é um `<img>` com `fetchpriority="high"` e preload, por baixo do vídeo. O vídeo da P1 só entra depois do `load`, em idle.
  - Com movimento reduzido ou `saveData`, fica só o poster: sem vídeo e sem animação.
  - Com o palco fora da tela (no mobile, ao rolar até o formulário), o vídeo pausa.

### Rodapé

Só a linha legal, em Inter 11 px. No desktop fica numa linha, embaixo à esquerda; no mobile, no fim da página. Os textos são os do rodapé da LP: "© 2026 Zero7 Tesouraria LTDA | CNPJ … · Todos os direitos reservados. · Política de Privacidade". Ver a pergunta 1.

### Ganchos no `quiz.js` (só visual)

O fluxo, a validação, a máscara, o envio e o `quiz_lead` não mudaram. Mudaram só três pontos:
- o `import './palco.js'`;
- o `mostrar()`, que agora grava `body[data-passo]` e dispara o evento `quiz:passo` com a etapa e a lista de perguntas;
- o cabeçalho, que no sucesso deixou de sumir: agora troca de texto, pelo CSS.

## Arquivos criados/alterados

**Criados:**
- `quiz/palco.js`;
- `assets/img/zero7-logo-tinta.svg`;
- `assets/marca/completa-papel.svg`;
- `relatorios/quiz-design.md`.

**Alterados:**
- `quiz/index.html`:
  - corpo novo, com tema claro, palco e linha legal no lugar do rodapé da LP;
  - `theme-color` e `color-scheme` claros;
  - preload do poster da P1;
  - saiu o `rodape.css`;
  - o GTM, o noscript e o Pixel + CAPI ficaram iguais.
- `quiz/quiz.css`: reescrito.
- `quiz/quiz.js`: os ganchos acima.
- `PROMPTS-LP-BLACK.md`: os textos a aprovar do design.
- `README.md`: a seção "Quiz".

## Capturas (shots/quiz-claro/)

- `{360,390,1440,1920}-{1-p1, 2-p2, 3-p3, 4-p4, 5-dados, 6-dados-erros, 7-dados-foco, 8-sucesso}.png`;
- `1440` e `1920` têm também `1b-p1-hover`;
- `768-1-p1`, `1024-1-p1`, `1280-1-p1` e `1366-1-p1`, para conferir as larguras do meio.

## Conferência com a referência

O protótipo do canvas não está no repositório. Conferi contra a especificação do pedido, item por item. Bate em tokens, fundo, topo, grid, card, progresso, opções, campos, CTA, sucesso, palco, 3D, transições e desempenho.

Onde diverge, e por quê:
- **Segunda cor dos títulos:** `rgba(14,11,10,.5)` em vez do `--cinza` (.42). O .42 dá 2,8:1 e não passa nem no mínimo de texto grande (3:1). O .5 dá 3,6:1. Ver a pergunta 3.
- **Rótulo do WhatsApp em tinta, e não em branco:** ver a pergunta 4.
- **3D do desktop acima da legenda,** e não no canto de baixo: lá embaixo ele cobria "ECOSSISTEMA ZERO7" e o título.
- **Degradê:** o pedido cita `#FF8A3D / #FF6A1A / #F2441F / #E52B24` e diz "o mesmo `--grad-marca` da LP". O da LP é a variante D (`#F6661E / #EF4C1A / #E8381F / #DA2522`), escurecida para o texto branco do `.fbtn` passar de 3:1. Usei o da LP. Ver a pergunta 2.

## Checagens rodadas

- **Lighthouse 12, mobile, servidor gzip da subpasta (5502), 2 rodadas:**

| Rodada | Perf | FCP | LCP | TBT | CLS | Acessib. | Boas práticas |
|---|---|---|---|---|---|---|---|
| 1 | 94 | 1,5 s | 2,8 s | 0 ms | 0 | 100 | 96 |
| 2 | 95 | 1,4 s | 2,9 s | 60 ms | 0 | 100 | 96 |

  - **LCP:** o elemento é o poster da P1. 84% do tempo é *render delay*, o mesmo artefato de rasterização sem GPU do Lighthouse que medimos na LP (Fase 6). A imagem em si não atrasa: ela carrega em 0 ms de espera.
  - **Boas práticas 96:** só pela fonte de 11 px da linha legal (o tamanho pedido).
  - **Peso:** 2,7 MB, quase tudo do vídeo da P1 (`hub-zero7-9x16-540.mp4`, 2,4 MB), que baixa depois do `load`. Ver a pergunta 6.
- **Rede por etapa (390 px):**
  - a cada etapa entram só o vídeo dela, o 3D dela e o poster da próxima;
  - nunca há dois vídeos na página, e o anterior para de baixar;
  - na P4, o Chrome escolheu o `.webm`.
- **Movimento reduzido:** nenhum `<video>` na página e só posters na rede.
- **Teclado:**
  - o Tab vai da logo até as opções, e o Enter avança;
  - o foco vai para o título de cada etapa;
  - no formulário: Nome → WhatsApp → E-mail → caixa → link da política → CTA → Voltar;
  - o anel de foco aparece em tudo: contorno de 2 px em tinta e, nos campos, a borda laranja com o anel .14.
- **Contraste** (medido; nos botões, pixel a pixel atrás do rótulo):

| Texto | Sobre | Contraste |
|---|---|---|
| `--tinta-2` (.66) | papel / branco / campo | 6,18 / 6,45 / 6,35 |
| `--cinza` (.42) | papel / branco | 2,80 / 2,84 (não vai em texto) |
| segunda cor dos títulos (.5) | papel / branco | 3,60 / 3,67 (texto grande) |
| erro `#C8261C` | branco | 5,60 |
| CTA "Quero minha oferta" (branco) | degradê | mín. 3,23, mediana 3,73 (a exceção do `.fbtn`) |
| WhatsApp (tinta) | verde | mín. 5,21, mediana 7,15 |
| WhatsApp (se fosse branco) | verde | mín. 2,02 |

- **Console:** sem erros nas 4 larguras, em todas as etapas.
- **Rede:** nenhum 404.
- **Scroll horizontal:** nenhum em 360, 390, 768, 1024, 1280, 1366, 1440 e 1920, em todas as etapas.
- **`lead.php`:** interceptado em todos os testes.

## Textos a aprovar usados nesta fase

Os textos estão em "Textos a aprovar" do `PROMPTS-LP-BLACK.md` (linhas "Quiz (design…)", "palco de mídia" e "rodapé legal").
- **Do pedido:** "Quiz da Black", "Sua oferta da Black / em 4 perguntas.", "Obrigado! / Bem-vindo à Black.", "Leva 30 segundos", "Seus dados ficam só com a Zero7.", "Ecossistema Zero7" e as 6 legendas.
- **Decisão minha:** onde cada pergunta muda de cor ("Você é **trader?**", "Qual é a sua **experiência?**", "O que você **opera?**", "Qual é o seu **maior desafio hoje?**", "Para onde enviamos **sua oferta?**", "Pronto! **Sua oferta está a caminho.**").
- **Saíram:** o título "Responda 4 perguntas e receba sua oferta da Black." e o subtítulo "Leva 30 segundos." da estrutura.

## Perguntas / pendências

1. **Rodapé:** saiu o rodapé completo da LP e ficou só a linha legal. Saíram junto:
   - a navegação;
   - o selo do Reclame Aqui;
   - as formas de pagamento;
   - o aviso legal ("Todas as informações aqui apresentadas são destinadas exclusivamente a fins educacionais… A Zero7 não atua como corretora…").

   Era isso? Se o aviso legal precisar ficar, ele cabe em 11 px embaixo da linha, no desktop e no mobile.
2. **Degradê:** uso o `--grad-marca` da LP (variante D), e não os valores citados no pedido. O motivo é o contraste do texto branco do CTA, medido nessa variante. Ok?
3. **Segunda cor dos títulos:** .5 em vez do `--cinza` .42, porque o .42 não passa em 3:1. Ok, ou prefere outro valor de pelo menos .46?
4. **WhatsApp:** o rótulo vai em tinta (5,2:1). Em branco daria 2,0:1, e a exceção do `.fbtn` vale só para o degradê da marca. Ok?
5. **Contato:** à esquerda do progresso não aparece nada, porque o `quiz.js` não escreve contagem no contato e eu não mexi na lógica. Quer um texto ali, como "Último passo"? Seria um texto novo, a aprovar.
6. **Vídeo da P1 no mobile:** o `hub-zero7-9x16-540.mp4` tem 2,4 MB (51 s) e baixa logo depois do `load`. Uma versão curta e mais leve só para o quiz (10–15 s, ~600 KB) baixaria o consumo. Quer?
7. **Espaço no card:** como a altura é reservada pela pergunta mais alta (a P4), a P1 e a P2 ficam com uma faixa branca embaixo das opções. Isso é o efeito pedido ("o card não pula de altura").

Commit `quiz: design tema claro`, sem push. Aguardando a sua revisão no navegador (http://localhost:5501/quiz/).
