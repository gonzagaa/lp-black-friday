// Contagem de valores em reais (limite de perda dos planos) e a curva usada nela.

// Desacelerando (ease-out cúbico)
export const desacelerar = (t) => 1 - (1 - t) ** 3;

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// 3047 -> "R$ 3.047,00" (com espaço comum, como no planos.json)
export const formatarReais = (n) => BRL.format(n).replace(/ /g, ' ');

// Conta de "de" até "para" em "ms", escrevendo em el.textContent. Devolve uma função que cancela.
export function contar(el, de, para, ms, curva, aoTerminar) {
  const inicio = performance.now();
  let pedido = 0;
  const quadro = (agora) => {
    const t = Math.min(1, (agora - inicio) / ms);
    el.textContent = formatarReais(Math.round((de + (para - de) * curva(t)) * 100) / 100);
    if (t < 1) pedido = requestAnimationFrame(quadro);
    else if (aoTerminar) aoTerminar();
  };
  pedido = requestAnimationFrame(quadro);
  return () => cancelAnimationFrame(pedido);
}
