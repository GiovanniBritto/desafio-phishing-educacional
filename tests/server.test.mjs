import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { request as httpRequest } from 'node:http';
import { startServer } from '../server.mjs';

let lab;
before(async () => { lab = await startServer({ port: 0 }); });
after(async () => {
  lab.server.closeAllConnections();
  await new Promise(resolve => lab.server.close(resolve));
});

function post(body, headers = {}) {
  return fetch(`${lab.url}/api/simulacao`, {
    method: 'POST',
    headers: { Origin: lab.url, 'Content-Type': 'application/json', ...headers },
    body,
  });
}

test('servidor escuta somente em 127.0.0.1', () => {
  assert.equal(lab.server.address().address, '127.0.0.1');
});

test('página e assets carregam com política restritiva', async () => {
  for (const route of ['/', '/index.html', '/styles.css', '/app.js', '/favicon.svg']) {
    const response = await fetch(`${lab.url}${route}`);
    assert.equal(response.status, 200, route);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match(response.headers.get('content-security-policy'), /form-action 'none'/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  }
  const html = await (await fetch(lab.url)).text();
  assert.match(html, /PÁGINA DE TREINAMENTO/);
  assert.doesNotMatch(html, /<(input|form|textarea)\b/i);
});

test('evento permitido devolve apenas exemplo fixo, sem persistência', async () => {
  const response = await post(JSON.stringify({ cenario: 'dados-ficticios' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'simulado',
    origem_dos_dados: 'exemplo fixo do servidor',
    exemplo: { usuario: 'aluno@example.test', senha: 'SENHA_FICTICIA_123' },
    persistido: false,
  });
});

test('campos extras e valores arbitrários são rejeitados sem serem refletidos', async () => {
  for (const body of [
    { cenario: 'dados-ficticios', senha: 'VALOR_DE_TESTE_REJEITADO' },
    { usuario: 'VALOR_DE_TESTE_REJEITADO' },
    { cenario: 'VALOR_DE_TESTE_REJEITADO' },
    [], null, 'VALOR_DE_TESTE_REJEITADO',
  ]) {
    const response = await post(JSON.stringify(body));
    assert.equal(response.status, 400);
    assert.doesNotMatch(await response.text(), /VALOR_DE_TESTE_REJEITADO/);
  }
});

test('origens externas e ausentes são bloqueadas', async () => {
  const response = await post('{"cenario":"dados-ficticios"}', { Origin: 'https://example.test' });
  assert.equal(response.status, 403);
  const noOrigin = await fetch(`${lab.url}/api/simulacao`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"cenario":"dados-ficticios"}',
  });
  assert.equal(noOrigin.status, 403);
});

test('Host arbitrário é bloqueado', async () => {
  const status = await new Promise((resolve, reject) => {
    const req = httpRequest(lab.url, { headers: { Host: 'example.test' } }, response => {
      response.resume();
      response.once('end', () => resolve(response.statusCode));
    });
    req.once('error', reject);
    req.end();
  });
  assert.equal(status, 403);
});

test('arquivos privados, rotas desconhecidas e travessia não são servidos', async () => {
  for (const route of ['/README.md', '/server.mjs', '/.git/config', '/%2e%2e/README.md', '/nao-existe']) {
    const response = await fetch(`${lab.url}${route}`);
    assert.equal(response.status, 404, route);
    assert.doesNotMatch(await response.text(), /import.*node:http|MIT License/);
  }
});

test('método incorreto, JSON inválido e formato incorreto são rejeitados', async () => {
  assert.equal((await fetch(`${lab.url}/api/simulacao`)).status, 405);
  assert.equal((await post('{')).status, 400);
  assert.equal((await post('cenario=dados-ficticios', { 'Content-Type': 'application/x-www-form-urlencoded' })).status, 415);
});

test('corpo acima de 256 bytes é rejeitado', async () => {
  const response = await post(JSON.stringify({ cenario: 'x'.repeat(300) }));
  assert.equal(response.status, 413);
});

test('HEAD mantém headers sem enviar o conteúdo da página', async () => {
  const response = await fetch(lab.url, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.ok(Number(response.headers.get('content-length')) > 0);
  assert.equal(await response.text(), '');
});
