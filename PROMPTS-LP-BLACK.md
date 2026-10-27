# LP Black Friday Zero7: prompts por fase para o Claude Code

São seis fases, cada uma com entrega e critério de aceite próprios. **O Claude Code faz uma fase, entrega o relatório e para.** A próxima só começa depois de aprovada.

---

## Como usar (Gustavo)

1. Confira se a pasta `lp-black-friday` tem: `CLAUDE.md`, `PROMPTS-LP-BLACK.md`, `_referencia/` e `_brandkit/`. A pasta `../Zero7` (home oficial) precisa estar ao lado.
2. Abra o Claude Code **dentro de `lp-black-friday`**. Ele lê o `CLAUDE.md` sozinho.
3. Cole o prompt da **Fase 1**. Quando ele terminar, vai mostrar o relatório e parar.
4. Deixe o `npm run dev` rodando e me mande o relatório aqui. Eu abro `http://localhost:5501` no navegador, confiro com o protótipo e te devolvo **as correções** ou **a mensagem de aprovação + o prompt da fase seguinte**.
5. Para aprovar, cole no Claude Code: `Fase N aprovada.` e, em seguida, o prompt da fase seguinte.

| Fase | Entrega | Risco |
|---|---|---|
| 1 | Fundação: estrutura, ferramentas, fontes, assets otimizados, tokens e componentes | Médio (tudo depende dela) |
| 2 | Nav + hero (horizonte, H1, selo, botão, contador) | Alto (é a primeira impressão) |
| 3 | Benefícios (bento) + transição do planeta | Baixo |
| 4 | Planos: layout da home, dados do `planos.json`, checkout | **Crítico (é o que converte)** |
| 5 | Comunidade (vídeos), fechamento e rodapé | Médio |
| 6 | Mobile fino, movimento, performance, SEO e checklist final | Médio |

---

## Copy alterada depois da aprovação

Estes textos **substituem** os do `_referencia/copy/LPBlack.html` e valem como copy oficial. Nenhuma fase deve voltar ao texto antigo.

| Data | Onde | Antes (LPBlack.html) | Agora |
|---|---|---|---|
| 27/10/2026 (aprovado pelo Gustavo) | Hero, parágrafo abaixo do H1 (`.hero__sub`) | "+ um pacote completo para levar sua jornada no trading para outro nível:" | "Os melhores benefícios da Zero7 + novidades juntos em um único plano. Chegou a hora de ir para outro nível." No desktop (≥ 1024), 2 linhas quebradas no ponto; no mobile, quebra natural. |
| 27/10/2026 (aprovado pelo Gustavo) | Comunidade, título | "Faça parte da comunidade com mais de 19 mil traders…" | "Faça parte da comunidade com mais de 30 mil traders e que continuam evoluindo com o ecossistema criado pela Zero7." |

## Textos a aprovar

Estes textos **não estão na copy**. Eles entram na LP, mas cada relatório precisa listá-los até serem aprovados.

| Onde | Texto |
|---|---|
| Nav | "Benefícios", "Planos", "Comunidade", "Área do Trader", botão "Aproveitar" |
| Hero | "Termina em" (contador) |
| Benefícios | rótulo "O pacote da Black"; título "Um pacote completo para o próximo nível."; link "Ir direto para os planos"; selo "Online 24h" no card Mentor IAVA; título curto do card 03, "Conta real com 10 dias na incubadora" (a copy diz "Transição para conta real com 10 dias na incubadora.") |
| Planos | rótulo "Planos Black Friday" |
| Comunidade | rótulo "Ecossistema Zero7" (o bloco "19K traders na comunidade" foi removido a pedido do cliente; o "Vídeo em breve" saiu quando os 6 cards ganharam vídeo) |
| SEO | `meta description` e `og:description`: "80% OFF na maior Black da história: os melhores benefícios da Zero7 + novidades juntos em um único plano. Chegou a hora de ir para outro nível." (montada com a copy de 27/10) |

## Pendências de negócio (não bloqueiam as fases)

