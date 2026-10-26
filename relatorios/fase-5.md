# Fase 5: Comunidade, fechamento e rodapé

## O que foi feito

### Antes da Fase 5 (pedidos da aprovação da Fase 4, em commits próprios)

- **Bitcoin sem o defeito da home** (`fase 4 (ajuste): bitcoin sem loop e publicação em subpasta`):
  - o loop só liga quando há cards suficientes; com menos, os cards ficam centralizados, as setas somem quando todos cabem e cada card tem o seu indicador com o nome;
  - a ordem é a do `planos.json` (BIT 8, BIT 16);
  - 3 recargas seguidas em 390, 768 e 1440: ordem estável e nenhum aviso do Swiper.
  - Detalhes no adendo de `relatorios/fase-4.md`.
- **P3, publicação em https://zero7.com.br/a-maior-black/:**
  - o `PLANOS_URL` continua `data/planos.json`, o arquivo próprio da LP; o TODO saiu e há um comentário explicando por quê;
  - todos os caminhos são relativos;
  - teste em subpasta com `scripts/servir-subpasta.mjs`;
  - pendências do PROMPTS atualizadas: P3 resolvida, P2 aguardando os preços do cliente.
- **Lenis e barra de rolagem fina** (`ajuste: rolagem suave com Lenis e barra fina`):
  - a mensagem com as especificações não chegou à sessão; segui a proposta que você aprovou;
  - os testes de rolagem estão no adendo 2 de `relatorios/fase-4.md`.

### 1. Comunidade (`#comunidade`)

- **Transição:** a borda de cima rasga em picote (`.div-picote`).
- **Fundo:** `linear-gradient(180deg, #070505, #050404)`, com a grade de 72 px e máscara radial.
- **Cabeçalho no padrão novo** (pedido da aprovação):
  - rótulo `.tag` "Ecossistema Zero7";
  - H2 `.titulo-secao` em Plus Jakarta 800, centralizado a partir de 768 px;
  - "Faça parte da comunidade com mais de 19 mil traders" em branco e "e que continuam evoluindo com o ecossistema criado pela Zero7." em branco .42;
  - **o bloco "19K traders na comunidade" saiu.**
- **Palco:** valores do protótipo (raio `40px 0 40px 0`, fundo `#090706` com degradê leve e borda branca .07).
  - Abas de texto com os 6 títulos, na ordem pedida, e sublinhado laranja na ativa. No mobile elas rolam e centralizam a ativa.
- **Carrossel**, com a matemática do `renderVals` do protótipo:
  - d = distância circular até o ativo (−3 a 2);
  - `translateX(calc(-50% + d × 255px))` e `scale(1 − |d| × .16)`;
  - opacidade 1 / .5 / .2, e os laterais com `grayscale(.6) brightness(.8)`;
  - 0,7 s na curva do projeto;
  - o ativo tem anel branco de 1 px e glow laranja embaixo.
  - **Tamanhos:** cards de 298 × 530 no desktop; no mobile, 236 × 420 com passo de 196 px.
  - Abre na Academy, como no protótipo.
- **Controles:**
  - clicar num card lateral ativa ele;
  - setas `.ibtn`;
  - barra de progresso de 6 segmentos (raio 2px 0);
  - arraste por pointer events (`touch-action: pan-y`: o arraste vertical continua rolando a página);
  - setas ← → do teclado no palco (nas abas, o foco acompanha).
- **Legenda:** título em Barlow 800 com a descrição exata da copy, num `aria-live` com altura reservada.
- **Mídia** (`MIDIA` em `js/modulos/comunidade.js`, no formato pedido):
  - **HUB Zero7:** card `hub-zero7-9x16-540.mp4` com o poster 9:16. No modal, `hub-zero7-9x16-720.mp4` no mobile e `hub-zero7-16x9-720.mp4` (com o poster 16:9) a partir de 768 px, escolhidos por `matchMedia` na hora em que ele abre.
  - **Academy:** `academy-1.mp4`/`.webm` e os pôsteres, copiados da home com nomes em kebab-case.
  - **Os outros 4:** "Vídeo em breve" (número gigante em contorno, brilho laranja embaixo e sem play). Basta preencher o array (P5).
