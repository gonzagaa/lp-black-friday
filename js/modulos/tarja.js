// Tarja fixa no topo com o timer de 24 horas, como a da home ("Essa oferta se encerra em:"). O prazo é sempre o
// próximo 23:59:59 de Brasília, todo dia, até BLACK_FIM (js/config.js), a mesma regra dos prazosPromo da home.
// Depois do último prazo, a tarja some e a nav volta ao topo (html.tarja-encerrada zera --tarja-altura).
// Usada pela LP (js/main.js) e pelo quiz (quiz/quiz.js). Estilo em css/tarja.css.
// Acessibilidade: os números são aria-hidden; o role="timer" leva o texto completo, atualizado só quando o minuto
// muda (nada de leitura a cada segundo). Na LP a tarja é um link (<a href="#planos">): o nome do link é o mesmo texto
// + "Ver os planos.".
import { BLACK_FIM, TARJA_HORA_DIARIA, TARJA_PULAR } from '../config.js?v=202611161611';

const BRASILIA = -3 * 60 * 60 * 1000; // UTC−3, sem horário de verão desde 2019
const DIA = 24 * 60 * 60 * 1000;
const dois = (n) => String(n).padStart(2, '0');
const quantos = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

// Próximo prazo diário (hoje ou amanhã às TARJA_HORA_DIARIA, em Brasília), pulando os dias de TARJA_PULAR, limitado ao
// fim da Black
function proximoPrazo(agora, fim) {
  const [h, m, s] = TARJA_HORA_DIARIA.split(':').map(Number);
  const local = new Date(agora + BRASILIA); // os campos UTC deste Date são a data e a hora de Brasília
  let prazo = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), h, m, s) - BRASILIA;
  if (prazo <= agora) prazo += DIA;
  const dia = (t) => new Date(t + BRASILIA).toISOString().slice(0, 10);
  while (TARJA_PULAR.includes(dia(prazo))) prazo += DIA;
  if (prazo > fim) prazo = fim;
  return prazo > agora ? prazo : null;
}

function textoCompleto(horas, minutos) {
  const partes = [];
  if (horas) partes.push(quantos(horas, 'hora', 'horas'));
  partes.push(quantos(minutos, 'minuto', 'minutos'));
  return `Essa oferta se encerra em ${partes.join(' e ')}`;
}

export function iniciarTarja() {
  const tarja = document.querySelector('[data-tarja]');
  if (!tarja) return;

  const fim = Date.parse(BLACK_FIM);
  if (Number.isNaN(fim)) {
    console.warn('BLACK_FIM inválido em js/config.js:', BLACK_FIM);
    return;
  }

  const relogio = tarja.querySelector('[role="timer"]');
  const campos = ['d', 'h', 'm', 's'].map((n) => tarja.querySelector(`[data-${n}]`));
  let ultimoMinuto = -1;
  let intervalo = null;

  function encerrar() {
    clearInterval(intervalo);
    tarja.hidden = true;
    document.documentElement.classList.add('tarja-encerrada');
  }

  function tique() {
    const agora = Date.now();
    const prazo = proximoPrazo(agora, fim);
    if (!prazo) {
      encerrar();
      return;
    }
    const falta = Math.floor((prazo - agora) / 1000);
    const dias = Math.floor(falta / 86400);
    const horas = Math.floor((falta % 86400) / 3600);
    const minutos = Math.floor((falta % 3600) / 60);
    const segundos = falta % 60;
    tarja.classList.toggle('tarja--com-dias', dias > 0); // no celular, os dias só aparecem quando passam de 0
    [dias, horas, minutos, segundos].forEach((v, i) => {
      const t = dois(v);
      if (campos[i] && campos[i].textContent !== t) campos[i].textContent = t;
    });
    const minutoTotal = Math.floor(falta / 60);
    if (minutoTotal !== ultimoMinuto) {
      ultimoMinuto = minutoTotal;
      const texto = textoCompleto(dias * 24 + horas, minutos);
      relogio.setAttribute('aria-label', texto);
      if (tarja.tagName === 'A') tarja.setAttribute('aria-label', `${texto}. Ver os planos.`);
    }
    tarja.dataset.pronto = '';
  }

  tique();
  if (!tarja.hidden) intervalo = setInterval(tique, 1000);
}
