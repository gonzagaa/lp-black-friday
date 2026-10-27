# Preços da Black (P2)

## O que foi feito

Fonte: a planilha do cliente "Planos Black 80% OFF 29/10 até 30/11", enviada no chat.

**`data/planos.json`, modo ativo `60dias`:**

- O "Preço taxado" da planilha é o `oldPrice` que já estava nesse modo, plano por plano. Por isso os valores entraram nele.
- Troquei só o à vista, o 12x e o checkout dos 8 planos (24 valores). O formato do arquivo ficou como estava.
- Os modos `30dias` e `reinicio` estão inativos e não foram tocados.
- O `maxDias` ("ilimitado*") e a nota do modo continuam iguais.

| Plano | De | 12x | À vista | Checkout | Desconto real | Limite de perda total |
|---|---|---|---|---|---|---|
| Trainee | R$ 627,00 | R$12,54 | R$125,40 | `…/checkout/7abf87` | 80,00% | R$ 1.200,00 |
| Júnior | R$ 917,00 | R$18,34 | R$183,40 | `…/checkout/9c42c1` | 80,00% | R$ 2.500,00 |
| Pleno | R$ 1.837,00 | R$36,74 | R$367,40 | `…/checkout/f1d2bb` | 80,00% | R$ 6.500,00 |
| Sênior | R$ 3.047,00 | R$60,94 | R$609,40 | `…/checkout/b01235` | 80,00% | R$ 15.000,00 |
| Expert | R$ 4.867,00 | R$97,34 | R$973,40 | `…/checkout/e5460e` | 80,00% | R$ 17.500,00 |
| Master | R$ 5.937,00 | R$118,74 | R$1.187,40 | `…/checkout/a44fc5` | 80,00% | R$ 22.500,00 |
| BIT 8 (`bit_trainee`) | R$ 627,00 | R$12,54 | R$125,40 | `…/checkout/f6981b` | 80,00% | R$ 1.200,00 |
| BIT 16 (`bit_junior`) | R$ 917,00 | R$18,34 | R$183,40 | `…/checkout/fb0bae` | 80,00% | R$ 2.500,00 |

O desconto real agora é exatamente 80%. A etiqueta "80% OFF" passou a bater com os preços; antes dava ~77%.

**"Limite de perda total":**

- O chip é HTML portado da home, não vem do `planos.json`.
- Os valores da Black entraram como troca no `scripts/portar-planos-html.mjs` (`PERDA_TOTAL_BLACK`), então um novo porte não os perde.
- Rodei o porte de novo: o diff do `index.html` mudou só os 8 chips.
- Os outros chips (operação, WIN/WDO, perda diária, meta de aprovação, repasse) continuam os da home.

**Outras mudanças:**

- **`js/modulos/planos-snapshot.js`:** regenerado (`npm run planos:snapshot`). É o fallback que a página usa se o fetch do JSON falhar.
- **`js/config.js`:** `BLACK_FIM = '2026-11-30T23:59:59-03:00'`, com a data da planilha. A hora segue com `TODO: confirmar` (P1). O contador continua fora da página.
- **Correção encontrada na conferência (`css/secoes/planos-black.css`):**
  - nos cards do Bitcoin, até 768 px, o chip "Repasse" vazava: "100% em conta real" não cabe no chip de 1/3 e o `nowrap` da Fase 4 cortava o texto;
  - acontecia com os valores antigos também;
  - agora o último chip pode quebrar a linha ("100% em / conta real"); os valores em R$ continuam numa linha.
- **`PROMPTS-LP-BLACK.md`:** P2 resolvida; P1 com a data recebida.

## Arquivos criados/alterados

- **Criado:** `relatorios/precos-black.md`.
- **Alterados:**
  - `data/planos.json`;
  - `js/modulos/planos-snapshot.js`;
  - `index.html` (8 chips);
  - `scripts/portar-planos-html.mjs`;
  - `css/secoes/planos-black.css`;
  - `js/config.js`;
  - `PROMPTS-LP-BLACK.md`.

## Capturas (shots/precos-black/)

- `planos-indice-1440.png`;
- `planos-bitcoin-1440.png`;
- `planos-indice-390.png`;
- `planos-bitcoin-390.png`.

## Checagens rodadas

**Na tela** (`localhost:5501/?utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e`, 1440 e 390):

- os 8 cards mostram os valores da tabela acima;
- os hrefs saem com a UTM e o `sck` uma vez só. Exemplos:

```
Sênior: https://app.zero7.com.br/checkout/b01235?utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e&sck=a|b|c|d|e
BIT 8:  https://app.zero7.com.br/checkout/f6981b?utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e&sck=a|b|c|d|e
```

**Chips** (texto × caixa, nos dois mercados, de 360 a 1920):

- sem vazamento de 390 a 1920;
- em 360, os valores longos (R$ 15.000,00 e os antigos R$ 14.997,00) avançam 1 px no recuo interno do chip, sem sair dele. Já era assim antes.

**Testes e aceite:**

- `npm test`: 8 de 8 passando.
- `node scripts/medir-planos.mjs`: só os itens de preço saem de ±2 px ("12x", valor, "ou", "à vista"). É esperado: os valores são outros que os da home e o texto centralizado muda de largura. Cards e chips continuam no lugar.
- O Bitcoin em 390 diverge da home de propósito, como antes.

## Perguntas / pendências

1. **Meta de aprovação:** a planilha só traz o "Limite de perda total". Com os novos valores, a meta da home ficou **menor** que o limite em todos os planos. Exemplo: Sênior com limite de R$ 15.000,00 e meta de R$ 9.997,00. A meta (e a perda diária) também muda na Black?
2. **Hora de término (P1):** 30/11 até que horas? Usei 23:59 (Brasília).
3. **Nota do card:** "*Plataforma gratuita por 60 dias. Após, cobrança mensal." (é a nota do modo 60 dias) continua valendo para os planos da Black?
4. **"Máximo de dias" = "ilimitado*"** (vem do mesmo modo): confirma?
