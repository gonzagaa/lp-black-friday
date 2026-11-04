# Cache busting: LP e quiz

**Problema:** em produção, o HTML novo carregava CSS e JS antigos, presos no cache.

**Solução:** todo arquivo local sai com `?v=<versão do deploy>`, e o `.htaccess` passa a mandar cabeçalhos de cache coerentes com isso.
- O HTML sempre revalida.
- Os arquivos versionados ficam em cache por 1 ano, como `immutable`.

Commit `ajuste: cache busting (?v= em tudo, cabeçalhos de cache)`, sem push. **Versão deste commit:** `202611040959`.

## O que foi feito

### 1. A versão: um lugar só, um script para espalhar

- **`js/versao.js`:** guarda a versão (`export const VERSAO`) e o helper `comVersao(url)`, que acrescenta `?v=` antes do `#`.
- **`scripts/versao.mjs`** (`npm run versao`):
  - **Versão:** sem argumento, usa a data e a hora de Brasília (`AAAAMMDDHHMM`); também aceita uma versão dada (`npm run versao -- 2026110415`).
  - **O que grava:** a versão em `js/versao.js` e o `?v=` em:
    - **HTML** (`index.html` e `quiz/index.html`):
      - `src`, `href`, `srcset` (cada candidato), `poster`, `data-src` e `data-poster`;
      - a `og:image` do próprio domínio;
      - `url()` em estilo inline.
    - **CSS** (`css/**`, `quiz/*.css`): os `url()` de fontes, grão e texturas.
    - **JS** (`js/**`, `quiz/*.js`): os `import ... from`, o `import '...'` e o `import()` entre módulos.
  - **Modo `--conferir`:** não grava nada. Lista qualquer referência local sem `?v=`, ou com outra versão, e sai com erro.
- **O que o script não versiona:**
  - links de página (`.html`, pastas, `#âncoras`);
  - endereços externos (GTM, Pixel, CAPI, Reclame Aqui);
  - `data/planos.json`, buscado com `cache: 'no-cache'` (preços sempre frescos);
  - `quiz/api/lead.php`, sem versão e com `no-store`.
- **Imports com `?v=` em cada arquivo, e não importmap:**
  - funciona em qualquer navegador; o importmap só existe a partir do Safari 16.4;
  - o `--conferir` garante que todo import usa a mesma versão. Isso importa porque o mesmo módulo com dois endereços carregaria duas vezes, cada um com o seu estado.

### 2. Endereços montados em tempo de execução (via `comVersao()`)

- **`js/modulos/comunidade.js`:** vídeos e posters dos cards. A lista `MIDIA` continua com os caminhos limpos; a versão entra só na hora de montar o HTML.
- **`js/modulos/home/carrosselPlanos.js`:** o Swiper (`vendor/swiper-11.2.10/…`). Anotei a mudança no cabeçalho do porte.
- **`js/modulos/rolagem.js`:** o Lenis.
- **`quiz/palco.js`:** vídeos (o `?v=` fica antes do `#t=2.8`), posters, pré-carga do próximo poster e 3D.

### 3. Cabeçalhos (`.htaccess` de `/a-maior-black/`, que vale também para o quiz)

Usei só `mod_headers` com `FilesMatch`, o mesmo que a home usa no ar. Nada de `RewriteEngine`: ele anularia as regras de rewrite das pastas de cima. O `.htaccess` do WordPress na raiz do domínio não foi tocado. As regras de 404 (`RedirectMatch`) continuam iguais.

| O quê | Cabeçalho |
|---|---|
| `*.html` | `Cache-Control: no-cache, must-revalidate` + `X-LiteSpeed-Cache-Control: no-cache` (e sem `Expires`) |
| CSS, JS, imagens, vídeos e fontes | `Cache-Control: public, max-age=31536000, immutable`, com `Header set` (só em 2xx), para um 404 passageiro não ficar um ano em cache |
| `*.json` (`data/planos.json`) | `Cache-Control: no-cache, must-revalidate` |
| Cache de página do LiteSpeed | `<IfModule LiteSpeed> CacheLookup off </IfModule>` |
| `quiz/api/` (`quiz/api/.htaccess`) | `Cache-Control: no-store` (o `lead.php` também manda) |

## Arquivos alterados

**Criados:**
- `js/versao.js`;
- `scripts/versao.mjs`;
- `relatorios/cache.md`.

