# Fase 6: polimento e entrega

## O que foi feito

### 1. Barra fixa do mobile (sem contador)

- **O que é:** só o botão laranja "Aproveitar a Black" (`.fbtn`), quase na largura toda. Fica dentro de um vidro escuro com raio `16px 0`, 10 px acima da safe-area (`env(safe-area-inset-bottom)` + `viewport-fit=cover`).
- **Onde existe:** só abaixo de 768 px. O contador continua guardado em `js/modulos/contador.js`, sem uso.
- **Regras (`js/modulos/barra-mobile.js`):**
  - aparece quando a hero sai da tela;
  - some quando a seção de planos ou o rodapé estão visíveis;
  - também some quando qualquer CTA da página entra na faixa da barra, então nunca cobre um botão;
  - escondida, ela fica `inert` (fora do Tab e do leitor de tela).
- **CSS:** `css/secoes/barra-mobile.css` (0,8 KB) bloqueia a renderização de propósito. Quando estava adiada, a barra ficava no fluxo até a folha chegar e gerava um deslocamento de layout (CLS 0,009).

### 2. Movimento

- O inventário abaixo foi feito rolando a página inteira e listando o que está rodando (`document.getAnimations()`, CSS e WAAPI).
- **Sem preferência:** 17 animações em 1440 e 18 em 390:
  - selo da hero (stamp e giro), breathe, twinkle e a luz do botão escuro;
  - balanço das etiquetas dos planos;
  - coroa e órbitas do fechamento;
  - logo animada (WAAPI);
  - transições de hover e a transição da barra mobile.
- **Com `prefers-reduced-motion: reduce`:** **0 animações** em 1440 e em 390. Também ficam desligados:
  - o Lenis;
  - a logo animada (vira a imagem estática);
  - o autoplay dos vídeos;
  - a transição do Swiper (`speed 0`).
- **Scroll-jacking:** nenhum. O Lenis só suaviza a roda e respeita a posição nativa. A âncora, o teclado e o toque continuam nativos.
- **Lenis:** o loop de quadros dele agora só roda enquanto há rolagem (`js/modulos/rolagem.js`). Antes, ele rodava o tempo todo.

### 3. Imagem de fundo da hero (P6)

`assets/img/` só tem o `.gitkeep`: não existe nenhum `hero-bg-*`. Pela instrução, não fiz nada. O `<picture>` continua comentado no `index.html` e o horizonte em CSS segue valendo.

### 4. Performance

O que foi otimizado:

- **CSS adiado:** as folhas abaixo da dobra (planos, pele, comunidade, fechamento, rodapé) carregam sem bloquear (`media="print"` → `all`, com `<noscript>`).
- **Grão:** a textura (77 KB) entra depois do `load` (`html.grao-pronto`).
- **Favicon:** só o PNG de 1 KB. O SVG pesava 33 KB e não está linkado.
- **Hero:** o `filter: blur()` do `.glow-rise` saiu (diferença de pixels: média 0,05, máximo 4 de 255).
- **Swiper dos planos:**
  - só é baixado e armado quando a seção chega a ~1200 px da tela;
  - o idle vem antes, então o download começa assim que a seção se aproxima;
  - armado tarde, ele trocava o card da frente (do Iniciante para o Sênior) à vista: CLS 0,015.
- **Servidor de teste:** `scripts/servir-subpasta.mjs` agora comprime em gzip, como um servidor de produção.

Os números estão em "Checagens".

### 5. SEO e compartilhamento

- **Título:** "A maior Black da história: 80% OFF | Zero7".
- **Description:** "80% OFF para garantir o seu plano perfeito + um pacote completo para levar sua jornada no trading para outro nível." São frases da copy (título dos planos + subtítulo da hero).
- **Open Graph e Twitter:**
  - título e descrição iguais aos de cima;
  - `og:url` e canonical: `https://zero7.com.br/a-maior-black/`;
  - `og:image` (1200 × 630) com `alt`.
