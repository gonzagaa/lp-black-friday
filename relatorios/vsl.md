# Seção VSL (#vsl): o vídeo entre os benefícios e os planos

Pedido do cliente de 12/11. Commit `ajuste: seção VSL entre benefícios e planos`, sem push.

## O que foi feito

### Posição

- **Ordem das seções:** topo > benefícios > **vsl** > planos > comunidade > fechamento.
- A seção vem logo depois do último card dos benefícios (Mentor IAVA) e antes da faixa de candles que abre os planos.
- **"Conhecer planos":** o botão que fechava os benefícios desceu para baixo do vídeo, com o mesmo link (`#planos`) e o mesmo tracking (`data-cta="beneficios"`). Os benefícios terminam com 120 px de respiro, e o VSL fecha com os 150 px que vinham antes dos candles.
- `id="vsl"`, fora do menu da nav.

### Layout

- **Cabeçalho:** o selo `.tag` "Assista antes de escolher" e o título bicolor `.titulo-secao` ("Entenda o maior pacote" / "de benefícios da história.", com a segunda linha em branco .42).
- **Subtítulo:** fica numa linha a partir de 1024 px e equilibrado em mais linhas abaixo disso.
- **Fundo:** o mesmo #070505 do fim dos benefícios, com a grade de 72 px mascarada ao redor do player e o grão global.
- **Player:**
  - 16:9 (a miniatura do YouTube é 1280 × 720), com até 1040 px de largura e `aspect-ratio` reservando a altura;
  - raio `32px 0 32px 0` (22 px no mobile), borda de 1 px `rgba(255,255,255,.08)` e sombra profunda;
  - atrás dele, a luz laranja difusa saindo de baixo, no tom do horizonte.
- **Selo 80% OFF:** o `.selo-hero` da hero, girado −12°, preso no canto de cima à direita, escapando um pouco.
  - Mede 96 px no desktop e 64 px no mobile (114 e 76 px na caixa girada).
  - No mobile ele não passa da borda: termina em 386 de 390 px.
- **Play:** redondo, a pedido do cliente (exceção à regra 4). Usa o degradê da marca, com o círculo branco e o ▶.
  - 96 px no desktop e 72 px no mobile.
  - No hover, o play cresce 8% e a capa clareia; com movimento reduzido, sem animação.
- **Mobile:** o player vai de ponta a ponta dentro do gutter, o título fica menor e o botão ocupa a largura toda.

### Player leve

- **Capa:** a miniatura `maxresdefault` do vídeo, salva como `assets/img/vsl-capa-1280.webp` (18 KB) e `vsl-capa-640.webp` (7 KB), com `srcset`, `width`/`height` e alt descritivo.
  - O fallback `hqdefault` não foi preciso: a `maxresdefault` existe.
  - A capa só é pedida quando a seção chega a ~800 px da tela. Com o `loading="lazy"` sozinho, o Chrome ainda a baixava na carga e ela pesava no LCP.
- **Play:** um `<button>` com aria-label "Assistir ao vídeo: Entenda o maior pacote de benefícios da Zero7", foco visível e um degradê escuro leve por cima da capa.
- **No clique:**
  - preconnect para `www.youtube-nocookie.com`, `www.youtube.com` e `i.ytimg.com`, só nesse momento;
  - a capa vira o iframe `youtube-nocookie.com/embed/beNPuHfW1UQ?autoplay=1&rel=0&modestbranding=1&playsinline=1`, com `title`, o `allow` pedido e `allowfullscreen`;
  - `dataLayer.push({ event: 'vsl_play', vsl_id: 'beNPuHfW1UQ' })`.
- **Desempenho:**
  - o `vsl.css` carrega fora do caminho crítico, como o das outras seções abaixo da dobra (`media="print"` + `<noscript>`);
  - o `vsl.js` só entra depois do `load` (`import()` no `main.js`).

## Arquivos criados/alterados

**Criados:**
- `css/secoes/vsl.css`;
- `js/modulos/vsl.js`;
- `assets/img/vsl-capa-1280.webp` e `assets/img/vsl-capa-640.webp`;
- `relatorios/vsl.md`.

**Alterados:**
- `index.html`: a seção nova, o CTA movido e o CSS adiado;
- `js/main.js`: o import tardio;
- `css/secoes/beneficios.css`: sem o `.beneficios__acao` e com o respiro final de 120 px;
- os `?v=` (`npm run versao`, versão `202611121008`);
- `PROMPTS-LP-BLACK.md`: os textos novos.

## Capturas (shots/vsl/)

- `{360,390,768,1024,1440,1920}-vsl-capa.png`: a seção com a capa;
- `{…}-vsl-tocando.png`: depois do clique, com o vídeo tocando;
- `1440-vsl-rolado.png`: com o "Conhecer planos" à mostra no desktop.

## Checagens rodadas

- **Larguras:** 360, 390, 768, 1024, 1440 e 1920 px.
  - Sem rolagem lateral e sem erros. CLS ≤ 0,0001.
  - A proporção do player é 1,778 em todas, e a altura não muda quando o iframe entra.
- **YouTube:** nenhum pedido antes do clique. No clique, o vídeo toca em todas as larguras (o `currentTime` avança) e o `vsl_play` vai para o dataLayer, uma vez.
- **"Conhecer planos":** leva para #planos, abaixo da nav.
- **Lighthouse mobile** (servidor gzip da subpasta, rodadas alternadas, antes e depois na mesma hora):

| | Antes | Depois |
|---|---|---|
| LCP | 3,7 / 3,7 / 3,7 / 3,8 s | 3,8 / 3,3 / 3,8 / 3,8 s |
| TBT | 410 / 350 / 40 / 10 ms | 150 / 680 / 150 / 240 ms |
| CLS | 0 | 0 |
| Peso | 377 KiB | 381 KiB (+4 KiB de HTML, sem a capa nem o YouTube) |

  - O LCP empata. A primeira versão subia 0,2 s, e as duas correções acima (CSS e JS fora do caminho crítico) resolveram.
  - O TBT oscila muito nesta máquina hoje (de 10 a 1210 ms em rodadas iguais). As medianas ficam próximas, e nada da seção roda antes do `load`.

## Textos a aprovar usados nesta fase

Os textos vieram do pedido: "Assista antes de escolher", o título, o subtítulo e o aria-label do play. Também o `title` do iframe ("Entenda o maior pacote de benefícios da história da Zero7") e o alt da capa ("Capa do vídeo: os benefícios do plano Black listados na tela, com o apresentador no canto"), que são meus. Todos estão no `PROMPTS-LP-BLACK.md`.

## Perguntas / pendências

1. **A capa é a miniatura do YouTube:** uma tela de lista ("Profit Pro gratuito…", "15 mil"), com o apresentador pequeno no canto. Querem uma capa própria, por exemplo com o rosto do apresentador e o título? Basta trocar os dois webp em `assets/img/`.