- **Comportamento dos vídeos:**
  - só o card ativo toca: mudo, em loop, `playsinline`, e só com a seção na tela;
  - os outros ficam pausados, com `preload="none"`;
  - com movimento reduzido, nada toca sozinho.
  - **Correção que fiz no caminho:** com o `<source>` preenchido, o Chrome ignorava o `preload="none"` e baixava os dois vídeos inteiros assim que a seção chegava perto. Agora cada arquivo só é pedido quando aquele card vai tocar.
- **Modal** (`<dialog>`, botão de play em gota de vidro):
  - vídeo grande com controles;
  - foco preso entre "fechar" e o vídeo, Esc fecha e o foco volta ao play;
  - a página não rola por baixo (o Lenis para);
  - ao fechar, o vídeo é solto.
  - **Sem controle de volume para vídeos sem áudio.** O HUB não tem áudio, e a Academy também não (sem trilha de áudio, conferido com o ffprobe), por isso as duas entradas têm `audio: false`.

### 2. Fechamento (`#fechamento`)

- **Fundo:** eclipse do protótipo e grade com máscara.
- **Logo animada (Motion V02 do brand kit):**
  - `scripts/portar-motion-logo.mjs` gera `js/modulos/motion-logo-core.js` a partir do `motion-core.cjs` **com só estas trocas**:
    - tinta `#070607` → `#FFFFFF`;
    - sem o `<rect>` de fundo branco;
    - viewBox recortada na área da marca (o mesmo retângulo do `completa-escuro.svg`, na escala do quadro), com overflow visível para o ingresso entrar voando de fora;
    - rótulo "Black Friday Zero7".
  - Gera também `motion-logo-cena.js` a partir do `scene-assets.json`.
  - `js/modulos/motion-logo.js` gera o SVG quadro a quadro com `requestAnimationFrame`.
  - **Dispara:** toca uma vez quando 40% da área da logo está na tela e para no quadro final, nítido (t ≥ 5,11 s). Sem som.
  - **Carga:** o `import()` só acontece com a seção a ~600 px.
  - **Sem animação:** com movimento reduzido ou antes do JS, fica o quadro final estático (`assets/marca/completa-escuro.svg`).
  - **O quadro final animado e o SVG estático são idênticos** (rasterizados em 1306 × 646: erro médio 0,000 por canal). A troca não pula.
  - **Tamanho:** 520 px no desktop e 300 px no mobile, com a proporção 1306 : 646 reservada (sem CLS).
- **Frase:** "Com a Zero7 você não opera sozinho." em Plus Jakarta 800, no estilo do H1, sem degradê, com o ponto ajustado (`.ponto`).
- **CTA:** `.fbtn` "Aproveitar a Black" → `#planos`.

### 3. Rodapé (`#rodape`)

- **Transição e fundo:** sobe em candles (`.div-candles`), com fundo `#0c0908` e o lettering BLACK FRIDAY gigante (`lettering-escuro.svg`) a .03.
- **Conteúdo dos blocos `#footer`, `#pagamento` e `#author` da home:**
  - logo `zero7-branco.svg`, CNPJ, endereço e horário;
  - selo do Reclame Aqui com o **mesmo script e a mesma injeção preguiçosa (IntersectionObserver, 600 px) da home, copiados sem alteração**;
  - Navegação, Suporte e Social: ícones em quadrados com raio 14px 0 e `aria-label` da home, desenhados em SVG inline (a home usa o ionicons, que não entra aqui);
  - 6 formas de pagamento em chips de 100 × 54 com raio 12px 0;
  - linha final com o ano atual (`.js-ano`, por JS, como na home);
  - aviso legal palavra por palavra.
- **Links:** "Home" → `#topo` e "Planos" → `#planos`. "Cookie" e "Políticas de Uso" continuam com `href=""`, como na home (pendente).

## Arquivos criados/alterados

**Criados:**
- `js/modulos/comunidade.js`, `fechamento.js`, `motion-logo.js`, `rodape.js` e `rolagem.js` (antes da fase);
- `js/modulos/motion-logo-core.js` e `motion-logo-cena.js`: GERADOS;
- `scripts/portar-motion-logo.mjs`, `diff-rodape.mjs` e `servir-subpasta.mjs`;
- `assets/video/academy-1.mp4`, `academy-1.webm`, `academy-1-poster.avif` e `academy-1-poster-560.avif` (copiados da home);
- `vendor/lenis-1.1.14/` (antes da fase).

**Entram no commit:** os vídeos do HUB, que você deixou em `assets/video/`.

