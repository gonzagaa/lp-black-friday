// Dados dos planos (data/planos.json, PLANOS_URL em js/config.js) para a LP inteira: uma requisição só, dividida
// entre a seção de planos (blackPlanos.js), o comparativo do card 01 dos benefícios e o limite de perda dos cards.
// Se o fetch falhar (ou o JSON vier sem modo ativo), vale o snapshot embutido, como antes no blackPlanos.
import { PLANOS_URL } from '../config.js';
import SNAPSHOT from './planos-snapshot.js';

let promessa = null;

function modosAtivos(db) {
  const modos = Array.isArray(db?.config?.modes) ? db.config.modes : [];
  return modos.filter((m) => m && m.active === true && m.id).map((m) => String(m.id));
}

export function carregarPlanos() {
  if (!promessa) {
    promessa = (async () => {
      try {
        const res = await fetch(PLANOS_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error('Falha ao carregar planos.json');
        const db = await res.json();
        if (!modosAtivos(db).length) throw new Error('planos.json sem modo ativo');
        return db;
      } catch (erro) {
        console.warn(`[planos] Não consegui usar ${PLANOS_URL} (${erro.message}). Usando o snapshot embutido.`);
        return SNAPSHOT;
      }
    })();
  }
  return promessa;
}

// O modo que a seção de planos abre: o defaultMode, se estiver ativo; senão, o primeiro ativo (regra do blackPlanos)
export function modoPadrao(db) {
  const ativos = modosAtivos(db);
  return ativos.includes(db?.config?.defaultMode) ? db.config.defaultMode : ativos[0];
}
