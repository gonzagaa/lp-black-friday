# Quiz: ajustes de 04/11 (rótulo, legenda, mobile e selo "80% OFF")

São quatro pedidos, um commit para cada, todos sem push. A lógica, a validação e o `lead.php` não mudaram. Em todos os testes, o `lead.php` foi interceptado no navegador, então nenhum envio foi para a RD.

| Commit | Pedido |
|---|---|
| `42ad5fe quiz (ajuste): sem o rótulo "Quiz da Black"` | 1. Sem o selo "Quiz da Black" acima do título |
| `23b315b quiz (ajuste): vídeos sem legenda` | 2. Sem o texto sobre os vídeos |
| `7df4831 quiz (ajuste): mobile mais enxuto` | 3. Mobile: luz, 3D, vídeo e card |
| commit deste relatório, `quiz (ajuste): selo "80% OFF" da LP` | 4. O selo "80% OFF" |

## 1. Sem o rótulo "Quiz da Black"

- Saíram o rótulo e o quadradinho laranja.
  - Esse rótulo só existia no cabeçalho, que aparece em todas as etapas.
  - No contato e no sucesso não havia outro selo igual.
- O título passou a ser o primeiro elemento da coluna.
  - Essa coluna fica centralizada na vertical, ao lado do palco.
  - Em 1440 × 900, o título começa cerca de 90 px abaixo da linha da logo: sem buraco e sem colar no topo.
- No mobile, o título continua só para o leitor de tela.
- **Testes (360, 390 e 1440):** CLS ≤ 0,0003, sem erros.
- **Prints:** `shots/quiz-sem-rotulo/`.

## 2. Vídeos sem legenda

- **Saiu o bloco `.palco__legenda`:** a etiqueta "Ecossistema Zero7", o título e a descrição, em todas as etapas, no desktop e no mobile.
- **Saiu também o degradê escuro** (`.palco__moldura::after`), que só existia para dar leitura a esse texto. O vídeo fica limpo, de ponta a ponta na moldura.
- **Continuam:** a moldura, o cartão fantasma, o 3D de cada etapa e a troca de vídeo.
- **Acessibilidade:** o palco inteiro passou a ser `aria-hidden`.
  - Ele não tem mais nenhum texto.
  - Os vídeos e o 3D já eram `aria-hidden`.
- **Textos:** as legendas saíram do `palco.js` e foram marcadas como removidas no `PROMPTS-LP-BLACK.md`.
- **Testes (360, 390 e 1440):** CLS ≤ 0,0003, sem erros.
- **Prints:** `shots/quiz-sem-legenda/`.

## 3. Mobile mais enxuto (até 767 px)

| | Antes | Depois |
|---|---|---|
| Luz laranja do topo | `rgba(255,138,61,.22)` → `.08`, raio de 900 px | `.10` → `.036` (cerca de 45%), raio de 560 px, só no canto |
| Objetos 3D | 70 px, 6 imagens baixadas no fluxo | escondidos e **0 imagens baixadas** (o `palco.js` só pede a imagem onde ela aparece) |
| Vídeo nas perguntas | 400 px | **260 px** |
| Vídeo no contato e no sucesso | 200 px | **160 px** |
| Card por cima do vídeo | −26 px | **−32 px** (mesmo raio, mesma sombra) |

- **Meta (390 × 844, com a tarja):** a pergunta e todas as opções cabem sem rolar.
  - O pior caso é a P4: título em 2 linhas e uma opção quebrando em 2 linhas. A última opção termina em **747 px**. Antes, terminava em 893 px.
  - **430 × 932:** cabe (P4 até 743 px).
  - **360 × 740:** P1 e P3 cabem. A P4 passa **11 px** da tela (751 de 740). A meta era só para o 390; se quiser, ajusto o 360 também.
- **Recorte:** o `object-fit: cover` continua.
  - No vídeo baixo, os dois vídeos com gente (lives na P3 e trading na P4) cortavam o rosto. Ganharam um foco de recorte (`object-position` a 15% e a 18%).
  - O hub, que começa em 2,8 s, não pega a emenda da colagem nesse recorte.
- **Desktop:** sem mudança. Em 1440 × 900, as medidas foram as mesmas antes e depois.
- **Testes:** CLS ≤ 0,0003 em 360, 390 e 430; 0 no 1440. Sem scroll horizontal, sem erros.
- **Prints antes e depois:** `shots/quiz-mobile/antes/` e `shots/quiz-mobile/depois/`, com `{360,390,430}-{p1,p3,p4,dados,sucesso}.png`.

## 4. Selo "80% OFF" da LP