- **Favicon e ícone do iOS:** o ingresso ZERO7 do brand kit (`assets/marca/favicon-32.png` e `apple-touch-icon.png`), gerados por `scripts/gerar-icones-og.mjs`.
- **Imagem OG, para aprovar:** `shots/fase-6/og-1200x630.jpg` (também em `assets/og/`). É o topo da página, sem a nav: H1 com o selo, subtítulo e CTA sobre o horizonte.

### 6. Acessibilidade

- **axe** (`@axe-core/playwright`, WCAG 2.0/2.1/2.2 A e AA + boas práticas, página inteira com os carrosséis armados):
  - **0 violações** em 1440 e em 390;
  - com o menu mobile aberto, também 0.
- **Teclado:** o percurso está descrito em "Checagens".

### 7. Tracking (P7)

- Nenhum script de terceiros foi adicionado. O `<head>` tem o comentário `<!-- TRACKING: GTM/Meta entram aqui -->`.
- `data-cta` em todos os CTAs (13 valores, 14 elementos):
  - `nav` (2: o botão da nav e o do menu);
  - `hero`;
  - `beneficios`;
  - `plano-trainee`, `plano-junior`, `plano-pleno`, `plano-senior`, `plano-expert`, `plano-master`;
  - `plano-bit_trainee` e `plano-bit_junior` (BIT 8 e BIT 16; a chave é a do `planos.json`);
  - `fechamento`;
  - `barra-mobile`.
- Os `data-cta` dos planos são colocados pelo `scripts/portar-planos-html.mjs`, então não se perdem quando o porte roda de novo.

### 8. Entrega

- **`README.md`:**
  - como rodar;
  - o que sobe para o servidor;
  - o que **não** sobe: `_brandkit`, `_referencia`, `_videos-fora-do-site`, `shots`, `relatorios`, `node_modules`, `scripts`, `componentes.html` e os `.md`;
  - compressão, cache e `Range` no servidor;
  - onde editar cada coisa: `js/config.js`, `data/planos.json` + `npm run planos:snapshot`, o array `MIDIA`, os tokens e o tracking;
  - os scripts de manutenção.
- **Porta 5501:** em `npm run dev`, no padrão do `npm run shots` e no CLAUDE.md. Também criei o `npm run subpasta`.
- **`npm run shots`:** aceita `--larguras=414,390`. A barra fixa sai das capturas de página inteira, porque se repetia em cada fatia; ela tem capturas próprias.

### Ajustes do cliente feitos durante a Fase 6 (já commitados)

**Comunidade** (`8cebe6c`, `5aae2a9`):

- sem palco: fileira de cards sangrada (Swiper com loop e cards centralizados);
- texto sobre os cards;
- vídeos sempre mudos, em loop, sem controles;
- os 16:9 saíram;
- título bicolor: branco até "evoluindo"; "com o ecossistema criado pela Zero7." em cinza .42, em linha própria a partir de 768 px. Dá **3 linhas exatas** em 1280, 1440 e 1920.

**Fechamento** (`5aae2a9`, `7a2f6f1`). Medidas:

| Largura | Logo | Gaps logo→frase / frase→botão | Centro conteúdo × eclipse | Respiros (topo / base) |
|---|---|---|---|---|
| 1920 | 179,4 px = 65,0% do botão (275,8) | 24,0 / 24,0 | 0,0 px | 160 / 160 |
| 1440 | 179,4 px = 65,0% | 24,0 / 24,0 | 0,0 px | 160 / 160 |
| 390 | 163,1 px = 65,0% (botão 251,1) | 20,0 / 20,0 | 0,0 px | 120 / 120 |

- **Logo:** 65% do botão é ~179 px. A mensagem citava "~130 px", mas com o botão de 276 px os dois valores não batem. Segui os 65%.
- **Compensação óptica:** `translateY(-3,5% do eclipse)`, só no conteúdo: 26,6 px no desktop e 21,7 px no mobile.
- **Sem cortes retos** entre comunidade, fechamento e rodapé: `overflow-x: clip`, fundos transparentes e máscara radial.

**Rodapé** (`7a2f6f1`):

