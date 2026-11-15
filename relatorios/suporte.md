# Botão flutuante do suporte (Zendesk)

Pedido do cliente de 15/11: trazer para a LP o mesmo botão flutuante do suporte da home. Commit `ajuste: botão do suporte (Zendesk) igual ao da home`, com push.

## O que foi feito

O botão é o Zendesk Messaging da home, portado de `../Zero7/index.html` (o carregador do snippet) e de `../Zero7/script/global.js` (`ligarBotaoDoZendesk`). A home não foi alterada.

### O que é igual à home

- **Snippet:** o mesmo arquivo, com a mesma key (`9d7c25de-…`) e o mesmo `id="ze-snippet"`. Sem esse id, o snippet não acha a key ("Key is missing from snippet") e nada aparece.
- **Aparência:** cor, ícone, textos e mensagem proativa ("Oi, como posso ajudar?") vêm da conta do Zendesk. Nada do widget é estilizado aqui.
- **Carregamento sob demanda:** o snippet (~400 KB) só é baixado quando a condição de mostrar o botão vale pela primeira vez. Quem fica na hero não baixa nada. Sem IntersectionObserver, o snippet não entra (falha para o lado seguro).
- **Comportamento:**
  - quando o `zE` fica pronto (espera de 150 ms, até 6 s), o botão é escondido primeiro, sem condição, e só então segue a página;
  - ele aparece fora da hero e some ao voltar para ela;
  - com a conversa aberta, nada se esconde. Ao fechar a conversa, o botão volta a seguir a página.
- **API:** só a documentada do Messaging, `zE('messenger', 'show' | 'hide')` e `zE('messenger:on', 'open' | 'close')`.

### O que muda em relação à home (a aprovar)

1. **Quando aparece.** Na home, o botão aparece quando o topo dos benefícios (`#ba`) entra na tela. A ideia era não cobrir o texto e o CTA da hero.
   - Na LP, os benefícios sobem por cima da hero (`--arco`), e o topo deles já está na primeira dobra: 674 px em 390 × 844 e 788 px em 1440 × 900. Com a regra da home, o botão e a mensagem proativa apareceriam na hero logo ao abrir a página.
   - Por isso, aqui a condição é **"a hero (`#topo`) saiu da tela"**, a mesma que faz a barra do mobile aparecer.
2. **Barra fixa do mobile (< 768 px).** O lançador (64 px, a 16 px do canto) caía em cima da seta do "Aproveitar a Black".
   - Agora, quando o snippet começa a carregar, o `<html>` ganha `.suporte-ativo`. A barra encolhe pela direita (`right: 90px`) e o lançador fica ao lado dela, na mesma linha, com o mesmo vão de 10 px.
   - O botão da barra mantém a altura (58 px) e o rótulo em 1 linha, inclusive em 360 px.
   - Se o Zendesk falhar ou estiver bloqueado, a classe sai e a barra volta à largura toda.

## Arquivos criados/alterados

- `js/modulos/suporte.js` (novo): carregador e controle do botão.
- `js/main.js`: importa e chama o `iniciarSuporte()`.
- `css/secoes/barra-mobile.css`: `.suporte-ativo .barra-mobile { right: 90px }`.
- `CLAUDE.md`: a regra 11 dizia "Zendesk não entra". Agora registra o botão do suporte, a pedido do cliente.
- Versão `202611151823` (`npm run versao`). Por isso o `?v=` mudou em todos os arquivos.

## Checagens rodadas

Em http://localhost:5501/ e na subpasta http://localhost:5502/a-maior-black/, em 360 × 640, 390 × 844, 768 × 1024 e 1440 × 900:

| Checagem | Resultado |
|---|---|
| Na hero, ao abrir a página | Nenhum pedido ao Zendesk, sem botão |
| Depois da hero | O snippet entra e o botão aparece |
| Lançador × barra do mobile (360 e 390) | Sem sobreposição. A mensagem proativa fica acima da barra, sem sobrepor |
| De volta à hero | Botão e mensagem escondidos |
| Descendo de novo | O botão volta |
| Abrindo direto em `#planos` | O botão aparece |
| Conversa aberta e subindo até a hero | A janela continua aberta. Fechada ali, o botão fica escondido |
| Zendesk bloqueado | `.suporte-ativo` sai e a barra volta à largura toda (10 → 380 px) |
| 404 locais | Nenhum, inclusive na subpasta |
| Console | Só o 400 do `pageview-notify.rdstation.com.br`, que o GTM carrega na primeira rolagem no localhost (sem relação com o Zendesk), e o CORS da API de Conversões no localhost, que já existiam |
| `npm test` | 9/9 |
| `npm run versao -- --conferir` | OK |

## Perguntas / pendências

1. **Quiz:** o botão entrou só na LP. Ele deve aparecer também no quiz? Lá, ele cobriria os botões do formulário no mobile.
2. **Cor:** o lançador sai azul-marinho, a cor configurada na conta do Zendesk, a mesma da home. Trocar a cor só para a LP exigiria mexer na conta (o que afetaria a home também) ou estilizar o widget por dentro, o que não foi feito.
