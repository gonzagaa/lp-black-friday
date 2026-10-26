# Fase 4: Planos

## O que foi feito

**Antes desta fase entraram:**
- o ajuste aprovado da Fase 3 (commit `fase 3 (ajuste): títulos balanceados`);
- o ajuste do cliente nos títulos de seção (commit `ajuste: títulos de seção centralizados e hierarquia`), descrito em "Ajuste do cliente: títulos de seção", no fim deste relatório.

Fiz o ajuste dos títulos **antes** de terminar os planos, num commit separado, para a seção já nascer no padrão novo.

**Onde ver:** http://localhost:5501/#planos. Para o teste de UTM: http://localhost:5501/?utm_source=teste&utm_campaign=bf26.

**Lidos antes de escrever código** (só leitura):
- `../Zero7/index.html` (a `section#plan` inteira);
- `script/blackPlanos.js`, `script/planosAtivo.js`, `script/4selet.js` e `script/planos.json`;
- `css/planosAtivo.css` e `css/sectionPlanos.css`;
- os prints 05 e 06 (layout da home) e os trechos de planos dos prints 02 e 03 (pele Black).

O `planos.json` da home continua idêntico ao snapshot de `data/planos.json`.

### Transição e cabeçalho
- A seção sobe recortada em candles (`.div-candles`), com os topos acesos.
- Fundo: `radial-gradient(60% 40% at 50% 0%, rgba(255,106,26,.07), transparent 70%)` sobre `#0c0908`, com a grade de 72 px sumindo para baixo.
- Cabeçalho no padrão novo (`.cabecalho-secao` + `.titulo-secao`):
  - `.tag` "Planos Black Friday";
  - H2 da copy, com "80% OFF" em `#FF6A1A`;
  - barra de 120 × 3 em degradê laranja.
- **Seletor de mercado:** pílula com "Mini Índice / Dólar" | "Futuro de Bitcoin". Mesma semântica da home: `role="radiogroup"`, `role="radio"` com `aria-checked` e tabindex móvel; setas, Home e End trocam o mercado; `?ativo=bitcoin` abre no Bitcoin. A opção ativa fica em laranja com texto escuro.
- **H3 com o nome do mercado:** os textos da home ("Mini índice / Dólar" e "Contrato Futuro de Bitcoin", do `planosAtivo.js`).
- **Modos:** a mesma lógica do `blackPlanos.js` (só os `config.modes` ativos, `defaultMode`, `hideButtonsWhenSingleMode` e a `footnote` do modo). "Escolha seu modelo de avaliação" e as três descrições são os textos da home, palavra por palavra.
  - Hoje só o modo "60dias" está ativo e `hideButtonsWhenSingleMode` é `true`, então essa parte fica **escondida**, como na home.
  - Testei com os três modos ativos (ver "Checagens").

### Cards (mesma estrutura da home: `.card[data-plan="<chave>"]`)
- **Casca:** raio 24 24 24 0, borda .14, fundo `#050303 → #0d0908`, padding 50/18/22, cards alinhados **pelo topo** (na home e no print eles esticam).
- **Aba do nome:** sobre a borda (top −27, 76% da largura, 54 px, raio 16, Barlow 900 30 px).
- **Selo** `.selo-plano` "80% OFF" em todos os cards: 74 px, 12°, top −30 / right −18.
- **Sênior:** borda 2 px laranja .7 com brilho, aba com borda laranja e a tarja da home ("Nossos traders mais positivos operam o plano Sênior").
- **Chips:** rótulos e valores copiados do HTML da home. "Máximo de dias" vem do JSON (`maxDias`).
  - Índice: 3 + 3 + 2 (os dois últimos largos). Bitcoin: 3 + 3.
- **Preço:** "de ~~oldPrice~~ por" (risco laranja de 2 px), "12x" em Barlow 800 36 px laranja + valor em Barlow 900 50 px, e "ou {valor} à vista", com "ou" e "à vista" em laranja e **sem caixa alta**.
- **Nota:** a `footnote` do modo ativo ("*Plataforma gratuita por 60 dias. Após, cobrança mensal.").
- **CTA:** `.fbtn.fbtn--block` "Contratar plano", com `href` = checkout do JSON + a query da página (igual ao `withCurrentQueryParams`), `target="_blank" rel="noopener"` e `aria-label="Contratar plano {Nome}"`.
- **Sem a observação da Profit One** (P4).