- sem os candles e sem o lettering gigante;
- fundo da base (transparente sobre o `#050404` do body) e linha de 1 px a .06;
- exceção registrada na regra 6 do CLAUDE.md.

**CTAs dos planos e degradê da marca** (`23270bd`):

- Os CTAs dos planos voltaram ao `.fbtn` laranja. O `.fbtn--escuro` ficou só na hero, a partir de 768 px.
- Tokens criados: `--grad-marca`, `--grad-marca-horizontal`, `--grad-marca-brilho` e `--sombra-material`.
- Variante D aprovada: `#F6661E → #EF4C1A → #E8381F → #DA2522` a 120°. Contraste mínimo do texto branco: 3,07:1. Regra 9 atualizada.
- Preenchimentos que passaram a usar o degradê:
  - `.fbtn`;
  - a gota do `.fbtn--escuro`;
  - o fundo do botão dos planos;
  - as barras de progresso;
  - o ponto da `.tag`;
  - o hover da barra de rolagem;
  - o progresso ativo da comunidade.

## Arquivos criados/alterados

**Criados:**

- `css/secoes/barra-mobile.css` e `js/modulos/barra-mobile.js`;
- `scripts/gerar-icones-og.mjs`;
- `assets/og/og-1200x630.jpg`;
- `assets/marca/favicon-32.png`, `apple-touch-icon.png` e `favicon.svg` (este não está linkado);
- `README.md`;
- `relatorios/fase-6.md`.

**Alterados:**

- `index.html`: head de SEO, OG, favicon e tracking; CSS adiado; `data-cta`; a barra mobile;
- `css/base.css` (grão preguiçoso) e `css/secoes/topo.css` (sem o blur);
- `js/main.js` (barra mobile e grão);
- `js/modulos/rolagem.js` (Lenis sob demanda);
- `js/modulos/home/carrosselPlanos.js` (Swiper perto da seção);
- `scripts/portar-planos-html.mjs` (`data-cta`), `scripts/servir-subpasta.mjs` (gzip), `scripts/shots.mjs` (porta 5501, `--larguras`, sem a barra) e `scripts/medir-planos.mjs` (rola até os planos antes de medir);
- `package.json` e `package-lock.json` (`lighthouse` e `@axe-core/playwright` em devDependencies; porta 5501; `npm run subpasta`);
- `CLAUDE.md` (porta 5501).

## Capturas (caminhos em shots/fase-6/)

- **Página inteira:** `360.png`, `390.png`, `414.png`, `768.png`, `1024.png`, `1280.png`, `1440.png` e `1920.png`.
- **Barra mobile visível** (sobre os benefícios): `barra-mobile-360.png`, `barra-mobile-390.png` e `barra-mobile-414.png`.
- **Imagem OG:** `og-1200x630.jpg`.
- **Ajustes anteriores** (em `shots/ajustes/`):
  - `comunidade-{1920,1440,390}`;
  - `comunidade-arraste-{1,3,6}-1440`;
  - `fechamento-{1920,1440,390}`;
  - `fim-da-pagina-{1440,390}`;
  - `emendas-{1920,1440,390}`;
  - `degrade-marca.png`.

## Conferência com a referência (o que bate, o que diverge e por quê)

- **Hero, benefícios e planos:** iguais ao aprovado nas Fases 2–4. O único ajuste visual desta fase na hero é o brilho sem blur, que tem diferença imperceptível.
- **Comunidade, fechamento e rodapé:** divergem dos prints 06–08 de propósito, pelos ajustes do cliente listados acima (sem palco, eclipse com assinatura, rodapé sem candles).
- **Barra mobile:** não existe nos prints. Segue a definição desta fase (sem contador).
- **Mobile em 360, 390 e 414:**
  - sem scroll horizontal;
  - o título da comunidade é longo e, a 38 px, ocupa 8 linhas em 360 e 390 e 7 em 414. Está legível e balanceado, mas é o bloco de texto mais alto do mobile;
  - os cards dos benefícios e dos planos cabem sem cortes;
  - as etiquetas 3D não são cortadas.
