// Card 01 dos benefícios ("Desconto de 80%"): comparativo de preço do plano Sênior (Mini Índice), com os valores
// do data/planos.json (preço antigo e à vista do modo que a seção de planos abre). Nada de valor no HTML.
// Quando o card entra na tela, a barra da Black encolhe de 100% até a proporção real (CSS, 1,2 s, --curva) e o
// valor conta do normal até o da Black, na mesma curva. Com movimento reduzido, já aparece o estado final.
import { carregarPlanos, modoPadrao } from './dados-planos.js';
import { separarAvista, valorEmReais } from './precos.js';
import { contar, curvaPagina, formatarReais } from './contagem.js';

const PLANO = 'senior';
const DURACAO = 1200;

export async function iniciarComparativo() {
  const cmp = document.querySelector('[data-comparativo]');
  if (!cmp) return;
  const db = await carregarPlanos();
  const cfg = db?.[modoPadrao(db)]?.[PLANO];
  const normal = valorEmReais(cfg?.oldPrice);
  const black = valorEmReais(separarAvista(cfg?.avista)?.valor);
  if (!(normal > 0 && black > 0 && black < normal)) {
    cmp.hidden = true; // sem os dois preços, o card fica como era
    return;
  }

  const fim = black / normal;
  const elBlack = cmp.querySelector('[data-cmp-black]');
  cmp.style.setProperty('--fim', String(fim));
  cmp.querySelector('[data-cmp-normal]').textContent = formatarReais(normal);
  cmp.querySelector('[data-cmp-chip]').textContent = `−${Math.round((1 - fim) * 100)}%`;
  cmp.querySelector('[data-cmp-black-leitor]').textContent = formatarReais(black);

  const final = () => { elBlack.textContent = formatarReais(black); cmp.classList.add('is-fim'); };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    final();
    return;
  }

  elBlack.textContent = formatarReais(normal);
  const io = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    io.disconnect();
    cmp.classList.add('is-fim'); // a transição do CSS leva a barra e o chip até --fim
    contar(elBlack, normal, black, DURACAO, curvaPagina);
  }, { threshold: 0.6 });
  io.observe(cmp);
}