| # | Pendência | Afeta |
|---|---|---|
| P1 | Data e hora de término da Black (contador). **Data recebida:** 30/11 (planilha "Planos Black 80% OFF 29/10 até 30/11"); `BLACK_FIM = 2026-11-30T23:59:59-03:00`, falta confirmar a hora. O contador segue sem uso na página | Fase 2 |
| P2 | ~~Preços e links de checkout da Black~~ **Resolvida:** planilha do cliente no modo ativo (60 dias) do `data/planos.json` (à vista, 12x e checkout dos 8 planos; desconto real de exatamente 80%) e "Limite de perda total" nos chips. Ver `relatorios/precos-black.md` | Fase 4 |
| P3 | ~~Onde a LP será publicada~~ **Resolvida:** https://zero7.com.br/a-maior-black/. A LP lê o próprio `data/planos.json` (relativo à pasta; não o painel da home), todos os caminhos são relativos e canonical/og:url = https://zero7.com.br/a-maior-black/ (Fase 6) | Fase 4 |
| P4 | Remover a observação "Profit One disponível…" dos planos (conflita com o benefício Profit Pro) | Fase 4 |
| P5 | ~~Vídeos da comunidade~~ **Resolvida:** os 6 cards têm vídeo (HUB Zero7, Trading e Performance, Lives, Academy, Comunidade no WhatsApp e Gamification); o estado "Vídeo em breve" saiu do código | Fase 5 |
| P6 | Imagem de fundo da hero gerada por IA (opcional; o horizonte em CSS já resolve) | Fase 6 |
| P7 | ~~Tracking (GTM, Meta, etc.)~~ **Resolvida:** cópia fiel da home (GTM-KCJQPMC na primeira interação, Pixel + CAPI com eventID), sck nos checkouts e `cta_click` no dataLayer. Ver `relatorios/tracking.md` | Fase 6 |

---

# Fase 1: Fundação

```
Leia o CLAUDE.md, o _referencia/README.md, todos os prints de _referencia/prints/ e os três arquivos de _referencia/canvas/ inteiros, antes de qualquer coisa.

Esta fase NÃO monta nenhuma seção da página. Ela cria a base que todas as outras vão usar.

1. CONTROLE DE VERSÃO
   - Se a pasta ainda não for um repositório git, rode git init.
   - Crie o .gitignore com: node_modules/, shots/, _brandkit/.

2. ESTRUTURA
   index.html                  esqueleto: head completo (lang pt-BR, viewport, theme-color #070607), <main> vazio com os ids das seções na ordem: topo, beneficios, planos, comunidade, fechamento; <footer id="rodape">
   componentes.html            vitrine dos componentes (não sobe)
   css/tokens.css              custom properties
   css/base.css                reset, fontes, body, grão global, utilitários
   css/componentes.css         botões, rótulo, cards, selo, divisores
   css/secoes/                 um arquivo por seção (vazios por enquanto)
   js/config.js                constantes de negócio (BLACK_FIM, PLANOS_URL), com // TODO: confirmar
   js/main.js                  entrada (type="module", defer)
   js/modulos/                 vazio por enquanto
   data/planos.json            cópia de ../Zero7/script/planos.json (snapshot de hoje)
   assets/fonts/ assets/3d/ assets/marca/ assets/texturas/ assets/pagamento/ assets/video/ assets/img/
   scripts/imagens.mjs  scripts/shots.mjs
   relatorios/

3. FERRAMENTAS (package.json, só devDependencies)
   - sharp, playwright e live-server.
   - Scripts:
     "dev":     live-server --port=5501 --no-browser
     "imagens": node scripts/imagens.mjs
     "shots":   node scripts/shots.mjs
   - O shots.mjs abre http://localhost:5501 (e /componentes.html quando receber --pagina=componentes) e captura a página inteira em 360, 390, 768, 1024, 1280, 1440 e 1920 px, salvando em shots/<rotulo>/<largura>.png. Antes de capturar, espera as fontes carregarem (document.fonts.ready) e roda com prefers-reduced-motion: reduce, para a captura ser estável.
   - Se o navegador do Playwright faltar, rode npx playwright install chromium.

4. FONTES LOCAIS (nada de Google Fonts)
   - Plus Jakarta Sans 700 e 800, Barlow Condensed 700, 800 e 900, e Inter variável.
   - Descompacte _brandkit/02-Tipografia.zip em _brandkit/tipografia/ e use os woff2 de lá quando existirem. O que faltar sai dos pacotes @fontsource (npm), subset latin.
   - Copie as licenças OFL para assets/fonts/.
   - @font-face com font-display: swap.
   - Preload só de Plus Jakarta Sans 800 e Inter (são as da hero).

5. ASSETS (scripts/imagens.mjs, que pode ser rodado de novo sem problema)
   - _brandkit/*.png (elementos 3D): cortar a transparência das bordas, gerar AVIF e WebP em 320 e 640 px de largura em assets/3d/, com nomes em kebab-case (19-percentual-640.avif, etc.).
   - _brandkit/*.svg: copiar para assets/marca/.
   - Logo Zero7 branca: a partir de ../Zero7/assets/logo zero7.svg, gerar assets/marca/zero7-branco.svg com TODOS os fills em #ffffff (a original tem o 7 azul, que não cabe na Black).
   - ../Zero7/assets/pagamento/1–6.avif: copiar para assets/pagamento/.
   - _referencia/texturas/*: copiar para assets/texturas/.
   - O relatório lista o peso de cada arquivo gerado.

6. TOKENS (css/tokens.css). Valores tirados do CSS de _referencia/canvas/Main.dc.html:
   - Cores:
     base #050404
     céu #080606
     planeta #030202
     superfície #0a0807 / #0c0908 / #0f0c0b
     texto #fff, rgba(255,255,255,.66), .55, .45
     laranja #FF6A1A, laranja claro #FF8A4C
     vermelho #E52B24
     luz #FFC83D
     linhas rgba(255,255,255,.07) e .14
   - Raios:
     --raio-assinatura: 16px 0
     --raio-card: 24px 24px 24px 0
     --raio-gota: 999px 0 999px 999px
     --raio-palco: 40px 0 40px 0
     --raio-chip: 8px
     --raio-sm: 12px 0
   - Espaço em múltiplos de 4. Container de 1240 px com padding lateral clamp(16px, 4vw, 48px).
   - Tipografia: as três famílias, mais a escala usada no protótipo.
   - Curva cubic-bezier(.2,0,0,1). Durações de 150, 200, 300 e 600 ms.

7. COMPONENTES (css/componentes.css), todos visíveis em componentes.html com seus estados (normal, hover, focus-visible, active, desabilitado quando fizer sentido):
   - .fbtn (botão principal): copie o bloco "BOTÃO v4" do Main.dc.html, combinado com as regras-base .fbtn, .fbtn__label e .fbtn__cap anteriores a ele.
     O resultado esperado:
       * laranja sólido em degradê vertical (#FF9152 → #FF6A1A → #F2511A);
       * brilho âmbar interno na base;
       * moldura fina de vidro feita com box-shadow de spread (5 e 6 px), seguindo o raio diagonal;
       * texto branco em Plus Jakarta 700, caixa alta;
       * seta laranja na gota branca;
       * no hover: sobe 1 px, a moldura acende e uma varredura de luz atravessa uma vez.
     Variações: .fbtn--sm (nav) e .fbtn--block (largura total, nos planos).
     Compare com _referencia/prints/01-hero-desktop.png: o botão precisa ficar idêntico.
   - .lbtn: link com sublinhado laranja que cresce no hover.
   - .ibtn: botão quadrado de navegação 52×52, raio 14px 0, neumórfico discreto, afunda no :active.
   - .tag: rótulo de seção (quadradinho laranja com raio 3px 0 + texto em caixa alta, tracking .18em).
   - .card-z: card de benefício (fundo #0a0807 com leve degradê, borda rgba(255,255,255,.07), raio do card, linha de luz no topo que acende no hover).
   - Selo de desconto: crie UM <symbol id="selo-serrilhado"> SVG em index.html (o polígono de 36 pontos do protótipo) e use com <svg><use href="#selo-serrilhado"/></svg>. Duas variantes:
       * .selo-hero: degradê #FF7A2A → #F24A1E → #D9231F, reflexo radial branco no canto superior esquerdo, anel tracejado branco, texto branco;
       * .selo-plano: degradê #FF8A3D → #FF6A1A → #E52B24, texto #0a0706.
   - Divisores:
       * .div-candles: copie .candles do protótipo, usando assets/texturas;
       * .div-picote: copie .perf do protótipo.
     Mostre os dois na vitrine, entre dois blocos de cores diferentes.
   - Texturas:
       * .grao: grão global, absolute por cima de tudo, soft-light, pointer-events none;
       * .grade: grade de 72 px.

8. ACEITE
   - npm run dev abre a página sem erros no console.
   - npm run shots -- fase1 --pagina=componentes gera as capturas.
   - Nenhuma requisição externa de fonte (confira na aba de rede pelo Playwright).
   - componentes.html bate com _referencia/prints/04-sistema-visual.png nos botões, raios, selo e divisores.
   - Nenhuma largura com scroll horizontal.

Escreva relatorios/fase-1.md no formato do CLAUDE.md, faça o commit "fase 1: fundação" e PARE.
```