- **É o mesmo selo da hero da LP:**
  - o componente `.selo-hero` de `css/componentes.css`, que o quiz já carregava;
  - o mesmo sprite, copiado do `index.html`: o polígono de 36 pontos e os degradês `#selo-hero-cor` e `#selo-hero-brilho`. O script confere se os degradês são idênticos aos da LP;
  - a mesma cor, o mesmo texto ("80%" / "OFF") e a mesma rotação (−12°);
  - a mesma entrada "carimbo" (.9 s) e o mesmo giro lento (40 s).
  - Não criei nenhum selo novo.
- **Desktop (a partir de 1080 px):**
  - fica colado no fim do título, depois do ponto: "em 4 perguntas." e, no sucesso, "Bem-vindo à Black.". Aparece em todas as etapas;
  - o tamanho segue a regra da LP, 1,12em do título: 54 px num título de 48 px;
  - invade um pouco a linha de cima, no vão abaixo de "Black", sem cobrir letra. O ponto final continua visível;
  - mesmo posicionamento da hero: um pino de largura zero depois do ponto, com `top: -.05em` e `margin-left: -.1em`.
- **Mobile:**
  - fica no canto superior direito da moldura do vídeo, escapando um pouco para fora, girado, com **78 px**;
  - aparece em todas as etapas, inclusive no contato e no sucesso, com o vídeo baixo;
  - medido: não cobre a tarja, o card, a barra de progresso nem a marca Black Friday.
- **Tablet (768–1079 px):** nessa faixa, o quiz usa o layout de uma coluna, e o título fica só para o leitor de tela. Por isso o selo vai para a moldura, como no celular, e o 3D sai dessa faixa para dar lugar a ele. Os 3D continuam só no layout de desktop (≥ 1080 px). Sem a imagem, eles também não baixam nessa faixa.
- **Acessibilidade:**
  - no título, o selo é `role="img"` com `aria-label="80% OFF"`. O leitor de tela lê o H1 como "Sua oferta da Black em 4 perguntas. 80% OFF";
  - o selo da moldura fica dentro do palco `aria-hidden`, para o "80% OFF" não ser lido duas vezes.
- **Sem salto de layout:** o selo é absoluto, a partir de um pino de largura zero, e o da moldura também é absoluto. CLS ≤ 0,0003.
- **Movimento reduzido:** sem animação (`animation-name: none` no carimbo e no giro).
- **Testes:** 360 × 740, 390 × 844, 430 × 932 e 1440 × 900, mais 768 e 1024 para o tablet.
- **Prints:** `shots/quiz-selo/`, com `{360,390,430,1440}-{p1,dados,sucesso}.png`, mais `768`, `1024` e o detalhe do título no desktop (`zoom-titulo.png`).

## 5. Mobile com o vídeo de fundo (canvas "Quiz da Black · Zero7")

Commit `quiz (ajuste): mobile com o vídeo de fundo`. Até 767 px, ele **substitui** o item 3 (vídeo de 260 px e card a −32 px) e o selo no canto do vídeo (item 4). A luz mais fraca e a saída dos 3D continuam. O tablet (768–1079 px) e o desktop não mudaram.

### Vídeo de fundo

- **Sem caixa:** a moldura perde raio, sombra e cartão fantasma. O vídeo ocupa a largura toda, colado nas laterais, logo abaixo da tarja.
- **Altura:** 360 px nas perguntas e 240 px no contato e no sucesso.
- **Imagem:** `object-fit: cover` e `filter: brightness(.62) saturate(.85)`.
- **Degradê por cima:** `rgba(10,6,5,.55)` no topo, `.12` em 32%, `.2` em 55% e `.78` no fim.
- **Fim do vídeo:** some no papel pela máscara `linear-gradient(180deg, #000 78%, transparent)`.
- A troca de vídeo entre as etapas continua igual.
- O vídeo é absoluto, então mudar a altura entre as etapas não empurra nada.

### Por cima do vídeo

- **Logos:** o Zero7 todo branco (`zero7-logo-branca.svg`, 22 px) e a Black Friday para fundo escuro (`completa-escuro.svg`, 34 px, a mesma da nav da LP).
  - Entram por `<picture>` com `media`, então cada largura baixa só a sua versão.
- **Título nas perguntas:** "Sua oferta da Black" / "em 4 perguntas." em Jakarta 800, entrelinha 1.02 e −.045em.
  - Primeira linha branca e a segunda em `rgba(255,255,255,.66)`, com sombra `0 2px 18px rgba(0,0,0,.35)`.
  - 118 px abaixo dos logos.
  - Fonte de 32 px; abaixo de ~390 px ela encolhe até a linha mais longa não chegar no selo (28,6 px em 360).
- **Contato e sucesso:** título de 26 px, 56 px abaixo dos logos. No sucesso, o título é "Obrigado!" / "Bem-vindo à Black.".

### Selo "80% OFF"

- É o mesmo `.selo-hero` da LP, girado −12°.
- Fica no canto direito do bloco do título, centralizado na vertical entre as duas linhas (os centros batem nas três larguras).
- **Tamanho:** 64 px nas perguntas e 56 px no contato e no sucesso.
- **Folga até o texto**, medida com a caixa girada (a folga real ao círculo é maior):

