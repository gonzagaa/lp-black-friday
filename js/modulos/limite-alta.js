/* "Limite de perda total" subindo: PORTE da ideia de ../Zero7/script/limiteAlta.js (efeito criado na home no commit
   5bedb6b; marcação no .chip em 750f810; tirado dos cards da home em 5665cd4), com a pele da Black
   (css/secoes/planos-black.css). Quando o card entra na tela, o valor volta para o padrão (o da home), dá uma
   piscada e conta até o da Black (1,4 s, desacelerando); no fim, a seta acende e a célula ganha a borda laranja.
   Mesmos tempos e mesmos estados da home (is-antigo → is-queda → is-subindo → is-alta). Diferenças, só estas:
   - os dois valores vêm do planos.json (limitePerdaTotal: padrao e black), nunca do HTML (regra 2);
   - roda em todas as larguras (na home, só a partir de 1080 e depois do LCP);
   - a piscada é de opacidade, não vermelha, e o "verde da alta" é o laranja da marca (regra 3 do CLAUDE.md);
   - a seta tem o lugar reservado desde o início (só opacity e transform), para o valor não andar (CLS 0);
   - roda de novo na troca de mercado: o bloco que some volta ao valor padrão e anima quando reaparecer.
   Como na home: uma vez por card, quando ele aparece de verdade (inclusive ao arrastar o carrossel); quem já está
   na tela ao carregar fica no valor final; sem IntersectionObserver ou com movimento reduzido, nada anima. */
import { carregarPlanos } from './dados-planos.js';
import { contar, desacelerar, formatarReais } from './contagem.js';
import { valorEmReais } from './precos.js';

const ESPERA = 900;  // ms no valor padrão antes da piscada
const QUEDA = 450;   // ms da piscada
const SUBIDA = 1400; // ms da contagem até o valor da Black
const ESTADOS = ['is-antigo', 'is-queda', 'is-subindo', 'is-alta'];

export async function iniciarLimiteAlta() {
  const caixas = [...document.querySelectorAll('#planos .chip.limite-alta')];
  if (!caixas.length) return;
  const db = await carregarPlanos();
  const limites = db?.limitePerdaTotal || {};

  const itens = new Map();
  caixas.forEach((caixa) => {
    const l = limites[caixa.closest('.card[data-plan]')?.dataset.plan];
    const el = caixa.querySelector('.limite-alta__valor');
    if (!l || !el) return;
    el.textContent = l.black; // estado final, enquanto nada anima
    const de = valorEmReais(l.padrao);
    const para = valorEmReais(l.black);
    if (para > de) itens.set(caixa, { el, de, para, final: l.black, relogios: [], cancelar: null });
  });

  if (!itens.size || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const trocar = (caixa, estado) => {
    caixa.classList.remove(...ESTADOS);
    if (estado) caixa.classList.add(estado);
  };

  const naTela = (caixa) => {
    const r = caixa.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  };

  function parar(item) {
    item.relogios.forEach(clearTimeout);
    item.relogios = [];
    if (item.cancelar) item.cancelar();
    item.cancelar = null;
  }

  function animar(caixa) {
    const item = itens.get(caixa);
    reservar(item);
    item.relogios.push(setTimeout(() => {
      trocar(caixa, 'is-queda');
      item.relogios.push(setTimeout(() => {
        trocar(caixa, 'is-subindo');
        item.cancelar = contar(item.el, item.de, item.para, SUBIDA, desacelerar, () => {
          item.cancelar = null;
          item.el.textContent = item.final;
          trocar(caixa, 'is-alta');
        });
      }, QUEDA));
    }, ESPERA));
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      observador.unobserve(entrada.target);
      animar(entrada.target);
    });
  }, { threshold: 0.6 });

  // volta ao valor padrão e espera o card aparecer
  function preparar(caixa) {
    const item = itens.get(caixa);
    parar(item);
    item.el.textContent = formatarReais(item.de);
    trocar(caixa, 'is-antigo');
    observador.observe(caixa);
  }

  // A caixa do valor fica com a largura do valor da Black, e o texto alinhado à esquerda: durante a contagem
  // ("R$ 9.997,00" → "R$ 15.000,00") nada se move (CLS 0). Mede com o valor final escrito, no mesmo quadro (sem
  // piscar); os cards do mercado escondido são medidos quando aparecem.
  function reservar(item) {
    if (item.el.style.minWidth) return;
    const atual = item.el.textContent;
    item.el.textContent = item.final;
    const largura = item.el.getBoundingClientRect().width;
    item.el.textContent = atual;
    if (largura) item.el.style.minWidth = `${Math.ceil(largura)}px`;
  }
  itens.forEach(reservar);

  itens.forEach((_, caixa) => {
    if (!naTela(caixa)) preparar(caixa);
  });

  // troca de mercado (Mini Índice ↔ Bitcoin): o bloco escondido volta ao padrão
  document.querySelectorAll('#planos .plano-asset').forEach((bloco) => {
    new MutationObserver(() => {
      if (!bloco.hidden) return;
      bloco.querySelectorAll('.chip.limite-alta').forEach((caixa) => {
        if (itens.has(caixa)) preparar(caixa);
      });
    }).observe(bloco, { attributes: true, attributeFilter: ['hidden'] });
  });
}
