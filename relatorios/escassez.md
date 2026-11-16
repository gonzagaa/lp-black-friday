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

## Perguntas / pendências

1. **`vendidos` e `meta`** (3100 e 4000) estão com `TODO: confirmar` no config. Para atualizar, basta trocar o `vendidos` e rodar `npm run versao`.
2. **768–1199 px:** a linha inteira do desktop não cabe nessa faixa. Por isso tirei o "Friday", encolhi o medidor e, até 1023 px, escondi o botão. Ok?