| Largura | Perguntas | Contato e sucesso |
|---|---|---|
| 360 px | 13 px | 40 px ou mais |
| 390 px | 15 px | 70 px ou mais |
| 430 px | 52 px | 108 px ou mais |

- O selo da moldura (item 4) fica escondido nessa largura.

### Card

- Começa logo abaixo do título, por cima da parte de baixo do vídeo, sem margem negativa.
- **Em 390 × 844, o topo fica em:** 295 px nas perguntas e 217 px no contato (o canvas pedia ~295 e ~217).
- **No contato,** os vãos do formulário diminuem para caber: entre os campos, de 14 para 10 px; entre rótulo e campo, de 6 para 4 px.

### Cabe sem rolar (com a tarja)

| Tela | P4 (4 opções), base da última opção | Contato: base de "Seus dados ficam só com a Zero7." |
|---|---|---|
| 360 × 740 | 696 px, cabe | 756 de 740, **não cabe** (passa 16 px) |
| 390 × 844 | 699 px, cabe | 756 de 844, cabe, com o "← Voltar" |
| 430 × 932 | 695 px, cabe | 736 de 932, cabe |

### Testes

- **CLS:** ≤ 0,0003 no mobile e 0 no desktop.
- **Sem** scroll horizontal, erros ou 404.
- **3D no mobile:** 0 imagens baixadas.
- **Desktop (1440 × 900):** as mesmas medidas, com o selo colado no fim de "em 4 perguntas.".

### Prints

Em `shots/quiz-mobile-fundo/`: `{360,390,430}-{p1,p4,dados,sucesso}.png` e `1440-{p1,p4,dados,sucesso}.png`.

## 6. Respostas às 4 decisões

Commit `quiz (ajuste): contato em tela baixa, tablet no vídeo de fundo, selo de 72 px`.

1. **Contato em telas com altura ≤ 760 px** (ex.: 360 × 740). As perguntas não mudaram.
   - Vídeo de fundo com 200 px.
   - Título de 24 px, mais perto dos logos (26 px de margem), para ficar na parte escura do vídeo.
   - Selo de 52 px.
   - Menos espaço no formulário: 8 px entre os campos e campos de 44 px.
   - **Resultado em 360 × 740:** o card começa em 183 px. A linha "Seus dados ficam só com a Zero7." termina em **700 px de 740**: o formulário cabe inteiro com a tarja, e o "← Voltar" também aparece.
2. **Tablet (768 a 1079 px):** passou para o layout com o vídeo de fundo.
   - Os logos e o conteúdo ficam numa coluna centralizada de 560 px; o vídeo continua de ponta a ponta.
   - Os logos brancos também valem nessa faixa (`<picture>` até 1079 px).
   - O título e o selo aparecem como no mobile: 32 px nas perguntas e 26 px no contato e no sucesso; selo de 64 e 56 px.
   - O selo do canto da moldura saiu de vez, do HTML e do CSS.
   - Sem 3D: nem baixa.
   - **768 × 1024:** o card começa em 299 px nas perguntas e em 221 px no contato.
   - **1024 × 768:** o contato cabe (714 de 768). Como a altura passa de 760 px, essa tela não usa o aperto do item 1.
3. **Enquadramento da P3 e da P4:** aprovado, sem mudança.
4. **"Ver os planos."** no link da tarja: aprovado e registrado.
5. **Extra, desktop:** o selo passou a ter **72 px**, 1,5em do título de 48 px.
   - Fica centrado na linha 2, logo depois do ponto (`top: -.14em`, `margin-left: .02em`).
   - O ponto continua visível, e o selo não encosta no "k" de "Black". Detalhe em `zoom-1440.png`.
   - O resto do desktop ficou igual: mesmas medidas em 1440 × 900.

### Testes

- Telas: 360 × 740, 390 × 844, 768 × 1024, 1024 × 768 e 1440 × 900.
- **CLS:** ≤ 0,0003.
- **Sem** scroll horizontal, erros ou 404.
- **3D:** 0 imagens baixadas abaixo de 1080 px.
- **Folga entre o texto e o selo:** 13 px em 360, 15 px em 390 e mais de 130 px no tablet.

### Prints

Em `shots/quiz-respostas/`:
- contato em 360: `360-dados.png`;
- P1 no tablet: `768-p1.png` e `1024-p1.png`;
- as outras etapas nas 5 telas;
- `zoom-1440.png`.

## Perguntas / pendências

1. **Hub:** a colagem volta no meio do vídeo (perto de 8 s, 16 s, 28 s e 48 s; ver `relatorios/tarja.md`). Se incomodar, a saída é reexportar um trecho limpo só para o quiz.