### Dados (`js/modulos/planos.js`)
- **URL:** `PLANOS_URL` em `js/config.js` (`'data/planos.json'`, com `// TODO` e P3). Não apontei para produção.
- **Falha no fetch:** usa o snapshot embutido (`js/modulos/planos-snapshot.js`) e registra `console.warn`. O snapshot é gerado do `data/planos.json` por `npm run planos:snapshot`, para não ser copiado à mão.
- **Card incompleto:** card sem preço ou sem checkout válido não aparece, nem a aba dele. Até os dados chegarem, os cards ocupam o lugar deles sem aparecer (nunca um card sem preço na tela).
- **Nada de preço no HTML:** o HTML só tem a estrutura e as specs fixas. Conferido: 0 URLs de checkout e 0 preços no `index.html`.
- **Parse testado:** `js/modulos/precos.js` separa "12x R$14,42" e "ou R$144,21 à vista" sem alterar valores. Os testes (`npm test`, 8 de 8 passando) conferem que **os 24 itens reais do JSON** (3 modos × 8 planos), separados e juntados de novo, voltam idênticos. Também cobrem formatos inválidos, o `comQueryAtual` (igual ao `withCurrentQueryParams`) e a validação do checkout.

### Carrossel (`js/modulos/carrossel.js`, sem biblioteca)
- CSS scroll-snap, com 3 cards a partir de 1200 px, 2 entre 768 e 1199 px e 1 + espiada abaixo de 768 px.
- **Plano ativo:** o do meio quando cabem 3; o primeiro da tela quando cabem 1 ou 2. Abre no Sênior (índice) e no primeiro card (Bitcoin). Trocar de mercado reposiciona.
- **Setas** `.ibtn` nas laterais, desabilitadas nas pontas.
- **Abas** com o nome de cada plano: sublinhado laranja e `aria-current` na ativa. Elas acompanham a rolagem (swipe nativo).
- **Teclado:** com o trilho em foco (`tabindex="0"`, `role="region"`), setas, Home e End.

### Decisões que tomei (confira)

1. **Geometria do trilho, para o selo nunca ser cortado e sem fatia dos vizinhos.**
   - O selo vaza 26 px para a direita do card. O trilho tem 32 px de folga de cada lado e invade a margem da seção nessa medida, então os cards ficam com a largura do protótipo (360 px em 1440).
   - O vão entre cards é de 32 px (o próximo card começa fora da tela), e uma máscara apaga a folga da esquerda, onde aparecia o selo do card anterior.
2. **Setas só a partir de 1200 px.** Entre 768 e 1199 px elas ficariam por cima dos cards; ali valem as abas, o swipe e o teclado. A home também esconde as setas abaixo de 1080 px.
3. **Quando todos os cards cabem na tela** (o Bitcoin, a partir de 768 px), os cards ficam centralizados e saem as setas e as abas, como o "lock" do Swiper na home.
4. **Abas no mobile em duas linhas de três**, como a home (o print 03 corta a fileira).
5. **Valor dos chips com tamanho ajustável.** Com 14 px fixos, "120 contratos" e "R$ 14.997,00" quebravam em duas linhas sempre que o card fica mais estreito que o protótipo (em 768 px, quase todos).
   - O valor acompanha a largura do card (container query): 14 px quando cabe, até 11,5 px no card mais estreito (o canvas mobile usa 12 px).
   - "R$" fica preso ao número (espaço não separável).
   - No Bitcoin (3 + 3, como pede a fase), "100% em conta real" vai para duas linhas, porque não cabe numa caixa de 1/3. Por isso a home usa 2 por linha nesses cards.
