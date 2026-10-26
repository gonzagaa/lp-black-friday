// Serve a LP como ela vai ficar em produção, numa subpasta: http://localhost:5502/a-maior-black/
// Tudo fora de /a-maior-black/ responde 404, então um caminho absoluto ("/css/...") quebra aqui como quebraria em
// https://zero7.com.br/a-maior-black/. Uso: node scripts/servir-subpasta.mjs [--porta=5502]
// (O live-server --mount não serviu a pasta no Windows e ainda devolveria 200 para caminhos absolutos.)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIXO = '/a-maior-black/';
const PORTA = Number((process.argv.find((a) => a.startsWith('--porta=')) || '').split('=')[1] || 5502);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

createServer(async (req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (caminho === '/a-maior-black') { res.writeHead(301, { Location: PREFIXO }); return res.end(); }
  if (!caminho.startsWith(PREFIXO)) { res.writeHead(404); return res.end('fora da subpasta'); }
  let arquivo = normalize(join(RAIZ, caminho.slice(PREFIXO.length)));
  if (!arquivo.startsWith(RAIZ + sep) && arquivo !== RAIZ) { res.writeHead(403); return res.end(); }
  try {
    if ((await stat(arquivo)).isDirectory()) arquivo = join(arquivo, 'index.html');
    const corpo = await readFile(arquivo);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo).toLowerCase()] || 'application/octet-stream' });
    res.end(corpo);
  } catch {
    res.writeHead(404);
    res.end('não encontrado');
  }
}).listen(PORTA, () => console.log(`LP em http://localhost:${PORTA}${PREFIXO} (fora da subpasta: 404)`));
