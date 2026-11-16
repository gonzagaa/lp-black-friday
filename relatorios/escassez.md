# Tarja de escassez da LP

Pedido do cliente de 16/11: na LP, a contagem de tempo sai e entra uma tarja de escassez ("Os planos da Black Friday estão acabando" + a % dos planos vendidos). Commit `ajuste: tarja de escassez na LP (no lugar do timer)`, sem push. O quiz e a home oficial não mudaram.

## O que foi feito

### Lógica (`TARJA_ESCASSEZ` em `js/config.js`, `js/modulos/escassez.js`)

- **Configuração:** `{ ativo: true, vendidos: 3100, meta: 4000, inicio: 16/11 13:35, fim: 19/11 23:59:59, teto: 99, curva: 1.6 }`, com horários em −03:00.
- **Cálculo:**
  - real = vendidos / meta (hoje 77,5%);
  - rampa = base + (teto − base) × (1 − (1 − x)^curva), com base = real e x = fração do tempo entre o início e o fim, travada entre 0 e 1;
  - exibido = arredondar(max(real, rampa)), no máximo 99. Nunca mostra 100, e depois do fim fica em 99.
- **Atualização:** recalcula ao abrir a página e a cada 60 s, pelo relógio do navegador.
- **Mudar o número real:** basta alterar `vendidos`. Se o real passar da rampa, vale o real.
- **Desligar:** com `ativo: false`, a tarja some e a nav volta ao topo (`html.tarja-encerrada` zera a `--tarja-altura`).
- **Documentação:** no README, seção "Tarja de escassez (LP)".

### A contagem de tempo saiu da LP