---

# Fase 2: Nav + hero

```
Fase 1 aprovada. Faça agora SOMENTE a Fase 2. Referências: _referencia/prints/01-hero-desktop.png, o topo de 03-mobile-completo.png e a seção "HERO" de _referencia/canvas/Main.dc.html (CSS e markup).

1. NAV
   - Container de 1240 px, padding de 10px 10px 10px 22px.
   - Raio 16px 0, fundo rgba(6,5,5,.62) com blur de 16 px, borda rgba(255,255,255,.1).
   - À esquerda, assets/marca/completa-escuro.svg com 46 px de altura (logo da Black, NÃO a da Zero7), com link para #topo.
   - À direita: os links Benefícios, Planos e Comunidade (âncoras, rolagem suave via CSS scroll-behavior respeitando reduced motion), "Área do Trader" (https://app.zero7.com.br/login) e um .fbtn--sm "Aproveitar" que leva a #planos.
   - Comportamento:
       * a nav fica sticky (top: 16px);
       * ao passar de 80 px de rolagem, o fundo fica mais opaco (.62 → .85);
       * abaixo de 900 px, os links viram um botão de menu (.ibtn 44×44, aria-expanded) que abre um painel de vidro em tela cheia com os mesmos links e o CTA, com foco preso dentro dele e fechamento por Esc ou clique fora.

2. HERO: horizonte em CSS, exatamente como no protótipo
   - Camadas, nesta ordem: .sky, .sky-grid (grade de 72 px com máscara), .rays, .glow-rise, estrelas (.star, 7 unidades), 2 brilhos de 4 pontas (.sparkle) e .planet.
   - Copie os valores do protótipo: tamanhos, posições, degradês, box-shadows do .planet e as animações breathe e twinkle.
   - min-height: 100svh, com mínimo de 760 px no desktop.
   - O topo do arco do planeta fica 210 px acima da base da hero.
   - Deixe preparado, mas comentado, um <picture> com hero-bg-desktop.avif e hero-bg-mobile.avif para a imagem de IA (pendência P6). O CSS do horizonte continua como fallback.

3. CONTEÚDO DA HERO (centralizado). Copy exata:
   - H1 em Plus Jakarta Sans 800, font-size clamp(50px, 7.6vw, 116px), line-height 1, letter-spacing -.045em, branco puro.
       Linha 1: "A maior black da"
       Linha 2: "história." + o selo
     * SÓ a palavra "história." recebe a luz do horizonte: degradê de texto linear-gradient(180deg, #fff 0%, #fff 56%, #ffe7d6 78%, #ffc49c 100%) e text-shadow 0 14px 40px rgba(255,106,26,.18). A linha 1 fica branca, sem efeito.
     * O ponto final leva margin-left: -.07em.
     * Selo .selo-hero:
         - posição absoluta em relação a um wrapper inline-block que envolve "história.": left 100%, top -.08em, margin-left .02em;
         - tamanho 1.12em, rotate(-12deg);
         - texto "80%" e "OFF" em Plus Jakarta 800, a .33em;
         - aria-label "80% OFF";
         - entrada: animação "stamp" (0,9 s, com atraso de 0,5 s);
         - depois da entrada, giro de 360° a cada 40 s.
       Ele NÃO pode encostar em nenhuma letra em nenhuma largura entre 360 e 1920 px. Se encostar, ajuste o top/margin por breakpoint e documente.
   - Subtítulo: "+ um pacote completo para levar sua jornada no trading para outro nível:" em Inter 400, clamp(16px, 1.4vw, 19px), rgba(255,255,255,.66), max-width 480 px.
   - CTA: .fbtn "Aproveitar a Black" → #planos.
   - Contador (.cd):
       * raio 12px 0, fundo rgba(10,8,7,.55), borda rgba(255,255,255,.08);
       * texto "Termina em" + DD D : HH H : MM M : SS S (os segundos em #FF8A4C);
       * números em Barlow Condensed 700, 22 px, tabular-nums;
       * lê BLACK_FIM do js/config.js (P1, // TODO);
       * ao zerar, mostra "Encerrada" e para;
       * o contador NÃO usa aria-live por segundo. Use um aria-label com o texto completo, atualizado a cada minuto.

4. MOBILE (≤ 600 px), conforme o print 03:
   - H1 a 47 px, quebrando em "A maior black" / "da história.";
   - padding-top de 150 px;
   - CTA com largura total;
   - selo no mesmo tamanho relativo.

5. ACEITE
   - Em 1440 × 1000, a hero bate com 01-hero-desktop.png. Gere uma captura nesse tamanho exato e coloque lado a lado com a referência no relatório (shots/fase-2/comparacao-1440.png).
   - O selo não sobrepõe letras de 360 a 1920 px.
   - CLS 0 na carga.
   - O LCP é o H1 (fontes da hero com preload).
   - Com reduced motion: nada se move.
   - Menu mobile operável só pelo teclado.

Relatório em relatorios/fase-2.md, commit "fase 2: nav e hero" e PARE.
```

