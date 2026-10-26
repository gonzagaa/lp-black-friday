// Gera assets/texturas/planos-grafico.svg: o gráfico de candles enorme do fundo da seção de planos (branco; a
// opacidade de 3–4% fica no CSS). Determinístico (semente fixa). Uso: node scripts/gerar-grafico-planos.mjs
import { writeFileSync } from 'node:fs';

let seed = 5;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const W = 1600, H = 640, N = 46, passo = W / N, larg = 18;
let preco = 540, corpos = '', pavios = '';
for (let i = 0; i < N; i++) {
  const abre = preco;
  const alvo = 520 - 360 * (i / (N - 1)) + 70 * Math.sin(i / 4.2);
  const fecha = abre + (alvo - abre) * .45 + (rnd() - .5) * 90;
  const alto = Math.min(abre, fecha) - rnd() * 46 - 8;
  const baixo = Math.max(abre, fecha) + rnd() * 46 + 8;
  const x = i * passo + (passo - larg) / 2;
  const topo = Math.min(abre, fecha), alt = Math.max(4, Math.abs(fecha - abre));
  pavios += `M${(x + larg / 2 - 1).toFixed(1)} ${alto.toFixed(1)}h2v${(baixo - alto).toFixed(1)}h-2z`;
  if (fecha < abre) corpos += `<rect x="${x.toFixed(1)}" y="${topo.toFixed(1)}" width="${larg}" height="${alt.toFixed(1)}"/>`;
  else corpos += `<rect x="${(x + 1).toFixed(1)}" y="${(topo + 1).toFixed(1)}" width="${larg - 2}" height="${(alt - 2).toFixed(1)}" fill="none" stroke="#fff" stroke-width="2"/>`;
  preco = fecha + (rnd() - .5) * 6;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" fill="#fff"><path d="${pavios}"/>${corpos}</svg>\n`;
writeFileSync(new URL('../assets/texturas/planos-grafico.svg', import.meta.url), svg);
