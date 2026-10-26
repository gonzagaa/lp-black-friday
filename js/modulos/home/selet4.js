/* PORTE de ../Zero7/script/4selet.js (repasse da query string para links de checkout), sem jQuery:
   a mesma lógica, com DOM puro. Roda no mesmo momento que na home (no "ready", antes de o blackPlanos
   preencher os cards).
   Como na home, ele não toca nos CTAs dos planos: no "ready" eles ainda não têm href e a classe do HTML é
   "link4Selet" (com S maiúsculo), que o seletor ".link4selet" não pega. Quem passa a query para os CTAs é o
   withCurrentQueryParams do blackPlanos. Fica aqui para qualquer outro link de checkout que entrar na LP. */

export function iniciarSelet4() {
  document.querySelectorAll('a[href^="https://membros.zero7.com.br/fast-checkout/"]').forEach(link => {
    link.classList.add('link4selet');
  });

  document.querySelectorAll('a[href^="https://app.zero7.com.br/checkout/"]').forEach(link => {
    link.classList.add('link4selet');
  });

  document.querySelectorAll('a[href^="https://app.4st.com.br/checkout/"]').forEach(link => {
    link.classList.add('link4selet');
  });

  document.querySelectorAll('a[href^="https://app.4selet.com.br/checkout/"]').forEach(link => {
    link.classList.add('link4selet');
  });

  const sPageURL = window.location.search.substring(1), sURLVariables = sPageURL.split('&');
  const parametrosGet = sURLVariables.join('&');
  let linkAtribuido = '';

  document.querySelectorAll('.link4selet').forEach(el => {
    const alvo = el.tagName === 'DIV' ? el.querySelector('a') : el.tagName === 'A' ? el : null;
    if (!alvo) return;
    const link = alvo.getAttribute('href');
    if (link === null) return; // (jQuery devolvia undefined e quebrava aqui)
    if (link.toLowerCase().indexOf('origem') >= 0) {
      linkAtribuido = link + '&' + parametrosGet;
    } else {
      linkAtribuido = link + '?' + parametrosGet;
    }
    alvo.setAttribute('href', linkAtribuido);
  });
}
