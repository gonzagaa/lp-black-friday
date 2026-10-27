/* Tracking da LP, além da cópia da home que está no index.html (GTM na primeira interação, Pixel + CAPI).

   1. sck nos links do checkout: o getParams é o da home (../Zero7/index.html, script do prefix
      "https://app.4st.com.br"), sem o console.log, e gera o mesmo &sck=utm_source|utm_medium|utm_campaign|utm_term|utm_content.
      Duas diferenças, as duas pedidas:
      - prefixos: o da home + "https://app.zero7.com.br/checkout", que é o domínio dos checkouts do planos.json
        (na home, só com o 4st, o sck não chega a nenhum checkout);
      - momento: a home roda uma vez sobre os <a> do HTML. Aqui o href dos CTAs dos planos é montado (e remontado a
        cada troca de modo/mercado) pelo blackPlanos, que já repassa a query string inteira (withCurrentQueryParams).
        Então este módulo só acrescenta o sck, depois de cada href novo (MutationObserver), e nunca duas vezes.
   2. Clique nos CTAs: dataLayer.push({ event: 'cta_click', cta }) para todo [data-cta]. Sem preventDefault. */

const PREFIX = ['https://app.4st.com.br', 'https://app.zero7.com.br/checkout'];

function getParams() {
  let t = '',
    e = window.top.location.href,
    r = new URL(e);
  if (null != r) {
    let a = r.searchParams.get('utm_source'),
      n = r.searchParams.get('utm_medium'),
      o = r.searchParams.get('utm_campaign'),
      m = r.searchParams.get('utm_term'),
      c = r.searchParams.get('utm_content'); - 1 !== e.indexOf('?') && (t = `&sck=${a}|${n}|${o}|${m}|${c}`);
  }
  return t;
}

function acrescentarSck(link) {
  const href = link.getAttribute('href');
  if (!href || href.includes('sck=') || !PREFIX.some((p) => href.indexOf(p) === 0)) return;
  const sck = getParams();
  if (!sck) return;
  // Sem query no href (não deveria acontecer: com UTM na página o blackPlanos já pôs "?..."), o sck abre a query
  link.setAttribute('href', href.includes('?') ? href + sck : href + '?' + sck.slice(1));
}

export function iniciarTracking() {
  if (window.location.search) {
    document.querySelectorAll('a[href]').forEach(acrescentarSck);
    new MutationObserver((mudancas) => {
      mudancas.forEach((m) => {
        if (m.type === 'attributes') { if (m.target.tagName === 'A') acrescentarSck(m.target); return; }
        m.addedNodes.forEach((no) => {
          if (no.nodeType !== 1) return;
          if (no.tagName === 'A') acrescentarSck(no);
          no.querySelectorAll('a[href]').forEach(acrescentarSck);
        });
      });
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
  }

  document.addEventListener('click', (e) => {
    const cta = e.target.closest && e.target.closest('[data-cta]');
    if (!cta) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'cta_click', cta: cta.dataset.cta });
  }, true);
}