- Saíram o texto "Essa oferta se encerra em" e os chips de dias, horas, minutos e segundos.
- A LP não carrega mais o `css/tarja.css` nem o `js/modulos/tarja.js`. O quiz continua usando os dois, sem mudança.
- A nova tarja ocupa o mesmo lugar:
  - fica grudada no topo, com a nav logo abaixo;
  - as âncoras descontam a `--tarja-altura`, que agora é de 64 px (76 px até 767 px);
  - o degradê do vão entre a tarja e a nav passou para a cor da base da nova tarja (#FFF7F1).

### Visual

- **Desktop (64 px):**
  - o fundo e o filete de 3 px com brilho pedidos;
  - em uma linha, com gap de 26 px: o "ao vivo" pulsando, a frase ("acabando" em 800, no degradê vermelho), o medidor de 300 × 14 px, a % e o botão "Garantir o meu";
  - o botão vem em fundo #0E0B0A, com 38 px de altura, raio `10px 0` e a gota laranja com a seta.
- **Medidor:**
  - um traço de 2 px marca os 100%;
  - o preenchimento vai no degradê #FFA25C → #E52B24, com listras diagonais correndo (loop de 0,9 s) e um brilho que atravessa a cada 3,6 s;
  - a ponta é branca, com borda de 3 px #E52B24, halo e brilho;
  - na entrada, o preenchimento anima de 0 até o valor em 1,2 s, com ease-out;
  - a ponta, o brilho e a entrada andam com `transform` e não deslocam o layout (CLS 0).
- **Porcentagem:** o número em Barlow 800 de 30 px, no degradê vermelho, com o "%" a 0,58em; embaixo, "DOS PLANOS VENDIDOS" em 10 px com espaçamento .16em.
- **Faixas intermediárias** (não estavam no pedido; a linha de 1020 px não cabe nelas):
  - 768–1199 px: sem o "Friday", medidor de 200 px e gap de 18 px;
  - 768–1023 px: sem o botão, porque a tarja inteira já é o link.
- **Mobile (até 767 px, 76 px, duas linhas):**
  - linha 1: o "ao vivo" + "Os planos da Black estão acabando" (13,5 px) à esquerda e "78% VENDIDOS" à direita;
  - linha 2: o medidor de ponta a ponta, com 10 px e ponta de 16 px;
  - sem botão.
  - Até 389 px, a linha de cima aperta um pouco (texto de 12,5 px e número de 22 px). Em 360 px, o conteúdo fica entre 12 e 348 px.
- Não há "Últimas vagas" nem "Esgota".

### Link, acessibilidade e tracking

- **Link:** a tarja inteira leva para #planos, com "Ver os planos." para o leitor de tela e foco visível (contorno de 2 px por dentro). O primeiro Tab da página cai nela.
- **Medidor:** `role="progressbar"`, com `aria-valuemin` 0, `aria-valuemax` 100, `aria-valuenow` e `aria-valuetext` ("78% dos planos vendidos").
- **Tracking:** o clique continua como `cta_click` "tarja". A barra mobile ignora a tarja na conta dos CTAs na tela.
- **Movimento reduzido:** sem listras correndo, sem brilho, sem pulso e sem animação de entrada.

## Arquivos criados/alterados

**Criados:**
- `css/escassez.css`;
- `js/modulos/escassez.js`;
- `relatorios/escassez.md`.

**Alterados:**
- `index.html`: a nova tarja no lugar da do timer, e o `escassez.css` no lugar do `tarja.css`;
- `js/main.js`: `iniciarEscassez`;
- `js/config.js`: `TARJA_ESCASSEZ`;
- `js/modulos/barra-mobile.js`: ignora a `.escassez`;
- `css/secoes/topo.css`: a cor do vão;
- `README.md`, `CLAUDE.md` e `PROMPTS-LP-BLACK.md`;
- os `?v=` (versão `202611161448`).

## Capturas (shots/escassez/)

- `{360,390,768,1024,1440,1920}-topo.png`;
- `1440-desligada.png`, com `ativo: false`.

## Checagens rodadas

| Largura | Altura | Conteúdo (esq.–dir.) | Rolagem lateral | CLS | Erros |
|---|---|---|---|---|---|
| 360 | 76 | 12–348 | não | 0 | 0 |
| 390 | 76 | 16–374 | não | 0 | 0 |
| 768 | 64 | 60–708 (sem botão) | não | 0,0001 | 0 |
| 1024 | 64 | 110–914 | não | 0,0001 | 0 |
| 1440 | 64 | 221–1219 | não | 0 | 0 |
| 1920 | 64 | 461–1459 | não | 0 | 0 |

- **Tarja e nav:** rolando, a tarja fica no topo e a nav logo abaixo (92 px no mobile e 80 px no desktop).
- **Clique na tarja:** leva a #planos. O topo dos planos fica em 170 px no mobile e 168 px no desktop, abaixo da nav, e o `cta_click` "tarja" vai para o dataLayer.
- **Datas simuladas** (relógio do navegador):

| Data | Valor |
|---|---|
| seg 16/11 13:35 | 78% |
| ter 17/11 12h | 86% |
| qua 18/11 12h | 93% |
| qui 19/11 12h | 98% |
| qui 19/11 22h | 99% |
| sex 20/11 12h | 99% |
| qua 25/11 12h | 99% |

  O `aria-valuetext` acompanha os valores. Sem recarregar a página, o valor sobe sozinho: ter 12h, 86%, e 6 h depois, 88%.
- **`ativo: false`:** a tarja some, a `--tarja-altura` vai a 0, a nav volta para 18 px do topo e não há erros.
- **Movimento reduzido:** listras, brilho e pulso sem animação, e a transição de entrada com 0 s.
- **Entrada:** amostras do preenchimento, de 0 até 78%.
- **Cache:** `npm run versao` e `--conferir` OK.

## Textos a aprovar

São todos do pedido e estão registrados no `PROMPTS-LP-BLACK.md`: "Os planos da Black Friday estão acabando" (no mobile, sem "Friday"), "Dos planos vendidos" / "Vendidos", "Garantir o meu", "Ver os planos." e "78% dos planos vendidos".

## Ajustes finais (16/11)

Commit `ajuste: tarja de escassez sem botão, % numa linha, medidor sincronizado`.

1. **Sem o botão "Garantir o meu"**, em todas as larguras: o "Aproveitar" da nav já cumpre esse papel. A tarja inteira continua sendo o link para #planos, com "Ver os planos.", foco visível e `cta_click` "tarja".
2. **Porcentagem numa linha:**
   - "78%" em Barlow 800, com 30 px no desktop, 24 px no mobile e 22 px até 389 px; degradê vermelho e "%" a 0,58em;
   - ao lado, a 8 px e alinhado pela base: "dos planos vendidos" em Inter 600, 14 px, rgba(14,11,10,.72), sem caixa alta;
   - no mobile, só "vendidos" (12 px), na mesma linha.
   - Com o espaço do botão livre, a frase inteira ("…Black Friday estão acabando") volta a partir de 1024 px. De 768 a 1023 px ela ainda não cabe: a linha sem o "Friday" já vai de 32 a 736 px. Nessa faixa ficam o medidor de 180 px e o gap de 18 px.
3. **Entrada sincronizada.**
   - **Causa:** o preenchimento animava `width`, calculado na thread principal, e a ponta animava `transform`, que roda no compositor. Com a carga da página ocupando a thread principal, a ponta corria à frente do laranja.
   - **Correção:** uma fonte única, `@property --p` (`<percentage>`). O JS põe o valor, e a transição anima só a `--p` (1,2 s, ease-out). O preenchimento é recortado com `clip-path: inset(0 calc(100% − --p) 0 0 round 999px)` e a ponta anda com `translateX(calc(--p − 100%))`. Os dois derivam do mesmo valor a cada quadro e nenhum desloca o layout.
   - **Medido quadro a quadro durante a entrada:** 192 quadros em 1440 px e 393 em 390 px, com diferença máxima entre a ponta e a `--p` de 0,00 ponto.
   - **Prints** a cada ~150 ms com as animações desaceleradas 10×: o laranja e a ponta andam juntos.
4. **`vendidos: 3100` e `meta: 4000` confirmados:** saiu o "a confirmar" do config.

### Testes

| Largura | Conteúdo | "Friday" | Rótulo | CLS | Rolagem lateral | Erros |
|---|---|---|---|---|---|---|
| 360 | 12–348 | não | "vendidos" 12 px | 0 | não | 0 |
| 390 | 16–374 | não | "vendidos" 12 px | 0 | não | 0 |
| 768 | 32–736 | não | "dos planos vendidos" 14 px | 0 | não | 0 |
| 1024 | 66–958 | sim | idem | 0 | não | 0 |
| 1440 | 274–1166 | sim | idem | 0 | não | 0 |
| 1920 | 514–1406 | sim | idem | 0 | não | 0 |

- O resto continua igual:
  - datas simuladas: 78 / 86 / 93 / 98 / 99 / 99 / 99;
  - recálculo sem recarregar (ter 12h, 86%; 6 h depois, 88%);
  - `ativo: false`, movimento reduzido, o clique levando a #planos abaixo da nav e o `cta_click` "tarja".
- `npm run versao` e `--conferir` OK.

### Prints (shots/escassez-ajuste/)

- `{360,390,768,1024,1440,1920}-topo.png`;
- a entrada a cada ~150 ms (desacelerada 10×): `{1440,390}-entrada-00…13.png` e as folhas `{1440,390}-entrada-folha.png`.

## Sombra e porcentagem (16/11)

Commit `ajuste: tarja de escassez sem brilho claro, % no tamanho da frase`.

1. **Sombra:**
   - A faixa clara sobre a nav era o degradê claro (#FFF7F1) do vão entre a tarja e a nav, posto para esconder o conteúdo que aparecia ali ao rolar. Ele virou um véu escuro, na cor da base da página: o vão continua escondido, sem clarear a nav.
   - O filete de 3 px ficou sem o glow laranja.
   - A sombra da tarja agora é `0 6px 16px -8px rgba(0,0,0,.55)`.
2. **"78% dos planos vendidos" num tamanho só:**
   - a frase usa a mesma fonte e o mesmo tamanho da mensagem da esquerda (Inter: 16 px no desktop, 13,5 px no mobile e 12,5 px até 389 px);
   - o "78%" (com o "%" do tamanho do número) vem em 800, no degradê vermelho;
   - "dos planos vendidos" (no mobile, "vendidos") vem em 600, no cinza escuro;
   - sem Barlow e sem número grande.
   - **Diferença em relação ao pedido:** o pedido citava 14 px, mas a mensagem da esquerda tem 16 px. Segui "o mesmo tamanho da mensagem". Se for para ficar em 14 px, a mensagem também precisa mudar.

### Testes

- 360–1920 px: sem rolagem lateral, sem sobreposição e com CLS 0. Em 360 px, o conteúdo fica entre 12 e 348 px.
- `npm run versao` e `--conferir` OK.

### Prints

`shots/escassez-sombra/{390,1440}-{antes,depois}-{parada,rolada}.png`.

## Mais destaque (16/11)

Commit `ajuste: tarja de escassez com mais destaque (% azul, trilho preto)`.

1. **Tipografia maior, com a % como estrela:**

| | Desktop | 768–1023 px | Mobile | Até 389 px |
|---|---|---|---|---|
| Mensagem (Inter 700, "acabando" em 800 no degradê vermelho) | 18 px | 18 px | 14 px | 13 px |
| "78% dos planos vendidos" ("78%" em 800, mesmo tamanho do número e do %) | 22 px | 22 px | 16 px ("78% vendidos") | 15 px |
| Altura da tarja | 72 px | 84 px | 76 px | 76 px |

   - A nav e as âncoras acompanham a altura de cada faixa: nav grudada logo abaixo da tarja, e os planos parando abaixo da nav.
   - **Mobile (diferença em relação ao pedido):** com a mensagem a 14 px e a % a 16 px, as duas não cabem na mesma linha (em 390 px passariam de 410 px). A mensagem fica inteira em cima, e "78% vendidos" vai para a direita do medidor, embaixo.
   - **768–1023 px:** numa linha só, o medidor teria que cair a ~100 px para caber em 768 px. Em vez de reduzir o texto, essa faixa usa duas linhas com as fontes do desktop: a frase inteira (com "Friday") em cima e, embaixo, o medidor largo com "78% dos planos vendidos", numa coluna de até 680 px.
   - **1024–1199 px:** o medidor cai para 200 px e o gap para 20 px. O texto continua inteiro.
2. **Trilho preto:**
   - #0E0B0A com borda interna rgba(255,255,255,.08);
   - 16 px no desktop e 12 px no mobile;
   - o traço de 100% em rgba(255,255,255,.35), dentro do trilho;
   - a ponta branca, com borda vermelha, ganhou um halo um pouco mais forte para se destacar sobre o preto.
3. **"78%" no azul da Zero7:**
   - degradê de texto de #1689E0 a #0A4FB8, em 800;
   - **contraste**, do branco ao ponto mais alaranjado do fundo: tom claro 3,15–3,69:1 e tom escuro 6,35–7,44:1. O texto grande e negrito pede 3:1, então passa sem escurecer;
   - só o "78%" é azul; a mensagem, o "acabando", a barra e o filete seguem no laranja e no vermelho.

### Testes

| Largura | Altura | Conteúdo | CLS | Rolagem lateral | Erros |
|---|---|---|---|---|---|
| 360 | 76 | 12–348 | 0 | não | 0 |
| 390 | 76 | 16–374 | 0 | não | 0 |
| 768 | 84 | 54–724 | 0 | não | 0 |
| 1024 | 72 | 59–965 | 0 | não | 0 |
| 1440 | 72 | 211–1229 | 0 | não | 0 |
| 1920 | 72 | 451–1469 | 0 | não | 0 |

- O resto continua igual: `ativo: false`, movimento reduzido, datas, `cta_click` "tarja" e o medidor sincronizado.
- `npm run versao` e `--conferir` OK.

### Prints

- `shots/escassez-destaque/{390,1440}-destaque-{parada,rolada}.png`;
- `{360,768,1024,1920}-topo.png`.

## Tema azul e tudo maior (16/11)

Commit `ajuste: tarja de escassez no azul da Zero7, maior`. Substitui as cores e os tamanhos do commit 46ec5b1.

1. **Tema azul:**
   - **Fundo:** `linear-gradient(90deg, #021F4D, #06398F 45%, #0A4FB8)` com a luz ciano no topo.
   - **Filete e sombra:** o filete de 3 px no degradê laranja, sem glow; a sombra escura sutil; o véu escuro do vão continua.
   - **Textos e "ao vivo":** textos em branco; o "ao vivo" em #FF8A3D, com o anel pulsando.
   - **"acabando":** degradê #FFB37A → #FFA25C, em 800. O pedido sugeria terminar em #FF8A3D, mas medido pixel a pixel no pior ponto (onde a luz do topo clareia o azul) ele ficava em 2,85:1 no mobile. Com #FFA25C, no mínimo **3,37:1** em todas as larguras.
2. **Fontes:** a mensagem tem 20 / 15 / 14 px; "78% dos planos vendidos", 26 / 18 / 17 px, com o "78%" em 800 branco e o resto em 600 branco .78 (7:1).
3. **Medidor:**
   - trilho #061633 com borda interna .12 e o traço de 100% em branco .4;
   - preenchimento #FFA25C → #FF6A1A → #F2441F, com listras e brilho;
   - ponta branca com borda #FF6A1A e halo laranja (26 px no desktop e 18 px no mobile).
4. **Alturas e faixas:**

| Faixa | Altura | Layout | Medidor |
|---|---|---|---|
| ≥ 1440 px | 84 | uma linha | 360 × 20 px |
| 1200–1439 px | 84 | uma linha | 280 px |
| 1080–1199 px | 84 | uma linha | 240 px |
| 768–1079 px | 96 | duas linhas | largo |
| até 767 px | 84 | duas linhas | 100% × 14 px |

   - **Por que 1024 ficou em duas linhas:** mesmo com o medidor em 240 px, a linha única pede 1075 px e não cabe em 1024. Por isso o layout de duas linhas vai até 1079 px.
   - A nav e as âncoras acompanham as alturas.

### Testes

- **Larguras:** 360, 390, 768, 1024, 1100, 1280, 1440 e 1920 px.
  - Sem rolagem lateral, sem sobreposição e com CLS 0.
  - Nada encosta nas bordas: em 360 px o conteúdo fica entre 12 e 348 px, e em 1100 px entre 29 e 1071 px.
- `ativo: false`, movimento reduzido e `cta_click` "tarja" funcionando.
- **Contraste mínimo, medido atrás do texto:**

| Largura | "acabando" | "dos planos vendidos" |
|---|---|---|
| 1440 | 4,03 | 7,02 |
| 1280 | 3,86 | 6,98 |
| 1100 | 3,81 | 6,78 |
| 1024 | 3,44 | 7,11 |
| 768 | 3,56 | 6,79 |
| 390 | 3,37 | 6,88 |
| 360 | 3,40 | 6,78 |

### Prints

`shots/escassez-azul/{360,390,768,1024,1100,1280,1440,1920}-topo.png` e `1440-desligada.png`.

## Perguntas / pendências

Nenhuma. `vendidos` e `meta` foram confirmados, e para atualizar o número real basta mudar `vendidos` e rodar `npm run versao`.
