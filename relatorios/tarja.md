# Tarja do topo: timer de 24 horas (LP e quiz)

O pedido era trazer da home o timer que vence a cada 24 horas, bonito e em destaque. Decisões do cliente: entra na LP e no quiz, numa tarja fixa no topo, com o texto da home.

## O que foi feito

- **Lógica:** a mesma da tarja da home (`prazosPromo` em `../Zero7/index.html`, só leitura).
  - O prazo é sempre o próximo 23:59:59 de Brasília, todo dia, até o `BLACK_FIM` (30/11).
  - Na home, os prazos são uma lista fixa. Aqui, o prazo do dia é calculado a partir de `TARJA_HORA_DIARIA` e do `BLACK_FIM`, os dois em `js/config.js`. Com isso, não há 30 datas para manter.
  - Depois do último prazo, a tarja some e a nav volta ao topo (`html.tarja-encerrada`).
- **Texto:** "Essa oferta se encerra em:", com "00d 14h 32m 07s", igual à home.
  - Como o timer zera a cada 24 horas, os dias são sempre 00. Até 600 px eles somem e o espaço vai para horas, minutos e segundos.
- **Visual:**
  - preto, com a luz laranja de cima e o filete do degradê da marca na base;
  - um quadradinho "ao vivo" no degradê, pulsando devagar (desligado com movimento reduzido);
  - os números em Barlow 800 branco, em chips de vidro com raio 8; as unidades no laranja claro;
  - altura fixa: 44 px, ou 40 px até 600 px.
- **Tarja clara na LP (ajuste do cliente):** na LP, toda escura, a tarja preta sumia. Lá ela é branca, como a da home (`.tarja--clara`): texto em tinta (~11:1), números brancos em chips pretos e unidades no laranja claro. O quiz, de fundo claro, continua com a tarja escura.
- **Posição:**
  - fica grudada no topo (`position: sticky`), acima da nav (z-index 70);
  - na LP, a nav gruda logo abaixo (`top: calc(var(--tarja-altura) + 16px)`), e o `scroll-padding-top` das âncoras desconta a tarja;
  - no quiz, fica acima do topo claro. O palco do desktop desconta a altura para continuar cabendo na tela.
- **Acessibilidade:**
  - os números são `aria-hidden`;
  - o `role="timer"` leva "Essa oferta se encerra em X horas e Y minutos", atualizado só quando o minuto muda.
- **Sem salto de layout:** a tarja nasce no HTML com a altura fixa, e os números ficam invisíveis (com a largura reservada) até o primeiro cálculo.
- **Correção no quiz:** o painel nascia `hidden` e só aparecia quando o `quiz.js` rodava. Se a primeira pintura saísse antes, o card crescia de 224 para 624 px.
  - Agora o painel e a P1 já nascem prontos no HTML, com os segmentos e a contagem desenhados. Sem JS, o CSS esconde o painel e fica o aviso do `<noscript>`.
  - A lógica não mudou.

## Arquivos criados/alterados

**Criados:**
- `css/tarja.css`;
- `js/modulos/tarja.js`;
- `relatorios/tarja.md`.

**Alterados:**
- `index.html` e `js/main.js`: a tarja na LP;
- `css/secoes/topo.css`: a nav e as âncoras descontam a tarja;
- `quiz/index.html`, `quiz/quiz.js` e `quiz/quiz.css`: a tarja no quiz, o layout em flex e a P1 pronta no HTML;
- `js/config.js`: `TARJA_HORA_DIARIA`;
- `CLAUDE.md`, `README.md` e `PROMPTS-LP-BLACK.md`.

## Capturas (shots/tarja/)

- `{360,390,768,1440,1920}-lp-topo.png`;
- `{…}-lp-rolada.png`, com a tarja e a nav grudadas depois de rolar;
- `{…}-quiz-topo.png`.

## Checagens rodadas

- **Cabe sem vazar:** de 360 a 1920 px, com o conteúdo da tarja dentro da tela e sem scroll horizontal.
- **Nav da LP:** rolada, a tarja fica em `top: 0` e a nav logo abaixo, em 56 px no mobile e 60 px no desktop.
- **Âncoras:** "Planos", pela nav no desktop e pelo menu no mobile, para abaixo da nav. O topo dos planos fica em 148 px no desktop e 134 px no mobile, com a base da nav em 130 e 118 px.
- **Texto e leitor de tela** (às 9h08): "Essa oferta se encerra em: 14h 51m …" e aria "Essa oferta se encerra em 14 horas e 51 minutos".
- **CLS** (carga, Playwright): LP ≤ 0,0001 e quiz ≤ 0,0003. Antes da correção, o quiz dava 0,03 a 0,06.
- **Lighthouse mobile**, a versão sem e a com a tarja em seguida, na mesma máquina:

| Página | Sem a tarja | Com a tarja |
|---|---|---|
| LP | perf 78, LCP 3,6 s, TBT 420 ms | perf 79, LCP 3,6 s, TBT 380 ms |
| Quiz | perf 95, LCP 2,9 s, TBT 0 ms | perf 94, LCP 2,9 s, TBT 90 ms |

  - CLS 0 e acessibilidade 100 nas duas páginas.
  - Hoje a máquina está com ruído (uma rodada isolada deu TBT de 950 ms). Por isso a comparação foi feita lado a lado.
- **Console:** sem erros nas duas páginas.
- **Rede:** nenhum 404.
- **`lead.php`:** interceptado em todos os testes.

## Textos a aprovar usados

"Essa oferta se encerra em:" e as unidades d/h/m/s, os mesmos da tarja da home no ar. Para o leitor de tela: "Essa oferta se encerra em X horas e Y minutos". Registrados no `PROMPTS-LP-BLACK.md`.

## Perguntas / pendências

1. **Último dia:** em 30/11 o timer vai até as 23:59:59 (o `BLACK_FIM`) e a tarja some. A hora do fim da Black continua com o `TODO: confirmar` da P1.
2. **Link:** na home, a tarja inteira é um link para a LP. Aqui ela não é link. Quer que leve para os planos (`#planos`) na LP e para o início do quiz no quiz?