**Alterados à mão:**
- `.htaccess` e `quiz/api/.htaccess`: os cabeçalhos;
- `js/modulos/comunidade.js`, `js/modulos/home/carrosselPlanos.js`, `js/modulos/rolagem.js` e `quiz/palco.js`: o `comVersao()`;
- `package.json`: o script `versao`;
- `README.md`: a seção "Cache busting", o script na tabela e a configuração de cache;
- `CLAUDE.md`: uma linha em "Verificação".

**Alterados pelo `npm run versao`** (os `?v=`):
- `index.html` e `quiz/index.html`;
- `css/base.css`, `css/componentes.css`, `css/secoes/topo.css` e `css/secoes/planos-black.css`;
- `js/main.js` e os módulos `comunidade`, `contador`, `dados-planos`, `fechamento`, `home/blackPlanos`, `home/carrosselPlanos`, `limite-alta`, `motion-logo`, `rolagem` e `tarja`;
- `quiz/quiz.js` e `quiz/palco.js`.

## Como gerar a versão no próximo deploy

```bash
npm run versao                  # versão nova (data e hora de Brasília)
npm run versao -- --conferir    # opcional: confere se ficou tudo com a versão nova
git add -A
git commit -m "deploy: versão <AAAAMMDDHHMM>"
git push origin master          # e, no cPanel: Git Version Control → Gerenciar → Pull or Deploy → Update from Remote
```

- **Arquivo novo:** basta referenciar normalmente e rodar `npm run versao`.
- **Arquivo gerado regenerado** (`planos.css`, `motion-logo-*.js`, `planos-snapshot.js`): rode `npm run versao` de novo.
- **Só preço ou checkout no `planos.json`:** não precisa de versão nova, porque ele já é buscado sem cache.

## Testes rodados

- **Rede, local** (live-server 5501; LP rolada inteira e quiz em todas as etapas, em 1440 × 900 e 390 × 844, com o `lead.php` interceptado):

| Página | Pedidos locais | Sem `?v=` | Com outra versão | Módulo carregado 2× | 404 | Erros de JS |
|---|---|---|---|---|---|---|
| LP 1440 | 79 (27 scripts, 12 CSS, 6 fontes, 24 imagens, 8 vídeos) | 0 | 0 | 0 | 0 | 0 |
| LP 390 | 75 | 0 | 0 | 0 | 0 | 0 |
| Quiz 1440 | 42 | 0 | 0 | 0 | 0 | 0 |
| Quiz 390 | 36 | 0 | 0 | 0 | 0 | 0 |

  - As exceções esperadas, que saem sem versão, são só o documento HTML, o `data/planos.json` e o `api/lead.php`.
- **A LP funciona como antes:**
  - planos montados (8 checkouts, preços na tela, Swiper armado);
  - Lenis carregado;
  - vídeos da comunidade tocando;
  - tarja contando;
  - menu do mobile abrindo.
- **O quiz funciona como antes:** chega ao sucesso, com o `quiz_lead` no dataLayer.
- **Servidor da subpasta** (`npm run subpasta`): os arquivos com `?v=` respondem 200.
- **`npm test`:** 9 de 9.
- **`npm run versao -- --conferir`:** OK.

## Depois do push + sync, conferir no ar

1. `curl -I https://zero7.com.br/a-maior-black/` e `…/quiz/` precisam mostrar `Cache-Control: no-cache, must-revalidate`.
   - O índice da pasta é o `index.html`; o `FilesMatch` deve pegá-lo.
   - Se não aparecer, me avise: dá para pôr o cabeçalho também pelo `DirectoryIndex`.
2. Um CSS com `?v=` precisa mostrar `Cache-Control: public, max-age=31536000, immutable`.
3. `…/data/planos.json` precisa mostrar `no-cache`, e `…/quiz/api/lead.php` (GET → 405) precisa mostrar `no-store`.
4. A LP e o quiz precisam abrir sem erro 500. Esse `.htaccess` também leva as regras de 404 do commit `2e13ae0`, que ainda não foram conferidas no ar.

## Observações

- Os arquivos sem `?v=` também recebem o `immutable`, porque o `FilesMatch` olha a extensão, não a busca. Hoje nenhuma página pede arquivo local sem versão, e o `--conferir` garante isso.
  - Dava para limitar com `<If "%{QUERY_STRING} =~ /v=/">`, mas não tenho certeza de que o LiteSpeed da TurboCloud aceita `<If>` em `.htaccess`. Por isso fiquei com o padrão que a home já usa no ar.
- A primeira visita depois deste deploy já baixa tudo de novo, porque todas as URLs mudaram. Daí em diante, cada `npm run versao` troca todas as URLs de uma vez.