6. **Nome do plano em `<h4>`**, para respeitar a hierarquia: H2 da seção → H3 do mercado → H4 do plano. Na home é `h3`.
7. **Cabeçalho alinhado à esquerda no mobile.** A fase pede o cabeçalho centralizado, mas o ajuste do cliente (que veio depois) diz que todo cabeçalho de seção fica à esquerda abaixo de 768 px. O seletor de mercado ocupa a largura toda.
8. **Nome do mercado escala com a tela** (34 px no desktop, 26 px a partir de 768 px). Em 768 px ele ficava quase do tamanho do título da seção (34 contra 38).
9. **Regra global `[hidden] { display: none !important }`**, para o `hidden` (card sem dados, mercado inativo) sempre valer sobre o `display` dos componentes.
10. **Ferramenta de captura (`scripts/shots.mjs`).** O modo "página inteira" do Chromium desenha errado carrossel com scroll-snap + máscara + container query: mostra outra posição de rolagem.
    - Provei que é só da captura: o `scrollLeft` real não muda, e um redimensionamento comum também não muda nada.
    - As capturas agora são feitas em fatias do tamanho da janela, rolando de verdade, e emendadas. Na foto, a nav não gruda, para não se repetir em cada fatia.

## Arquivos criados/alterados

- `index.html`: seção `#planos` completa (cabeçalho, seletor, modos, 8 cards, carrosséis e abas)
- `css/secoes/planos.css` (novo conteúdo)
- `css/base.css`: regra global `[hidden]`
- `js/main.js`: importa o carrossel e os planos
- novos módulos: `js/modulos/planos.js`, `js/modulos/carrossel.js` e `js/modulos/precos.js`; e o `js/modulos/planos-snapshot.js`, gerado
- novos scripts: `scripts/snapshot-planos.mjs` e `scripts/testes/precos.test.mjs`
- `package.json`: scripts `planos:snapshot` e `test`
- `scripts/shots.mjs`: captura em fatias
- `relatorios/fase-4.md`

## Capturas (caminhos em shots/fase-4/)

- `planos-390.png`, `planos-768.png`, `planos-1024.png`, `planos-1440.png`, `planos-1920.png`: a seção em cada largura, com o selo inteiro.
- `planos-bitcoin-1440.png`, `planos-bitcoin-390.png`: o mercado Bitcoin.
- `comparacao-home.png`: o `05-planos-home-oficial.jpg` ao lado da LP em 800 px, nos mesmos planos (Expert e Master).
- `modos-3-ativos.png`: a UI de modos, forçando os 3 modos ativos.
- `360.png` … `1920.png`: página inteira.

## Conferência com a referência (o que bate, o que diverge e por quê)

**× `05-planos-home-oficial.jpg`** (`comparacao-home.png`): **mesma estrutura**. Aba do nome sobre a borda, chips 3 + 3 + 2 com os mesmos rótulos e valores, "de … por", "12x …", "ou … à vista", nota do modo, CTA "Contratar plano" e abas de plano embaixo. Muda só a pele (preto e laranja, selo, raio diagonal, botão laranja). Também sai a nota da Profit One (P4).

**× print 02 (pele Black):** bate em cabeçalho, seletor, título do mercado, cards, selos e abas. Divergências:
- os cards não esticam (pedido da fase);
- o selo da direita não é mais cortado (pedido da fase);
- o carrossel abre centrado no Sênior (o print foi tirado sem rolar);
- o título da seção está em Jakarta caixa normal (ajuste do cliente).

**× print 03 (mobile):** bate no card do Sênior (tarja, chips, preço, CTA), no seletor de largura total e no selo de 66 px. Divergências:
- "ou" e "à vista" sem caixa alta (a fase diz que o print está errado nesse ponto);
- cabeçalho à esquerda (ajuste do cliente);
- espiada do próximo card (pedida pela fase);
- abas em duas linhas.

## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)

### Tabela: modos ativos × planos, com o desconto real (1 − à vista / de)

Modo ativo: **60dias** (o `defaultMode` é "reinicio", mas está inativo; vale o primeiro ativo).

| Plano | De (oldPrice) | Parcelado | À vista | Checkout | Desconto real |
|---|---:|---:|---:|---|---:|
| Trainee | R$ 627,00 | 12x R$14,42 | R$144,21 | https://app.zero7.com.br/checkout/469145 | 77,0% ⚠ |
| Júnior | R$ 917,00 | 12x R$21,09 | R$210,91 | https://app.zero7.com.br/checkout/5055db | 77,0% ⚠ |
| Pleno | R$ 1.837,00 | 12x R$42,25 | R$422,51 | https://app.zero7.com.br/checkout/e04174 | 77,0% ⚠ |
| Sênior | R$ 3.047,00 | 12x R$70,08 | R$700,81 | https://app.zero7.com.br/checkout/bb0320 | 77,0% ⚠ |
| Expert | R$ 4.867,00 | 12x R$111,94 | R$1.119,41 | https://app.zero7.com.br/checkout/5aecd4 | 77,0% ⚠ |
| Master | R$ 5.937,00 | 12x R$136,55 | R$1.365,51 | https://app.zero7.com.br/checkout/029d91 | 77,0% ⚠ |
| BIT 16 | R$ 917,00 | 12x R$21,09 | R$210,91 | https://app.zero7.com.br/checkout/ae55bc | 77,0% ⚠ |
| BIT 8 | R$ 627,00 | 12x R$14,42 | R$144,21 | https://app.zero7.com.br/checkout/02aff1 | 77,0% ⚠ |

