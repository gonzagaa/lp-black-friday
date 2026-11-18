// Tarja de escassez da LP: "Os planos da Black Friday estão acabando" + o medidor da % dos planos vendidos.
// O número segue uma rampa até quinta (TARJA_ESCASSEZ em js/config.js; a fórmula está comentada lá). Recalcula ao
// abrir a página e a cada 60 s, pelo relógio do navegador. Na entrada, o preenchimento anima de 0 até o valor (CSS).
// ativo: false esconde a tarja e zera --tarja-altura (html.tarja-encerrada): a nav volta ao topo.
// Acessibilidade: o medidor é role="progressbar" com aria-valuenow e aria-valuetext ("78% dos planos vendidos").
import { TARJA_ESCASSEZ } from '../config.js?v=202611181532';

const MINUTO = 60 * 1000;

// Valor exibido (inteiro de 0 a teto) num instante. Exportado para os testes de data.
export function valorEscassez(cfg, agora) {
  if (cfg.fixo != null) return cfg.fixo; // congelado no config
  const real = (cfg.vendidos / cfg.meta) * 100;
  const inicio = Date.parse(cfg.inicio);
  const fim = Date.parse(cfg.fim);
  const x = Math.min(1, Math.max(0, (agora - inicio) / (fim - inicio)));
  const rampa = real + (cfg.teto - real) * (1 - Math.pow(1 - x, cfg.curva));
  return Math.max(0, Math.min(cfg.teto, Math.round(Math.max(real, rampa))));
}

export function iniciarEscassez() {
  const tarja = document.querySelector('[data-escassez]');
  if (!tarja) return;

  if (!TARJA_ESCASSEZ.ativo) {
    tarja.hidden = true;
    document.documentElement.classList.add('tarja-encerrada');
    return;
  }

  const medidor = tarja.querySelector('[role="progressbar"]');

  // --mx: onde o medidor começa na tela. O brilho do laranja usa a mesma animação do reflexo da tarja (mesma duração,
  // curva e atraso, em transform) e se desloca por --mx, para os dois serem o mesmo feixe passando (css/escassez.css)
  const posicao = () => tarja.style.setProperty('--mx', `${Math.round(medidor.getBoundingClientRect().left)}px`);
  posicao();
  if ('ResizeObserver' in window) new ResizeObserver(posicao).observe(tarja);
  else window.addEventListener('resize', posicao, { passive: true });
  const numeros = tarja.querySelectorAll('[data-escassez-pct]');

  function atualizar(entrada = false) {
    const pct = valorEscassez(TARJA_ESCASSEZ, Date.now());
    // --p é a fonte única do medidor (o preenchimento e a ponta derivam dela; css/escassez.css)
    const largura = () => tarja.style.setProperty('--p', `${pct}%`);
    // na entrada, o valor vai depois da primeira pintura (com 0%), para a transição do CSS animar de 0 até ele
    if (entrada) requestAnimationFrame(() => requestAnimationFrame(largura));
    else largura();
    numeros.forEach((el) => { el.textContent = String(pct); });
    medidor.setAttribute('aria-valuenow', String(pct));
    medidor.setAttribute('aria-valuetext', `${pct}% dos planos vendidos`);
    tarja.dataset.pronto = '';
  }

  atualizar(true);
  setInterval(atualizar, MINUTO);
}