- **Planos (`node scripts/medir-planos.mjs`):** 1920–768 dentro de ±2 px nos dois mercados. Em 390 o Bitcoin diverge **de propósito**: a LP não repete o loop defeituoso da home (pedido da Fase 4). Na tela vem BIT 8 primeiro, na home BIT 16.

## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)

### Lighthouse 12

| Servidor | Perf | FCP | LCP | TBT | CLS | SI | Peso |
|---|---|---|---|---|---|---|---|
| Mobile, gzip (5502), rodada 1 | 88 | 1,6 s | 3,3 s | 200 ms | 0 | 3,4 s | 365 KiB |
| Mobile, gzip (5502), rodada 2 | 89 | 1,6 s | 3,4 s | 160 ms | 0 | 3,0 s | 365 KiB |
| Mobile, live-server (5501) | 74 | 2,3 s | 4,6 s | 280 ms | 0 | 3,5 s | 622 KiB |
| Desktop, gzip (5502) | 99 | 0,4 s | 0,7 s | 0 ms | 0 | 1,2 s | 365 KiB |
| Desktop, live-server (5501) | 97 | 0,6 s | 1,0 s | 0 ms | 0 | 1,4 s | 622 KiB |

- Notas: acessibilidade 100, boas práticas 100 e SEO 100 em todas as rodadas.
- Antes das otimizações (5501): mobile 75, LCP 4,9 s, 793 KiB.
- O 5501 (live-server) não comprime nada e injeta o script de recarga. O gzip do 5502 representa o servidor de produção.

**Metas:**

| Meta | Resultado | Situação |
|---|---|---|
| CLS < 0,05 | 0 | Bate |
| Primeira dobra < 800 KB | 365 KiB | Bate |
| TBT < 200 ms | 160–200 ms; uma rodada anterior deu 0–90 ms | No limite |
| LCP < 2,5 s no mobile | 3,3–3,4 s simulado | **Não bate no Lighthouse** |

**Por que o LCP simulado não baixa:**

- O Lighthouse simula a rede lenta a partir do que observou na carga real.
- Nessa carga, a primeira pintura observada sai entre 1,5 e 1,9 s. Mas o `load` já terminou em 160–270 ms e o elemento do LCP é o próprio H1 (texto).
- A demora é da rasterização em software do Chrome sem GPU do teste. No mesmo Chrome, pelo Playwright, a primeira pintura sai em 110–160 ms.
- Por causa disso, todos os 365 KB baixados antes daquela pintura entram como dependência do LCP simulado.
- Testei variantes sem horizonte, sem animações, sem blend, sem filtros, sem o grão e sem as folhas adiadas: o LCP simulado continuou em ~3,4 s.
- Uma página de controle mínima observa a primeira pintura em ~100 ms.

**Medição real com rede e CPU limitadas** (Chrome via CDP, 1,6 Mbps, 150 ms de latência, CPU 4×, 390 × 844, servidor gzip):

| Métrica | Resultado |
|---|---|
| LCP (H1), 6 cargas | 1,90–2,56 s; mediana ~2,0 s |
| CLS (carga + rolagem até os planos) | **0,0000** |
| Desktop sem limite | LCP 0,32–0,36 s, CLS 0 |

- **Recomendação:** depois de publicar, rodar o PageSpeed Insights no endereço final, que usa dados de campo e outra máquina.
- **Próximos passos possíveis**, se o número simulado precisar bater:
  - `content-visibility: auto` nas seções abaixo da dobra;
  - pré-carregar a Barlow 800 do selo.
- Os dois mexem com a rolagem por âncora e com o peso inicial. Não apliquei sem aprovação.

### axe

0 violações em 1440 e 390 (página inteira, carrosséis armados) e 0 com o menu aberto.

### Percurso só pelo teclado (Tab, 700 ms entre paradas)

Em todas as paradas o anel de foco estava desenhado, e nenhuma ficou fora da tela.

**1440 (39 paradas):**

