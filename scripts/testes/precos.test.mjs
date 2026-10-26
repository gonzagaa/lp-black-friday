// Testes das funções de preço e checkout (npm test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { separarParcela, separarAvista, valorEmReais, comQueryAtual, checkoutValido } from '../../js/modulos/precos.js';

const db = JSON.parse(readFileSync(new URL('../../data/planos.json', import.meta.url), 'utf8'));
const modos = db.config.modes.map((m) => m.id);
const entradas = modos.flatMap((modo) => Object.entries(db[modo] ?? {}).map(([plano, cfg]) => ({ modo, plano, cfg })));

test('o planos.json tem dados para todos os modos declarados', () => {
  assert.ok(entradas.length >= 24);
});

test('parcelado: todo item do JSON separa e, remontado, volta idêntico', () => {
  for (const { modo, plano, cfg } of entradas) {
    const p = separarParcela(cfg.parcel);
    assert.ok(p, `${modo}/${plano}: não separou "${cfg.parcel}"`);
    assert.equal(`${p.parcelas} ${p.valor}`, cfg.parcel, `${modo}/${plano}`);
  }
});

test('à vista: todo item do JSON separa e, remontado, volta idêntico', () => {
  for (const { modo, plano, cfg } of entradas) {
    const a = separarAvista(cfg.avista);
    assert.ok(a, `${modo}/${plano}: não separou "${cfg.avista}"`);
    assert.equal(`ou ${a.valor} à vista`, cfg.avista, `${modo}/${plano}`);
  }
});

test('parcelado: exemplos e formatos inválidos', () => {
  assert.deepEqual(separarParcela('12x R$14,42'), { parcelas: '12x', valor: 'R$14,42' });
  assert.deepEqual(separarParcela('12x R$1.119,41'), { parcelas: '12x', valor: 'R$1.119,41' });
  assert.deepEqual(separarParcela('  12x   R$70,08 '), { parcelas: '12x', valor: 'R$70,08' });
  assert.deepEqual(separarParcela('6X R$ 10,00'), { parcelas: '6X', valor: 'R$ 10,00' });
  assert.equal(separarParcela('R$14,42'), null);
  assert.equal(separarParcela('12x'), null);
  assert.equal(separarParcela(''), null);
  assert.equal(separarParcela(undefined), null);
});

test('à vista: exemplos e formatos inválidos', () => {
  assert.deepEqual(separarAvista('ou R$144,21 à vista'), { valor: 'R$144,21' });
  assert.deepEqual(separarAvista('ou R$1.365,51 à vista'), { valor: 'R$1.365,51' });
  assert.deepEqual(separarAvista('Ou R$ 99,90 À VISTA'), { valor: 'R$ 99,90' });
  assert.equal(separarAvista('R$144,21 à vista'), null);
  assert.equal(separarAvista('ou R$144,21'), null);
  assert.equal(separarAvista(null), null);
});

test('valor em reais (só para conferência)', () => {
  assert.equal(valorEmReais('R$ 627,00'), 627);
  assert.equal(valorEmReais('ou R$1.119,41 à vista'), 1119.41);
  assert.ok(Number.isNaN(valorEmReais('grátis')));
});

test('checkout com a query da página: igual ao withCurrentQueryParams da home', () => {
  const co = 'https://app.zero7.com.br/checkout/469145';
  assert.equal(comQueryAtual(co, ''), co);
  assert.equal(comQueryAtual(co, '?'), co);
  assert.equal(comQueryAtual(co, '?utm_source=teste&utm_campaign=bf26'), `${co}?utm_source=teste&utm_campaign=bf26`);
  assert.equal(comQueryAtual(`${co}?origem=lp`, '?utm_source=teste'), `${co}?origem=lp&utm_source=teste`);
});

test('checkout válido: só URL absoluta http(s)', () => {
  assert.ok(checkoutValido('https://app.zero7.com.br/checkout/469145'));
  assert.ok(checkoutValido('https://zero7.com.br/copa-zero7/'));
  assert.ok(!checkoutValido(''));
  assert.ok(!checkoutValido('/checkout/123'));
  assert.ok(!checkoutValido('javascript:alert(1)'));
  assert.ok(!checkoutValido(undefined));
});
