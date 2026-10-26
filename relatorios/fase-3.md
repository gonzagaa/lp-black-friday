# Fase 3: Benefícios

## O que foi feito

Antes desta fase entrou o ajuste aprovado da Fase 2 (commit `fase 2 (ajuste): menu`):
- o CTA do painel do menu passou a dizer "Aproveitar a Black";
- o CLAUDE.md ganhou a seção "Hero aprovada na Fase 2", com os valores que valem por cima do print 01.

**Onde ver:** http://localhost:5501 (a seção está logo abaixo da hero).

### Transição do planeta (amarrada à altura real do arco)
- O `--arco` saiu do `.hero` e foi para o `:root` (`css/secoes/topo.css`): 150 px no desktop e 144 px no mobile. A hero e os benefícios usam a mesma variável.
- A seção sobe exatamente `--arco` por cima da base da hero (`margin-top: calc(-1 * var(--arco))`; no protótipo eram −200 px fixos).
- O fundo é `linear-gradient(180deg, rgba(3,2,2,0), #030202 var(--arco), #070505)`. O degradê começa transparente no topo do arco, que fica inteiro, e chega ao `#030202` (o corpo do planeta) na base da hero.
- O rótulo "O pacote da Black" aparece 40 px acima da base da hero, como no print 01.
- As duas linhas de gráfico ao fundo (branca e laranja, opacidade .07) ficam 160 px abaixo da base da hero, como no protótipo.

### Cabeçalho
`.tag` "O pacote da Black". H2 em Barlow 800, `clamp(44px, 5.2vw, 76px)`, line-height .9: "Um pacote completo" em branco + "para o próximo nível." em branco .38. À direita, o `.lbtn` "Ir direto para os planos" → `#planos`.

### Bento
- Grade de 3 colunas com gap de 20 px. Os oito `.card-z` estão na ordem pedida, com títulos e descrições da copy palavra por palavra (o título curto do 03 é texto a aprovar).
- Os 01, 04 e 08 levam o 3D do brand kit; os demais, os gráficos SVG do protótipo.
- O "80" e o "100" aparecem gigantes, só em contorno. O 08 leva o selo "Online 24h" com ponto verde e o cavalo saindo pela base.
- O número de cada card está em Barlow 700 15 px `#FF8A4C`; os títulos, em Barlow 800 caixa alta.
- **3D:** em `<picture>` com AVIF/WebP, `srcset` de 320 e 640 px, `sizes` com a largura real, `width`/`height`, `alt=""` e `loading="lazy"`. No desktop o navegador escolhe a versão de 320 px (até 14,6 KB cada).

### Responsivo
- **768–1199 px:** 2 colunas. Os cards de 2 e 3 colunas ocupam a linha inteira.
- **< 768 px:** 1 coluna, com os valores do `Mobile.dc.html`:
  - padding de 26/22 px, títulos de 40 px (01 e 08) e 32 px (os outros), descrição de 15 px;
  - no 01 e no 04, o 3D tem 130 px e fica no canto de baixo; a descrição tem largura máxima de 220 px para não passar por cima dele.

### Interação
- **Hover:** borda .14, linha de luz no topo e 3D subindo 6 px com −3°. Isso vem do `.card-z` da Fase 1, conferido em navegador.
- **Entrada por rolagem** (`js/modulos/revelar.js`, IntersectionObserver):
  - fade + 16 px de subida, 600 ms na curva do projeto e 60 ms entre os itens que entram juntos, uma vez só;
  - desligada com movimento reduzido: nada se esconde nem anima.

### CTA da seção
`.fbtn` "Conhecer planos" → `#planos`.

### Decisões que tomei (confira)

