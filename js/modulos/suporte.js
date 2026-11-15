/* Botão flutuante do suporte (Zendesk Messaging): o mesmo da home, a pedido do cliente (15/11).

   Porte de ../Zero7/index.html (o carregador do "zero7support Zendesk Widget script") e de ../Zero7/script/global.js
   (ligarBotaoDoZendesk). Igual à home:
   - o mesmo snippet, com a mesma key e o id="ze-snippet" (o snippet lê a key na própria tag, por esse id: sem ele,
     "Key is missing from snippet" e nada aparece);
   - o arquivo só entra quando a condição de MOSTRAR o botão fica verdadeira pela primeira vez: quem fica na hero não
     baixa os ~400 KB do widget. Sem IntersectionObserver ele não entra, falhando para o lado seguro (sem botão);
   - quando o zE fica pronto (espera de 150 ms, até 6 s), esconde primeiro, sem condição, e só então segue a página:
     mostra fora da hero e esconde ao voltar para ela. Com a conversa aberta nada se esconde; ao fechá-la, o botão
     volta a seguir a página. Só a API documentada do Messaging: zE('messenger', 'show' | 'hide') e
     zE('messenger:on', 'open' | 'close'). Conta, key, cor, textos e mensagem proativa são os da conta, como na home.

   Duas diferenças, as duas por causa do layout da LP:
   1. A dobra. Na home o botão aparece quando o topo dos benefícios (#ba) sobe da base da tela, para não cobrir o
      texto e o CTA da hero. Aqui os benefícios sobem por cima da hero (--arco) e o topo deles já está na primeira
      dobra (674 px em 390 × 844, 788 px em 1440 × 900): a mesma regra poria o botão na hero. Então a condição é
      "a hero (#topo) saiu da tela", a mesma que faz a barra do mobile aparecer.
   2. A barra do mobile (< 768 px). O lançador (64 px, a 16 px do canto) cairia em cima do "Aproveitar a Black".
      Quando o snippet começa a entrar, o <html> ganha .suporte-ativo e a barra encolhe pela direita, deixando o
      lugar do lançador na mesma linha (css/secoes/barra-mobile.css). Se o snippet falhar, a classe sai e a barra
      volta à largura toda. Nada do widget é estilizado. */

const SNIPPET = 'https://static.zdassets.com/ekr/snippet.js?key=9d7c25de-f931-4cef-9b11-536a3552365d';
const ATIVO = 'suporte-ativo';

export function iniciarSuporte() {
  const hero = document.getElementById('topo');
  if (!hero || !('IntersectionObserver' in window)) return;

  const raiz = document.documentElement;
  let foraDaHero = false; // última leitura do observador
  let entrou = false;
  let armado = false;
  let conversaAberta = false;
  let mostrando = null;

  function aplicar(mostrar) {
    if (!armado || (!mostrar && conversaAberta) || mostrar === mostrando) return;
    mostrando = mostrar;
    window.zE('messenger', mostrar ? 'show' : 'hide');
  }

  function desistir() {
    raiz.classList.remove(ATIVO);
  }

  function armar() {
    // Modo de falha seguro da home: esconde INCONDICIONALMENTE antes de olhar a página. O estado conhecido passa a
    // ser "escondido", e a posição da página decide a partir dali.
    try {
      window.zE('messenger', 'hide');
    } catch (e) {
      desistir();
      return;
    }
    armado = true;
    mostrando = false;
    window.zE('messenger:on', 'open', () => { conversaAberta = true; });
    window.zE('messenger:on', 'close', () => {
      conversaAberta = false;
      aplicar(foraDaHero);
    });
    aplicar(foraDaHero);
  }

  // O load do ARQUIVO não garante o zE: o snippet ainda monta a API depois de executar. Por isso a espera, com teto
  // (sem ele, seria um timer eterno em quem bloqueia o domínio do Zendesk).
  function quandoOzEEstiverPronto(tentativa) {
    if (typeof window.zE === 'function') {
      armar();
      return;
    }
    if (tentativa >= 40) { // 40 × 150 ms = 6 s e desiste
      desistir();
      return;
    }
    setTimeout(() => quandoOzEEstiverPronto(tentativa + 1), 150);
  }

  function carregar() {
    if (entrou) return;
    entrou = true;
    raiz.classList.add(ATIVO);
    const s = document.createElement('script');
    s.id = 'ze-snippet';
    s.src = SNIPPET;
    s.async = true;
    s.addEventListener('load', () => quandoOzEEstiverPronto(0));
    s.addEventListener('error', desistir);
    document.head.appendChild(s);
  }

  // Um observador só, de mão dupla: entra o snippet na primeira saída da hero, mostra fora dela e esconde ao voltar.
  // Quem abre a página direto numa âncora (#planos) já sai daqui com a hero fora da tela.
  new IntersectionObserver(([e]) => {
    foraDaHero = !e.isIntersecting;
    if (foraDaHero) carregar();
    aplicar(foraDaHero);
  }).observe(hero);
}
