# Comunidade no desktop: mais leve e mais limpa

Só vale para `(min-width: 1024px) and (hover: hover) and (pointer: fine)` (constante `DESKTOP` no JS, o mesmo media query no CSS). O mobile e as telas de toque ficam como estavam.

## O que foi feito

### 1. Palco de 3 cards

- **Medidas:** card de 360 px a partir de 1280 (320 entre 1024 e 1279) e 28 px entre os cards (`spaceBetween` do Swiper, que muda junto com o media query).
- **Palco:** 3 × card + 2 × 28. Dá 1136 px a partir de 1280 e 1016 px em 1024; os 3 cards centrais aparecem inteiros.
- **Sem o `mask-image` do trilho no desktop.** No lugar, `::before` e `::after` do `.comunidade__trilho`:
  - fixos nas laterais, com `pointer-events: none`;
  - largura `(100% − palco) / 2`;
  - `linear-gradient` transparente na borda do palco até `#050404` (o fundo da seção) a 60% da largura.
- **Larguras das laterais medidas:** 4 px em 1024, 72 px em 1280, 152 px em 1440 e 392 px em 1920. Em 1280 o 4º card só se insinua; em 1920, o 4º e o 5º somem no degradê.
- **Folga do trilho:** 10 px de padding em cima e embaixo, para o card subir 6 px sem ser cortado. A margem de cima (56 → 46) e a das setas (32 → 22) compensam, e a altura total da seção não muda.

### 2. Texto com a mesma altura

- **Tamanho fixo fechado:** título em 1 linha (`nowrap`) e descrição com `min-height` e `max-height` de 2 linhas (`3em`, com line-height 1.5).
- **Máscara no fim da 2ª linha**, no lugar de reticências: a 1ª linha fica inteira, e a 2ª some nos últimos 64 px.
  - Ela só entra nas descrições com mais de 2 linhas (`data-corta`, calculado pelo JS ao montar, ao redimensionar e quando as fontes chegam).
  - Assim, um texto que cabe em 2 linhas não fica com o fim apagado.
- **Ao passar o mouse:** a descrição abre até 6 linhas (`max-height: 9em`), em .35 s com a curva da página (`--curva`). A camada da máscara anda 64 px para a direita e sai do texto. O bloco cresce para cima e o degradê do `.cslide__texto::before` acompanha.
- **Pelo teclado:** com foco visível nas setas ou nos segmentos do progresso, o card ativo abre do mesmo jeito (`.comunidade:has(.comunidade__nav :focus-visible) .swiper-slide-active`).

### 3. Destaque no hover

- `.comunidade__trilho:has(.cslide:hover) .cslide:not(:hover)`: opacity .4.
- Card sob o mouse: opacity 1, `translateY(-6px)` e a borda interna `rgba(255,255,255,.14)`.
  - A borda fica num `::after` por cima do vídeo e só a opacidade dele muda. A `box-shadow` do próprio card fica embaixo do vídeo e não aparece.
- Só opacity e transform, em .35 s. Sem filter, blur nem backdrop-filter.

### 4. Vídeos tocando

Toda a lógica está no `avaliar()` que já existia, sem um segundo loop:

- **Sem hover:** tocam só os cards cujo centro está no palco (o centro e os dois vizinhos). Os que aparecem no degradê pausam.
- **Com hover:** toca só o card sob o mouse. Os outros pausam no quadro em que estavam e voltam quando o mouse sai do trilho.
- **Como o hover é lido:** `pointerover` e `pointerleave` no trilho, só com mouse. Ao mudar, chamam o `avaliar()`.

### 5. Movimento reduzido

- Sem transições e sem o `translateY`.
- O texto já aberto, sem máscara.
- Nenhum vídeo toca (como antes).

## Arquivos alterados

- `css/secoes/comunidade.css`: bloco "DESKTOP COM MOUSE" no fim do arquivo.
- `js/modulos/comunidade.js`:
  - `DESKTOP` e `espaco()`;
  - palco e hover no `avaliar()`;
  - `marcarCortes()`;
  - `pointerover`/`pointerleave`;
  - troca do `spaceBetween` quando o media query muda.

## Desempenho: antes × depois

**Como medi:**

- Chrome real (para decodificar H.264 e VP9), headless, com a seção centralizada e o card Academy no centro.
- Contagem de `requestAnimationFrame` por 5 s, em três situações:
  - carrossel parado;
  - passando de card (próximo a cada 1 s);
  - hover no Academy.
- Também anotei o pior quadro e os quadros de vídeo descartados (`getVideoPlaybackQuality`).
- 2 cargas por situação.

