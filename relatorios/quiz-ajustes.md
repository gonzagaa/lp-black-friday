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

## Perguntas / pendências

1. **360 × 740:** a P4 passa 11 px da tela. Quer que eu ajuste o 360 também, por exemplo com o vídeo de 250 px só nessa largura?
2. **Tablet (768–1079 px):** o selo fica na moldura e o 3D sai, como descrito acima. Ok?
3. **Hub:** a colagem volta no meio do vídeo (perto de 8 s, 16 s, 28 s e 48 s; ver `relatorios/tarja.md`). Se incomodar, a saída é reexportar um trecho limpo só para o quiz.
