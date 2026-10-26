// Textos de preço do planos.json: separa as partes para estilizar, sem alterar nenhum valor.
// O JSON traz tudo pronto: "12x R$14,42" e "ou R$144,21 à vista". Aqui só se corta onde estilizar.
// Testes: scripts/testes/precos.test.mjs (npm test).

// "12x R$14,42" -> { parcelas: "12x", valor: "R$14,42" }. Fora desse formato: null.
export function separarParcela(texto) {
  const m = /^\s*(\d+x)\s+(\S.*?)\s*$/i.exec(String(texto ?? ''));
  return m ? { parcelas: m[1], valor: m[2] } : null;
}

// "ou R$144,21 à vista" -> { valor: "R$144,21" }. Fora desse formato: null.
export function separarAvista(texto) {
  const m = /^\s*ou\s+(\S.*?)\s+à vista\s*$/i.exec(String(texto ?? ''));
  return m ? { valor: m[1] } : null;
}

// "R$ 1.119,41" -> 1119.41 (só para conferências, como o % de desconto real; nunca para exibir)
export function valorEmReais(texto) {
  const m = /R\$\s*([\d.]+,\d{2})/.exec(String(texto ?? ''));
  return m ? Number(m[1].replaceAll('.', '').replace(',', '.')) : NaN;
}

// Igual ao withCurrentQueryParams do blackPlanos.js da home: anexa a query string da página ao checkout.
export function comQueryAtual(href, search) {
  const params = String(search ?? '').replace(/^\?/, '');
  if (!params) return href;
  return href + (href.includes('?') ? '&' : '?') + params;
}

// Checkout utilizável: URL absoluta http(s)
export function checkoutValido(href) {
  try {
    const url = new URL(String(href ?? ''));
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}
