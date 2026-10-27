// Contagem de valores em reais (comparativo do card 01 e limite de perda dos planos) e as curvas usadas nela.

// cubic-bezier(x1, y1, x2, y2) como função de t (0–1), igual à do CSS: acha o parâmetro da curva para o x pedido
// (Newton, com bisseção de reserva) e devolve o y
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const x = (u) => ((ax * u + bx) * u + cx) * u;
  const y = (u) => ((ay * u + by) * u + cy) * u;
  const dx = (u) => (3 * ax * u + 2 * bx) * u + cx;
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 6; i++) {
      const d = dx(u);
      if (Math.abs(d) < 1e-6) break;
      u -= (x(u) - t) / d;
    }
    if (u < 0 || u > 1 || Math.abs(x(u) - t) > 1e-4) {
      let a = 0, b = 1;
      u = t;
      for (let i = 0; i < 30; i++) {
        if (x(u) < t) a = u; else b = u;
        u = (a + b) / 2;
      }
    }
    return y(u);
  };
}

// A curva da página (--curva em css/tokens.css)
export const curvaPagina = bezier(0.2, 0, 0, 1);

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