---

# Fase 3: Benefícios

```
Fase 2 aprovada. Faça SOMENTE a Fase 3. Referências: o trecho "BENEFÍCIOS" de 02-pagina-desktop-completa.png e de 03-mobile-completo.png, e a seção #beneficios de _referencia/canvas/Main.dc.html.

1. TRANSIÇÃO DO PLANETA
   - A seção começa com margin-top -200px, por cima da base da hero.
   - O fundo dela é linear-gradient(180deg, rgba(3,2,2,0), #030202 200px, #070505), ou seja, o corpo escuro do planeta vira o fundo dos benefícios, sem nenhum corte.
   - Ao fundo, duas linhas de gráfico em SVG (polyline branca e laranja, opacidade .07), como no protótipo.

2. CABEÇALHO
   - .tag "O pacote da Black" (texto a aprovar).
   - H2 em Barlow Condensed 800, clamp(44px, 5.2vw, 76px), line-height .9, caixa alta: "Um pacote completo" em branco + "para o próximo nível." em rgba(255,255,255,.38) (texto a aprovar).
   - À direita, .lbtn "Ir direto para os planos" → #planos (texto a aprovar).

3. BENTO: grade de 3 colunas, gap de 20 px, cards .card-z. A copy de título e descrição é EXATA. A sequência:
   01 "Desconto de 80%" | "Mais estrutura para o seu operacional, investindo menos."
      ocupa 2 colunas, min-height 360; 3D 19-percentual (260 px, à direita) + "80" gigante só em contorno (text-stroke rgba(255,255,255,.07)).
   02 "Aumento de margem" | "Mais estrutura para você operar com folga."
      mini gráfico de barras crescendo (as 4 últimas em laranja), SVG inline.
   03 "Conta real com 10 dias na incubadora" | "Mostre seu potencial e chegue a conta real para começar a lucrar sem limite."
      barra de progresso em 10 segmentos (5 acesos) + "10 dias".
   04 "Repasse de 100% em conta real" | "Ao passar para a conta real, todo o lucro é seu."
      ocupa 2 colunas; 3D 11-cofre-de-capital + "100" em contorno.
   05 "Reinício" | "Uma segunda chance garantida para zerar e começar de novo quando quiser."
      ícone de traço de reinício, 64 px, em #FF8A4C.
   06 "Profit Pro" | "Comece com uma plataforma completa e com mais recursos à sua disposição."
      mini candles SVG.
   07 "Sem prazo de avaliação" | "Para operar com tranquilidade sem a pressão de um prazo."
      "∞" em Barlow 300, 84 px, #FF8A4C.
   08 "Mentor IAVA" | "Seu Mentor de trading 24h por dia. Otimize o seu operacional identificando padrões que potencializam seus resultados."
      ocupa 3 colunas; selo "Online 24h" com ponto verde (texto a aprovar); 3D 17-cavalo-de-estrategia saindo pela base.
   - O número de cada card fica em Barlow 700, 15 px, #FF8A4C. O título em Barlow 800, caixa alta.
   - 3D em <picture> AVIF/WebP com loading="lazy", width/height e alt="".

4. RESPONSIVO
   - 768–1199 px: 2 colunas (os cards de 2 e 3 colunas ocupam a linha inteira).
   - < 768 px: 1 coluna; 3D menor, conforme o print 03.

5. INTERAÇÃO
   - No hover: borda rgba(255,255,255,.14), linha de luz no topo do card e o 3D sobe 6 px com rotate(-3deg).
   - Entrada por scroll (IntersectionObserver): fade + translateY de 16 px, stagger de 60 ms, uma vez só. Desligada com reduced motion.

6. CTA final da seção: .fbtn "Conhecer planos" → #planos (texto da copy).

7. ACEITE
   - Bate com o print 02 no desktop e com o 03 no mobile.
   - A transição hero → benefícios não mostra nenhuma linha ou corte.
   - Sem scroll horizontal.
   - Imagens 3D abaixo da dobra não carregam antes de chegar perto (confira na aba de rede).

Relatório em relatorios/fase-3.md, commit "fase 3: benefícios" e PARE.
```

