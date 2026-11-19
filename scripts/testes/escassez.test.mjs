// Testes da % da tarja de escassez (npm test): a regra em vigor do TARJA_ESCASSEZ (js/config.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { valorEscassez } from '../../js/modulos/escassez.js';
import { TARJA_ESCASSEZ } from '../../js/config.js';

const em = (iso) => Date.parse(iso);
const valor = (iso) => valorEscassez(TARJA_ESCASSEZ, em(iso));

test('regra de 19/11: sai de 91% e chega a 100% às 20h em ponto', () => {
  assert.equal(valor('2026-11-19T11:00:00-03:00'), 91); // antes do início, fica na base
  assert.equal(valor('2026-11-19T12:00:00-03:00'), 91);
  assert.equal(valor('2026-11-19T12:53:19-03:00'), 91);
  assert.equal(valor('2026-11-19T12:53:21-03:00'), 92);
  assert.equal(valor('2026-11-19T16:00:00-03:00'), 95);
  assert.equal(valor('2026-11-19T19:59:59-03:00'), 99); // 100 só no fim, nunca antes
  assert.equal(valor('2026-11-19T20:00:00-03:00'), 100);
  assert.equal(valor('2026-11-19T23:59:59-03:00'), 100); // depois do fim, fica no teto
  assert.equal(valor('2026-11-25T12:00:00-03:00'), 100);
});

test('a % nunca desce e sobe no máximo 1 ponto por minuto', () => {
  let anterior = valor('2026-11-19T11:00:00-03:00');
  for (let t = em('2026-11-19T11:00:00-03:00'); t <= em('2026-11-19T21:00:00-03:00'); t += 60 * 1000) {
    const v = valorEscassez(TARJA_ESCASSEZ, t);
    assert.ok(v >= anterior && v - anterior <= 1, `${new Date(t).toISOString()}: ${anterior} → ${v}`);
    anterior = v;
  }
});

test('fixo congela o valor e base null volta a partir do real', () => {
  assert.equal(valorEscassez({ ...TARJA_ESCASSEZ, fixo: 91 }, em('2026-11-19T20:00:00-03:00')), 91);
  // sem base, a rampa parte do real (3100 / 4000 = 77,5%)
  assert.equal(valorEscassez({ ...TARJA_ESCASSEZ, base: null }, em('2026-11-19T11:00:00-03:00')), 77);
});