**Alterados:**
- `index.html`: comunidade, fechamento, rodapé e modal;
- `css/secoes/comunidade.css`, `fechamento.css` e `rodape.css`;
- `js/main.js`;
- `CLAUDE.md`: bloco da Fase 5;
- `PROMPTS-LP-BLACK.md`: "Textos a aprovar" sem o 19K.

## Capturas (caminhos em shots/fase-5/)

- **Página inteira:** `360.png` … `1920.png`.
- **Por seção:** `comunidade-{1920,1440,768,390}.png`, `fechamento-{…}.png` e `rodape-{…}.png`. As capturas são feitas com movimento reduzido, então mostram a logo no quadro final estático.
- **Lado a lado com o print 02 (1440):** `comparacao-print02-1440.png`.
- **Logo:**
  - `logo-quadros.png`: tira com 8 quadros da animação (0,4 s a 5,2 s);
  - `logo-quadro-final.png`.
- **Modal:**
  - `modal-hub-1440.png` (16:9) e `modal-hub-390.png` (9:16);
  - `modal-controles-sem-volume.png` (barra de controles sem o botão de volume).

## Conferência com a referência (o que bate, o que diverge e por quê)

**Bate com o print 02:**
- comunidade: palco, abas, carrossel com os 5 cards à vista, legenda, setas e progresso;
- eclipse, frase e CTA;
- rodapé: colunas, pagamento, linha final e aviso.

**Diverge de propósito:**
1. **Cabeçalho da comunidade.** Segue o padrão novo (Jakarta, centralizado, bicolor, sem o "19K"), por pedido seu. No desktop, a frase longa ocupa 5 linhas no limite de 900 px do `.cabecalho-secao`.
2. **Logo animada acima da frase.** Pedido seu, não estava no print. Com ela, o conteúdo ficou mais alto que o eclipse de 620 px, e **subi o eclipse para 760 px no desktop**, mantendo o desenho. Confira.
3. **Selo do Reclame Aqui.** No print é um espaço reservado; aqui é o script da home.
4. **Ícones sociais.** SVG inline do protótipo, no lugar do ionicons da home.

**Mobile:** o print 03 não cobre essas seções, então o mobile é adaptação minha. Cards de 236 × 420 com os vizinhos aparecendo nas bordas, abas rolando, frase no tamanho do H1 mobile e rodapé em colunas que quebram.

## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)

**Página (`npm run shots -- fase-5`):** 360 a 1920 sem scroll horizontal.
- Console: os únicos erros são do selo do RA (CORS em `api.reclameaqui.com.br`, que recusa a origem `localhost`). Em produção, `/a-maior-black/` fica no mesmo domínio da home, onde o selo funciona.
- Requisições externas: só as do selo do RA (bundle e CSS no S3, e as fontes do Google que ele puxa, como já acontece na home).

**Rede: os vídeos não baixam antes da hora** (aceite), estado de cada `<video>`:

| Momento | HUB (card) | Academy (card, ativo) |
|---|---|---|
| Topo da página | sem fonte, nada baixado | sem fonte, nada baixado |
| Nos planos (comunidade a < 600 px) | só o poster | só o poster |
| Comunidade na tela | nada baixado | tocando (15 s em buffer) |
| Clique na aba HUB | tocando | pausado |
| Movimento reduzido, comunidade na tela | nada baixado | nada baixado (fica o poster) |

**Logo:**
- O módulo da animação não vem no carregamento: só entra (motion-logo, -core e -cena) com a seção perto.
- Amostras a cada 0,45 s: estática → ingresso com desfoque → letras 2 → 6 → 11 → reflexo → **FINAL**.
- Com movimento reduzido, nenhum módulo é baixado e fica a imagem estática.

**Modal pelo teclado** (aceite), em 1440 e em 390:
- Tab das abas chega em "Assistir: HUB Zero7", e Enter abre.
- Foco em "Fechar vídeo"; o Tab gira entre "fechar" e o vídeo, nunca sai do modal.
- Esc fecha, o foco volta ao play e o vídeo é solto (`readyState` 0).
- Em 1440: 1100 × 619, 16:9. Em 390: 359 × 638, 9:16.

**Carrossel da comunidade** (1440 e 390):
- teclado: seta → / ← nas abas;
- botão "Próximo conteúdo";
- barra de progresso;
- clique no card lateral;
- arraste para o lado;
- sem abrir o modal por engano depois do arraste.