1. Nav: logo ("Black Friday Zero7 — início"), Benefícios, Planos, Comunidade, Área do Trader e "Aproveitar".
2. Hero: CTA.
3. Benefícios: "Conhecer planos".
4. Planos: seletor de mercado (um grupo de rádio, com as setas trocando o mercado); os 3 CTAs dos cards visíveis (os de fora da tela ficam `inert`); setas "Plano anterior" e "Próximo plano"; os 6 nomes de plano da paginação.
5. Comunidade: "Conteúdo anterior", os 6 "Ir para <título>" e "Próximo conteúdo".
6. Fechamento: CTA.
7. Rodapé: Home, Blog, Planos, Regulamento, Quem Somos, Área do Trader, Instagram, TikTok, Facebook e Política de Privacidade.
8. O Tab seguinte sai da página e o próximo volta ao início.

**390 (31 paradas):**

- logo, "Abrir menu", CTA da hero, "Conhecer planos", seletor de mercado;
- só o CTA do card visível (Sênior);
- paginação, comunidade, fechamento e rodapé.
- A barra mobile é o último item do DOM. Ela só recebe foco quando está visível; escondida, fica `inert`.

**Menu mobile:**

- Enter abre o `dialog` e o foco entra no menu;
- Esc fecha e devolve o foco ao botão "Abrir menu".

### Barra mobile (rolando de 150 em 150 px)

| Tela | Aparece | Some | Volta | Some no fechamento/rodapé | CTAs cobertos |
|---|---|---|---|---|---|
| 360 × 740 | 750 | 2700 (CTA dos benefícios, depois os planos) | 4800 (comunidade) | 5550–5850 | **0** |
| 390 × 844 | 750 | 2550 | 4800 | 5400–5850 | **0** |
| 414 × 896 | 750 | 2400 | 4800 | 5250–5700 | **0** |
| 768 | nunca aparece | | | | |

- Entre o CTA do fechamento e o rodapé, a barra reaparece por ~150–300 px, já sem cobrir nenhum botão.
- Em todas as posições, ela fica a 10 px da base, acima da safe-area.

### Outras checagens

- **Capturas:** sem scroll horizontal em 360, 390, 414, 768, 1024, 1280, 1440 e 1920.
- **Console:**
  - sem erros da LP;
  - os únicos erros são do selo do Reclame Aqui (CORS da API dele fora de zero7.com.br), o mesmo da Fase 5 e esperado em localhost;
  - as requisições externas são todas desse selo (o widget dele traz as próprias fontes do Google).
- **`npm test`:** 0 falhas.
- **Subpasta** (`http://localhost:5502/a-maior-black/`): Lighthouse e medições rodaram nela sem 404.

## Textos a aprovar usados nesta fase

- **`<title>` e `og:title`:** "A maior Black da história: 80% OFF | Zero7". É uma composição: "A maior black da história." e "80% OFF" vêm da copy; "Black" em maiúscula e a marca no fim vêm do padrão de título de página.
- **`meta description` e `og:description`:** "80% OFF para garantir o seu plano perfeito + um pacote completo para levar sua jornada no trading para outro nível." São duas frases da copy, unidas.
- **`og:image:alt`:** "A maior black da história. 80% OFF. Botão Aproveitar a Black sobre o horizonte laranja."
- **Imagem OG:** `shots/fase-6/og-1200x630.jpg`, para aprovar.
- Continuam valendo os textos a aprovar das fases anteriores (tabela do `PROMPTS-LP-BLACK.md`).

## Perguntas / pendências

**Pendências de negócio (P1–P7):**

| # | Pendência | Status |
|---|---|---|
| P1 | Data e hora de término da Black | **Aberta.** `BLACK_FIM = '2026-11-27T23:59:59-03:00'` em `js/config.js`, com `// TODO: confirmar`. Hoje nada a usa, porque o contador não está na página. |
| P2 | Preços e checkouts da Black | **Aguardando o cliente.** O `data/planos.json` ainda tem o snapshot atual (desconto real ~77% × etiqueta "80% OFF"). Quando chegarem, editar o JSON e rodar `npm run planos:snapshot`. |
| P3 | Onde publicar | **Resolvida.** https://zero7.com.br/a-maior-black/: caminhos relativos, canonical e `og:url`. |
| P4 | Remover "Profit One disponível…" | **Feita** na Fase 4. |
| P5 | Vídeos de Trading e Performance, Lives, Comunidade no WhatsApp e Gamification | **Aberta.** Basta preencher o array `MIDIA` (`js/modulos/comunidade.js`) e pôr os arquivos em `assets/video/`. |
| P6 | Imagem de fundo da hero por IA | **Sem arquivos.** Nada foi ativado; o `<picture>` segue comentado. |
| P7 | Tracking | **Não instalado**, por instrução. O ponto de entrada está comentado no `<head>` e os `data-cta` estão prontos. |

