// Contador DD D : HH H : MM M : SS S até BLACK_FIM. Ao zerar, mostra "Encerrada" e para.
// SEM USO POR ENQUANTO: saiu da hero por ajuste do cliente (Fase 2) e não é importado no main.js.
// Pode voltar na barra fixa mobile da Fase 6 (decisão pendente). Para usar, importe iniciarContador
// no main.js e coloque na página uma estrutura assim (os números são preenchidos aqui):
//
//   <div class="cd" role="timer" aria-label="Termina em" data-contador>
//     <span aria-hidden="true">Termina em</span>
//     <b aria-hidden="true"><span data-d>00</span><small>D</small></b> ... data-h, data-m, data-s
//     <b class="cd__fim" aria-hidden="true">Encerrada</b>
//   </div>
//
// O elemento ganha data-pronto quando os números e a Barlow estão prontos (esconda até lá, para não haver CLS),
// e a classe cd--encerrada ao zerar.
// Acessibilidade: nada de aria-live por segundo. O role="timer" leva um aria-label com o texto
// completo, atualizado só quando o minuto muda.
import { BLACK_FIM } from '../config.js';

const dois = (n) => String(n).padStart(2, '0');
const quantos = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

function textoCompleto(dias, horas, minutos) {
  const partes = [];
  if (dias) partes.push(quantos(dias, 'dia', 'dias'));
  if (dias || horas) partes.push(quantos(horas, 'hora', 'horas'));
  partes.push(quantos(minutos, 'minuto', 'minutos'));
  const lista = partes.length > 1 ? `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}` : partes[0];
  return `Termina em ${lista}`;
}

export function iniciarContador() {
  const contador = document.querySelector('[data-contador]');
  if (!contador) return;

  const fim = Date.parse(BLACK_FIM);
  if (Number.isNaN(fim)) {
    console.warn('BLACK_FIM inválido em js/config.js:', BLACK_FIM);
    return;
  }

  const campo = (nome) => contador.querySelector(`[data-${nome}]`);
  const campos = { d: campo('d'), h: campo('h'), m: campo('m'), s: campo('s') };
  const escrever = (el, valor) => { if (el.textContent !== valor) el.textContent = valor; };
  let minutoAnunciado = null;
  let espera;

  function encerrar() {
    clearTimeout(espera);
    contador.classList.add('cd--encerrada');
    contador.setAttribute('aria-label', 'Encerrada');
  }

  function atualizar() {
    const faltaMs = fim - Date.now();
    if (faltaMs <= 0) {
      encerrar();
      return;
    }
    const falta = Math.ceil(faltaMs / 1000);
    const dias = Math.floor(falta / 86400);
    const horas = Math.floor((falta % 86400) / 3600);
    const minutos = Math.floor((falta % 3600) / 60);

    escrever(campos.d, dois(dias));
    escrever(campos.h, dois(horas));
    escrever(campos.m, dois(minutos));
    escrever(campos.s, dois(falta % 60));

    const minutoAtual = Math.floor(falta / 60);
    if (minutoAtual !== minutoAnunciado) {
      minutoAnunciado = minutoAtual;
      contador.setAttribute('aria-label', textoCompleto(dias, horas, minutos));
    }

    // Próxima virada de segundo, recalculando do relógio (não acumula atraso)
    espera = setTimeout(atualizar, (faltaMs % 1000) + 20);
  }

  atualizar();

  // Só aparece com a Barlow já carregada: se ela trocasse com o contador visível, a largura mudaria (CLS)
  const fonte = document.fonts.load('700 22px "Barlow Condensed"');
  const limite = new Promise((pronto) => setTimeout(pronto, 3000));
  Promise.race([fonte, limite]).finally(() => { contador.dataset.pronto = ''; });
}
