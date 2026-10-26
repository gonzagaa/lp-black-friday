// Logo animada da campanha no fechamento (Motion V02 do brand kit, portado em motion-logo-core.js).
// Carregado com import() pelo fechamento.js só quando a seção está a ~600 px da tela; não roda com movimento
// reduzido (lá fica o quadro final estático, assets/marca/completa-escuro.svg).
// - preparar(): troca a imagem estática pelo SVG no instante 0 (vazio: o ingresso ainda não entrou);
// - tocar(): toca UMA vez, gerando o SVG quadro a quadro com requestAnimationFrame, e para no quadro final, nítido
//   (a partir de 5,11 s o motion está parado; o resto dos 9 s do vídeo é a cartela). Sem som.
import { createMotion } from './motion-logo-core.js';
import CENA from './motion-logo-cena.js';

const FIM = 5.11;

export function criarLogoAnimada(lugar) {
  const motion = createMotion(CENA);
  let quadro = null;

  const desenhar = (t) => { lugar.innerHTML = motion.svg(t); };

  return {
    preparar() {
      desenhar(0);
    },
    tocar() {
      if (quadro !== null) return;
      const inicio = performance.now();
      const passo = (agora) => {
        const t = (agora - inicio) / 1000;
        if (t >= FIM) {
          desenhar(motion.duration); // quadro final: sem desfoque nem reflexo
          lugar.classList.add('is-final');
          return;
        }
        desenhar(t);
        quadro = requestAnimationFrame(passo);
      };
      quadro = requestAnimationFrame(passo);
    },
  };
}
