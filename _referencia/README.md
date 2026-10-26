# _referencia: a direção visual aprovada

Esta pasta é a fonte da verdade visual da LP. Ela não sobe para produção.

## prints/

| Arquivo | O que mostra |
|---|---|
| `01-hero-desktop.png` | Hero aprovada em 1440 × 1000. É a referência de pixel da primeira dobra. |
| `02-pagina-desktop-completa.png` | Página inteira em 1440 px: hero, benefícios, planos, comunidade, fechamento e rodapé. |
| `03-mobile-completo.png` | Mobile em 390 px: hero, benefícios, um card de plano e a barra fixa inferior. |
| `04-sistema-visual.png` | Sistema visual: proporção de cor, raios, texturas, botões, transições, selo e tipografia. |
| `05-planos-home-oficial.jpg`, `06-planos-home-oficial-topo.jpg` | Como os planos são hoje na home oficial. O **layout** precisa ser o mesmo; só muda a pele. |
| `07-ref-efeito-horizonte.png` | Referência do efeito de luz do horizonte. |
| `08-ref-h1-e-selo.png` | Referência da fonte do H1 e do selo 80% OFF. |

Observação sobre o print 02: a captura foi feita sem rolar o carrossel de planos, por isso ele aparece em Trainee, Júnior e Pleno. Na página, o carrossel abre centralizado no Sênior.

## canvas/

`Main.dc.html`, `Mobile.dc.html` e `Sistema.dc.html` são os arquivos-fonte do protótipo aprovado.

- **O CSS dentro do `<style>` vale como especificação.** As cores, raios, sombras, degradês e tamanhos ali são os aprovados. Copie os valores, não reinvente.
- **O markup é um template do canvas, não HTML final.** `{{ x }}`, `<sc-for>`, `<sc-if>`, `<helmet>`, `<x-dc>` e a classe `Component extends DCLogic` são sintaxe do protótipo. Traduza para HTML semântico e JS puro.
- Os caminhos de imagem apontam para os originais (`_brandkit/`, `../Zero7/assets/`). Na LP, use as versões otimizadas geradas na Fase 1.
- O `renderVals()` do `Main.dc.html` traz os dados de exemplo dos planos (valores de 60 dias do `planos.json` de 26/10) e a lógica do carrossel da comunidade. Leia antes de implementar.

## texturas/

- `grain.png`: grão em tile de 240 px, aplicado por cima da página toda com `mix-blend-mode: soft-light`.
- `candles-mask.svg` + `candles-tops.svg`: divisor em candles. A seção de baixo "sobe" recortada em barras (máscara), e os topos das barras ficam acesos em laranja. É o mesmo conceito do divisor da home oficial (`../Zero7/css/divisor.css`).

## copy/

`LPBlack.html` (+ `images/`) é a copy original, com as referências de layout que o redator anexou. **Os textos dela são lei.**