---

# Fase 4: Planos (a fase mais importante)

```
Fase 3 aprovada. Faça SOMENTE a Fase 4.

ANTES DE ESCREVER CÓDIGO, leia por completo (só leitura):
- ../Zero7/index.html, seção <section id="plan"> inteira;
- ../Zero7/script/blackPlanos.js, ../Zero7/script/planosAtivo.js e ../Zero7/script/4selet.js;
- ../Zero7/script/planos.json;
- ../Zero7/css/planosAtivo.css e ../Zero7/css/sectionPlanos.css;
- _referencia/prints/05-planos-home-oficial.jpg e 06-planos-home-oficial-topo.jpg (o LAYOUT de hoje);
- o trecho de planos de 02-pagina-desktop-completa.png e de 03-mobile-completo.png (a PELE Black).

Regra: o usuário já conhece o layout dos planos da home. A ESTRUTURA é a mesma; só muda a pele.

1. TRANSIÇÃO: a seção sobe recortada em candles (.div-candles), com os topos acesos.
   - Fundo: radial-gradient(60% 40% at 50% 0%, rgba(255,106,26,.07), transparent 70%) sobre #0c0908.
   - Grade de 72 px com máscara que some para baixo.

2. CABEÇALHO (centralizado)
   - .tag "Planos Black Friday" (texto a aprovar).
   - H2 da copy: "80% OFF para garantir o seu plano perfeito.", com "80% OFF" em #FF6A1A.
   - Barra de 120 × 3 px em degradê laranja.
   - Seletor de mercado (pílula):
       * "Mini Índice / Dólar" | "Futuro de Bitcoin";
       * mesma semântica da home (role="radiogroup", setas do teclado);
       * opção ativa em laranja com texto escuro.
   - H3 com o nome do mercado ativo.
   - Botões de modo + descrição do modo: mesma lógica do blackPlanos.js (config.modes ativos, defaultMode, hideButtonsWhenSingleMode). Os textos das descrições são os mesmos da home, palavra por palavra.

3. CARD (mesma estrutura da home: .card[data-plan="<chave>"])
   - Casca:
       * raio 24px 24px 24px 0;
       * borda 1px rgba(255,255,255,.14);
       * fundo linear-gradient(180deg, #050303, #0d0908);
       * padding 50px 18px 22px.
   - Aba do nome sobre a borda: absoluta, top -27 px, 76% da largura, 54 px de altura, raio 16 px, Barlow 900, 30 px, caixa alta.
   - Selo .selo-plano "80% OFF" em TODOS os cards: 74 px, rotate(12deg), no canto superior direito (top -30, right -18).
     O trilho do carrossel precisa ter folga para o selo nunca ser cortado (no protótipo ele corta: corrija).
   - Sênior (data-plan="senior"):
       * borda 2px rgba(255,106,26,.7) + glow;
       * aba com borda laranja;
       * tarja abaixo do título com o texto da home: "Nossos traders mais positivos operam o plano Sênior".
   - Chips (mesmos rótulos e valores da home, copiados do HTML de lá):
       * grade de 6 colunas: 3 chips por linha nas duas primeiras linhas e 2 chips largos na última ("Máximo de dias" e "Repasse");
       * nos cards de Bitcoin (6 chips): 3 + 3;
       * cada chip: fundo rgba(255,255,255,.035), raio 8 px, rótulo Inter 11 px .55, valor Inter 700 14 px, tabular-nums;
       * "Máximo de dias" vem do JSON (maxDias).
   - Preço, centralizado:
       * "de <s>{oldPrice}</s> por" (risco em #FF6A1A, 2 px);
       * "12x" em Barlow 800 36 px laranja + valor em Barlow 900 50 px branco;
       * "ou {valor} à vista": "ou" e "à vista" em laranja, Barlow 700 20 px, SEM caixa alta (o print mobile está errado nesse ponto).
     Os textos do JSON vêm prontos ("12x R$14,42", "ou R$144,21 à vista"). Separe as partes com uma função de parse testada e não altere os valores.
   - Nota: o footnote do modo ativo (hoje "*Plataforma gratuita por 60 dias. Após, cobrança mensal.").
   - CTA: .fbtn.fbtn--block "Contratar plano", href = checkout do JSON + os parâmetros da URL atual, exatamente como withCurrentQueryParams do blackPlanos.js, com target="_blank" rel="noopener" e aria-label "Contratar plano {Nome}".
   - NÃO incluir a observação "A plataforma Profit One está disponível…" (pendência P4).
   - Alinhe os cards pelo topo. Hoje eles esticam e sobra um vazio embaixo.

4. DADOS
   - URL do JSON em js/config.js: PLANOS_URL. Padrão 'data/planos.json'. Comentário: em produção deve apontar para o mesmo painel da home (pendência P3). NÃO aponte para produção sem pedido.
   - Se o fetch falhar, use um fallback embutido (o snapshot de hoje) e registre console.warn. Nunca mostre card sem preço ou sem checkout.
   - Os preços nunca ficam escritos no HTML: o HTML só tem a estrutura e as specs fixas.

5. CARROSSEL (sem bibliotecas)
   - CSS scroll-snap.
   - Quantidade de cards visíveis:
       * ≥ 1200 px: 3;
       * 768–1199 px: 2;
       * < 768 px: 1 + uma "espiada" do próximo.
   - Setas .ibtn nas laterais; abaixo, abas com o nome de cada plano (sublinhado laranja na aba ativa, aria-current). As abas sincronizam com a rolagem.
   - Abre centralizado no Sênior (índice) e no primeiro card (bitcoin). Trocar de mercado reposiciona.
   - Swipe nativo, teclado (setas quando o trilho tem foco) e nada de scroll horizontal na página.

6. ACEITE (obrigatório no relatório)
   - Tabela com todos os modos ativos × todos os planos: oldPrice, parcelado, à vista, checkout e o % de desconto REAL calculado (1 − à vista / oldPrice). Marque com ⚠ onde o % real for diferente de 80% (pendência P2).
   - Teste abrindo http://localhost:5501/?utm_source=teste&utm_campaign=bf26 e confirme que TODOS os links de checkout carregam os parâmetros.
   - Compare lado a lado com 05-planos-home-oficial.jpg: mesma estrutura (aba, chips 3+3+2, preço, CTA, abas de plano).
   - Capturas em 390, 768, 1024, 1440 e 1920 mostrando que o selo nunca é cortado.

Relatório em relatorios/fase-4.md, commit "fase 4: planos" e PARE.
```