⚠ **Todos os planos têm 77,0% de desconto real, e o selo diz "80% OFF" (P2).**

Os modos inativos, só como referência (eles também não dão 80%):
- **30dias:** 60% (Trainee, Júnior, Expert, Master e BITs) ou 70% (Pleno e Sênior). O checkout do Sênior aponta para `https://zero7.com.br/copa-zero7/`.
- **reinicio:** os mesmos 60% / 70%, e também com o Sênior em `copa-zero7`.

### Teste de UTM: http://localhost:5501/?utm_source=teste&utm_campaign=bf26

**8 de 8 links de checkout** (os dois mercados) carregam os parâmetros, e todos com `target="_blank" rel="noopener"`:

| Plano | `href` |
|---|---|
| Trainee | `https://app.zero7.com.br/checkout/469145?utm_source=teste&utm_campaign=bf26` |
| Júnior | `…/checkout/5055db?utm_source=teste&utm_campaign=bf26` |
| Pleno | `…/checkout/e04174?utm_source=teste&utm_campaign=bf26` |
| Sênior | `…/checkout/bb0320?utm_source=teste&utm_campaign=bf26` |
| Expert | `…/checkout/5aecd4?utm_source=teste&utm_campaign=bf26` |
| Master | `…/checkout/029d91?utm_source=teste&utm_campaign=bf26` |
| BIT 16 | `…/checkout/ae55bc?utm_source=teste&utm_campaign=bf26` |
| BIT 8 | `…/checkout/02aff1?utm_source=teste&utm_campaign=bf26` |

Sem query, os 8 ficam exatamente iguais ao JSON. Se o checkout já tiver `?`, a query entra com `&` (coberto nos testes de unidade).

### Selo nunca cortado
Em 390, 768, 1024, 1440 e 1920 px, nos dois mercados, passei por **todas as 8 posições** do carrossel (clicando em cada aba). Em nenhuma o selo de um card inteiro na tela sai da área visível do trilho. No mobile, o card da espiada aparece cortado de propósito, junto com o selo dele.

### Dados e modos
- **Fetch bloqueado:** os 8 cards aparecem com os preços do snapshot, e o console mostra o `warning` "[planos] Não consegui usar data/planos.json (Failed to fetch). Usando o snapshot embutido." (mais o erro de rede do próprio bloqueio).
- **JSON com problema** (Expert sem checkout; Master com o parcelado fora do formato): os dois cards e as duas abas somem, com um `warning` para cada.
- **Três modos ativos:**
  - os botões aparecem, e o padrão é o `defaultMode` "reinicio" (Sênior R$96,81, máx. "60 + reinício", sem nota);
  - clicar em "30 dias" troca para R$59,91, máx. "30", a nota do modo e a descrição "Os planos com 30 dias…".

### Teclado, swipe e página
- **Seletor de mercado:** a seta → vai para o Bitcoin (título "Contrato Futuro de Bitcoin"), e a ← volta.
- **Trilho em foco:** a seta → vai do Sênior para o Expert; Home vai para o Trainee.
- **Swipe** (rolar o trilho até o fim): a aba acompanha (Expert, o do meio dos três últimos).
- **Página:** sem scroll horizontal.
- **Capturas** (`npm run shots -- fase-4`): nas 7 larguras, sem scroll horizontal, sem erro de console e sem requisição externa.
- **CLS e LCP:** CLS 0,0000 na carga e depois de rolar a página toda (1440 × 900 e 390 × 844); o LCP continua no `h1#hero-titulo`.
- **Testes de unidade:** `npm test`, 8 de 8.

## Textos a aprovar usados nesta fase

