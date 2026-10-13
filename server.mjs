import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HOST = '127.0.0.1';
const MAX_BODY_BYTES = 256;
const ASSETS = new Map([
  ['/', ['dist/index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['dist/index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['dist/styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['dist/app.js', 'text/javascript; charset=utf-8']],
  ['/favicon.svg', ['dist/favicon.svg', 'image/svg+xml']],
]);

function reply(response, status, contentType, body, headOnly = false) {
  response.writeHead(status, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  response.end(headOnly ? undefined : body);
}

function json(response, status, body) {
  reply(response, status, 'application/json; charset=utf-8', JSON.stringify(body));
}

function readSmallBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    request.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });
    request.on('end', () => {
      if (tooLarge) rejectBody(Object.assign(new Error('Corpo excede o limite.'), { status: 413 }));
      else resolveBody(Buffer.concat(chunks).toString('utf8'));
    });
    request.on('error', rejectBody);
    request.on('aborted', () => rejectBody(new Error('Requisição interrompida.')));
  });
}

export async function startServer({ port = 8765 } = {}) {
  const assets = new Map(await Promise.all([...ASSETS].map(async ([route, [path, type]]) => [
    route, { type, body: await readFile(new URL(path, import.meta.url)) },
  ])));

  const server = createServer(async (request, response) => {
    // O endereço de escuta é fixo em loopback. Host/Origin também são validados.
    const expectedHost = `${HOST}:${server.address().port}`;
    if (request.headers.host !== expectedHost) {
      request.resume();
      return json(response, 403, { erro: 'Host fora do laboratório local.' });
    }

    if ((request.method === 'GET' || request.method === 'HEAD') && assets.has(request.url)) {
      const asset = assets.get(request.url);
      return reply(response, 200, asset.type, asset.body, request.method === 'HEAD');
    }

    if (request.url !== '/api/simulacao') {
      request.resume();
      return json(response, 404, { erro: 'Recurso não encontrado.' });
    }
    if (request.method !== 'POST') {
      request.resume();
      return json(response, 405, { erro: 'Use POST para executar a simulação.' });
    }
    if (request.headers.origin !== `http://${expectedHost}`) {
      request.resume();
      return json(response, 403, { erro: 'Origem fora do laboratório local.' });
    }
    if (request.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
      request.resume();
      return json(response, 415, { erro: 'O cenário usa application/json.' });
    }

    try {
      const raw = await readSmallBody(request);
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        return json(response, 400, { erro: 'JSON inválido.' });
      }
      if (!payload || Array.isArray(payload) || typeof payload !== 'object'
          || Object.keys(payload).length !== 1 || payload.cenario !== 'dados-ficticios') {
        return json(response, 400, { erro: 'Apenas o identificador do cenário fictício é aceito.' });
      }

      // Estes valores são constantes ilustrativas. Nenhuma credencial vem da requisição.
      return json(response, 200, {
        status: 'simulado',
        origem_dos_dados: 'exemplo fixo do servidor',
        exemplo: { usuario: 'aluno@example.test', senha: 'SENHA_FICTICIA_123' },
        persistido: false,
      });
    } catch (error) {
      if (!response.destroyed) {
        json(response, error.status === 413 ? 413 : 400, {
          erro: error.status === 413 ? 'Corpo excede 256 bytes.' : 'Requisição interrompida.',
        });
      }
    }
  });
  server.requestTimeout = 5000;
  server.headersTimeout = 5000;
  server.timeout = 5000;
  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(port, HOST, resolveListen);
  });
  return { server, url: `http://${HOST}:${server.address().port}` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.LAB_PORT ?? '8765');
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    console.error('LAB_PORT deve ser um inteiro entre 1024 e 65535.');
    process.exitCode = 1;
  } else {
    try {
      const { server, url } = await startServer({ port });
      console.log(`Laboratório local: ${url}`);
      console.log('Dados fictícios. Para encerrar: Ctrl+C.');
      const stop = () => server.close(() => process.exit(0));
      process.once('SIGINT', stop);
      process.once('SIGTERM', stop);
    } catch (error) {
      console.error(error.code === 'EADDRINUSE'
        ? 'Porta ocupada. Escolha outra porta usando LAB_PORT.'
        : 'Não foi possível iniciar o laboratório local.');
      process.exitCode = 1;
    }
  }
}