---

# Fase 5: Comunidade, fechamento e rodapé

```
Fase 4 aprovada. Faça SOMENTE a Fase 5. Referências: a metade de baixo de 02-pagina-desktop-completa.png e as seções #comunidade, "FECHAMENTO" e "RODAPÉ" de _referencia/canvas/Main.dc.html (inclusive o renderVals, que traz a matemática do carrossel).

1. COMUNIDADE
   - Transição: a borda superior rasga em picote (.div-picote). Fundo linear-gradient(180deg, #070505, #050404) + grade com máscara radial.
   - Cabeçalho:
       * .tag "Ecossistema Zero7" (a aprovar);
       * H2 da copy em Barlow 800, clamp(36px, 4vw, 58px), na cor rgba(255,255,255,.42), com "19 mil traders" em branco: "Faça parte da comunidade com mais de 19 mil traders e que continuam evoluindo com o ecossistema criado pela Zero7.";
       * à direita, o número "19K" (o K em laranja) + "traders na comunidade" (a aprovar).
   - Palco:
       * raio 40px 0 40px 0, fundo #090706 com degradê leve e borda rgba(255,255,255,.07);
       * em cima, abas de texto com os 6 títulos da copy, na ordem: HUB Zero7, Trading e Performance, Lives, Academy, Comunidade no WhatsApp, Gamification;
       * a aba ativa tem sublinhado laranja.
   - Carrossel vertical (cards de 298 × 530, 9:16, raio do card):
       * para cada card, d = distância circular até o ativo (de -3 a 2);
       * translateX(calc(-50% + d*255px)), scale(1 - |d|*.16);
       * opacidade 1 / .5 / .2; grayscale(.6) brightness(.8) nos laterais;
       * transição de 0,7 s na curva do projeto;
       * o card ativo tem anel branco de 1 px e um glow laranja embaixo.
     Clicar num card lateral ativa ele. Há setas .ibtn, uma barra de progresso de 6 segmentos (raio 2px 0), swipe por pointer events e teclado.
   - Legenda: título do ativo em Barlow 800 + descrição exata da copy.
   - MÍDIA: um array em js/modulos/comunidade.js com { titulo, descricao, video: { mp4, webm }, poster }.
       * Academy: copie ../Zero7/assets/academy 1.mp4/.webm e poster-academy-1.avif para assets/video/ (com nomes em kebab-case).
       * HUB Zero7: os vídeos JÁ ESTÃO em assets/video/ (otimizados, sem áudio):
           - hub-zero7-9x16-540.mp4 (2,5 MB): vídeo do CARD no carrossel;
           - hub-zero7-9x16-poster.webp: poster do card;
           - hub-zero7-9x16-720.mp4: vídeo do modal no mobile;
           - hub-zero7-16x9-720.mp4 + hub-zero7-16x9-poster.webp: vídeo do modal no desktop (≥ 768px).
         Escolha a fonte do modal por matchMedia no momento em que ele abre.
       * Os outros 4 (Trading e Performance, Lives, Comunidade no WhatsApp, Gamification) ficam em estado "Vídeo em breve": fundo escuro com brilho laranja embaixo, número "01"–"06" gigante em contorno e o selo "Vídeo em breve" (a aprovar). Quando o arquivo existir, basta preencher o array (pendência P5). Cada entrada aceita video.card (9:16) e, opcionalmente, video.modalDesktop (16:9).
       * Comportamento: só o card ATIVO toca, mudo, em loop e playsinline, e só enquanto a seção estiver visível (IntersectionObserver). Os outros ficam pausados, com preload="none".
       * O botão de play (gota de vidro) abre um modal com o vídeo em tamanho grande e com controles: foco preso, Esc fecha, devolve o foco. Os vídeos do HUB não têm áudio, então não mostre controle de volume para eles.
       * Com reduced motion: nada de autoplay.

2. FECHAMENTO
   - Eclipse: copie .eclipse do protótipo + grade com máscara.
   - LOGO ANIMADA DA CAMPANHA (motion oficial do brand kit, em _brandkit/motion/; leia o LEIA-ME-V02.md):
       * Dentro do eclipse, acima da frase, a assinatura Black Friday se monta: o ingresso entra voando, as letras se formam e um reflexo branco atravessa o lettering.
       * A animação é código, não vídeo: _brandkit/motion/Fonte/motion-core.cjs (createMotion) + Fonte/scene-assets.json. Porte para js/modulos/motion-logo.js (ES module) e gere o SVG quadro a quadro com requestAnimationFrame.
       * Adaptação para fundo escuro, já testada (ver _brandkit/motion/prova-fundo-escuro.png):
           - ink '#070607' → '#FFFFFF';
           - remova o <rect> de fundo branco (o fundo é o eclipse).
         Use a viewBox recortada só na área da marca, sem as margens do quadro 4:3, e uns 520px de largura no desktop, 300px no mobile.
       * Toca UMA vez, quando a seção entra na tela (IntersectionObserver, threshold ~.4), e para no quadro final, nítido (t ≥ 5,11s). Sem som (o WAV não entra).
       * Com reduced motion, ou antes de o JS carregar: mostre direto o quadro final (assets/marca/completa-escuro.svg), sem animar.
       * Performance: o scene-assets.json tem ~38KB. Carregue o módulo com import() só quando a seção estiver a ~600px da tela, para não pesar na carga inicial.
   - Frase da copy em Plus Jakarta 800 (mesmo estilo do H1, sem degradê), com o ponto ajustado: "Com a Zero7 você não opera sozinho."
   - .fbtn "Aproveitar a Black" → #planos.

3. RODAPÉ (o MESMO conteúdo da home: copie de ../Zero7/index.html os blocos #footer, #pagamento e #author, mantendo textos e links)
   - Transição: o rodapé sobe em candles (.div-candles). Fundo #0c0908 + o lettering BLACK FRIDAY gigante ao fundo com opacidade de no máximo .03.
   - Coluna 1:
       * assets/marca/zero7-branco.svg;
       * CNPJ, endereço e horário;
       * selo do Reclame Aqui com o MESMO script e a mesma injeção preguiçosa (IntersectionObserver) da home, copiados de lá sem alteração.
   - Colunas: Navegação (os mesmos links da home; "Home" e "Planos" apontam para âncoras desta página), Suporte e Social (ícones em quadrados com raio 14px 0, com aria-label).
   - Formas de pagamento: 6 logos em chips 100×54, raio 12px 0.
   - Linha final: "© {ano atual} | Todos os direitos reservados.", "Política de Privacidade", "Cookie", "Políticas de Uso" (os hrefs que estão vazios na home continuam pendentes: registre no relatório) e o CNPJ. Depois, o aviso legal completo, palavra por palavra.

4. ACEITE
   - Bate com o print 02.
   - Os vídeos não baixam antes da seção chegar perto (confira na aba de rede).
   - Modal operável por teclado.
   - Rodapé com os mesmos textos e links da home (faça um diff de texto e cole no relatório).

Relatório em relatorios/fase-5.md, commit "fase 5: comunidade, fechamento e rodapé" e PARE.
```