**Na tela:** o rótulo "Planos Black Friday". Os demais vêm da copy (H2, "Contratar plano" e "80% OFF") ou da home, palavra por palavra: nomes de mercado e de plano, chips, tarja do Sênior, "Escolha seu modelo de avaliação", descrições dos modos e nota.

**Só para leitor de tela:**
- carrossel: "Planos Mini Índice / Dólar" / "Planos Futuro de Bitcoin", com papel "carrossel";
- setas: "Plano anterior" / "Próximo plano" (do protótipo);
- grupos: "Escolha o plano" (abas) e "Modelo de avaliação" (botões de modo);
- selo: "80% de desconto" (do protótipo).

## Perguntas / pendências

1. **P2: 77% × 80%.** O desconto real é 77,0% em todos os planos do modo ativo, e o selo diz 80%. Ajustamos os preços no `planos.json` ou o texto do selo?
2. **P3:** `PLANOS_URL` continua no snapshot local. Para onde ele aponta em produção?
3. **Setas só a partir de 1200 px** (decisão 2) e **cabeçalho à esquerda no mobile** (decisão 7): confirmar.
4. **Valor dos chips abaixo de 14 px** em cards estreitos (decisão 5): confirmar. A alternativa seria aceitar a quebra em duas linhas.
5. **Hover nos cards de plano:** a home acende a borda e sobe o card 2 px. A fase não pede, e não fiz. Quer?
6. **Título do Bitcoin:** usei o da home ("Contrato Futuro de Bitcoin"); o protótipo usava "Futuro de Bitcoin". Confirmar.
7. Seguem abertas: P1 (`BLACK_FIM`), o contador na barra mobile (Fase 6) e a grade de 72 px no mobile.

---

## Ajuste do cliente: títulos de seção (commit "ajuste: títulos de seção centralizados e hierarquia")

1. **Cabeçalho centralizado a partir de 768 px.** Novo `.cabecalho-secao` em `componentes.css`: rótulo, título e subtítulo, max-width 900 e `margin-inline: auto`; à esquerda abaixo de 768 px. Aplicado aos benefícios e aos planos.
2. **Saiu o link "Ir direto para os planos"** dos benefícios (desktop e mobile).
3. **Hierarquia:**
   - **Títulos de seção:** `.titulo-secao` em Plus Jakarta Sans 800, caixa normal, −.04em, line-height 1.02, `clamp(38px, 4.6vw, 64px)` e `text-wrap: balance`. Nos benefícios, "para o próximo nível." fica em branco .42; nos planos, "80% OFF" fica em `#FF6A1A` e o resto em branco. O ponto final leva o `-.07em` da Jakarta.
   - **Títulos de card** um degrau abaixo: os largos (01, 04 e 08) em `clamp(34px, 3vw, 44px)` e os normais em `clamp(26px, 2.1vw, 30px)`, com os tokens `--fs-card-destaque` e `--fs-card`.
   - **Relação medida** (título de seção ÷ título de card):

     | Seção | 1440 px | 768 px | 390 px |
     |---|---|---|---|
     | Benefícios (÷ card largo) | 64 ÷ 43,2 = **1,48×** | 38 ÷ 34 = 1,12× | 38 ÷ 34 = 1,12× |
     | Planos (÷ nome do plano) | 64 ÷ 30 = 2,13× | 1,27× | 1,36× |

     Em tablet e mobile, os dois `clamp` batem no mínimo; a diferença de fonte (Jakarta × Barlow caixa alta) é o que segura a hierarquia.
   - **O que continua em Barlow caixa alta:** títulos de card, nomes de plano, números, abas e o nome do mercado (34 px; 26 px a partir de 768 px).
   - O `.tag` continua em **Inter 600 caixa alta**, como no protótipo, e não em Barlow como o pedido sugere. Se quiser em Barlow, é uma linha.
4. **Regra 7 do CLAUDE.md** atualizada: Jakarta no H1, nos títulos de seção e na frase do fechamento; Barlow restrita; tamanhos dos cards; cabeçalho centralizado a partir de 768 px.

Capturas: `shots/ajuste-titulos/beneficios-1440.png`, `beneficios-768.png`, `beneficios-390.png`, `planos-1440.png` e `planos-390.png`.

Aguardando aprovação para a Fase 5.