**Antes de comparar:** o headless rasteriza em software e não trava em 60 Hz (chega a 72 fps), e a máquina estava com carga variável. Os números servem para comparar antes e depois, não como fps absoluto.

O "antes" foi medido de novo depois do commit do Gamification, para que os dois lados tenham os 6 vídeos.

### Vídeos decodificando ao mesmo tempo (não pausados)

| | Antes | Depois |
|---|---|---|
| 1440, sem hover | **5** | **3** (Lives, Academy, Comunidade no WhatsApp) |
| 1440, hover no Academy | 5 | **1** (Academy) |
| 1920, sem hover | **7** | **3** |
| 1920, hover no Academy | 7 | **1** |

### FPS (2 cargas)

| Situação | Antes | Depois |
|---|---|---|
| 1440 × 900, parado | 42,6 / 67,3 | 48,9 / 72,1 |
| 1440 × 900, passando de card | 32,4 / 43,9 | 36,9 / 40,1 |
| 1440 × 900, hover | 41,9 / 50,1 | 56,2 / 67,2 |
| 1920 × 1080, parado | 39,4 / 44,2 | 72,1 / 49,2 |
| 1920 × 1080, passando de card | 30,3 / 30,1 | 42,6 / 37,6 |
| 1920 × 1080, hover | 37,6 / 46,9 | 65,2 / 59,8 |

### Quadros de vídeo descartados em 5 s (2 cargas)

| Situação | Antes | Depois |
|---|---|---|
| 1440, parado | 103 / 16 | 40 / 0 |
| 1440, hover | 105 / 51 | 17 / 5 |
| 1920, parado | 103 / 103 | 0 / 38 |
| 1920, passando | 188 / 179 | 78 / 80 |
| 1920, hover | 109 / 79 | 8 / 14 |

**Leitura dos resultados:**

- O maior ganho está em 1920 e no hover, onde o número de vídeos tocando cai de 5–7 para 1–3.
- Passando de card, o ganho é menor. A transição do Swiper ainda move os 3 vídeos do palco, e o pior quadro (~200 ms) vem do arme dos vídeos que entram, como antes.

## Capturas (shots/comunidade-desktop/)

- **Sem hover:** `1024.png`, `1280.png`, `1440.png` e `1920.png`.
- **Com hover no card 04 Academy** (o texto mais longo, aberto em 5–6 linhas): `1024-hover-academy.png`, `1280-hover-academy.png`, `1440-hover-academy.png` e `1920-hover-academy.png`.
- **Mobile e toque sem mudança:** `390-sem-mudanca.png` e `1440-toque-sem-mudanca.png`.

## Checagens

**Medidas** (1024, 1280, 1440, 1920):

| Largura | Card | Espaço | Palco | Laterais |
|---|---|---|---|---|
| 1024 | 320 | 28 | 1016 | 4 px |
| 1280 | 360 | 28 | 1136 | 72 px |
| 1440 | 360 | 28 | 1136 | 152 px |
| 1920 | 360 | 28 | 1136 | 392 px |

`mask-image` do trilho: `none`.

**Texto:**

- **Alinhamento:** nos 3 cards do palco, o número, o título e a descrição começam na mesma altura (1280+: 522 / 542 / 576 px do topo do card; 1024: 451 / 471 / 505).
- **Títulos:** nenhum cortado em 1 linha, inclusive "COMUNIDADE NO WHATSAPP" no card de 320 px.
- **Descrições com máscara** (mais de 2 linhas):
  - de 1280 em diante: HUB Zero7 e Academy;
  - em 1024: também Trading e Performance e Gamification.

**Hover no Academy:**

- o card fica com opacity 1 e `translate(0, -6px)`; os outros com opacity .4;
- a descrição abre de 42 px para 105 px (1280+) ou 126 px (1024), a altura do texto inteiro, sem corte.

**Teclado:** com foco visível na seta "Conteúdo anterior", o card ativo abre a descrição (105 px).

**Mobile e toque:** capturas antes × depois da seção com movimento reduzido. Diferença 0 em todos os pixels, em 390 (celular) e em 1440 com toque (o media query do desktop não vale: card de 320, espaço de 20, máscara do trilho como antes).

**Erros:** nenhum erro de console ou 404.

## Perguntas / pendências

1. **Hover nos cards das laterais:** com `pointer-events: none` nos degradês, como pedido, o mouse ainda "acha" a parte visível do 4º card (a faixa transparente do degradê, junto ao palco). Ali o card toca sozinho e os 3 do palco apagam. Se preferir que só os cards do palco reajam ao mouse, dá para os degradês receberem o ponteiro (o arraste continua funcionando, porque o Swiper escuta o trilho inteiro).