1. **"∞" em SVG.** A Fase 3 pede o "∞" em Barlow 300, mas o subset latin da Barlow **não tem esse glifo**. Testei: a largura do "∞" muda conforme a fonte reserva (48 px com Courier, 64 px com Georgia), e a do "8", que existe, não muda. Ou seja, nem o protótipo usava a Barlow aí. Desenhei o símbolo em SVG, no tamanho, na cor (`#FF8A4C`) e no peso do print 02, sem baixar mais um peso de fonte. Isso fecha a pendência 5 da Fase 1.
2. **No layout de 2 colunas, o 07 ocupa a linha inteira.** O 05 e o 06 dividem uma linha; sem isso, o 07 ficaria sozinho com um buraco ao lado.
3. **O `<picture>` do 3D é uma camada absoluta do tamanho do card.**
   - No protótipo o `<img>` era solto. Com o `<picture>` (e o `<source>` dentro dele), sobrava um item invisível no flex do card, que empurrava a pílula "Online 24h" 35 px para a esquerda.
   - Corrigido: a pílula e os três 3D caem nas mesmas coordenadas do print 02 (pílula em 871–1037 px, `%` em 595–855, cofre em 991–1221, cavalo em 1051–1221).
4. **Entrada por rolagem sem piscar e sem prender conteúdo.**
   - A classe `.js` agora é posta por um script inline de uma linha no `<head>`, antes da primeira pintura (antes era o `main.js`, que roda depois). Assim os itens já nascem escondidos.
   - A animação usa a propriedade `translate` (Web Animations API), que não briga com o `transform` do hover dos cards.
   - Rede de segurança: se o `main.js` não carregar, os itens aparecem sozinhos em 3 s.
5. **Mobile, onde o print 03 não mostra** (ele vai só até o card 02):
   - o link "Ir direto para os planos" continua visível, embaixo do título;
   - o CTA "Conhecer planos" tem largura total, como o da hero;
   - no card 08, o texto fica em cima, a pílula embaixo à esquerda e o cavalo menor (96 px) no canto;
   - os outros cards seguem o padrão do 01 e do 02.
6. **Acessibilidade:** os números dos cards ("01"…"08"), os gráficos, o "∞", o contorno e o "10 dias" são decorativos e estão com `aria-hidden`. Cada card é um `<article>` com `<h3>`; a seção usa `aria-labelledby` apontando para o H2.

## Arquivos criados/alterados

- `index.html`: seção `#beneficios` completa e script inline da classe `.js` no `<head>`
- `css/secoes/beneficios.css`: transição, cabeçalho, bento, responsivo
- `css/secoes/topo.css`: `--arco` foi para o `:root` (variável compartilhada)
- `css/base.css`: estado inicial da entrada por rolagem (só com movimento permitido) e a rede de segurança
- `js/modulos/revelar.js` (novo), `js/main.js` (importa o revelar; a classe `.js` saiu dele)
- `relatorios/fase-3.md`

## Capturas (caminhos em shots/fase-3/)

- `comparacao-1440.png`: print 02 ao lado da página, alinhados pelo rótulo "O pacote da Black".
- `comparacao-390.png`: print 03 ao lado da página, alinhados da mesma forma.
- `transicao-1440.png`, `transicao-1920.png`, `transicao-390.png`: a passagem hero → benefícios.
- `360.png`, `390.png`, `768.png`, `1024.png`, `1280.png`, `1440.png`, `1920.png`: página inteira.

## Conferência com a referência (o que bate, o que diverge e por quê)

**Desktop × print 02** (`comparacao-1440.png`): bate. Cabeçalho, bento (tamanhos, espaçamentos, raios), 3D, contornos, gráficos, pílula, cavalo e CTA estão nas mesmas posições relativas. Divergências:
- a seção começa 180 px mais acima na página (o rótulo está em 785 px; no print, em 965), porque a hero ficou mais baixa (aprovado na Fase 2);
- o arco aparece um pouco mais "cheio" nas laterais, porque agora ele fica a 150 px da base (no print, 210);
- o "∞" está um pouco mais fino que no print, onde o protótipo caiu numa fonte reserva.

**Mobile × print 03** (`comparacao-390.png`): bate no título, nos cards 01 e 02 e no 3D pequeno no canto. Divergência: o link "Ir direto para os planos" aparece embaixo do título (decisão 5).

**Transição:** no centro, a cor é a mesma (`3,2,2`) 10 px acima, na base e 10 px abaixo da base da hero. Medindo sem o grão e sem o texto, a maior diferença de cor entre duas linhas vizinhas, a ±30 px da base, é:

| Tela | Esquerda | Centro | Direita |
|---|---:|---:|---:|
| 1440 × 900 | 1,3 | 0,2 | 1,2 |
| 1920 × 1080 | 0,8 | 0,3 | 0,7 |
| 390 × 844 | 0,1 | 0,1 | 0,1 |

Valores em uma escala de 0 a 255: não há linha nem corte. O arco continua inteiro; nas laterais, perto da base, ele se dissolve no corpo do planeta, como no print 02.

## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)

**Capturas** (`npm run shots -- fase-3 --porta=5501`): nas 7 larguras, de 360 a 1920 px, não há scroll horizontal, nem erro de console, nem requisição externa. Fontes baixadas: Jakarta 800 e 700, Inter e Barlow 700, 800 e 900, todas locais.

**CLS e LCP** (movimento normal, com a entrada por rolagem ativa):

| Tela | CLS na carga | CLS depois de rolar a página toda | LCP |
|---|---:|---:|---|
| 1440 × 900 | 0,0000 | 0,0000 | `h1#hero-titulo` |
| 390 × 844 | 0,0000 | 0,0000 | `h1#hero-titulo` |

**Entrada por rolagem:**
- movimento normal: dos 10 itens, só o que já está na tela começa a aparecer na carga. Depois de rolar, os 10 estão revelados e com opacidade 1;
- movimento reduzido: opacidade 1 em todos e nenhuma animação ativa;
- com o `main.js` bloqueado: os itens ficam escondidos na carga e aparecem todos em 3 s.

**Hover** (card 01): borda .07 → .14, linha do topo com opacidade 0 → 1, e o 3D com `translateY(-6px) rotate(-3deg)`.

**3D com `loading="lazy"`** (aba de rede pelo Playwright). O lazy funciona, mas na carga normal os três 3D baixam junto com a página:
- **Prova de que funciona:** com 3.000 px de espaço antes da seção, **nenhum 3D baixa na carga**, e cada um só é pedido ao se aproximar da tela.
- **Por que baixam:** o Chrome só adia o que está mais longe que uma certa distância da tela: 1.250 px em 4G (mais em redes lentas ou desconhecidas). Como a seção começa logo depois da dobra, os três ficam dentro disso:

  | Tela | 19 (%) | 11 (cofre) | 17 (cavalo) |
  |---|---:|---:|---:|
  | 1440 × 900 | 156 px | 536 px | 1.187 px |
  | 390 × 844, 4G simulado | 251 px | 1.100 px | 1.334 px: **só é pedido com a rolagem** |

  No desktop os três são pedidos na carga (36 KB no total, na versão de 320 px).

## Textos a aprovar usados nesta fase

- Rótulo "O pacote da Black".
- Título "Um pacote completo para o próximo nível."
- Link "Ir direto para os planos".
- Selo "Online 24h" (card Mentor IAVA).
- Título curto do card 03: "Conta real com 10 dias na incubadora" (a copy diz "Transição para conta real com 10 dias na incubadora.").
- Também na tela, mas decorativo (`aria-hidden`) e definido no prompt da fase: "10 dias" na barra do card 03.

## Perguntas / pendências

1. **3D na primeira carga do desktop:** pelo critério do próprio Chrome eles estão "perto" e baixam na carga (36 KB). Se você quiser que só baixem quando estiverem mais próximos, dá para trocar o `loading="lazy"` por um carregamento próprio com IntersectionObserver e uma margem menor. Fica a seu critério; hoje está como a fase pede.
2. **Mobile:** confirmar o link "Ir direto para os planos" visível, o CTA "Conhecer planos" com largura total e o arranjo do card 08 (decisão 5).
3. **Tablet:** confirmar o card 07 ocupando a linha inteira no layout de 2 colunas (decisão 2).
4. **"∞" em SVG** (decisão 1): confirmar.
5. Seguem abertas: `BLACK_FIM` provisório (P1), contador na barra mobile (Fase 6) e grade de 72 px no mobile (pendência 4 da Fase 1).

Aguardando aprovação para a Fase 4.