**Rodapé, diff de texto e links com a home** (`node scripts/diff-rodape.mjs`):
- **Textos (21/22 iguais):** a única diferença é o ano reservado no HTML (home 2025, LP 2026); nas duas, o JS troca pelo ano atual.
- **Links (10/12 iguais):** só "Home" `#home` → `#topo` e "Planos" `#plan` → `#planos`, que é o pedido.

```
TEXTOS: 21/22 iguais
  = Zero7 Tesouraria LTDA | CNPJ: 49.452.697/0001-20
  = Av. Dep. Jamel Cecílio, nº 2929 - Jardim Goiás, Goiânia - GO, 74810-240
  = Segunda a sexta-feira, 8h às 18h
  = Navegação · Home · Blog · Planos · Regulamento · Quem Somos · Área do Trader
  = Suporte · suporte@zero7.com.br · Social · Formas de Pagamento
  = ©
  - home: 2025
  + LP:   2026
  = | Todos os direitos reservados. · Política de Privacidade · Cookie · Políticas de Uso
  = Zero7 Tesouraria LTDA | CNPJ: 49.452.697/0001-20
  = Todas as informações aqui apresentadas são destinadas exclusivamente a fins educacionais (…aviso completo, igual…)

LINKS: 10/12 iguais
  - home: Home → #home
  + LP:   Home → #topo
  = Blog → https://blog.zero7.com.br/
  - home: Planos → #plan
  + LP:   Planos → #planos
  = Regulamento → https://zero7.com.br/regulamento/
  = Quem Somos → https://zero7.com.br/quem-somos/
  = Área do Trader → https://app.zero7.com.br/login (target _blank)
  = Zero7 no Instagram → https://www.instagram.com/zero7tesouraria/ (target _blank)
  = Zero7 no TikTok → https://www.tiktok.com/@zero7_mesa (target _blank)
  = Zero7 no Facebook → https://www.facebook.com/zero7tesouraria (target _blank)
  = Política de Privacidade → https://zero7.com.br/politica-de-privacidade/
  = Cookie → (vazio)
  = Políticas de Uso → (vazio)
```

**Subpasta** (http://localhost:5502/a-maior-black/, com os vídeos, o modal, o motion e o rodapé carregados):
- 66 requisições em 390 e 67 em 1440;
- nenhum 404 e nenhuma requisição local fora da subpasta.

**Rolagem com as seções novas:** a âncora #comunidade da nav para na seção (0,2 px).

**Desempenho:** LCP 2.012 ms (390, CPU 4× e 1,6 Mbps) e 232 ms (1440); **CLS 0,0000** na carga e na rolagem.

**Testes:** `npm test` 8/8.

## Textos a aprovar usados nesta fase

- **Na tela:** rótulo "Ecossistema Zero7"; "Vídeo em breve".
- **Grafia:** a copy escreve "Comunidade no Whatsapp"; usei "WhatsApp", como no prompt e no protótipo. Confirmar.
- **Só para leitor de tela:**
  - "Escolha um conteúdo" (abas);
  - "Assistir: <título>" (play);
  - "Mostrar <título>" (card lateral);
  - "Conteúdo anterior" / "Próximo conteúdo" (setas, do protótipo);
  - "Ir para <título>" (progresso, do protótipo);
  - "Fechar vídeo";
  - "Navegação do rodapé";
  - `alt` das bandeiras de pagamento: Pix, Mastercard, Visa, Elo, American Express e Hipercard. Na home elas estão vazias; aqui identifiquei cada logo.

## Perguntas / pendências

1. **P5:** vídeos de Trading e Performance, Lives, Comunidade no WhatsApp e Gamification. Basta preencher o array `MIDIA`.
2. **Eclipse de 760 px no desktop** (o protótipo tem 620) para caber a logo acima da frase: aprova?
3. **"Cookie" e "Políticas de Uso"** continuam com `href=""`, igual à home. Quais são os endereços?
4. **Volume no Firefox:** o Firefox não deixa esconder o controle de volume (ele aparece desativado nos vídeos sem áudio). No Chromium e no Safari ele some.
5. **Lenis e barra fina:** feitos pela proposta aprovada. Se a mensagem original tinha outros valores, me reenvie que eu ajusto.
6. Seguem abertas: P1 (`BLACK_FIM`), P2 (preços da Black) e o contador na barra mobile (Fase 6).

Aguardando aprovação para a Fase 6.