**Perguntas:**

1. **LCP no Lighthouse mobile** (3,3–3,4 s simulado; ~2,0 s medido com rede e CPU limitadas): aceita assim e confere no PageSpeed depois de publicar? Ou quer que eu tente `content-visibility` e o preload da Barlow 800?
2. **Imagem OG** e **textos de SEO**: aprova?
3. **"Cookie" e "Políticas de Uso"** no rodapé continuam como texto, com TODO. Quais são os endereços?

Aguardando aprovação da Fase 6.

---

## Adendo pós-aprovação (commit "fase 6 (ajuste): fechamento e meta description")

Fase 6 aprovada com dois ajustes finais.

### 1. Frase do fechamento sempre em 2 linhas a partir de 600 px

Em `css/secoes/fechamento.css`, a `.fechamento__frase` ganhou `max-width: max(calc(var(--eclipse) * .68), 8.6em)` e mantém o `text-wrap: balance`.

- **Os 68% do eclipse sozinhos não fecham em 1440 e 1920.** Nessas larguras a fonte chega a 72 px e a linha mais longa ("você não opera sozinho.") tem 604 px, mais que os 68% do eclipse (517 px). A frase cairia para 3 linhas.
- **Por isso o piso de 8.6em:** a caixa nunca fica mais estreita que a linha mais longa. Onde os 68% cabem (600–1024), valem os 68%.

Medido com `getClientRects` da frase:

| Largura | Fonte | Linhas | Largura das linhas | Caixa | Folga até a borda do eclipse |
|---|---|---|---|---|---|
| 600 | 40 px | 2 | 319 / 336 | 422 (68% de 620) | 142 px |
| 768 | 40 px | 2 | 319 / 336 | 517 (68% de 760) | 212 px |
| **810** | 40,5 px | **2** (antes: 1 linha, 46 px de folga) | 323 / 340 | 517 | 210 px |
| **1024** | 51,2 px | **2** (antes: 1 linha, passava 42 px da borda) | 408 / 430 | 517 | 165 px |
| 1280 | 64 px | 2 | 510 / 537 | 550 | 111 px |
| **1440** | 72 px | **2** | 574 / 604 | 619 (piso 8.6em) | 78 px |
| **1920** | 72 px | **2** | 574 / 604 | 619 (piso 8.6em) | 78 px |

- **Abaixo de 600 px nada muda:** 2 linhas em 390 e 3 em 360, como antes.
- **As outras medidas do fechamento continuam iguais:**
  - logo a 65% do botão;
  - gaps 24/24 no desktop e 20/20 no mobile;
  - centro do conteúdo × eclipse com diferença de 0,0 px;
  - respiros 160/160 no desktop e 120/120 no mobile.
- **Capturas:**
  - `shots/fase-6/fechamento-frase-810.png`, `-1024.png`, `-1440.png` e `-1920.png`;
  - página inteira atualizada em `shots/fase-6/`, sem scroll horizontal em nenhuma largura.

### 2. Meta description

O "+" virou "e" na `meta description` e no `og:description`: "80% OFF para garantir o seu plano perfeito e um pacote completo para levar sua jornada no trading para outro nível."

O título ficou como estava (aprovado).

### Decisões registradas

- **LCP mobile:** aceito como está, sem `content-visibility` e sem preload da Barlow. A medição fica para o PageSpeed, depois da publicação.
- **"Cookie" e "Políticas de Uso":** seguem como texto sem link até o cliente informar os endereços.
