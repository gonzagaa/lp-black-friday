# LP Black Friday Zero7 2026: instruções permanentes

## O que é este projeto

Landing page da Black Friday 2026 da Zero7 Tesouraria, uma mesa proprietária de day trade. É feita em HTML, CSS e JS puros, sem framework e sem etapa de build obrigatória.

A página usa a **identidade da campanha Black** (preto + laranja do brand kit), e não a identidade azul da home. Em compensação, carrega o **DNA de forma** da home: o raio diagonal e o divisor de candles.

A direção visual já foi aprovada e está em `_referencia/`. Comece pelo `_referencia/README.md`.

## Fluxo de trabalho (obrigatório)

1. O trabalho está dividido em fases em `PROMPTS-LP-BLACK.md`. **Faça somente a fase que foi pedida.**
2. Ao terminar a fase:
   - rode as capturas;
   - escreva o relatório em `relatorios/fase-N.md` e repita o resumo no chat;
   - **PARE**.
3. Só comece a fase seguinte depois de receber, por escrito, **"Fase N aprovada"**. Se vierem correções, aplique, gere um novo relatório e pare de novo.
4. Faça um commit por fase, com a mensagem `fase N: <resumo>`. Correções da mesma fase vão em commits `fase N (ajuste): ...`.
5. Se algo exigir uma decisão que não está escrita (um texto, um dado, um comportamento), **pergunte e não invente**. Registre a pergunta no relatório.

## Fontes da verdade (em ordem)

1. `_referencia/copy/LPBlack.html`: a copy. Os textos são lei.
2. `_referencia/prints/`: como a página tem que ficar.
3. `_referencia/canvas/*.dc.html`: o CSS desses arquivos traz os valores exatos aprovados.
4. `../Zero7/`: a home oficial (planos, lógica de preços, rodapé). **Só leitura. Nunca altere nada fora desta pasta.**

## Regras invioláveis

1. **Copy.** Use os textos da copy palavra por palavra, incluindo pontuação. Os textos que não vieram da copy estão listados na seção "Textos a aprovar" do `PROMPTS-LP-BLACK.md`. Pode usá-los, mas sinalize no relatório.
2. **Planos.** O layout é igual ao da home e só muda a pele. Preço, checkout, modo e prazo vêm do `planos.json`. **Nunca escreva URL de checkout ou preço fixo no HTML.**
3. **Cor.** O preto domina (cerca de 82%), o branco conduz e o laranja `#FF6A1A` aparece **só** nestes pontos:
   - CTA;
   - preço ("12x", "ou", "à vista");
   - um destaque por seção;
   - luz do horizonte e do eclipse;
   - topo dos candles;
   - aba ativa;
   - números dos cards de benefício;
   - selo de desconto.

   O vermelho `#E52B24` entra só no fim de degradês. O amarelo `#FFC83D` é só luz: brilho interno do botão e foco.
4. **Forma: raio diagonal da Zero7.** Botões, nav e pílulas usam `16px 0`. Cards usam `24px 24px 24px 0`. A seta do botão fica na "gota" `999px 0 999px 999px`. O palco da comunidade usa `40px 0 40px 0`. Chips usam `8px`. Não use cantos iguais nos quatro lados, a não ser em chips e no seletor de mercado (pílula).
5. **Fundo nunca liso.** Toda seção tem textura: grão global, grade de 72 px com máscara, linhas de gráfico ou luz.
6. **Transição nunca seca.** Entre seções use sempre uma destas: horizonte (o planeta vira o fundo da próxima seção), candles (a seção sobe recortada), picote de ingresso ou fusão por máscara ou degradê.
7. **Tipografia.**
   - Plus Jakarta Sans 800 (letter-spacing `-.045em`) só nas frases de impacto: H1 da hero e frase do fechamento.
   - Barlow Condensed 700–900 em caixa alta para títulos de seção, nomes de plano, rótulos e números.
   - Inter 400–600 para o corpo do texto.
   - O ponto final depois de palavra em Jakarta leva `margin-left: -.07em`, porque a fonte deixa um vão.
8. **3D com parcimônia.** Os elementos 3D do brand kit aparecem só onde o protótipo usa: benefícios 01, 04 e 08 e o card Academy. Nada de 3D decorativo flutuando.
9. **Acessibilidade.**
   - Área de toque de no mínimo 44 × 44 px.
   - `:focus-visible` desenhado em tudo que recebe foco.
   - Contraste de 4,5:1 no texto.
   - `prefers-reduced-motion` desliga toda animação que não for essencial.
   - Use HTML semântico: `button` para ação, `a` para navegação.
10. **Performance.**
    - Imagens em AVIF/WebP com `width`/`height` e `loading="lazy"` abaixo da dobra.
    - Fontes locais em woff2, com preload só das usadas na hero.
    - Sem bibliotecas pesadas: o carrossel usa CSS scroll-snap e JS próprio, sem Swiper, GSAP ou Lenis.
    - Metas: LCP < 2,5 s no mobile, CLS < 0,05, primeira dobra < 800 KB.
11. **Tracking e terceiros.** Não adicione GTM, Pixel ou similares sem pedido explícito. O selo do Reclame Aqui entra igual à home (Fase 5).
12. **Datas e números de negócio.** A data de término do contador e qualquer número que não esteja na copy ficam em `js/config.js` como constantes com `// TODO: confirmar`. Liste todos no relatório.

## Verificação

- `npm run dev` sobe a página em **http://localhost:5500**. Use sempre esta porta: o revisor abre a página nesse endereço, no navegador.
- `npm run shots -- <rotulo>` captura a página inteira em 360, 390, 768, 1024, 1280, 1440 e 1920 px e salva em `shots/<rotulo>/`.
- Toda fase termina comparando as capturas com `_referencia/prints/`. Aponte você mesmo, no relatório, onde a página ainda diverge do protótipo.

## Formato do relatório de cada fase

```
# Fase N: <nome>
## O que foi feito
## Arquivos criados/alterados
## Capturas (caminhos em shots/fase-N/)
## Conferência com a referência (o que bate, o que diverge e por quê)
## Checagens rodadas (console sem erros, larguras sem scroll horizontal, etc.)
## Textos a aprovar usados nesta fase
## Perguntas / pendências
Aguardando aprovação para a Fase N+1.
```