---

# Fase 6: Mobile fino, movimento, performance, SEO e entrega

```
Fase 5 aprovada. Faça SOMENTE a Fase 6.

1. MOBILE (360, 390 e 414 px), conforme 03-mobile-completo.png
   - Revise seção por seção: tamanhos de título, respiros, carrossel de planos com espiada, palco da comunidade (cards menores, apenas 3 visíveis).
   - Barra fixa inferior (só abaixo de 768 px):
       * vidro, raio 16px 0;
       * "Termina em" + contador compacto + botão laranja "Aproveitar a Black" → #planos;
       * aparece quando a hero sai da tela;
       * some quando a seção de planos ou o rodapé estão visíveis;
       * respeita a safe-area-inset-bottom;
       * nunca cobre um CTA.

2. MOVIMENTO
   - Revise todas as animações (stamp e giro do selo, breathe, twinkle, reveals, carrosséis, hover).
   - Tudo desliga com prefers-reduced-motion.
   - Nada de scroll-jacking.

3. IMAGEM DE FUNDO DA HERO (pendência P6)
   - Se existirem assets/img/hero-bg-desktop.(avif|webp) e hero-bg-mobile.(avif|webp), ative o <picture> preparado na Fase 2 e esconda o horizonte em CSS.
   - Se não existirem, não faça nada e registre.

4. PERFORMANCE
   - Rode o Lighthouse (npx lighthouse) em mobile e desktop sobre http://localhost:5501 e cole os números no relatório.
   - Metas: LCP < 2,5 s no mobile, CLS < 0,05, TBT < 200 ms, primeira dobra < 800 KB.
   - Se não bater, corrija antes de reportar: subset de fontes, tamanhos responsivos, CSS crítico da hero inline, carregamento preguiçoso.

5. SEO E COMPARTILHAMENTO
   - title, meta description e Open Graph (título e descrição saem da copy).
   - Favicon a partir do brand kit.
   - Imagem OG de 1200×630: gere a partir da hero (pode ser um print do topo da página) e mostre no relatório para aprovar.
   - Canonical pendente (P3).

6. ACESSIBILIDADE
   - Rode o axe (@axe-core/playwright) e zere as violações sérias.
   - Faça a página inteira só pelo teclado e descreva o percurso.

7. TRACKING (P7): NÃO adicione nenhum.
   - Deixe um comentário <!-- TRACKING: GTM/Meta entram aqui --> no <head>.
   - Cada CTA deve ter data-cta="hero|beneficios|plano-{chave}|fechamento|nav|barra-mobile", para facilitar a configuração depois.

8. ENTREGA
   - README.md: como rodar, o que sobe para o servidor (sem _brandkit, _referencia, shots, relatorios, node_modules, scripts) e onde editar cada coisa (config.js, planos.json, array de vídeos).
   - Lista final de pendências (P1–P7) com o status de cada uma.
   - Capturas finais em todas as larguras.

Relatório em relatorios/fase-6.md, commit "fase 6: polimento e entrega" e PARE.
```
