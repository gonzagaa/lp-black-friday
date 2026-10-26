# Fase 4: Planos (refeita: porte literal da home + pele Black)

## O que foi feito

A seção foi refeita pelo método pedido: **primeiro o código da home portado literalmente, medido contra a home, e só depois a pele Black.** Depois vieram quatro rodadas de ajuste do cliente (neutralizar a seção, tirar o destaque do Sênior, a seta do botão escuro e o preço em cinza); o resultado abaixo já inclui todas.

### 1. Porte (sem pele)

- **HTML.** `scripts/portar-planos-html.mjs` copia a `section#plan` de `../Zero7/index.html` (só leitura) para a `#planos`, com as mesmas classes e o rótulo "CONTRATAR PLANO <span>(NOME)</span>". Ele também faz estas trocas (o script documenta cada uma):
  - `id` plan → planos;
  - o cupom dá lugar ao cabeçalho de seção da LP;
  - saem as imagens de fundo e os `data-aos`;
  - o título do mercado vira `h3`;
  - sai a nota da Profit One;
  - preço, prazo e checkout saem do HTML (regra 2);
  - o CTA perde o `role="button"`;
  - cada card ganha a etiqueta 3D e o `aria-label="80% de desconto"`.
- **CSS.** `scripts/portar-planos-css.mjs` abre a home em produção com o rastreamento travado (`rastrear` = false e domínios de terceiros bloqueados). Ele varre todas as folhas nos dois mercados e guarda as regras que casam com a seção: planosAtivo, sectionPlanos, sectionPlanosTematico, button (`.z7-btnx`/`.btn`), componentes, global, tokens e o CSS do Swiper que vem no pacote da home. O resultado é gerado em `css/secoes/planos.css`.
  - **Escala:** a home usa raiz de 8 px (10 px a partir de 1080). Cada `Xrem` vira `calc(X * var(--rem))`, e `--rem` replica a raiz dentro de `#planos`, então as medidas finais em px saem iguais.
  - **O gerador também resolve:**
    - os tokens do `:root` da home, que passam para dentro da seção;
    - o `@font-face` dos ícones do Swiper (as setas);
    - shorthands com `var()` que o CSSOM perde (lidos do texto da folha);
    - regras que valem para a própria section (`section { padding-block }`);
    - as regras dos botões de modo (a home não os desenha com um modo só).
- **JS** (`js/modulos/home/`, cada arquivo com o cabeçalho "PORTE de …" listando o que mudou):
  - `blackPlanos.js`: módulo ES. Lê `PLANOS_URL` com fallback no snapshot e retira o card sem preço ou sem checkout válido. Modos, botões, nota, flash e `withCurrentQueryParams` são os da home.
  - `planosAtivo.js`: troca de mercado da home, seletor com teclado e `?ativo=`. Bitcoin usa só a classe `bit` (as regras de `.white` só mudam cor; `.tema` mudaria o tamanho do preço).
  - `selet4.js`: o 4selet sem jQuery. Como na home, ele não toca nos CTAs dos planos (quem repassa a query é o `blackPlanos`).
  - `carrosselPlanos.js`: `mySwiper4` e `mySwiper11` com a config do `global.js` (1/2/3 slides, espaçamento 5/20/60, loop, paginação com o nome do plano, slides fora da tela `inert`). O Swiper sai de `vendor/swiper-11.2.10/` sob demanda, depois do load, em idle e depois do `planos.json`. Rótulos de leitor de tela em português.
- **Swiper:** copiado de `../Zero7/vendor` para `vendor/swiper-11.2.10/` (JS 154 KB + LICENSE). Regra 10 do CLAUDE.md atualizada com a exceção.

### 2. Aceite de layout (antes da pele)

`scripts/medir-planos.mjs` mede com `getBoundingClientRect` a home (https://zero7.com.br/home/, sem rastreamento) e a LP nas cinco larguras, **nos dois mercados**. No teste, a LP recebe as fontes da home por uma rota do Playwright (nada disso vai para a página) e fica sem a pele. Origem: x a partir da borda da janela e y a partir do topo do `.swiper`.

**Resultado: 768 medidas, todas com Δ 0,0 px** (tolerância ±2 px). A tabela completa está no anexo, no fim deste relatório.

| Largura | Mini Índice / Dólar | Futuro de Bitcoin |
|---|---|---|
| 1920 | 125/125 ✅ | 66/66 ✅ |
| 1440 | 125/125 ✅ | 66/66 ✅ |
| 1024 | 85/85 ✅ | 66/66 ✅ |
| 768 | 85/85 ✅ | 66/66 ✅ |
| 390 | 47/47 ✅ | 37/37 ✅ |

A tarja do Sênior aparece na tabela como "removida a pedido do cliente" e fica fora da conta. Elementos medidos:
- faixa do carrossel e `.swiper`;
- por card: card, aba do título, h3, cada chip com rótulo e valor, oldPrice e o valor dele, preço, "12x", linha à vista com "ou" e "à vista", nota e botão com rótulo e gota;
- setas, paginação e cada indicador.

Três problemas do porte só apareceram graças à medição e foram corrigidos:
- a fonte de ícones das setas não tinha vindo;
- o Bitcoin com a classe `tema`;
- um recuo lateral da seção que a pele zerava.

### 3. Pele Black (`css/secoes/planos-black.css`, carregada depois)

Princípio do cliente: **seção preta e neutra.** O laranja fica só nas etiquetas 3D e no desenho do botão escuro.

- **Fundo ("palco de vitrine"):**
  - base `#050404`, sem tom laranja;
  - feixe de luz branca vindo de cima (cone com pico de branco a 6% e máscara);
  - piso em perspectiva sob os cards (grade de linhas a 5%, convergindo para trás dos cards, com máscara para os lados e para a frente);
  - gráfico de candles enorme atrás do título (`assets/texturas/planos-grafico.svg`, gerado por `scripts/gerar-grafico-planos.mjs`, branco a 3,5% com máscara radial);
  - o grão global continua por cima;
  - a entrada em candles continua, com os topos acesos.
- **Título:** bicolor como o dos benefícios. "80% OFF para garantir" em branco e "o seu plano perfeito." em branco .42, com a mesma fonte, tamanho e cinza do H2 dos benefícios. A partir de 768 px a parte cinza tem linha própria; no mobile a quebra é natural. Saiu a barrinha laranja.
- **Seletor de mercado:** a opção ativa é uma pílula escura elevada (`#1c1614`, borda branca .14, brilho interno no topo, texto branco); as inativas ficam em branco .55. Os botões de modo seguem o mesmo desenho.
- **Cards todos iguais:**
  - o Sênior não tem mais borda, glow nem tarja (o elemento saiu do HTML, sem espaço vazio);
  - o carrossel continua abrindo com o Sênior no meio (`data-inicial`);
  - as regras de `.card--copa` e `.card-tarja` saíram do CSS gerado;
  - fundo `#050303 → #0d0908`, borda e raio da home (`30px 30px 30px 0`);
  - nome do plano em Barlow 900 (38 px; 30 px abaixo de 1080);
  - chips em Inter com rótulo a .58. Rótulo/valor seguem a rampa da home até 13/16 px no desktop; abaixo de 1080, 11/13 px.
- **Preço:**
  - valores (parcelado e à vista) em branco, em Jakarta 800 a 50 px (36 px abaixo de 1080);
  - "12x" (Jakarta 800, 20 px), "ou" e "à vista" (Jakarta 700, 20 px) em branco .42;
  - "de ~~R$ X~~ por" igual, com o risco em cinza .42;
  - nenhum texto dos cards fica laranja.
- **CTAs:** todos na variante escura, com a caixa do `.z7-btnx` da home (largura total, 70 px, raio 20px 0) e o rótulo "CONTRATAR PLANO (NOME)" em Jakarta 700, 16 px.
- **`.fbtn--escuro` melhorado** (vale para a hero e para os planos, com os mesmos tokens `--escuro-*` em `tokens.css`):
  - borda de 1 px em degradê (branco .22 no topo → .04 na base) por máscara;
  - filete de neon laranja na base;
  - luz da borda mais fina e mais lenta (5 s);
  - seta **preta** (#0a0706, traço 2,4 px) na **gota laranja** com reflexo;
  - no hover, o neon e a borda acendem, o botão sobe 1 px, a varredura atravessa, a gota ganha `brightness(1.08)` e a seta avança 3 px.
  - Nos planos, o "→" da home virou o SVG da seta (traço 2,4 px).
  - Amostras no `componentes.html`.
- **Setas e indicadores:** setas neutras (borda branca de 2 px e raio 20px 0 da home, fundo branco .04). O indicador ativo ganha sublinhado branco.
- **Etiqueta 3D (`22-etiqueta-de-oferta`):**
  - no canto superior direito de cada card, vazando a borda (top −34 px, right −22 px e 110 px de altura no desktop; −24/−14 e 78 px no mobile);
  - `rotate(14deg)` com sombra forte e balanço de 10° a 18° em 4 s (origem em 50% 12%), parado com movimento reduzido;
  - `alt=""`, e o card leva `aria-label="80% de desconto"`;
  - o carrossel recorta só no eixo X, com 48 px de folga, e a etiqueta dos cards fora da tela some. Assim nunca é cortada nem aparece a do vizinho.
- **Mesma altura:** todos os cards têm a mesma altura em todas as larguras, nos dois mercados. Abaixo de 1080, o valor do chip em 13 px cabe numa linha (em 14 px, "R$ 14.997,00" quebrava e o Expert e o Master ficavam mais altos). O slide também estica até o mais alto, como garantia.

| Largura | Índice | Bitcoin |
|---|---|---|
| 1920 | 624,5 px (todos) | 624,5 px (todos) |
| 1440 | 605,8 px | 605,8 px |
| 1024 | 479,3 px | 415,8 px |
| 768 | 507,9 px | 444,4 px |
| 390 | 507,9 px | 444,4 px |

### Decisões que tomei (confira)

1. **Fontes e tamanhos fora do pedido.** Abaixo de 1080 usei preço a 36 px, nome do plano a 30 px e chips a 11/13 px. A home usa 8,4 px no rótulo do chip; subi por legibilidade. Por isso, no mobile, as alturas dos chips com pele diferem das da home.
2. **Espaço da seção:** mantive o da LP (150 px em cima, por causa dos candles, e 110 px embaixo). A home usa 80 px.
3. **Preço antigo:** o traço posicionado da home dependia da métrica da TT Fors; com Inter ele não cobria o valor. Troquei por `line-through` no próprio valor.
4. **Os 20 px do "12x", "ou" e "à vista" valem em todas as larguras,** para o cinza .42 contar como texto grande (ver o contraste abaixo).

## Arquivos criados/alterados

- **Criados:**
  - `css/secoes/planos-black.css`;
  - `js/modulos/home/blackPlanos.js`, `planosAtivo.js`, `selet4.js` e `carrosselPlanos.js`;
  - `scripts/portar-planos-html.mjs`, `portar-planos-css.mjs`, `medir-planos.mjs` e `gerar-grafico-planos.mjs`;
  - `assets/texturas/planos-grafico.svg`;
  - `vendor/swiper-11.2.10/`.
- **Alterados:**
  - `index.html`: `#planos` portada e o link da pele;
  - `css/secoes/planos.css`: agora GERADO;
  - `css/tokens.css`: tokens `--escuro-*`;
  - `css/componentes.css`: `.fbtn--escuro` melhorado;
  - `componentes.html`: amostras do botão escuro;
  - `js/main.js`;
  - `scripts/shots.mjs`: espera só as imagens visíveis;
  - `CLAUDE.md`: exceção do Swiper na regra 10 e o bloco "Planos".
- **Removidos:** `js/modulos/planos.js` e `js/modulos/carrossel.js` (carrossel próprio da 1ª versão).

## Capturas (caminhos em shots/fase-4/)

- **Lado a lado HOME × LP:** `comparacao-1920.png`, `comparacao-1440.png` e `comparacao-390.png`.
- **Seção:**
  - `planos-1920.png`, `planos-1440.png`, `planos-1024.png`, `planos-768.png` e `planos-390.png`;
  - Bitcoin: `planos-bitcoin-1440.png` e `planos-bitcoin-390.png`.
- **Antes do ajuste "menos laranja":** `ajuste-antes-1920.png`, `ajuste-antes-1440.png` e `ajuste-antes-390.png`.
- **Botões:**
  - `cta-plano-1440.png` e `cta-plano-hover-1440.png` (ampliados 2×);
  - `hero-fbtn-escuro-1440.png`;
  - `componentes-fbtn-escuro.png` (normal, hover, foco e ativo; sobre a luz da hero e sobre o preto dos cards).
- **Modos:** `modos-3-ativos.png`, com os 3 modos ligados por teste.
- **Página inteira:** `360.png` … `1920.png`.

## Conferência com a referência (o que bate, o que diverge e por quê)

- **Layout:** é o da home, medido (Δ 0 px em 768 medidas). Diferenças visuais em relação à home:
  - fontes e pele, que foram pedidas;
  - sem destaque no Sênior (pedido);
  - sem a nota da Profit One (P4 da 1ª versão).
- **Herdado da home:** em 390 px, a home tinha a tarja do Sênior por cima da 1ª fileira de chips. Como a tarja saiu, isso deixou de existir na LP.
- **"Compare com o print do cliente":** não recebi esse print, e em `_referencia/prints/` não há um novo. Comparei com a home e com a versão anterior (`ajuste-antes-*`). Se houver um print específico, me mande que eu comparo.
- **Laranja que sobrou na seção:**
  - as etiquetas;
  - o desenho do botão escuro (neon, luz da borda e gota);
  - os topos acesos dos candles da entrada;
  - **o pontinho do rótulo "Planos Black Friday"** (componente `.tag`, igual em todas as seções). Se quiser neutro aqui, é uma linha.

## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)

- **Página (`npm run shots -- fase-4`):** 360 a 1920 sem scroll horizontal, 0 erro no console e 0 requisição externa. Fontes: só as locais.
- **Console:** limpo nas cinco larguras. O único aviso é o do Swiper, "Loop Warning", no carrossel do Bitcoin (2 cards com `loop`), igual na home. Por causa disso, numa de três medições em 768 px os dois cards do Bitcoin vieram em ordem trocada; nas outras duas, Δ 0.
- **Desempenho:** LCP 1.884 ms (390 px, CPU 4× e 1,6 Mbps) e 208 ms (1440); **CLS 0,0000** na carga e na rolagem até os planos. O elemento de LCP continua sendo o H1 da hero.
- **Contraste do cinza .42 do preço:** 3,98:1 sobre `#050303` e 4,05:1 sobre `#0d0908` (as duas pontas do card). Em 20 px bold é texto grande (≥ 18,66 px bold), e passa de 3:1. Ficou .42; com .5 seria 5,3:1.
- **Etiqueta nunca cortada:** em cada largura (390 a 1920), mercado e posição do carrossel (8 posições por largura), a etiqueta dos cards na tela fica inteira e a dos cards fora da tela fica escondida. Nenhum problema.
- **Teclado:**
  - setas no seletor trocam o mercado e o título (com foco);
  - Tab em 1440: CTA Pleno → CTA Sênior → CTA Expert → setas → 6 indicadores → sai da seção;
  - Tab em 390: CTA Sênior → indicadores;
  - nunca entra em card fora da tela (`inert`).
- **Dados:**
  - **Fetch bloqueado:** o snapshot entra e os 8 planos ficam prontos (Sênior "12x R$70,08").
  - **Card inválido** (Expert sem checkout, Master com parcelado fora do formato): os dois saem do carrossel e da paginação.
  - **3 modos ligados:** os botões aparecem e o padrão é "Reinício". Clicar em "30 dias" troca o preço, o máximo de dias e a nota.
- **Reduced motion:** a etiqueta fica parada (`animation: none`). Sem a preferência: `planos-etiqueta-balanco 4s ease-in-out infinite`.
- `npm test`: 8/8.

### Tabela: modos ativos × planos, com o desconto real (1 − à vista / de)

**Modo 60dias (Planos 60 dias), o ativo:**

| Plano | De (oldPrice) | Parcelado | À vista | Checkout | Desconto real |
|---|---:|---:|---:|---|---:|
| Trainee | R$ 627,00 | 12x R$14,42 | R$144,21 | https://app.zero7.com.br/checkout/469145 | 77,0% ⚠ |
| Júnior | R$ 917,00 | 12x R$21,09 | R$210,91 | https://app.zero7.com.br/checkout/5055db | 77,0% ⚠ |
| Pleno | R$ 1.837,00 | 12x R$42,25 | R$422,51 | https://app.zero7.com.br/checkout/e04174 | 77,0% ⚠ |
| Sênior | R$ 3.047,00 | 12x R$70,08 | R$700,81 | https://app.zero7.com.br/checkout/bb0320 | 77,0% ⚠ |
| Expert | R$ 4.867,00 | 12x R$111,94 | R$1.119,41 | https://app.zero7.com.br/checkout/5aecd4 | 77,0% ⚠ |
| Master | R$ 5.937,00 | 12x R$136,55 | R$1.365,51 | https://app.zero7.com.br/checkout/029d91 | 77,0% ⚠ |
| BIT 8 | R$ 627,00 | 12x R$14,42 | R$144,21 | https://app.zero7.com.br/checkout/02aff1 | 77,0% ⚠ |
| BIT 16 | R$ 917,00 | 12x R$21,09 | R$210,91 | https://app.zero7.com.br/checkout/ae55bc | 77,0% ⚠ |

Os modos inativos (30dias: 60–70%; reinicio: 60–70%) seguem como na 1ª versão do relatório. A configuração lida é `defaultMode: reinicio`, `hideButtonsWhenSingleMode: true` e só o modo 60dias ativo.

### Teste de UTM: http://localhost:5501/?utm_source=teste&utm_campaign=bf26

| Plano | href | |
|---|---|---|
| trainee | https://app.zero7.com.br/checkout/469145?utm_source=teste&utm_campaign=bf26 | ✔ |
| junior | https://app.zero7.com.br/checkout/5055db?utm_source=teste&utm_campaign=bf26 | ✔ |
| pleno | https://app.zero7.com.br/checkout/e04174?utm_source=teste&utm_campaign=bf26 | ✔ |
| senior | https://app.zero7.com.br/checkout/bb0320?utm_source=teste&utm_campaign=bf26 | ✔ |
| expert | https://app.zero7.com.br/checkout/5aecd4?utm_source=teste&utm_campaign=bf26 | ✔ |
| master | https://app.zero7.com.br/checkout/029d91?utm_source=teste&utm_campaign=bf26 | ✔ |
| bit_junior | https://app.zero7.com.br/checkout/ae55bc?utm_source=teste&utm_campaign=bf26 | ✔ |
| bit_trainee | https://app.zero7.com.br/checkout/02aff1?utm_source=teste&utm_campaign=bf26 | ✔ |

**8/8** com os parâmetros, todos com `target=_blank rel=noopener` e `aria-label` "Contratar plano <Nome>". Sem query, os 8 hrefs ficam iguais ao JSON.

## Textos a aprovar usados nesta fase

- **Na tela:** só o rótulo "Planos Black Friday". O resto vem da copy (H2) ou da home, palavra por palavra: mercados, planos, chips, "Escolha seu modelo de avaliação", descrições dos modos, nota e "CONTRATAR PLANO (NOME)". Saiu a tarja "Nossos traders mais positivos operam o plano Sênior" (pedido).
- **Só para leitor de tela:**
  - card: "80% de desconto";
  - setas: "Plano anterior" e "Próximo plano";
  - fim do carrossel: "Este é o primeiro plano" e "Este é o último plano";
  - seletor: "Escolha o mercado" (da home).
  - Os indicadores são lidos pelo nome do plano.

## Perguntas / pendências

1. **P2: 77% × 80%.** O desconto real é 77,0% em todos os planos do modo ativo, e a etiqueta e o rótulo dizem 80%. Ajustamos os preços no `planos.json` ou o texto?
2. **P3:** `PLANOS_URL` continua no snapshot local. Para onde ele aponta em produção?
3. **Print do cliente** para a comparação do fundo: não recebi. Mande se houver um.
4. **Pontinho laranja do rótulo "Planos Black Friday"**: deixo (padrão das outras seções) ou neutralizo só aqui?
5. **Título do Bitcoin:** é o da home, "Contrato Futuro de Bitcoin". Confirmar.
6. **Manutenção:** o CSS e o HTML da seção são gerados a partir da home (`node scripts/portar-planos-css.mjs` precisa de rede). Se a home mudar, rode os dois scripts e o `medir-planos.mjs`.
7. Seguem abertas: P1 (`BLACK_FIM`) e o contador na barra mobile (Fase 6).

Aguardando aprovação para a Fase 5.

---

## Anexo: tabela do aceite de layout (home × LP, sem pele, ±2 px)

Valores em px: x a partir da borda da janela, y a partir do topo do `.swiper`, depois largura e altura. Gerada por `node scripts/medir-planos.mjs --saida=…`.

### 1920 px · Mini Índice / Dólar

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 1920, 763.5 | 0, 0, 1920, 763.5 | 0.0 | ✅ |
| swiper | 24, 0, 1872, 719.5 | 24, 0, 1872, 719.5 | 0.0 | ✅ |
| 1·PLENO card | 24, 40, 584, 639.5 | 24, 40, 584, 639.5 | 0.0 | ✅ |
| 1·PLENO aba do título | 142, 13.4, 348, 63 | 142, 13.4, 348, 63 | 0.0 | ✅ |
| 1·PLENO título (h3) | 173, 24.4, 286, 41 | 173, 24.4, 286, 41 | 0.0 | ✅ |
| 1·PLENO chip 1 | 40, 122, 177.3, 70.9 | 40, 122, 177.3, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 1 rótulo | 45, 135, 167.3, 16.9 | 45, 135, 167.3, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 1 valor | 45, 156.9, 167.3, 23 | 45, 156.9, 167.3, 23 | 0.0 | ✅ |
| 1·PLENO chip 2 | 227.3, 122, 177.3, 70.9 | 227.3, 122, 177.3, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 2 rótulo | 232.3, 135, 167.3, 16.9 | 232.3, 135, 167.3, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 2 valor | 232.3, 156.9, 167.3, 23 | 232.3, 156.9, 167.3, 23 | 0.0 | ✅ |
| 1·PLENO chip 3 | 414.7, 122, 177.3, 70.9 | 414.7, 122, 177.3, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 3 rótulo | 419.7, 135, 167.3, 16.9 | 419.7, 135, 167.3, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 3 valor | 419.7, 156.9, 167.3, 23 | 419.7, 156.9, 167.3, 23 | 0.0 | ✅ |
| 1·PLENO chip 4 | 40, 202.9, 177.3, 70.9 | 40, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 4 rótulo | 45, 215.9, 167.3, 16.9 | 45, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 4 valor | 45, 237.8, 167.3, 23 | 45, 237.8, 167.3, 23 | 0.0 | ✅ |
| 1·PLENO chip 5 | 227.3, 202.9, 177.3, 70.9 | 227.3, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 5 rótulo | 232.3, 215.9, 167.3, 16.9 | 232.3, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 5 valor | 232.3, 237.8, 167.3, 23 | 232.3, 237.8, 167.3, 23 | 0.0 | ✅ |
| 1·PLENO chip 6 | 414.7, 202.9, 177.3, 70.9 | 414.7, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 6 rótulo | 419.7, 215.9, 167.3, 16.9 | 419.7, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 6 valor | 419.7, 237.8, 167.3, 23 | 419.7, 237.8, 167.3, 23 | 0.0 | ✅ |
| 1·PLENO chip 7 | 40, 283.8, 271, 70.9 | 40, 283.8, 271, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 7 rótulo | 45, 296.8, 261, 16.9 | 45, 296.8, 261, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 7 valor | 45, 318.7, 261, 23 | 45, 318.7, 261, 23 | 0.0 | ✅ |
| 1·PLENO chip 8 | 321, 283.8, 271, 70.9 | 321, 283.8, 271, 70.9 | 0.0 | ✅ |
| 1·PLENO chip 8 rótulo | 326, 296.8, 261, 16.9 | 326, 296.8, 261, 16.9 | 0.0 | ✅ |
| 1·PLENO chip 8 valor | 326, 318.7, 261, 23 | 326, 318.7, 261, 23 | 0.0 | ✅ |
| 1·PLENO oldPrice | 178, 404.7, 276, 23 | 178, 404.7, 276, 23 | 0.0 | ✅ |
| 1·PLENO oldPrice valor | 270.3, 404.7, 85, 23 | 270.3, 404.7, 85, 23 | 0.0 | ✅ |
| 1·PLENO preço | 163, 442.7, 306, 50 | 163, 442.7, 306, 50 | 0.0 | ✅ |
| 1·PLENO "12x" | 163, 463.7, 38, 26 | 163, 463.7, 38, 26 | 0.0 | ✅ |
| 1·PLENO à vista (linha) | 163, 492.7, 306, 28 | 163, 492.7, 306, 28 | 0.0 | ✅ |
| 1·PLENO "ou" | 215.3, 494.7, 21.3, 24 | 215.3, 494.7, 21.3, 24 | 0.0 | ✅ |
| 1·PLENO "à vista" | 358, 494.7, 58.6, 24 | 358, 494.7, 58.6, 24 | 0.0 | ✅ |
| 1·PLENO nota de rodapé | 160.7, 534.7, 310.7, 14.8 | 160.7, 534.7, 310.7, 14.8 | 0.0 | ✅ |
| 1·PLENO botão | 40, 587.5, 552, 70 | 40, 587.5, 552, 70 | 0.0 | ✅ |
| 1·PLENO botão rótulo | 77, 614.5, 244, 16 | 77, 614.5, 244, 16 | 0.0 | ✅ |
| 1·PLENO botão gota | 519, 597.5, 63, 50 | 519, 597.5, 63, 50 | 0.0 | ✅ |
| 2·SÊNIOR card | 668, 40, 584, 639.5 | 668, 40, 584, 639.5 | 0.0 | ✅ |
| 2·SÊNIOR aba do título | 786, 13.4, 348, 63 | 786, 13.4, 348, 63 | 0.0 | ✅ |
| 2·SÊNIOR título (h3) | 817, 24.4, 286, 41 | 817, 24.4, 286, 41 | 0.0 | ✅ |
| 2·SÊNIOR tarja | 685, 84, 550, 32 | — (removido a pedido do cliente) | — | ➖ |
| 2·SÊNIOR chip 1 | 684, 122, 177.3, 70.9 | 684, 122, 177.3, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 1 rótulo | 689, 135, 167.3, 16.9 | 689, 135, 167.3, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 1 valor | 689, 156.9, 167.3, 23 | 689, 156.9, 167.3, 23 | 0.0 | ✅ |
| 2·SÊNIOR chip 2 | 871.3, 122, 177.3, 70.9 | 871.3, 122, 177.3, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 2 rótulo | 876.3, 135, 167.3, 16.9 | 876.3, 135, 167.3, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 2 valor | 876.3, 156.9, 167.3, 23 | 876.3, 156.9, 167.3, 23 | 0.0 | ✅ |
| 2·SÊNIOR chip 3 | 1058.7, 122, 177.3, 70.9 | 1058.7, 122, 177.3, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 3 rótulo | 1063.7, 135, 167.3, 16.9 | 1063.7, 135, 167.3, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 3 valor | 1063.7, 156.9, 167.3, 23 | 1063.7, 156.9, 167.3, 23 | 0.0 | ✅ |
| 2·SÊNIOR chip 4 | 684, 202.9, 177.3, 70.9 | 684, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 4 rótulo | 689, 215.9, 167.3, 16.9 | 689, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 4 valor | 689, 237.8, 167.3, 23 | 689, 237.8, 167.3, 23 | 0.0 | ✅ |
| 2·SÊNIOR chip 5 | 871.3, 202.9, 177.3, 70.9 | 871.3, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 5 rótulo | 876.3, 215.9, 167.3, 16.9 | 876.3, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 5 valor | 876.3, 237.8, 167.3, 23 | 876.3, 237.8, 167.3, 23 | 0.0 | ✅ |
| 2·SÊNIOR chip 6 | 1058.7, 202.9, 177.3, 70.9 | 1058.7, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 6 rótulo | 1063.7, 215.9, 167.3, 16.9 | 1063.7, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 6 valor | 1063.7, 237.8, 167.3, 23 | 1063.7, 237.8, 167.3, 23 | 0.0 | ✅ |
| 2·SÊNIOR chip 7 | 684, 283.8, 271, 70.9 | 684, 283.8, 271, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 7 rótulo | 689, 296.8, 261, 16.9 | 689, 296.8, 261, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 7 valor | 689, 318.7, 261, 23 | 689, 318.7, 261, 23 | 0.0 | ✅ |
| 2·SÊNIOR chip 8 | 965, 283.8, 271, 70.9 | 965, 283.8, 271, 70.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 8 rótulo | 970, 296.8, 261, 16.9 | 970, 296.8, 261, 16.9 | 0.0 | ✅ |
| 2·SÊNIOR chip 8 valor | 970, 318.7, 261, 23 | 970, 318.7, 261, 23 | 0.0 | ✅ |
| 2·SÊNIOR oldPrice | 822, 404.7, 276, 23 | 822, 404.7, 276, 23 | 0.0 | ✅ |
| 2·SÊNIOR oldPrice valor | 914.3, 404.7, 85, 23 | 914.3, 404.7, 85, 23 | 0.0 | ✅ |
| 2·SÊNIOR preço | 804.3, 442.7, 311.4, 50 | 804.3, 442.7, 311.4, 50 | 0.0 | ✅ |
| 2·SÊNIOR "12x" | 804.3, 463.7, 38, 26 | 804.3, 463.7, 38, 26 | 0.0 | ✅ |
| 2·SÊNIOR à vista (linha) | 804.3, 492.7, 311.4, 28 | 804.3, 492.7, 311.4, 28 | 0.0 | ✅ |
| 2·SÊNIOR "ou" | 858.5, 494.7, 21.3, 24 | 858.5, 494.7, 21.3, 24 | 0.0 | ✅ |
| 2·SÊNIOR "à vista" | 1002.9, 494.7, 58.6, 24 | 1002.9, 494.7, 58.6, 24 | 0.0 | ✅ |
| 2·SÊNIOR nota de rodapé | 804.7, 534.7, 310.7, 14.8 | 804.7, 534.7, 310.7, 14.8 | 0.0 | ✅ |
| 2·SÊNIOR botão | 684, 587.5, 552, 70 | 684, 587.5, 552, 70 | 0.0 | ✅ |
| 2·SÊNIOR botão rótulo | 721, 614.5, 252, 16 | 721, 614.5, 252, 16 | 0.0 | ✅ |
| 2·SÊNIOR botão gota | 1163, 597.5, 63, 50 | 1163, 597.5, 63, 50 | 0.0 | ✅ |
| 3·EXPERT card | 1312, 40, 584, 639.5 | 1312, 40, 584, 639.5 | 0.0 | ✅ |
| 3·EXPERT aba do título | 1430, 13.4, 348, 63 | 1430, 13.4, 348, 63 | 0.0 | ✅ |
| 3·EXPERT título (h3) | 1461, 24.4, 286, 41 | 1461, 24.4, 286, 41 | 0.0 | ✅ |
| 3·EXPERT chip 1 | 1328, 122, 177.3, 70.9 | 1328, 122, 177.3, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 1 rótulo | 1333, 135, 167.3, 16.9 | 1333, 135, 167.3, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 1 valor | 1333, 156.9, 167.3, 23 | 1333, 156.9, 167.3, 23 | 0.0 | ✅ |
| 3·EXPERT chip 2 | 1515.3, 122, 177.3, 70.9 | 1515.3, 122, 177.3, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 2 rótulo | 1520.3, 135, 167.3, 16.9 | 1520.3, 135, 167.3, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 2 valor | 1520.3, 156.9, 167.3, 23 | 1520.3, 156.9, 167.3, 23 | 0.0 | ✅ |
| 3·EXPERT chip 3 | 1702.7, 122, 177.3, 70.9 | 1702.7, 122, 177.3, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 3 rótulo | 1707.7, 135, 167.3, 16.9 | 1707.7, 135, 167.3, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 3 valor | 1707.7, 156.9, 167.3, 23 | 1707.7, 156.9, 167.3, 23 | 0.0 | ✅ |
| 3·EXPERT chip 4 | 1328, 202.9, 177.3, 70.9 | 1328, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 4 rótulo | 1333, 215.9, 167.3, 16.9 | 1333, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 4 valor | 1333, 237.8, 167.3, 23 | 1333, 237.8, 167.3, 23 | 0.0 | ✅ |
| 3·EXPERT chip 5 | 1515.3, 202.9, 177.3, 70.9 | 1515.3, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 5 rótulo | 1520.3, 215.9, 167.3, 16.9 | 1520.3, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 5 valor | 1520.3, 237.8, 167.3, 23 | 1520.3, 237.8, 167.3, 23 | 0.0 | ✅ |
| 3·EXPERT chip 6 | 1702.7, 202.9, 177.3, 70.9 | 1702.7, 202.9, 177.3, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 6 rótulo | 1707.7, 215.9, 167.3, 16.9 | 1707.7, 215.9, 167.3, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 6 valor | 1707.7, 237.8, 167.3, 23 | 1707.7, 237.8, 167.3, 23 | 0.0 | ✅ |
| 3·EXPERT chip 7 | 1328, 283.8, 271, 70.9 | 1328, 283.8, 271, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 7 rótulo | 1333, 296.8, 261, 16.9 | 1333, 296.8, 261, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 7 valor | 1333, 318.7, 261, 23 | 1333, 318.7, 261, 23 | 0.0 | ✅ |
| 3·EXPERT chip 8 | 1609, 283.8, 271, 70.9 | 1609, 283.8, 271, 70.9 | 0.0 | ✅ |
| 3·EXPERT chip 8 rótulo | 1614, 296.8, 261, 16.9 | 1614, 296.8, 261, 16.9 | 0.0 | ✅ |
| 3·EXPERT chip 8 valor | 1614, 318.7, 261, 23 | 1614, 318.7, 261, 23 | 0.0 | ✅ |
| 3·EXPERT oldPrice | 1466, 404.7, 276, 23 | 1466, 404.7, 276, 23 | 0.0 | ✅ |
| 3·EXPERT oldPrice valor | 1558.3, 404.7, 85, 23 | 1558.3, 404.7, 85, 23 | 0.0 | ✅ |
| 3·EXPERT preço | 1457.6, 442.7, 292.8, 50 | 1457.6, 442.7, 292.8, 50 | 0.0 | ✅ |
| 3·EXPERT "12x" | 1457.6, 463.7, 38, 26 | 1457.6, 463.7, 38, 26 | 0.0 | ✅ |
| 3·EXPERT à vista (linha) | 1457.6, 492.7, 292.8, 28 | 1457.6, 492.7, 292.8, 28 | 0.0 | ✅ |
| 3·EXPERT "ou" | 1503.8, 494.7, 21.3, 24 | 1503.8, 494.7, 21.3, 24 | 0.0 | ✅ |
| 3·EXPERT "à vista" | 1645.5, 494.7, 58.6, 24 | 1645.5, 494.7, 58.6, 24 | 0.0 | ✅ |
| 3·EXPERT nota de rodapé | 1448.7, 534.7, 310.7, 14.8 | 1448.7, 534.7, 310.7, 14.8 | 0.0 | ✅ |
| 3·EXPERT botão | 1328, 587.5, 552, 70 | 1328, 587.5, 552, 70 | 0.0 | ✅ |
| 3·EXPERT botão rótulo | 1365, 614.5, 249.1, 16 | 1365, 614.5, 249.1, 16 | 0.0 | ✅ |
| 3·EXPERT botão gota | 1807, 597.5, 63, 50 | 1807, 597.5, 63, 50 | 0.0 | ✅ |
| seta anterior | 608.3, 323.8, 54, 54 | 608.3, 323.8, 54, 54 | 0.0 | ✅ |
| seta próxima | 1257.7, 323.8, 54, 54 | 1257.7, 323.8, 54, 54 | 0.0 | ✅ |
| paginação | 600, 719.5, 720, 44 | 600, 719.5, 720, 44 | 0.0 | ✅ |
| paginação 1 (TRAINEE) | 600, 719.5, 111.7, 44 | 600, 719.5, 111.7, 44 | 0.0 | ✅ |
| paginação 2 (JÚNIOR) | 721.7, 719.5, 111.7, 44 | 721.7, 719.5, 111.7, 44 | 0.0 | ✅ |
| paginação 3 (PLENO) | 843.3, 719.5, 111.7, 44 | 843.3, 719.5, 111.7, 44 | 0.0 | ✅ |
| paginação 4 (SÊNIOR) | 965, 719.5, 111.7, 44 | 965, 719.5, 111.7, 44 | 0.0 | ✅ |
| paginação 5 (EXPERT) | 1086.7, 719.5, 111.7, 44 | 1086.7, 719.5, 111.7, 44 | 0.0 | ✅ |
| paginação 6 (MASTER) | 1208.3, 719.5, 111.7, 44 | 1208.3, 719.5, 111.7, 44 | 0.0 | ✅ |

### 1920 px · Futuro de Bitcoin

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 384, 0, 1152, 732.5 | 384, 0, 1152, 732.5 | 0.0 | ✅ |
| swiper | 408, 0, 1104, 732.5 | 408, 0, 1104, 732.5 | 0.0 | ✅ |
| 1·BIT 8 card | 408, 40, 537, 652.5 | 408, 40, 537, 652.5 | 0.0 | ✅ |
| 1·BIT 8 aba do título | 516.6, 12.8, 319.8, 55 | 516.6, 12.8, 319.8, 55 | 0.0 | ✅ |
| 1·BIT 8 título (h3) | 547.6, 23.8, 257.8, 33 | 547.6, 23.8, 257.8, 33 | 0.0 | ✅ |
| 1·BIT 8 chip 1 | 424, 122, 247.5, 70.9 | 424, 122, 247.5, 70.9 | 0.0 | ✅ |
| 1·BIT 8 chip 1 rótulo | 429, 135, 237.5, 16.9 | 429, 135, 237.5, 16.9 | 0.0 | ✅ |
| 1·BIT 8 chip 1 valor | 429, 156.9, 237.5, 23 | 429, 156.9, 237.5, 23 | 0.0 | ✅ |
| 1·BIT 8 chip 2 | 681.5, 122, 247.5, 70.9 | 681.5, 122, 247.5, 70.9 | 0.0 | ✅ |
| 1·BIT 8 chip 2 rótulo | 686.5, 135, 237.5, 16.9 | 686.5, 135, 237.5, 16.9 | 0.0 | ✅ |
| 1·BIT 8 chip 2 valor | 686.5, 156.9, 237.5, 23 | 686.5, 156.9, 237.5, 23 | 0.0 | ✅ |
| 1·BIT 8 chip 3 | 424, 202.9, 247.5, 70.9 | 424, 202.9, 247.5, 70.9 | 0.0 | ✅ |
| 1·BIT 8 chip 3 rótulo | 429, 215.9, 237.5, 16.9 | 429, 215.9, 237.5, 16.9 | 0.0 | ✅ |
| 1·BIT 8 chip 3 valor | 429, 237.8, 237.5, 23 | 429, 237.8, 237.5, 23 | 0.0 | ✅ |
| 1·BIT 8 chip 4 | 681.5, 202.9, 247.5, 70.9 | 681.5, 202.9, 247.5, 70.9 | 0.0 | ✅ |
| 1·BIT 8 chip 4 rótulo | 686.5, 215.9, 237.5, 16.9 | 686.5, 215.9, 237.5, 16.9 | 0.0 | ✅ |
| 1·BIT 8 chip 4 valor | 686.5, 237.8, 237.5, 23 | 686.5, 237.8, 237.5, 23 | 0.0 | ✅ |
| 1·BIT 8 chip 5 | 424, 283.8, 247.5, 70.9 | 424, 283.8, 247.5, 70.9 | 0.0 | ✅ |
| 1·BIT 8 chip 5 rótulo | 429, 296.8, 237.5, 16.9 | 429, 296.8, 237.5, 16.9 | 0.0 | ✅ |
| 1·BIT 8 chip 5 valor | 429, 318.7, 237.5, 23 | 429, 318.7, 237.5, 23 | 0.0 | ✅ |
| 1·BIT 8 chip 6 | 681.5, 283.8, 247.5, 70.9 | 681.5, 283.8, 247.5, 70.9 | 0.0 | ✅ |
| 1·BIT 8 chip 6 rótulo | 686.5, 296.8, 237.5, 16.9 | 686.5, 296.8, 237.5, 16.9 | 0.0 | ✅ |
| 1·BIT 8 chip 6 valor | 686.5, 318.7, 237.5, 23 | 686.5, 318.7, 237.5, 23 | 0.0 | ✅ |
| 1·BIT 8 oldPrice | 550.3, 404.7, 252.5, 23 | 550.3, 404.7, 252.5, 23 | 0.0 | ✅ |
| 1·BIT 8 oldPrice valor | 637.3, 404.7, 72.1, 23 | 637.3, 404.7, 72.1, 23 | 0.0 | ✅ |
| 1·BIT 8 preço | 522.9, 442.7, 307.3, 50 | 522.9, 442.7, 307.3, 50 | 0.0 | ✅ |
| 1·BIT 8 "12x" | 522.9, 454.7, 57.1, 38 | 522.9, 454.7, 57.1, 38 | 0.0 | ✅ |
| 1·BIT 8 à vista (linha) | 522.9, 492.7, 307.3, 41 | 522.9, 492.7, 307.3, 41 | 0.0 | ✅ |
| 1·BIT 8 "ou" | 544.1, 500.7, 25.1, 28 | 544.1, 500.7, 25.1, 28 | 0.0 | ✅ |
| 1·BIT 8 "à vista" | 739.9, 500.7, 69, 28 | 739.9, 500.7, 69, 28 | 0.0 | ✅ |
| 1·BIT 8 nota de rodapé | 521.2, 547.7, 310.7, 14.8 | 521.2, 547.7, 310.7, 14.8 | 0.0 | ✅ |
| 1·BIT 8 botão | 424, 600.5, 505, 70 | 424, 600.5, 505, 70 | 0.0 | ✅ |
| 1·BIT 8 botão rótulo | 461, 627.5, 227.9, 16 | 461, 627.5, 227.9, 16 | 0.0 | ✅ |
| 1·BIT 8 botão gota | 856, 610.5, 63, 50 | 856, 610.5, 63, 50 | 0.0 | ✅ |
| 2·BIT 16 card | 975, 40, 537, 652.5 | 975, 40, 537, 652.5 | 0.0 | ✅ |
| 2·BIT 16 aba do título | 1083.6, 12.8, 319.8, 55 | 1083.6, 12.8, 319.8, 55 | 0.0 | ✅ |
| 2·BIT 16 título (h3) | 1114.6, 23.8, 257.8, 33 | 1114.6, 23.8, 257.8, 33 | 0.0 | ✅ |
| 2·BIT 16 chip 1 | 991, 122, 247.5, 70.9 | 991, 122, 247.5, 70.9 | 0.0 | ✅ |
| 2·BIT 16 chip 1 rótulo | 996, 135, 237.5, 16.9 | 996, 135, 237.5, 16.9 | 0.0 | ✅ |
| 2·BIT 16 chip 1 valor | 996, 156.9, 237.5, 23 | 996, 156.9, 237.5, 23 | 0.0 | ✅ |
| 2·BIT 16 chip 2 | 1248.5, 122, 247.5, 70.9 | 1248.5, 122, 247.5, 70.9 | 0.0 | ✅ |
| 2·BIT 16 chip 2 rótulo | 1253.5, 135, 237.5, 16.9 | 1253.5, 135, 237.5, 16.9 | 0.0 | ✅ |
| 2·BIT 16 chip 2 valor | 1253.5, 156.9, 237.5, 23 | 1253.5, 156.9, 237.5, 23 | 0.0 | ✅ |
| 2·BIT 16 chip 3 | 991, 202.9, 247.5, 70.9 | 991, 202.9, 247.5, 70.9 | 0.0 | ✅ |
| 2·BIT 16 chip 3 rótulo | 996, 215.9, 237.5, 16.9 | 996, 215.9, 237.5, 16.9 | 0.0 | ✅ |
| 2·BIT 16 chip 3 valor | 996, 237.8, 237.5, 23 | 996, 237.8, 237.5, 23 | 0.0 | ✅ |
| 2·BIT 16 chip 4 | 1248.5, 202.9, 247.5, 70.9 | 1248.5, 202.9, 247.5, 70.9 | 0.0 | ✅ |
| 2·BIT 16 chip 4 rótulo | 1253.5, 215.9, 237.5, 16.9 | 1253.5, 215.9, 237.5, 16.9 | 0.0 | ✅ |
| 2·BIT 16 chip 4 valor | 1253.5, 237.8, 237.5, 23 | 1253.5, 237.8, 237.5, 23 | 0.0 | ✅ |
| 2·BIT 16 chip 5 | 991, 283.8, 247.5, 70.9 | 991, 283.8, 247.5, 70.9 | 0.0 | ✅ |
| 2·BIT 16 chip 5 rótulo | 996, 296.8, 237.5, 16.9 | 996, 296.8, 237.5, 16.9 | 0.0 | ✅ |
| 2·BIT 16 chip 5 valor | 996, 318.7, 237.5, 23 | 996, 318.7, 237.5, 23 | 0.0 | ✅ |
| 2·BIT 16 chip 6 | 1248.5, 283.8, 247.5, 70.9 | 1248.5, 283.8, 247.5, 70.9 | 0.0 | ✅ |
| 2·BIT 16 chip 6 rótulo | 1253.5, 296.8, 237.5, 16.9 | 1253.5, 296.8, 237.5, 16.9 | 0.0 | ✅ |
| 2·BIT 16 chip 6 valor | 1253.5, 318.7, 237.5, 23 | 1253.5, 318.7, 237.5, 23 | 0.0 | ✅ |
| 2·BIT 16 oldPrice | 1117.3, 404.7, 252.5, 23 | 1117.3, 404.7, 252.5, 23 | 0.0 | ✅ |
| 2·BIT 16 oldPrice valor | 1204.3, 404.7, 72.1, 23 | 1204.3, 404.7, 72.1, 23 | 0.0 | ✅ |
| 2·BIT 16 preço | 1086.4, 442.7, 314.2, 50 | 1086.4, 442.7, 314.2, 50 | 0.0 | ✅ |
| 2·BIT 16 "12x" | 1086.4, 454.7, 57.1, 38 | 1086.4, 454.7, 57.1, 38 | 0.0 | ✅ |
| 2·BIT 16 à vista (linha) | 1086.4, 492.7, 314.2, 41 | 1086.4, 492.7, 314.2, 41 | 0.0 | ✅ |
| 2·BIT 16 "ou" | 1109, 500.7, 25.1, 28 | 1109, 500.7, 25.1, 28 | 0.0 | ✅ |
| 2·BIT 16 "à vista" | 1309, 500.7, 69, 28 | 1309, 500.7, 69, 28 | 0.0 | ✅ |
| 2·BIT 16 nota de rodapé | 1088.2, 547.7, 310.7, 14.8 | 1088.2, 547.7, 310.7, 14.8 | 0.0 | ✅ |
| 2·BIT 16 botão | 991, 600.5, 505, 70 | 991, 600.5, 505, 70 | 0.0 | ✅ |
| 2·BIT 16 botão rótulo | 1028, 627.5, 234.7, 16 | 1028, 627.5, 234.7, 16 | 0.0 | ✅ |
| 2·BIT 16 botão gota | 1423, 610.5, 63, 50 | 1423, 610.5, 63, 50 | 0.0 | ✅ |

### 1440 px · Mini Índice / Dólar

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 1440, 747.8 | 0, 0, 1440, 747.8 | 0.0 | ✅ |
| swiper | 24, 0, 1392, 703.8 | 24, 0, 1392, 703.8 | 0.0 | ✅ |
| 1·PLENO card | 24, 40, 424, 623.8 | 24, 40, 424, 623.8 | 0.0 | ✅ |
| 1·PLENO aba do título | 110, 14.1, 252, 63 | 110, 14.1, 252, 63 | 0.0 | ✅ |
| 1·PLENO título (h3) | 141, 25.1, 190, 41 | 141, 25.1, 190, 41 | 0.0 | ✅ |
| 1·PLENO chip 1 | 40, 122, 124, 65.6 | 40, 122, 124, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 1 rótulo | 45, 135, 114, 14.6 | 45, 135, 114, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 1 valor | 45, 154.6, 114, 20 | 45, 154.6, 114, 20 | 0.0 | ✅ |
| 1·PLENO chip 2 | 174, 122, 124, 65.6 | 174, 122, 124, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 2 rótulo | 179, 135, 114, 14.6 | 179, 135, 114, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 2 valor | 179, 154.6, 114, 20 | 179, 154.6, 114, 20 | 0.0 | ✅ |
| 1·PLENO chip 3 | 308, 122, 124, 65.6 | 308, 122, 124, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 3 rótulo | 313, 135, 114, 14.6 | 313, 135, 114, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 3 valor | 313, 154.6, 114, 20 | 313, 154.6, 114, 20 | 0.0 | ✅ |
| 1·PLENO chip 4 | 40, 197.6, 124, 65.6 | 40, 197.6, 124, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 4 rótulo | 45, 210.6, 114, 14.6 | 45, 210.6, 114, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 4 valor | 45, 230.3, 114, 20 | 45, 230.3, 114, 20 | 0.0 | ✅ |
| 1·PLENO chip 5 | 174, 197.6, 124, 65.6 | 174, 197.6, 124, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 5 rótulo | 179, 210.6, 114, 14.6 | 179, 210.6, 114, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 5 valor | 179, 230.3, 114, 20 | 179, 230.3, 114, 20 | 0.0 | ✅ |
| 1·PLENO chip 6 | 308, 197.6, 124, 65.6 | 308, 197.6, 124, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 6 rótulo | 313, 210.6, 114, 14.6 | 313, 210.6, 114, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 6 valor | 313, 230.3, 114, 20 | 313, 230.3, 114, 20 | 0.0 | ✅ |
| 1·PLENO chip 7 | 40, 273.3, 191, 65.6 | 40, 273.3, 191, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 7 rótulo | 45, 286.3, 181, 14.6 | 45, 286.3, 181, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 7 valor | 45, 305.9, 181, 20 | 45, 305.9, 181, 20 | 0.0 | ✅ |
| 1·PLENO chip 8 | 241, 273.3, 191, 65.6 | 241, 273.3, 191, 65.6 | 0.0 | ✅ |
| 1·PLENO chip 8 rótulo | 246, 286.3, 181, 14.6 | 246, 286.3, 181, 14.6 | 0.0 | ✅ |
| 1·PLENO chip 8 valor | 246, 305.9, 181, 20 | 246, 305.9, 181, 20 | 0.0 | ✅ |
| 1·PLENO oldPrice | 138, 388.9, 196, 23 | 138, 388.9, 196, 23 | 0.0 | ✅ |
| 1·PLENO oldPrice valor | 190.3, 388.9, 85, 23 | 190.3, 388.9, 85, 23 | 0.0 | ✅ |
| 1·PLENO preço | 83, 426.9, 306, 50 | 83, 426.9, 306, 50 | 0.0 | ✅ |
| 1·PLENO "12x" | 83, 447.9, 38, 26 | 83, 447.9, 38, 26 | 0.0 | ✅ |
| 1·PLENO à vista (linha) | 83, 476.9, 306, 28 | 83, 476.9, 306, 28 | 0.0 | ✅ |
| 1·PLENO "ou" | 135.3, 478.9, 21.3, 24 | 135.3, 478.9, 21.3, 24 | 0.0 | ✅ |
| 1·PLENO "à vista" | 278, 478.9, 58.6, 24 | 278, 478.9, 58.6, 24 | 0.0 | ✅ |
| 1·PLENO nota de rodapé | 80.7, 518.9, 310.7, 14.8 | 80.7, 518.9, 310.7, 14.8 | 0.0 | ✅ |
| 1·PLENO botão | 40, 571.8, 392, 70 | 40, 571.8, 392, 70 | 0.0 | ✅ |
| 1·PLENO botão rótulo | 77, 598.8, 244, 16 | 77, 598.8, 244, 16 | 0.0 | ✅ |
| 1·PLENO botão gota | 359, 581.8, 63, 50 | 359, 581.8, 63, 50 | 0.0 | ✅ |
| 2·SÊNIOR card | 508, 40, 424, 623.8 | 508, 40, 424, 623.8 | 0.0 | ✅ |
| 2·SÊNIOR aba do título | 594, 14.1, 252, 63 | 594, 14.1, 252, 63 | 0.0 | ✅ |
| 2·SÊNIOR título (h3) | 625, 25.1, 190, 41 | 625, 25.1, 190, 41 | 0.0 | ✅ |
| 2·SÊNIOR tarja | 525, 84, 390, 47 | — (removido a pedido do cliente) | — | ➖ |
| 2·SÊNIOR chip 1 | 524, 122, 124, 65.6 | 524, 122, 124, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 1 rótulo | 529, 135, 114, 14.6 | 529, 135, 114, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 1 valor | 529, 154.6, 114, 20 | 529, 154.6, 114, 20 | 0.0 | ✅ |
| 2·SÊNIOR chip 2 | 658, 122, 124, 65.6 | 658, 122, 124, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 2 rótulo | 663, 135, 114, 14.6 | 663, 135, 114, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 2 valor | 663, 154.6, 114, 20 | 663, 154.6, 114, 20 | 0.0 | ✅ |
| 2·SÊNIOR chip 3 | 792, 122, 124, 65.6 | 792, 122, 124, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 3 rótulo | 797, 135, 114, 14.6 | 797, 135, 114, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 3 valor | 797, 154.6, 114, 20 | 797, 154.6, 114, 20 | 0.0 | ✅ |
| 2·SÊNIOR chip 4 | 524, 197.6, 124, 65.6 | 524, 197.6, 124, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 4 rótulo | 529, 210.6, 114, 14.6 | 529, 210.6, 114, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 4 valor | 529, 230.3, 114, 20 | 529, 230.3, 114, 20 | 0.0 | ✅ |
| 2·SÊNIOR chip 5 | 658, 197.6, 124, 65.6 | 658, 197.6, 124, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 5 rótulo | 663, 210.6, 114, 14.6 | 663, 210.6, 114, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 5 valor | 663, 230.3, 114, 20 | 663, 230.3, 114, 20 | 0.0 | ✅ |
| 2·SÊNIOR chip 6 | 792, 197.6, 124, 65.6 | 792, 197.6, 124, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 6 rótulo | 797, 210.6, 114, 14.6 | 797, 210.6, 114, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 6 valor | 797, 230.3, 114, 20 | 797, 230.3, 114, 20 | 0.0 | ✅ |
| 2·SÊNIOR chip 7 | 524, 273.3, 191, 65.6 | 524, 273.3, 191, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 7 rótulo | 529, 286.3, 181, 14.6 | 529, 286.3, 181, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 7 valor | 529, 305.9, 181, 20 | 529, 305.9, 181, 20 | 0.0 | ✅ |
| 2·SÊNIOR chip 8 | 725, 273.3, 191, 65.6 | 725, 273.3, 191, 65.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 8 rótulo | 730, 286.3, 181, 14.6 | 730, 286.3, 181, 14.6 | 0.0 | ✅ |
| 2·SÊNIOR chip 8 valor | 730, 305.9, 181, 20 | 730, 305.9, 181, 20 | 0.0 | ✅ |
| 2·SÊNIOR oldPrice | 622, 388.9, 196, 23 | 622, 388.9, 196, 23 | 0.0 | ✅ |
| 2·SÊNIOR oldPrice valor | 674.3, 388.9, 85, 23 | 674.3, 388.9, 85, 23 | 0.0 | ✅ |
| 2·SÊNIOR preço | 564.3, 426.9, 311.4, 50 | 564.3, 426.9, 311.4, 50 | 0.0 | ✅ |
| 2·SÊNIOR "12x" | 564.3, 447.9, 38, 26 | 564.3, 447.9, 38, 26 | 0.0 | ✅ |
| 2·SÊNIOR à vista (linha) | 564.3, 476.9, 311.4, 28 | 564.3, 476.9, 311.4, 28 | 0.0 | ✅ |
| 2·SÊNIOR "ou" | 618.5, 478.9, 21.3, 24 | 618.5, 478.9, 21.3, 24 | 0.0 | ✅ |
| 2·SÊNIOR "à vista" | 762.9, 478.9, 58.6, 24 | 762.9, 478.9, 58.6, 24 | 0.0 | ✅ |
| 2·SÊNIOR nota de rodapé | 564.7, 518.9, 310.7, 14.8 | 564.7, 518.9, 310.7, 14.8 | 0.0 | ✅ |
| 2·SÊNIOR botão | 524, 571.8, 392, 70 | 524, 571.8, 392, 70 | 0.0 | ✅ |
| 2·SÊNIOR botão rótulo | 561, 598.8, 252, 16 | 561, 598.8, 252, 16 | 0.0 | ✅ |
| 2·SÊNIOR botão gota | 843, 581.8, 63, 50 | 843, 581.8, 63, 50 | 0.0 | ✅ |
| 3·EXPERT card | 992, 40, 424, 623.8 | 992, 40, 424, 623.8 | 0.0 | ✅ |
| 3·EXPERT aba do título | 1078, 14.1, 252, 63 | 1078, 14.1, 252, 63 | 0.0 | ✅ |
| 3·EXPERT título (h3) | 1109, 25.1, 190, 41 | 1109, 25.1, 190, 41 | 0.0 | ✅ |
| 3·EXPERT chip 1 | 1008, 122, 124, 65.6 | 1008, 122, 124, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 1 rótulo | 1013, 135, 114, 14.6 | 1013, 135, 114, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 1 valor | 1013, 154.6, 114, 20 | 1013, 154.6, 114, 20 | 0.0 | ✅ |
| 3·EXPERT chip 2 | 1142, 122, 124, 65.6 | 1142, 122, 124, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 2 rótulo | 1147, 135, 114, 14.6 | 1147, 135, 114, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 2 valor | 1147, 154.6, 114, 20 | 1147, 154.6, 114, 20 | 0.0 | ✅ |
| 3·EXPERT chip 3 | 1276, 122, 124, 65.6 | 1276, 122, 124, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 3 rótulo | 1281, 135, 114, 14.6 | 1281, 135, 114, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 3 valor | 1281, 154.6, 114, 20 | 1281, 154.6, 114, 20 | 0.0 | ✅ |
| 3·EXPERT chip 4 | 1008, 197.6, 124, 65.6 | 1008, 197.6, 124, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 4 rótulo | 1013, 210.6, 114, 14.6 | 1013, 210.6, 114, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 4 valor | 1013, 230.3, 114, 20 | 1013, 230.3, 114, 20 | 0.0 | ✅ |
| 3·EXPERT chip 5 | 1142, 197.6, 124, 65.6 | 1142, 197.6, 124, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 5 rótulo | 1147, 210.6, 114, 14.6 | 1147, 210.6, 114, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 5 valor | 1147, 230.3, 114, 20 | 1147, 230.3, 114, 20 | 0.0 | ✅ |
| 3·EXPERT chip 6 | 1276, 197.6, 124, 65.6 | 1276, 197.6, 124, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 6 rótulo | 1281, 210.6, 114, 14.6 | 1281, 210.6, 114, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 6 valor | 1281, 230.3, 114, 20 | 1281, 230.3, 114, 20 | 0.0 | ✅ |
| 3·EXPERT chip 7 | 1008, 273.3, 191, 65.6 | 1008, 273.3, 191, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 7 rótulo | 1013, 286.3, 181, 14.6 | 1013, 286.3, 181, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 7 valor | 1013, 305.9, 181, 20 | 1013, 305.9, 181, 20 | 0.0 | ✅ |
| 3·EXPERT chip 8 | 1209, 273.3, 191, 65.6 | 1209, 273.3, 191, 65.6 | 0.0 | ✅ |
| 3·EXPERT chip 8 rótulo | 1214, 286.3, 181, 14.6 | 1214, 286.3, 181, 14.6 | 0.0 | ✅ |
| 3·EXPERT chip 8 valor | 1214, 305.9, 181, 20 | 1214, 305.9, 181, 20 | 0.0 | ✅ |
| 3·EXPERT oldPrice | 1106, 388.9, 196, 23 | 1106, 388.9, 196, 23 | 0.0 | ✅ |
| 3·EXPERT oldPrice valor | 1158.3, 388.9, 85, 23 | 1158.3, 388.9, 85, 23 | 0.0 | ✅ |
| 3·EXPERT preço | 1057.6, 426.9, 292.8, 50 | 1057.6, 426.9, 292.8, 50 | 0.0 | ✅ |
| 3·EXPERT "12x" | 1057.6, 447.9, 38, 26 | 1057.6, 447.9, 38, 26 | 0.0 | ✅ |
| 3·EXPERT à vista (linha) | 1057.6, 476.9, 292.8, 28 | 1057.6, 476.9, 292.8, 28 | 0.0 | ✅ |
| 3·EXPERT "ou" | 1103.8, 478.9, 21.3, 24 | 1103.8, 478.9, 21.3, 24 | 0.0 | ✅ |
| 3·EXPERT "à vista" | 1245.5, 478.9, 58.6, 24 | 1245.5, 478.9, 58.6, 24 | 0.0 | ✅ |
| 3·EXPERT nota de rodapé | 1048.7, 518.9, 310.7, 14.8 | 1048.7, 518.9, 310.7, 14.8 | 0.0 | ✅ |
| 3·EXPERT botão | 1008, 571.8, 392, 70 | 1008, 571.8, 392, 70 | 0.0 | ✅ |
| 3·EXPERT botão rótulo | 1045, 598.8, 249.1, 16 | 1045, 598.8, 249.1, 16 | 0.0 | ✅ |
| 3·EXPERT botão gota | 1327, 581.8, 63, 50 | 1327, 581.8, 63, 50 | 0.0 | ✅ |
| seta anterior | 466.9, 316.7, 54, 54 | 466.9, 316.7, 54, 54 | 0.0 | ✅ |
| seta próxima | 919.1, 316.7, 54, 54 | 919.1, 316.7, 54, 54 | 0.0 | ✅ |
| paginação | 360, 703.8, 720, 44 | 360, 703.8, 720, 44 | 0.0 | ✅ |
| paginação 1 (TRAINEE) | 360, 703.8, 111.7, 44 | 360, 703.8, 111.7, 44 | 0.0 | ✅ |
| paginação 2 (JÚNIOR) | 481.7, 703.8, 111.7, 44 | 481.7, 703.8, 111.7, 44 | 0.0 | ✅ |
| paginação 3 (PLENO) | 603.3, 703.8, 111.7, 44 | 603.3, 703.8, 111.7, 44 | 0.0 | ✅ |
| paginação 4 (SÊNIOR) | 725, 703.8, 111.7, 44 | 725, 703.8, 111.7, 44 | 0.0 | ✅ |
| paginação 5 (EXPERT) | 846.7, 703.8, 111.7, 44 | 846.7, 703.8, 111.7, 44 | 0.0 | ✅ |
| paginação 6 (MASTER) | 968.3, 703.8, 111.7, 44 | 968.3, 703.8, 111.7, 44 | 0.0 | ✅ |

### 1440 px · Futuro de Bitcoin

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 216, 0, 1008, 716.8 | 216, 0, 1008, 716.8 | 0.0 | ✅ |
| swiper | 240, 0, 960, 716.8 | 240, 0, 960, 716.8 | 0.0 | ✅ |
| 1·BIT 8 card | 240, 40, 465, 636.8 | 240, 40, 465, 636.8 | 0.0 | ✅ |
| 1·BIT 8 aba do título | 334.2, 13.5, 276.6, 55 | 334.2, 13.5, 276.6, 55 | 0.0 | ✅ |
| 1·BIT 8 título (h3) | 365.2, 24.5, 214.6, 33 | 365.2, 24.5, 214.6, 33 | 0.0 | ✅ |
| 1·BIT 8 chip 1 | 256, 122, 211.5, 65.6 | 256, 122, 211.5, 65.6 | 0.0 | ✅ |
| 1·BIT 8 chip 1 rótulo | 261, 135, 201.5, 14.6 | 261, 135, 201.5, 14.6 | 0.0 | ✅ |
| 1·BIT 8 chip 1 valor | 261, 154.6, 201.5, 20 | 261, 154.6, 201.5, 20 | 0.0 | ✅ |
| 1·BIT 8 chip 2 | 477.5, 122, 211.5, 65.6 | 477.5, 122, 211.5, 65.6 | 0.0 | ✅ |
| 1·BIT 8 chip 2 rótulo | 482.5, 135, 201.5, 14.6 | 482.5, 135, 201.5, 14.6 | 0.0 | ✅ |
| 1·BIT 8 chip 2 valor | 482.5, 154.6, 201.5, 20 | 482.5, 154.6, 201.5, 20 | 0.0 | ✅ |
| 1·BIT 8 chip 3 | 256, 197.6, 211.5, 65.6 | 256, 197.6, 211.5, 65.6 | 0.0 | ✅ |
| 1·BIT 8 chip 3 rótulo | 261, 210.6, 201.5, 14.6 | 261, 210.6, 201.5, 14.6 | 0.0 | ✅ |
| 1·BIT 8 chip 3 valor | 261, 230.3, 201.5, 20 | 261, 230.3, 201.5, 20 | 0.0 | ✅ |
| 1·BIT 8 chip 4 | 477.5, 197.6, 211.5, 65.6 | 477.5, 197.6, 211.5, 65.6 | 0.0 | ✅ |
| 1·BIT 8 chip 4 rótulo | 482.5, 210.6, 201.5, 14.6 | 482.5, 210.6, 201.5, 14.6 | 0.0 | ✅ |
| 1·BIT 8 chip 4 valor | 482.5, 230.3, 201.5, 20 | 482.5, 230.3, 201.5, 20 | 0.0 | ✅ |
| 1·BIT 8 chip 5 | 256, 273.3, 211.5, 65.6 | 256, 273.3, 211.5, 65.6 | 0.0 | ✅ |
| 1·BIT 8 chip 5 rótulo | 261, 286.3, 201.5, 14.6 | 261, 286.3, 201.5, 14.6 | 0.0 | ✅ |
| 1·BIT 8 chip 5 valor | 261, 305.9, 201.5, 20 | 261, 305.9, 201.5, 20 | 0.0 | ✅ |
| 1·BIT 8 chip 6 | 477.5, 273.3, 211.5, 65.6 | 477.5, 273.3, 211.5, 65.6 | 0.0 | ✅ |
| 1·BIT 8 chip 6 rótulo | 482.5, 286.3, 201.5, 14.6 | 482.5, 286.3, 201.5, 14.6 | 0.0 | ✅ |
| 1·BIT 8 chip 6 valor | 482.5, 305.9, 201.5, 20 | 482.5, 305.9, 201.5, 20 | 0.0 | ✅ |
| 1·BIT 8 oldPrice | 364.3, 388.9, 216.5, 23 | 364.3, 388.9, 216.5, 23 | 0.0 | ✅ |
| 1·BIT 8 oldPrice valor | 433.3, 388.9, 72.1, 23 | 433.3, 388.9, 72.1, 23 | 0.0 | ✅ |
| 1·BIT 8 preço | 318.9, 426.9, 307.3, 50 | 318.9, 426.9, 307.3, 50 | 0.0 | ✅ |
| 1·BIT 8 "12x" | 318.9, 438.9, 57.1, 38 | 318.9, 438.9, 57.1, 38 | 0.0 | ✅ |
| 1·BIT 8 à vista (linha) | 318.9, 476.9, 307.3, 41 | 318.9, 476.9, 307.3, 41 | 0.0 | ✅ |
| 1·BIT 8 "ou" | 340.1, 484.9, 25.1, 28 | 340.1, 484.9, 25.1, 28 | 0.0 | ✅ |
| 1·BIT 8 "à vista" | 535.9, 484.9, 69, 28 | 535.9, 484.9, 69, 28 | 0.0 | ✅ |
| 1·BIT 8 nota de rodapé | 317.2, 531.9, 310.7, 14.8 | 317.2, 531.9, 310.7, 14.8 | 0.0 | ✅ |
| 1·BIT 8 botão | 256, 584.8, 433, 70 | 256, 584.8, 433, 70 | 0.0 | ✅ |
| 1·BIT 8 botão rótulo | 293, 611.8, 227.9, 16 | 293, 611.8, 227.9, 16 | 0.0 | ✅ |
| 1·BIT 8 botão gota | 616, 594.8, 63, 50 | 616, 594.8, 63, 50 | 0.0 | ✅ |
| 2·BIT 16 card | 735, 40, 465, 636.8 | 735, 40, 465, 636.8 | 0.0 | ✅ |
| 2·BIT 16 aba do título | 829.2, 13.5, 276.6, 55 | 829.2, 13.5, 276.6, 55 | 0.0 | ✅ |
| 2·BIT 16 título (h3) | 860.2, 24.5, 214.6, 33 | 860.2, 24.5, 214.6, 33 | 0.0 | ✅ |
| 2·BIT 16 chip 1 | 751, 122, 211.5, 65.6 | 751, 122, 211.5, 65.6 | 0.0 | ✅ |
| 2·BIT 16 chip 1 rótulo | 756, 135, 201.5, 14.6 | 756, 135, 201.5, 14.6 | 0.0 | ✅ |
| 2·BIT 16 chip 1 valor | 756, 154.6, 201.5, 20 | 756, 154.6, 201.5, 20 | 0.0 | ✅ |
| 2·BIT 16 chip 2 | 972.5, 122, 211.5, 65.6 | 972.5, 122, 211.5, 65.6 | 0.0 | ✅ |
| 2·BIT 16 chip 2 rótulo | 977.5, 135, 201.5, 14.6 | 977.5, 135, 201.5, 14.6 | 0.0 | ✅ |
| 2·BIT 16 chip 2 valor | 977.5, 154.6, 201.5, 20 | 977.5, 154.6, 201.5, 20 | 0.0 | ✅ |
| 2·BIT 16 chip 3 | 751, 197.6, 211.5, 65.6 | 751, 197.6, 211.5, 65.6 | 0.0 | ✅ |
| 2·BIT 16 chip 3 rótulo | 756, 210.6, 201.5, 14.6 | 756, 210.6, 201.5, 14.6 | 0.0 | ✅ |
| 2·BIT 16 chip 3 valor | 756, 230.3, 201.5, 20 | 756, 230.3, 201.5, 20 | 0.0 | ✅ |
| 2·BIT 16 chip 4 | 972.5, 197.6, 211.5, 65.6 | 972.5, 197.6, 211.5, 65.6 | 0.0 | ✅ |
| 2·BIT 16 chip 4 rótulo | 977.5, 210.6, 201.5, 14.6 | 977.5, 210.6, 201.5, 14.6 | 0.0 | ✅ |
| 2·BIT 16 chip 4 valor | 977.5, 230.3, 201.5, 20 | 977.5, 230.3, 201.5, 20 | 0.0 | ✅ |
| 2·BIT 16 chip 5 | 751, 273.3, 211.5, 65.6 | 751, 273.3, 211.5, 65.6 | 0.0 | ✅ |
| 2·BIT 16 chip 5 rótulo | 756, 286.3, 201.5, 14.6 | 756, 286.3, 201.5, 14.6 | 0.0 | ✅ |
| 2·BIT 16 chip 5 valor | 756, 305.9, 201.5, 20 | 756, 305.9, 201.5, 20 | 0.0 | ✅ |
| 2·BIT 16 chip 6 | 972.5, 273.3, 211.5, 65.6 | 972.5, 273.3, 211.5, 65.6 | 0.0 | ✅ |
| 2·BIT 16 chip 6 rótulo | 977.5, 286.3, 201.5, 14.6 | 977.5, 286.3, 201.5, 14.6 | 0.0 | ✅ |
| 2·BIT 16 chip 6 valor | 977.5, 305.9, 201.5, 20 | 977.5, 305.9, 201.5, 20 | 0.0 | ✅ |
| 2·BIT 16 oldPrice | 859.3, 388.9, 216.5, 23 | 859.3, 388.9, 216.5, 23 | 0.0 | ✅ |
| 2·BIT 16 oldPrice valor | 928.3, 388.9, 72.1, 23 | 928.3, 388.9, 72.1, 23 | 0.0 | ✅ |
| 2·BIT 16 preço | 810.4, 426.9, 314.2, 50 | 810.4, 426.9, 314.2, 50 | 0.0 | ✅ |
| 2·BIT 16 "12x" | 810.4, 438.9, 57.1, 38 | 810.4, 438.9, 57.1, 38 | 0.0 | ✅ |
| 2·BIT 16 à vista (linha) | 810.4, 476.9, 314.2, 41 | 810.4, 476.9, 314.2, 41 | 0.0 | ✅ |
| 2·BIT 16 "ou" | 833, 484.9, 25.1, 28 | 833, 484.9, 25.1, 28 | 0.0 | ✅ |
| 2·BIT 16 "à vista" | 1033, 484.9, 69, 28 | 1033, 484.9, 69, 28 | 0.0 | ✅ |
| 2·BIT 16 nota de rodapé | 812.2, 531.9, 310.7, 14.8 | 812.2, 531.9, 310.7, 14.8 | 0.0 | ✅ |
| 2·BIT 16 botão | 751, 584.8, 433, 70 | 751, 584.8, 433, 70 | 0.0 | ✅ |
| 2·BIT 16 botão rótulo | 788, 611.8, 234.7, 16 | 788, 611.8, 234.7, 16 | 0.0 | ✅ |
| 2·BIT 16 botão gota | 1111, 594.8, 63, 50 | 1111, 594.8, 63, 50 | 0.0 | ✅ |

### 1024 px · Mini Índice / Dólar

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 1024, 578 | 0, 0, 1024, 578 | 0.0 | ✅ |
| swiper | 19.2, 0, 985.6, 534 | 19.2, 0, 985.6, 534 | 0.0 | ✅ |
| 1·SÊNIOR card | 19.2, 32, 483, 470 | 19.2, 32, 483, 470 | 0.0 | ✅ |
| 1·SÊNIOR aba do título | 69.1, 15.4, 383.2, 50 | 69.1, 15.4, 383.2, 50 | 0.0 | ✅ |
| 1·SÊNIOR título (h3) | 94.1, 24.4, 333.2, 32 | 94.1, 24.4, 333.2, 32 | 0.0 | ✅ |
| 1·SÊNIOR tarja | 33.2, 67.6, 455, 25.6 | — (removido a pedido do cliente) | — | ➖ |
| 1·SÊNIOR chip 1 | 30.8, 82, 147.9, 53.1 | 30.8, 82, 147.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 1 rótulo | 36.6, 92.6, 136.3, 10.9 | 36.6, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 1 valor | 36.6, 107.5, 136.3, 17 | 36.6, 107.5, 136.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 | 186.7, 82, 147.9, 53.1 | 186.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 rótulo | 192.5, 92.6, 136.3, 10.9 | 192.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 valor | 192.5, 107.5, 136.3, 17 | 192.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 | 342.7, 82, 147.9, 53.1 | 342.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 rótulo | 348.5, 92.6, 136.3, 10.9 | 348.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 valor | 348.5, 107.5, 136.3, 17 | 348.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 | 30.8, 143.1, 147.9, 53.1 | 30.8, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 rótulo | 36.6, 153.7, 136.3, 10.9 | 36.6, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 valor | 36.6, 168.6, 136.3, 17 | 36.6, 168.6, 136.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 | 186.7, 143.1, 147.9, 53.1 | 186.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 rótulo | 192.5, 153.7, 136.3, 10.9 | 192.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 valor | 192.5, 168.6, 136.3, 17 | 192.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 | 342.7, 143.1, 147.9, 53.1 | 342.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 rótulo | 348.5, 153.7, 136.3, 10.9 | 348.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 valor | 348.5, 168.6, 136.3, 17 | 348.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 | 30.8, 204.2, 225.9, 53.1 | 30.8, 204.2, 225.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 rótulo | 36.6, 214.8, 214.3, 10.9 | 36.6, 214.8, 214.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 valor | 36.6, 229.7, 214.3, 17 | 36.6, 229.7, 214.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 | 264.7, 204.2, 225.9, 53.1 | 264.7, 204.2, 225.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 rótulo | 270.5, 214.8, 214.3, 10.9 | 270.5, 214.8, 214.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 valor | 270.5, 229.7, 214.3, 17 | 270.5, 229.7, 214.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR oldPrice | 145.7, 281.3, 229.9, 17 | 145.7, 281.3, 229.9, 17 | 0.0 | ✅ |
| 1·SÊNIOR oldPrice valor | 224.1, 281.3, 68, 17 | 224.1, 281.3, 68, 17 | 0.0 | ✅ |
| 1·SÊNIOR preço | 155.3, 310.3, 210.7, 28.8 | 155.3, 310.3, 210.7, 28.8 | 0.0 | ✅ |
| 1·SÊNIOR "12x" | 160.6, 312.3, 42.6, 28 | 160.6, 312.3, 42.6, 28 | 0.0 | ✅ |
| 1·SÊNIOR à vista (linha) | 155.3, 339.1, 210.7, 28 | 155.3, 339.1, 210.7, 28 | 0.0 | ✅ |
| 1·SÊNIOR "ou" | 155.3, 341.1, 22.1, 24 | 155.3, 341.1, 22.1, 24 | 0.0 | ✅ |
| 1·SÊNIOR "à vista" | 305.4, 341.1, 60.7, 24 | 305.4, 341.1, 60.7, 24 | 0.0 | ✅ |
| 1·SÊNIOR nota de rodapé | 105.3, 381.1, 310.7, 14.8 | 105.3, 381.1, 310.7, 14.8 | 0.0 | ✅ |
| 1·SÊNIOR botão | 30.8, 428, 459.8, 56 | 30.8, 428, 459.8, 56 | 0.0 | ✅ |
| 1·SÊNIOR botão rótulo | 60.6, 449.6, 135.7, 12.8 | 60.6, 449.6, 135.7, 12.8 | 0.0 | ✅ |
| 1·SÊNIOR botão gota | 432, 436.2, 50.4, 39.6 | 432, 436.2, 50.4, 39.6 | 0.0 | ✅ |
| 2·EXPERT card | 522.2, 32, 483, 470 | 522.2, 32, 483, 470 | 0.0 | ✅ |
| 2·EXPERT aba do título | 572.1, 15.4, 383.2, 50 | 572.1, 15.4, 383.2, 50 | 0.0 | ✅ |
| 2·EXPERT título (h3) | 597.1, 24.4, 333.2, 32 | 597.1, 24.4, 333.2, 32 | 0.0 | ✅ |
| 2·EXPERT chip 1 | 533.8, 82, 147.9, 53.1 | 533.8, 82, 147.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 1 rótulo | 539.6, 92.6, 136.3, 10.9 | 539.6, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 1 valor | 539.6, 107.5, 136.3, 17 | 539.6, 107.5, 136.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 2 | 689.7, 82, 147.9, 53.1 | 689.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 2 rótulo | 695.5, 92.6, 136.3, 10.9 | 695.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 2 valor | 695.5, 107.5, 136.3, 17 | 695.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 3 | 845.7, 82, 147.9, 53.1 | 845.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 3 rótulo | 851.5, 92.6, 136.3, 10.9 | 851.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 3 valor | 851.5, 107.5, 136.3, 17 | 851.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 4 | 533.8, 143.1, 147.9, 53.1 | 533.8, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 4 rótulo | 539.6, 153.7, 136.3, 10.9 | 539.6, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 4 valor | 539.6, 168.6, 136.3, 17 | 539.6, 168.6, 136.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 5 | 689.7, 143.1, 147.9, 53.1 | 689.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 5 rótulo | 695.5, 153.7, 136.3, 10.9 | 695.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 5 valor | 695.5, 168.6, 136.3, 17 | 695.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 6 | 845.7, 143.1, 147.9, 53.1 | 845.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 6 rótulo | 851.5, 153.7, 136.3, 10.9 | 851.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 6 valor | 851.5, 168.6, 136.3, 17 | 851.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 7 | 533.8, 204.2, 225.9, 53.1 | 533.8, 204.2, 225.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 7 rótulo | 539.6, 214.8, 214.3, 10.9 | 539.6, 214.8, 214.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 7 valor | 539.6, 229.7, 214.3, 17 | 539.6, 229.7, 214.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 8 | 767.7, 204.2, 225.9, 53.1 | 767.7, 204.2, 225.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 8 rótulo | 773.5, 214.8, 214.3, 10.9 | 773.5, 214.8, 214.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 8 valor | 773.5, 229.7, 214.3, 17 | 773.5, 229.7, 214.3, 17 | 0.0 | ✅ |
| 2·EXPERT oldPrice | 648.7, 281.3, 229.9, 17 | 648.7, 281.3, 229.9, 17 | 0.0 | ✅ |
| 2·EXPERT oldPrice valor | 727.1, 281.3, 68, 17 | 727.1, 281.3, 68, 17 | 0.0 | ✅ |
| 2·EXPERT preço | 659.7, 310.3, 208, 28.8 | 659.7, 310.3, 208, 28.8 | 0.0 | ✅ |
| 2·EXPERT "12x" | 669, 312.3, 42.6, 28 | 669, 312.3, 42.6, 28 | 0.0 | ✅ |
| 2·EXPERT à vista (linha) | 659.7, 339.1, 208, 28 | 659.7, 339.1, 208, 28 | 0.0 | ✅ |
| 2·EXPERT "ou" | 659.7, 341.1, 22.1, 24 | 659.7, 341.1, 22.1, 24 | 0.0 | ✅ |
| 2·EXPERT "à vista" | 807, 341.1, 60.7, 24 | 807, 341.1, 60.7, 24 | 0.0 | ✅ |
| 2·EXPERT nota de rodapé | 608.3, 381.1, 310.7, 14.8 | 608.3, 381.1, 310.7, 14.8 | 0.0 | ✅ |
| 2·EXPERT botão | 533.8, 428, 459.8, 56 | 533.8, 428, 459.8, 56 | 0.0 | ✅ |
| 2·EXPERT botão rótulo | 563.6, 449.6, 135.7, 12.8 | 563.6, 449.6, 135.7, 12.8 | 0.0 | ✅ |
| 2·EXPERT botão gota | 935, 436.2, 50.4, 39.6 | 935, 436.2, 50.4, 39.6 | 0.0 | ✅ |
| paginação | 224, 534, 576, 44 | 224, 534, 576, 44 | 0.0 | ✅ |
| paginação 1 (TRAINEE) | 224, 534, 89.3, 44 | 224, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 2 (JÚNIOR) | 321.3, 534, 89.3, 44 | 321.3, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 3 (PLENO) | 418.7, 534, 89.3, 44 | 418.7, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 4 (SÊNIOR) | 516, 534, 89.3, 44 | 516, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 5 (EXPERT) | 613.3, 534, 89.3, 44 | 613.3, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 6 (MASTER) | 710.7, 534, 89.3, 44 | 710.7, 534, 89.3, 44 | 0.0 | ✅ |

### 1024 px · Futuro de Bitcoin

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 1024, 472.9 | 0, 0, 1024, 472.9 | 0.0 | ✅ |
| swiper | 19.2, 0, 985.6, 472.9 | 19.2, 0, 985.6, 472.9 | 0.0 | ✅ |
| 1·BIT 8 card | 19.2, 32, 483, 408.9 | 19.2, 32, 483, 408.9 | 0.0 | ✅ |
| 1·BIT 8 aba do título | 69.1, 17.8, 383.2, 46 | 69.1, 17.8, 383.2, 46 | 0.0 | ✅ |
| 1·BIT 8 título (h3) | 94.1, 26.8, 333.2, 28 | 94.1, 26.8, 333.2, 28 | 0.0 | ✅ |
| 1·BIT 8 chip 1 | 30.8, 82, 147.9, 53.1 | 30.8, 82, 147.9, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 1 rótulo | 36.6, 92.6, 136.3, 10.9 | 36.6, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 1 valor | 36.6, 107.5, 136.3, 17 | 36.6, 107.5, 136.3, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 2 | 186.7, 82, 147.9, 53.1 | 186.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 2 rótulo | 192.5, 92.6, 136.3, 10.9 | 192.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 2 valor | 192.5, 107.5, 136.3, 17 | 192.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 3 | 342.7, 82, 147.9, 53.1 | 342.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 3 rótulo | 348.5, 92.6, 136.3, 10.9 | 348.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 3 valor | 348.5, 107.5, 136.3, 17 | 348.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 4 | 30.8, 143.1, 147.9, 53.1 | 30.8, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 4 rótulo | 36.6, 153.7, 136.3, 10.9 | 36.6, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 4 valor | 36.6, 168.6, 136.3, 17 | 36.6, 168.6, 136.3, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 5 | 186.7, 143.1, 147.9, 53.1 | 186.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 5 rótulo | 192.5, 153.7, 136.3, 10.9 | 192.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 5 valor | 192.5, 168.6, 136.3, 17 | 192.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 6 | 342.7, 143.1, 147.9, 53.1 | 342.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 6 rótulo | 348.5, 153.7, 136.3, 10.9 | 348.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 6 valor | 348.5, 168.6, 136.3, 17 | 348.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 1·BIT 8 oldPrice | 145.7, 220.2, 229.9, 17 | 145.7, 220.2, 229.9, 17 | 0.0 | ✅ |
| 1·BIT 8 oldPrice valor | 229.3, 220.2, 57.7, 17 | 229.3, 220.2, 57.7, 17 | 0.0 | ✅ |
| 1·BIT 8 preço | 160.1, 249.2, 201.1, 28.8 | 160.1, 249.2, 201.1, 28.8 | 0.0 | ✅ |
| 1·BIT 8 "12x" | 167.3, 251.2, 42.6, 28 | 167.3, 251.2, 42.6, 28 | 0.0 | ✅ |
| 1·BIT 8 à vista (linha) | 160.1, 278, 201.1, 28 | 160.1, 278, 201.1, 28 | 0.0 | ✅ |
| 1·BIT 8 "ou" | 160.1, 280, 22.1, 24 | 160.1, 280, 22.1, 24 | 0.0 | ✅ |
| 1·BIT 8 "à vista" | 300.5, 280, 60.7, 24 | 300.5, 280, 60.7, 24 | 0.0 | ✅ |
| 1·BIT 8 nota de rodapé | 105.3, 320, 310.7, 14.8 | 105.3, 320, 310.7, 14.8 | 0.0 | ✅ |
| 1·BIT 8 botão | 30.8, 366.9, 459.8, 56 | 30.8, 366.9, 459.8, 56 | 0.0 | ✅ |
| 1·BIT 8 botão rótulo | 60.6, 388.5, 135.7, 12.8 | 60.6, 388.5, 135.7, 12.8 | 0.0 | ✅ |
| 1·BIT 8 botão gota | 432, 375, 50.4, 39.6 | 432, 375, 50.4, 39.6 | 0.0 | ✅ |
| 2·BIT 16 card | 522.2, 32, 483, 408.9 | 522.2, 32, 483, 408.9 | 0.0 | ✅ |
| 2·BIT 16 aba do título | 572.1, 17.8, 383.2, 46 | 572.1, 17.8, 383.2, 46 | 0.0 | ✅ |
| 2·BIT 16 título (h3) | 597.1, 26.8, 333.2, 28 | 597.1, 26.8, 333.2, 28 | 0.0 | ✅ |
| 2·BIT 16 chip 1 | 533.8, 82, 147.9, 53.1 | 533.8, 82, 147.9, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 1 rótulo | 539.6, 92.6, 136.3, 10.9 | 539.6, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 1 valor | 539.6, 107.5, 136.3, 17 | 539.6, 107.5, 136.3, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 2 | 689.7, 82, 147.9, 53.1 | 689.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 2 rótulo | 695.5, 92.6, 136.3, 10.9 | 695.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 2 valor | 695.5, 107.5, 136.3, 17 | 695.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 3 | 845.7, 82, 147.9, 53.1 | 845.7, 82, 147.9, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 3 rótulo | 851.5, 92.6, 136.3, 10.9 | 851.5, 92.6, 136.3, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 3 valor | 851.5, 107.5, 136.3, 17 | 851.5, 107.5, 136.3, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 4 | 533.8, 143.1, 147.9, 53.1 | 533.8, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 4 rótulo | 539.6, 153.7, 136.3, 10.9 | 539.6, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 4 valor | 539.6, 168.6, 136.3, 17 | 539.6, 168.6, 136.3, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 5 | 689.7, 143.1, 147.9, 53.1 | 689.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 5 rótulo | 695.5, 153.7, 136.3, 10.9 | 695.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 5 valor | 695.5, 168.6, 136.3, 17 | 695.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 6 | 845.7, 143.1, 147.9, 53.1 | 845.7, 143.1, 147.9, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 6 rótulo | 851.5, 153.7, 136.3, 10.9 | 851.5, 153.7, 136.3, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 6 valor | 851.5, 168.6, 136.3, 17 | 851.5, 168.6, 136.3, 17 | 0.0 | ✅ |
| 2·BIT 16 oldPrice | 648.7, 220.2, 229.9, 17 | 648.7, 220.2, 229.9, 17 | 0.0 | ✅ |
| 2·BIT 16 oldPrice valor | 732.3, 220.2, 57.7, 17 | 732.3, 220.2, 57.7, 17 | 0.0 | ✅ |
| 2·BIT 16 preço | 661.7, 249.2, 204, 28.8 | 661.7, 249.2, 204, 28.8 | 0.0 | ✅ |
| 2·BIT 16 "12x" | 668.3, 251.2, 42.6, 28 | 668.3, 251.2, 42.6, 28 | 0.0 | ✅ |
| 2·BIT 16 à vista (linha) | 661.7, 278, 204, 28 | 661.7, 278, 204, 28 | 0.0 | ✅ |
| 2·BIT 16 "ou" | 661.7, 280, 22.1, 24 | 661.7, 280, 22.1, 24 | 0.0 | ✅ |
| 2·BIT 16 "à vista" | 805, 280, 60.7, 24 | 805, 280, 60.7, 24 | 0.0 | ✅ |
| 2·BIT 16 nota de rodapé | 608.3, 320, 310.7, 14.8 | 608.3, 320, 310.7, 14.8 | 0.0 | ✅ |
| 2·BIT 16 botão | 533.8, 366.9, 459.8, 56 | 533.8, 366.9, 459.8, 56 | 0.0 | ✅ |
| 2·BIT 16 botão rótulo | 563.6, 388.5, 135.7, 12.8 | 563.6, 388.5, 135.7, 12.8 | 0.0 | ✅ |
| 2·BIT 16 botão gota | 935, 375, 50.4, 39.6 | 935, 375, 50.4, 39.6 | 0.0 | ✅ |

### 768 px · Mini Índice / Dólar

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 768, 578 | 0, 0, 768, 578 | 0.0 | ✅ |
| swiper | 19.2, 0, 729.6, 534 | 19.2, 0, 729.6, 534 | 0.0 | ✅ |
| 1·SÊNIOR card | 19.2, 32, 355, 470 | 19.2, 32, 355, 470 | 0.0 | ✅ |
| 1·SÊNIOR aba do título | 56.3, 15.4, 280.8, 50 | 56.3, 15.4, 280.8, 50 | 0.0 | ✅ |
| 1·SÊNIOR título (h3) | 81.3, 24.4, 230.8, 32 | 81.3, 24.4, 230.8, 32 | 0.0 | ✅ |
| 1·SÊNIOR tarja | 33.2, 67.6, 327, 37.6 | — (removido a pedido do cliente) | — | ➖ |
| 1·SÊNIOR chip 1 | 30.8, 82, 105.3, 53.1 | 30.8, 82, 105.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 1 rótulo | 36.6, 92.6, 93.7, 10.9 | 36.6, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 1 valor | 36.6, 107.5, 93.7, 17 | 36.6, 107.5, 93.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 | 144, 82, 105.3, 53.1 | 144, 82, 105.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 rótulo | 149.8, 92.6, 93.7, 10.9 | 149.8, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 valor | 149.8, 107.5, 93.7, 17 | 149.8, 107.5, 93.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 | 257.3, 82, 105.3, 53.1 | 257.3, 82, 105.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 rótulo | 263.1, 92.6, 93.7, 10.9 | 263.1, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 valor | 263.1, 107.5, 93.7, 17 | 263.1, 107.5, 93.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 | 30.8, 143.1, 105.3, 53.1 | 30.8, 143.1, 105.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 rótulo | 36.6, 153.7, 93.7, 10.9 | 36.6, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 valor | 36.6, 168.6, 93.7, 17 | 36.6, 168.6, 93.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 | 144, 143.1, 105.3, 53.1 | 144, 143.1, 105.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 rótulo | 149.8, 153.7, 93.7, 10.9 | 149.8, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 valor | 149.8, 168.6, 93.7, 17 | 149.8, 168.6, 93.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 | 257.3, 143.1, 105.3, 53.1 | 257.3, 143.1, 105.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 rótulo | 263.1, 153.7, 93.7, 10.9 | 263.1, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 valor | 263.1, 168.6, 93.7, 17 | 263.1, 168.6, 93.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 | 30.8, 204.2, 161.9, 53.1 | 30.8, 204.2, 161.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 rótulo | 36.6, 214.8, 150.3, 10.9 | 36.6, 214.8, 150.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 valor | 36.6, 229.7, 150.3, 17 | 36.6, 229.7, 150.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 | 200.7, 204.2, 161.9, 53.1 | 200.7, 204.2, 161.9, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 rótulo | 206.5, 214.8, 150.3, 10.9 | 206.5, 214.8, 150.3, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 valor | 206.5, 229.7, 150.3, 17 | 206.5, 229.7, 150.3, 17 | 0.0 | ✅ |
| 1·SÊNIOR oldPrice | 113.7, 281.3, 165.9, 17 | 113.7, 281.3, 165.9, 17 | 0.0 | ✅ |
| 1·SÊNIOR oldPrice valor | 160.1, 281.3, 68, 17 | 160.1, 281.3, 68, 17 | 0.0 | ✅ |
| 1·SÊNIOR preço | 91.3, 310.3, 210.7, 28.8 | 91.3, 310.3, 210.7, 28.8 | 0.0 | ✅ |
| 1·SÊNIOR "12x" | 96.6, 312.3, 42.6, 28 | 96.6, 312.3, 42.6, 28 | 0.0 | ✅ |
| 1·SÊNIOR à vista (linha) | 91.3, 339.1, 210.7, 28 | 91.3, 339.1, 210.7, 28 | 0.0 | ✅ |
| 1·SÊNIOR "ou" | 91.3, 341.1, 22.1, 24 | 91.3, 341.1, 22.1, 24 | 0.0 | ✅ |
| 1·SÊNIOR "à vista" | 241.4, 341.1, 60.7, 24 | 241.4, 341.1, 60.7, 24 | 0.0 | ✅ |
| 1·SÊNIOR nota de rodapé | 41.3, 381.1, 310.7, 14.8 | 41.3, 381.1, 310.7, 14.8 | 0.0 | ✅ |
| 1·SÊNIOR botão | 30.8, 428, 331.8, 56 | 30.8, 428, 331.8, 56 | 0.0 | ✅ |
| 1·SÊNIOR botão rótulo | 60.6, 449.6, 135.7, 12.8 | 60.6, 449.6, 135.7, 12.8 | 0.0 | ✅ |
| 1·SÊNIOR botão gota | 304, 436.2, 50.4, 39.6 | 304, 436.2, 50.4, 39.6 | 0.0 | ✅ |
| 2·EXPERT card | 394.2, 32, 355, 470 | 394.2, 32, 355, 470 | 0.0 | ✅ |
| 2·EXPERT aba do título | 431.3, 15.4, 280.8, 50 | 431.3, 15.4, 280.8, 50 | 0.0 | ✅ |
| 2·EXPERT título (h3) | 456.3, 24.4, 230.8, 32 | 456.3, 24.4, 230.8, 32 | 0.0 | ✅ |
| 2·EXPERT chip 1 | 405.8, 82, 105.3, 53.1 | 405.8, 82, 105.3, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 1 rótulo | 411.6, 92.6, 93.7, 10.9 | 411.6, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 1 valor | 411.6, 107.5, 93.7, 17 | 411.6, 107.5, 93.7, 17 | 0.0 | ✅ |
| 2·EXPERT chip 2 | 519, 82, 105.3, 53.1 | 519, 82, 105.3, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 2 rótulo | 524.8, 92.6, 93.7, 10.9 | 524.8, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 2 valor | 524.8, 107.5, 93.7, 17 | 524.8, 107.5, 93.7, 17 | 0.0 | ✅ |
| 2·EXPERT chip 3 | 632.3, 82, 105.3, 53.1 | 632.3, 82, 105.3, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 3 rótulo | 638.1, 92.6, 93.7, 10.9 | 638.1, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 3 valor | 638.1, 107.5, 93.7, 17 | 638.1, 107.5, 93.7, 17 | 0.0 | ✅ |
| 2·EXPERT chip 4 | 405.8, 143.1, 105.3, 53.1 | 405.8, 143.1, 105.3, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 4 rótulo | 411.6, 153.7, 93.7, 10.9 | 411.6, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 4 valor | 411.6, 168.6, 93.7, 17 | 411.6, 168.6, 93.7, 17 | 0.0 | ✅ |
| 2·EXPERT chip 5 | 519, 143.1, 105.3, 53.1 | 519, 143.1, 105.3, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 5 rótulo | 524.8, 153.7, 93.7, 10.9 | 524.8, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 5 valor | 524.8, 168.6, 93.7, 17 | 524.8, 168.6, 93.7, 17 | 0.0 | ✅ |
| 2·EXPERT chip 6 | 632.3, 143.1, 105.3, 53.1 | 632.3, 143.1, 105.3, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 6 rótulo | 638.1, 153.7, 93.7, 10.9 | 638.1, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 6 valor | 638.1, 168.6, 93.7, 17 | 638.1, 168.6, 93.7, 17 | 0.0 | ✅ |
| 2·EXPERT chip 7 | 405.8, 204.2, 161.9, 53.1 | 405.8, 204.2, 161.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 7 rótulo | 411.6, 214.8, 150.3, 10.9 | 411.6, 214.8, 150.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 7 valor | 411.6, 229.7, 150.3, 17 | 411.6, 229.7, 150.3, 17 | 0.0 | ✅ |
| 2·EXPERT chip 8 | 575.7, 204.2, 161.9, 53.1 | 575.7, 204.2, 161.9, 53.1 | 0.0 | ✅ |
| 2·EXPERT chip 8 rótulo | 581.5, 214.8, 150.3, 10.9 | 581.5, 214.8, 150.3, 10.9 | 0.0 | ✅ |
| 2·EXPERT chip 8 valor | 581.5, 229.7, 150.3, 17 | 581.5, 229.7, 150.3, 17 | 0.0 | ✅ |
| 2·EXPERT oldPrice | 488.7, 281.3, 165.9, 17 | 488.7, 281.3, 165.9, 17 | 0.0 | ✅ |
| 2·EXPERT oldPrice valor | 535.1, 281.3, 68, 17 | 535.1, 281.3, 68, 17 | 0.0 | ✅ |
| 2·EXPERT preço | 467.7, 310.3, 208, 28.8 | 467.7, 310.3, 208, 28.8 | 0.0 | ✅ |
| 2·EXPERT "12x" | 477, 312.3, 42.6, 28 | 477, 312.3, 42.6, 28 | 0.0 | ✅ |
| 2·EXPERT à vista (linha) | 467.7, 339.1, 208, 28 | 467.7, 339.1, 208, 28 | 0.0 | ✅ |
| 2·EXPERT "ou" | 467.7, 341.1, 22.1, 24 | 467.7, 341.1, 22.1, 24 | 0.0 | ✅ |
| 2·EXPERT "à vista" | 615, 341.1, 60.7, 24 | 615, 341.1, 60.7, 24 | 0.0 | ✅ |
| 2·EXPERT nota de rodapé | 416.3, 381.1, 310.7, 14.8 | 416.3, 381.1, 310.7, 14.8 | 0.0 | ✅ |
| 2·EXPERT botão | 405.8, 428, 331.8, 56 | 405.8, 428, 331.8, 56 | 0.0 | ✅ |
| 2·EXPERT botão rótulo | 435.6, 449.6, 135.7, 12.8 | 435.6, 449.6, 135.7, 12.8 | 0.0 | ✅ |
| 2·EXPERT botão gota | 679, 436.2, 50.4, 39.6 | 679, 436.2, 50.4, 39.6 | 0.0 | ✅ |
| paginação | 96, 534, 576, 44 | 96, 534, 576, 44 | 0.0 | ✅ |
| paginação 1 (TRAINEE) | 96, 534, 89.3, 44 | 96, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 2 (JÚNIOR) | 193.3, 534, 89.3, 44 | 193.3, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 3 (PLENO) | 290.7, 534, 89.3, 44 | 290.7, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 4 (SÊNIOR) | 388, 534, 89.3, 44 | 388, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 5 (EXPERT) | 485.3, 534, 89.3, 44 | 485.3, 534, 89.3, 44 | 0.0 | ✅ |
| paginação 6 (MASTER) | 582.7, 534, 89.3, 44 | 582.7, 534, 89.3, 44 | 0.0 | ✅ |

### 768 px · Futuro de Bitcoin

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 768, 489.9 | 0, 0, 768, 489.9 | 0.0 | ✅ |
| swiper | 19.2, 0, 729.6, 489.9 | 19.2, 0, 729.6, 489.9 | 0.0 | ✅ |
| 1·BIT 8 card | 19.2, 32, 355, 425.9 | 19.2, 32, 355, 425.9 | 0.0 | ✅ |
| 1·BIT 8 aba do título | 56.3, 17.1, 280.8, 46 | 56.3, 17.1, 280.8, 46 | 0.0 | ✅ |
| 1·BIT 8 título (h3) | 81.3, 26.1, 230.8, 28 | 81.3, 26.1, 230.8, 28 | 0.0 | ✅ |
| 1·BIT 8 chip 1 | 30.8, 82, 105.3, 53.1 | 30.8, 82, 105.3, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 1 rótulo | 36.6, 92.6, 93.7, 10.9 | 36.6, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 1 valor | 36.6, 107.5, 93.7, 17 | 36.6, 107.5, 93.7, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 2 | 144, 82, 105.3, 53.1 | 144, 82, 105.3, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 2 rótulo | 149.8, 92.6, 93.7, 10.9 | 149.8, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 2 valor | 149.8, 107.5, 93.7, 17 | 149.8, 107.5, 93.7, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 3 | 257.3, 82, 105.3, 53.1 | 257.3, 82, 105.3, 53.1 | 0.0 | ✅ |
| 1·BIT 8 chip 3 rótulo | 263.1, 92.6, 93.7, 10.9 | 263.1, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 3 valor | 263.1, 107.5, 93.7, 17 | 263.1, 107.5, 93.7, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 4 | 30.8, 143.1, 105.3, 70.1 | 30.8, 143.1, 105.3, 70.1 | 0.0 | ✅ |
| 1·BIT 8 chip 4 rótulo | 36.6, 162.2, 93.7, 10.9 | 36.6, 162.2, 93.7, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 4 valor | 36.6, 177.1, 93.7, 17 | 36.6, 177.1, 93.7, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 5 | 144, 143.1, 105.3, 70.1 | 144, 143.1, 105.3, 70.1 | 0.0 | ✅ |
| 1·BIT 8 chip 5 rótulo | 149.8, 162.2, 93.7, 10.9 | 149.8, 162.2, 93.7, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 5 valor | 149.8, 177.1, 93.7, 17 | 149.8, 177.1, 93.7, 17 | 0.0 | ✅ |
| 1·BIT 8 chip 6 | 257.3, 143.1, 105.3, 70.1 | 257.3, 143.1, 105.3, 70.1 | 0.0 | ✅ |
| 1·BIT 8 chip 6 rótulo | 263.1, 153.7, 93.7, 10.9 | 263.1, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 1·BIT 8 chip 6 valor | 263.1, 168.6, 93.7, 34 | 263.1, 168.6, 93.7, 34 | 0.0 | ✅ |
| 1·BIT 8 oldPrice | 113.7, 237.2, 165.9, 17 | 113.7, 237.2, 165.9, 17 | 0.0 | ✅ |
| 1·BIT 8 oldPrice valor | 165.3, 237.2, 57.7, 17 | 165.3, 237.2, 57.7, 17 | 0.0 | ✅ |
| 1·BIT 8 preço | 96.1, 266.2, 201.1, 28.8 | 96.1, 266.2, 201.1, 28.8 | 0.0 | ✅ |
| 1·BIT 8 "12x" | 103.3, 268.2, 42.6, 28 | 103.3, 268.2, 42.6, 28 | 0.0 | ✅ |
| 1·BIT 8 à vista (linha) | 96.1, 295, 201.1, 28 | 96.1, 295, 201.1, 28 | 0.0 | ✅ |
| 1·BIT 8 "ou" | 96.1, 297, 22.1, 24 | 96.1, 297, 22.1, 24 | 0.0 | ✅ |
| 1·BIT 8 "à vista" | 236.5, 297, 60.7, 24 | 236.5, 297, 60.7, 24 | 0.0 | ✅ |
| 1·BIT 8 nota de rodapé | 41.3, 337, 310.7, 14.8 | 41.3, 337, 310.7, 14.8 | 0.0 | ✅ |
| 1·BIT 8 botão | 30.8, 383.9, 331.8, 56 | 30.8, 383.9, 331.8, 56 | 0.0 | ✅ |
| 1·BIT 8 botão rótulo | 60.6, 405.5, 135.7, 12.8 | 60.6, 405.5, 135.7, 12.8 | 0.0 | ✅ |
| 1·BIT 8 botão gota | 304, 392, 50.4, 39.6 | 304, 392, 50.4, 39.6 | 0.0 | ✅ |
| 2·BIT 16 card | 394.2, 32, 355, 425.9 | 394.2, 32, 355, 425.9 | 0.0 | ✅ |
| 2·BIT 16 aba do título | 431.3, 17.1, 280.8, 46 | 431.3, 17.1, 280.8, 46 | 0.0 | ✅ |
| 2·BIT 16 título (h3) | 456.3, 26.1, 230.8, 28 | 456.3, 26.1, 230.8, 28 | 0.0 | ✅ |
| 2·BIT 16 chip 1 | 405.8, 82, 105.3, 53.1 | 405.8, 82, 105.3, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 1 rótulo | 411.6, 92.6, 93.7, 10.9 | 411.6, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 1 valor | 411.6, 107.5, 93.7, 17 | 411.6, 107.5, 93.7, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 2 | 519, 82, 105.3, 53.1 | 519, 82, 105.3, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 2 rótulo | 524.8, 92.6, 93.7, 10.9 | 524.8, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 2 valor | 524.8, 107.5, 93.7, 17 | 524.8, 107.5, 93.7, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 3 | 632.3, 82, 105.3, 53.1 | 632.3, 82, 105.3, 53.1 | 0.0 | ✅ |
| 2·BIT 16 chip 3 rótulo | 638.1, 92.6, 93.7, 10.9 | 638.1, 92.6, 93.7, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 3 valor | 638.1, 107.5, 93.7, 17 | 638.1, 107.5, 93.7, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 4 | 405.8, 143.1, 105.3, 70.1 | 405.8, 143.1, 105.3, 70.1 | 0.0 | ✅ |
| 2·BIT 16 chip 4 rótulo | 411.6, 162.2, 93.7, 10.9 | 411.6, 162.2, 93.7, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 4 valor | 411.6, 177.1, 93.7, 17 | 411.6, 177.1, 93.7, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 5 | 519, 143.1, 105.3, 70.1 | 519, 143.1, 105.3, 70.1 | 0.0 | ✅ |
| 2·BIT 16 chip 5 rótulo | 524.8, 162.2, 93.7, 10.9 | 524.8, 162.2, 93.7, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 5 valor | 524.8, 177.1, 93.7, 17 | 524.8, 177.1, 93.7, 17 | 0.0 | ✅ |
| 2·BIT 16 chip 6 | 632.3, 143.1, 105.3, 70.1 | 632.3, 143.1, 105.3, 70.1 | 0.0 | ✅ |
| 2·BIT 16 chip 6 rótulo | 638.1, 153.7, 93.7, 10.9 | 638.1, 153.7, 93.7, 10.9 | 0.0 | ✅ |
| 2·BIT 16 chip 6 valor | 638.1, 168.6, 93.7, 34 | 638.1, 168.6, 93.7, 34 | 0.0 | ✅ |
| 2·BIT 16 oldPrice | 488.7, 237.2, 165.9, 17 | 488.7, 237.2, 165.9, 17 | 0.0 | ✅ |
| 2·BIT 16 oldPrice valor | 540.3, 237.2, 57.7, 17 | 540.3, 237.2, 57.7, 17 | 0.0 | ✅ |
| 2·BIT 16 preço | 469.7, 266.2, 204, 28.8 | 469.7, 266.2, 204, 28.8 | 0.0 | ✅ |
| 2·BIT 16 "12x" | 476.3, 268.2, 42.6, 28 | 476.3, 268.2, 42.6, 28 | 0.0 | ✅ |
| 2·BIT 16 à vista (linha) | 469.7, 295, 204, 28 | 469.7, 295, 204, 28 | 0.0 | ✅ |
| 2·BIT 16 "ou" | 469.7, 297, 22.1, 24 | 469.7, 297, 22.1, 24 | 0.0 | ✅ |
| 2·BIT 16 "à vista" | 613, 297, 60.7, 24 | 613, 297, 60.7, 24 | 0.0 | ✅ |
| 2·BIT 16 nota de rodapé | 416.3, 337, 310.7, 14.8 | 416.3, 337, 310.7, 14.8 | 0.0 | ✅ |
| 2·BIT 16 botão | 405.8, 383.9, 331.8, 56 | 405.8, 383.9, 331.8, 56 | 0.0 | ✅ |
| 2·BIT 16 botão rótulo | 435.6, 405.5, 135.7, 12.8 | 435.6, 405.5, 135.7, 12.8 | 0.0 | ✅ |
| 2·BIT 16 botão gota | 679, 392, 50.4, 39.6 | 679, 392, 50.4, 39.6 | 0.0 | ✅ |

### 390 px · Mini Índice / Dólar

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 390, 622 | 0, 0, 390, 622 | 0.0 | ✅ |
| swiper | 19.2, 0, 351.6, 534 | 19.2, 0, 351.6, 534 | 0.0 | ✅ |
| 1·SÊNIOR card | 19.2, 32, 352, 470 | 19.2, 32, 352, 470 | 0.0 | ✅ |
| 1·SÊNIOR aba do título | 56, 15.4, 278.4, 50 | 56, 15.4, 278.4, 50 | 0.0 | ✅ |
| 1·SÊNIOR título (h3) | 81, 24.4, 228.4, 32 | 81, 24.4, 228.4, 32 | 0.0 | ✅ |
| 1·SÊNIOR tarja | 33.2, 67.6, 324, 37.6 | — (removido a pedido do cliente) | — | ➖ |
| 1·SÊNIOR chip 1 | 30.8, 82, 104.3, 53.1 | 30.8, 82, 104.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 1 rótulo | 36.6, 92.6, 92.7, 10.9 | 36.6, 92.6, 92.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 1 valor | 36.6, 107.5, 92.7, 17 | 36.6, 107.5, 92.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 | 143, 82, 104.3, 53.1 | 143, 82, 104.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 rótulo | 148.8, 92.6, 92.7, 10.9 | 148.8, 92.6, 92.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 2 valor | 148.8, 107.5, 92.7, 17 | 148.8, 107.5, 92.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 | 255.3, 82, 104.3, 53.1 | 255.3, 82, 104.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 rótulo | 261.1, 92.6, 92.7, 10.9 | 261.1, 92.6, 92.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 3 valor | 261.1, 107.5, 92.7, 17 | 261.1, 107.5, 92.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 | 30.8, 143.1, 104.3, 53.1 | 30.8, 143.1, 104.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 rótulo | 36.6, 153.7, 92.7, 10.9 | 36.6, 153.7, 92.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 4 valor | 36.6, 168.6, 92.7, 17 | 36.6, 168.6, 92.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 | 143, 143.1, 104.3, 53.1 | 143, 143.1, 104.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 rótulo | 148.8, 153.7, 92.7, 10.9 | 148.8, 153.7, 92.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 5 valor | 148.8, 168.6, 92.7, 17 | 148.8, 168.6, 92.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 | 255.3, 143.1, 104.3, 53.1 | 255.3, 143.1, 104.3, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 rótulo | 261.1, 153.7, 92.7, 10.9 | 261.1, 153.7, 92.7, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 6 valor | 261.1, 168.6, 92.7, 17 | 261.1, 168.6, 92.7, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 | 30.8, 204.2, 160.4, 53.1 | 30.8, 204.2, 160.4, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 rótulo | 36.6, 214.8, 148.8, 10.9 | 36.6, 214.8, 148.8, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 7 valor | 36.6, 229.7, 148.8, 17 | 36.6, 229.7, 148.8, 17 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 | 199.2, 204.2, 160.4, 53.1 | 199.2, 204.2, 160.4, 53.1 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 rótulo | 205, 214.8, 148.8, 10.9 | 205, 214.8, 148.8, 10.9 | 0.0 | ✅ |
| 1·SÊNIOR chip 8 valor | 205, 229.7, 148.8, 17 | 205, 229.7, 148.8, 17 | 0.0 | ✅ |
| 1·SÊNIOR oldPrice | 113, 281.3, 164.4, 17 | 113, 281.3, 164.4, 17 | 0.0 | ✅ |
| 1·SÊNIOR oldPrice valor | 158.6, 281.3, 68, 17 | 158.6, 281.3, 68, 17 | 0.0 | ✅ |
| 1·SÊNIOR preço | 89.8, 310.3, 210.7, 28.8 | 89.8, 310.3, 210.7, 28.8 | 0.0 | ✅ |
| 1·SÊNIOR "12x" | 95.1, 312.3, 42.6, 28 | 95.1, 312.3, 42.6, 28 | 0.0 | ✅ |
| 1·SÊNIOR à vista (linha) | 89.8, 339.1, 210.7, 28 | 89.8, 339.1, 210.7, 28 | 0.0 | ✅ |
| 1·SÊNIOR "ou" | 89.8, 341.1, 22.1, 24 | 89.8, 341.1, 22.1, 24 | 0.0 | ✅ |
| 1·SÊNIOR "à vista" | 239.9, 341.1, 60.7, 24 | 239.9, 341.1, 60.7, 24 | 0.0 | ✅ |
| 1·SÊNIOR nota de rodapé | 39.8, 381.1, 310.7, 14.8 | 39.8, 381.1, 310.7, 14.8 | 0.0 | ✅ |
| 1·SÊNIOR botão | 30.8, 428, 328.8, 56 | 30.8, 428, 328.8, 56 | 0.0 | ✅ |
| 1·SÊNIOR botão rótulo | 60.6, 449.6, 135.7, 12.8 | 60.6, 449.6, 135.7, 12.8 | 0.0 | ✅ |
| 1·SÊNIOR botão gota | 301, 436.2, 50.4, 39.6 | 301, 436.2, 50.4, 39.6 | 0.0 | ✅ |
| paginação | 19.2, 534, 351.6, 88 | 19.2, 534, 351.6, 88 | 0.0 | ✅ |
| paginação 1 (TRAINEE) | 19.2, 534, 111.9, 44 | 19.2, 534, 111.9, 44 | 0.0 | ✅ |
| paginação 2 (JÚNIOR) | 139.1, 534, 111.9, 44 | 139.1, 534, 111.9, 44 | 0.0 | ✅ |
| paginação 3 (PLENO) | 258.9, 534, 111.9, 44 | 258.9, 534, 111.9, 44 | 0.0 | ✅ |
| paginação 4 (SÊNIOR) | 19.2, 578, 111.9, 44 | 19.2, 578, 111.9, 44 | 0.0 | ✅ |
| paginação 5 (EXPERT) | 139.1, 578, 111.9, 44 | 139.1, 578, 111.9, 44 | 0.0 | ✅ |
| paginação 6 (MASTER) | 258.9, 578, 111.9, 44 | 258.9, 578, 111.9, 44 | 0.0 | ✅ |

### 390 px · Futuro de Bitcoin

| Elemento | Home x, y, l, a | LP x, y, l, a | Δ máx | |
|---|---|---|---|---|
| faixa do carrossel (.wrapper.plano) | 0, 0, 390, 533.9 | 0, 0, 390, 533.9 | 0.0 | ✅ |
| swiper | 19.2, 0, 351.6, 489.9 | 19.2, 0, 351.6, 489.9 | 0.0 | ✅ |
| 1·BIT 16 card | 19.2, 32, 352, 425.9 | 19.2, 32, 352, 425.9 | 0.0 | ✅ |
| 1·BIT 16 aba do título | 56, 17.1, 278.4, 46 | 56, 17.1, 278.4, 46 | 0.0 | ✅ |
| 1·BIT 16 título (h3) | 81, 26.1, 228.4, 28 | 81, 26.1, 228.4, 28 | 0.0 | ✅ |
| 1·BIT 16 chip 1 | 30.8, 82, 104.3, 53.1 | 30.8, 82, 104.3, 53.1 | 0.0 | ✅ |
| 1·BIT 16 chip 1 rótulo | 36.6, 92.6, 92.7, 10.9 | 36.6, 92.6, 92.7, 10.9 | 0.0 | ✅ |
| 1·BIT 16 chip 1 valor | 36.6, 107.5, 92.7, 17 | 36.6, 107.5, 92.7, 17 | 0.0 | ✅ |
| 1·BIT 16 chip 2 | 143, 82, 104.3, 53.1 | 143, 82, 104.3, 53.1 | 0.0 | ✅ |
| 1·BIT 16 chip 2 rótulo | 148.8, 92.6, 92.7, 10.9 | 148.8, 92.6, 92.7, 10.9 | 0.0 | ✅ |
| 1·BIT 16 chip 2 valor | 148.8, 107.5, 92.7, 17 | 148.8, 107.5, 92.7, 17 | 0.0 | ✅ |
| 1·BIT 16 chip 3 | 255.3, 82, 104.3, 53.1 | 255.3, 82, 104.3, 53.1 | 0.0 | ✅ |
| 1·BIT 16 chip 3 rótulo | 261.1, 92.6, 92.7, 10.9 | 261.1, 92.6, 92.7, 10.9 | 0.0 | ✅ |
| 1·BIT 16 chip 3 valor | 261.1, 107.5, 92.7, 17 | 261.1, 107.5, 92.7, 17 | 0.0 | ✅ |
| 1·BIT 16 chip 4 | 30.8, 143.1, 104.3, 70.1 | 30.8, 143.1, 104.3, 70.1 | 0.0 | ✅ |
| 1·BIT 16 chip 4 rótulo | 36.6, 162.2, 92.7, 10.9 | 36.6, 162.2, 92.7, 10.9 | 0.0 | ✅ |
| 1·BIT 16 chip 4 valor | 36.6, 177.1, 92.7, 17 | 36.6, 177.1, 92.7, 17 | 0.0 | ✅ |
| 1·BIT 16 chip 5 | 143, 143.1, 104.3, 70.1 | 143, 143.1, 104.3, 70.1 | 0.0 | ✅ |
| 1·BIT 16 chip 5 rótulo | 148.8, 162.2, 92.7, 10.9 | 148.8, 162.2, 92.7, 10.9 | 0.0 | ✅ |
| 1·BIT 16 chip 5 valor | 148.8, 177.1, 92.7, 17 | 148.8, 177.1, 92.7, 17 | 0.0 | ✅ |
| 1·BIT 16 chip 6 | 255.3, 143.1, 104.3, 70.1 | 255.3, 143.1, 104.3, 70.1 | 0.0 | ✅ |
| 1·BIT 16 chip 6 rótulo | 261.1, 153.7, 92.7, 10.9 | 261.1, 153.7, 92.7, 10.9 | 0.0 | ✅ |
| 1·BIT 16 chip 6 valor | 261.1, 168.6, 92.7, 34 | 261.1, 168.6, 92.7, 34 | 0.0 | ✅ |
| 1·BIT 16 oldPrice | 113, 237.2, 164.4, 17 | 113, 237.2, 164.4, 17 | 0.0 | ✅ |
| 1·BIT 16 oldPrice valor | 163.8, 237.2, 57.7, 17 | 163.8, 237.2, 57.7, 17 | 0.0 | ✅ |
| 1·BIT 16 preço | 93.2, 266.2, 204, 28.8 | 93.2, 266.2, 204, 28.8 | 0.0 | ✅ |
| 1·BIT 16 "12x" | 99.8, 268.2, 42.6, 28 | 99.8, 268.2, 42.6, 28 | 0.0 | ✅ |
| 1·BIT 16 à vista (linha) | 93.2, 295, 204, 28 | 93.2, 295, 204, 28 | 0.0 | ✅ |
| 1·BIT 16 "ou" | 93.2, 297, 22.1, 24 | 93.2, 297, 22.1, 24 | 0.0 | ✅ |
| 1·BIT 16 "à vista" | 236.5, 297, 60.7, 24 | 236.5, 297, 60.7, 24 | 0.0 | ✅ |
| 1·BIT 16 nota de rodapé | 39.8, 337, 310.7, 14.8 | 39.8, 337, 310.7, 14.8 | 0.0 | ✅ |
| 1·BIT 16 botão | 30.8, 383.9, 328.8, 56 | 30.8, 383.9, 328.8, 56 | 0.0 | ✅ |
| 1·BIT 16 botão rótulo | 60.6, 405.5, 135.7, 12.8 | 60.6, 405.5, 135.7, 12.8 | 0.0 | ✅ |
| 1·BIT 16 botão gota | 301, 392, 50.4, 39.6 | 301, 392, 50.4, 39.6 | 0.0 | ✅ |
| paginação | 19.2, 489.9, 351.6, 44 | 19.2, 489.9, 351.6, 44 | 0.0 | ✅ |
| paginação 1 (BIT 16) | 79.1, 489.9, 111.9, 44 | 79.1, 489.9, 111.9, 44 | 0.0 | ✅ |
| paginação 2 (BIT 8) | 199, 489.9, 111.9, 44 | 199, 489.9, 111.9, 44 | 0.0 | ✅ |

---

## Adendo pós-aprovação (commit "fase 4 (ajuste): bitcoin sem loop e publicação em subpasta")

**Bitcoin (2 cards): o defeito da home não foi replicado.**

O `carrosselPlanos.js` só liga o loop quando o mercado tem pelo menos 2 × o maior `slidesPerView`. Com menos cards:
- loop desligado;
- `centerInsufficientSlides`;
- `watchOverflow` (as setas somem quando todos cabem);
- indicadores montados um por card, com o nome do plano. A paginação do Swiper sem loop tem um por posição: com os 2 cards à vista, só um.

O mesmo vale se o índice perder cards por dado inválido. Outras mudanças:
- O `blackPlanos.js` põe os cards na ordem do `planos.json` (BIT 8, BIT 16), uma vez, antes de o carrossel armar.
- O aviso "Swiper Loop Warning" que ainda sobrava vinha do carrossel do índice criado escondido (página aberta com `?ativo=bitcoin`). Agora os dois blocos ficam visíveis só enquanto os carrosséis nascem, na mesma tarefa e sem pintar.

**Teste com 3 recargas seguidas por largura, em `?ativo=bitcoin`:**

| Largura | Ordem | Na tela | Loop | Centro | Setas | Indicadores | Console |
|---|---|---|---|---|---|---|---|
| 390 | BIT 8, BIT 16 (3/3) | BIT 8 | não | 0 px | escondidas | BIT 8, BIT 16 | nenhum aviso |
| 768 | BIT 8, BIT 16 (3/3) | os dois | não | 0 px | escondidas | BIT 8, BIT 16 | nenhum aviso |
| 1440 | BIT 8, BIT 16 (3/3) | os dois | não | 0 px | escondidas | BIT 8, BIT 16 | nenhum aviso |

Em 390, clicar no indicador "BIT 16" leva ao card e o acende; o BIT 8 fica `inert`. Voltar ao índice mantém o Sênior e os 6 indicadores.

Rodei de novo, sem regressão:
- UTM 8/8;
- etiqueta nunca cortada (5 larguras);
- fallback;
- card inválido (4 cards, sem loop, 4 indicadores);
- teclado;
- página sem scroll horizontal e com console limpo.

**P3 (publicação em https://zero7.com.br/a-maior-black/):**
- `PLANOS_URL` continua `data/planos.json`, o arquivo próprio da LP. O "TODO" saiu, e um comentário explica por que não aponta para o painel da home.
- Não há nenhum caminho começando com "/" no HTML, CSS ou JS. O favicon é `data:,` e o sprite do selo é inline; manifest ainda não existe (Fase 6).
- O `live-server --mount=/a-maior-black:.` devolveu 404 na própria subpasta no Windows. Além disso, ele serviria a pasta também na raiz, e um caminho absoluto passaria despercebido. Por isso criei `scripts/servir-subpasta.mjs`: serve a pasta só em `/a-maior-black/` e responde 404 em todo o resto.
- **Resultado em http://localhost:5502/a-maior-black/ (390 e 1440, página rolada inteira e os dois mercados):** 38 requisições (html, 10 css, 6 woff2, 11 js com o Swiper, svg, png, avif, json); nenhum 404, nenhuma requisição fora da subpasta, console limpo e os 8 planos prontos. Vou repetir o teste na Fase 5, com os vídeos.
- A tabela de pendências do `PROMPTS-LP-BLACK.md` foi atualizada: P3 resolvida, P2 aguardando os preços do cliente. O commit leva junto as suas alterações que estavam abertas nesse arquivo (porta 5501, vídeos do HUB e logo animada na Fase 5).
