# LP Black Friday Zero7 2026

Landing page da Black Friday 2026 da Zero7 Tesouraria, publicada em **https://zero7.com.br/a-maior-black/**.

É feita em HTML, CSS e JS puros. Não tem framework nem etapa de build: o que está commitado é o que vai para o servidor.

## Como rodar

```bash
npm install                    # só para as ferramentas de desenvolvimento (a página não depende de nada do node_modules)
npx playwright install chromium   # uma vez, para capturas e testes
npm run dev                    # http://localhost:5501  (live-server, recarrega ao salvar)
```

Outros comandos:

| Comando | Para quê |
|---|---|
| `npm run subpasta` | Serve a página como em produção: http://localhost:5502/a-maior-black/. Tudo fora da subpasta dá 404 e o texto vai comprimido em gzip. Use antes de publicar e para medir com o Lighthouse. |
| `npm run shots -- <rotulo>` | Captura a página inteira em 360, 390, 768, 1024, 1280, 1440 e 1920 px e salva em `shots/<rotulo>/`. |
| `npm run planos:snapshot` | Regenera `js/modulos/planos-snapshot.js` a partir de `data/planos.json`. **Rode sempre que o planos.json mudar.** |
| `npm test` | Testes de `scripts/testes/`. |

## Publicação (Git Version Control do cPanel)

A LP publica como a home: push no GitHub (`gonzagaa/lp-black-friday`, branch `master`) e, no cPanel, **Git™ Version Control → Gerenciar → Pull or Deploy → Update from Remote**. Não há `.cpanel.yml`: o clone é a própria pasta pública (`/home7/zero7/public_html/a-maior-black`), então **tudo o que está commitado vai para o ar**.

O que a página usa: `index.html`, `css/`, `js/`, `data/`, `assets/`, `vendor/` e `quiz/` (o quiz, em /a-maior-black/quiz/; ver "Quiz" abaixo).

O resto do repositório também sobe, mas o `.htaccess` da raiz faz responder **404** (`RedirectMatch 404`, como a home):

- `_referencia/`, `_brandkit/`, `_videos-fora-do-site/`, `relatorios/`, `scripts/`, `shots/` e `node_modules/`;
- todo `*.md` (`CLAUDE.md`, `PROMPTS-LP-BLACK.md`, `README.md`);
- `package.json`, `package-lock.json` e `componentes.html`;
- `error_log` e todo `*.log`, em qualquer pasta (o log do PHP do quiz nasce em `quiz/api/`);
- dotfiles e dotpastas (`.gitignore`, `.git/`, `.htaccess`…), menos `.well-known/`.

Nada que a página carrega pode ficar nessas pastas. Arquivo de teste ou temporário que não deve ir ao ar não entra em commit.

### Cache busting: rode `npm run versao` antes de cada deploy

Todo arquivo local que a LP e o quiz carregam sai com `?v=<versão>`: CSS, módulos JS (inclusive os `import` entre eles), fontes, imagens, vídeos, posters, ícones e a `og:image`. O servidor manda esses arquivos com cache de um ano (`immutable`), e o HTML com `no-cache` (`.htaccess`). Então a versão nova só chega se a versão mudar.

```bash
npm run versao                  # versão = data e hora de Brasília (AAAAMMDDHHMM); grava em js/versao.js e em todos os ?v=
npm run versao -- --conferir    # só confere: lista referência local sem ?v= (ou com outra versão) e sai com erro
git add -A && git commit -m "deploy: versão <AAAAMMDDHHMM>"   # depois: push e "Update from Remote" no cPanel
```

- A versão mora num lugar só, `js/versao.js` (`VERSAO`). O script `scripts/versao.mjs` a espalha pelo HTML, pelo CSS e pelos imports. Não edite os `?v=` à mão.
- Os endereços que o JS monta em tempo de execução usam `comVersao()` de `js/versao.js`: vídeos e posters da comunidade e do quiz, 3D do quiz, Swiper e Lenis.
- **Ficam sem versão:**
  - `data/planos.json`, buscado com `no-cache` (servido com `no-cache`);
  - `quiz/api/lead.php` (`no-store`).
- **Arquivo novo:** basta referenciar normalmente e rodar `npm run versao`. O `--conferir` acusa o que tiver ficado sem versão.
- **Arquivo gerado regenerado** (`css/secoes/planos.css`, `js/modulos/motion-logo-*.js`, `js/modulos/planos-snapshot.js`): rode `npm run versao` de novo.

Todos os caminhos da página são relativos, então ela funciona em qualquer subpasta.

Em `assets/3d/`, a página usa só uma parte dos elementos 3D do brand kit. Os outros 82 arquivos dessa pasta sobem junto, mas não são pedidos pela página.

Configuração recomendada no servidor:

- **Compressão** gzip ou brotli para HTML, CSS, JS, JSON e SVG. Sem ela, a página pesa cerca de 620 KB em vez de 365 KB.
- **Cache** (já no `.htaccess` da pasta): HTML com `no-cache, must-revalidate` e o cache de página do LiteSpeed desligado; CSS, JS, imagens, vídeos e fontes, todos com `?v=`, com `public, max-age=31536000, immutable`; `data/planos.json` com `no-cache`; `quiz/api/` com `no-store`. Ver "Cache busting" acima.
- **Vídeos** (`.mp4`, `.webm`) servidos com suporte a `Range` (o padrão de Apache e Nginx).
- **Sem bloquear o tracking:** a página chama `www.googletagmanager.com` e `backend-api-zero7.vercel.app`. Se o servidor mandar um Content-Security-Policy, ele precisa liberar esses domínios e os que o container do GTM carrega (Meta, Google Ads).
- **Tipos MIME** para `.avif` (`image/avif`), `.webp`, `.webm` e `.woff2` (`font/woff2`).

Depois de publicar, confira:

- a aba de rede, que não deve ter nenhum 404;
- o PageSpeed Insights do endereço final;
- o selo do Reclame Aqui no rodapé. Ele só carrega em zero7.com.br; em localhost aparece um erro de CORS no console, e isso é esperado.

## Onde editar cada coisa

| O quê | Onde |
|---|---|
| Preços, checkout, modo (30/60 dias, reinício) e prazo de cada plano | `data/planos.json`. Depois, rode `npm run planos:snapshot`, que gera o fallback usado se o fetch falhar. **Nunca escreva preço ou URL de checkout no HTML.** |
| Data de término da Black e endereço do planos.json | `js/config.js` (`BLACK_FIM` e `PLANOS_URL`). |
| Tarja do topo (timer de 24 horas, só o quiz desde 16/11) | HTML no topo do `quiz/index.html` (para desligar, apague o bloco), estilo em `css/tarja.css`, lógica em `js/modulos/tarja.js`. Zera todo dia às `TARJA_HORA_DIARIA` (23:59:59) até o `BLACK_FIM`, os dois em `js/config.js`. |
| Tarja de escassez da LP ("Os planos da Black Friday estão acabando" + % vendidos) | `TARJA_ESCASSEZ` em `js/config.js` (ver "Tarja de escassez" abaixo). Estilo em `css/escassez.css`, lógica em `js/modulos/escassez.js`. |
| Cards e vídeos da comunidade | Array `MIDIA` em `js/modulos/comunidade.js`. Cada item tem `titulo`, `descricao`, `video: { mp4, webm? }` e `poster`. Os vídeos ficam em `assets/video/`, em 9:16, sem som (tocam mudos e em loop). O poster vai em AVIF ou WebP. |
| Textos | `index.html`. Use a copy aprovada palavra por palavra. |
| Cores, raios, degradê da marca e durações | `css/tokens.css`. |
| Pele da seção de planos | `css/secoes/planos-black.css`. O `css/secoes/planos.css` é **gerado** a partir da home (veja abaixo); não edite à mão. |
| Imagem de compartilhamento e favicons | Gerados por `node scripts/gerar-icones-og.mjs`, com o `npm run dev` rodando. |

### Tarja de escassez (LP)

A tarja do topo da LP mostra "Os planos da Black Friday estão acabando" e um medidor com a % dos planos vendidos. Tudo se ajusta em `TARJA_ESCASSEZ`, no `js/config.js`:

```js
export const TARJA_ESCASSEZ = {
  ativo: true,                            // false: a tarja some e a nav volta ao topo
  vendidos: 3100,                         // o número real de planos vendidos
  meta: 4000,                             // o total de planos da Black
  inicio: '2026-11-16T13:35:00-03:00',    // começo da rampa
  fim: '2026-11-19T23:59:59-03:00',       // fim da rampa (depois dele, fica no teto)
  teto: 99,                               // nunca mostra 100
  curva: 1.6,                             // > 1: sobe mais rápido no começo e desacelera perto do fim
};
```

- **Atualizar o número real:** mude só `vendidos`. A tarja mostra o maior entre o real (`vendidos / meta`) e a rampa. Se o real passar da rampa, vale o real.
- **A rampa:** sai do real no `inicio` e sobe até o `teto` no `fim`: `base + (teto − base) × (1 − (1 − x)^curva)`, com `x` = fração do tempo decorrido. Com os valores de hoje: seg 13:35 → 78%, ter 12h → 86%, qua 12h → 93%, qui 12h → 98%, qui à noite → 99%. Depois do `fim`, fica em 99.
- **Desligar:** `ativo: false`.
- Depois de qualquer mudança, rode `npm run versao` antes do deploy.
- O valor é recalculado ao abrir a página e a cada 60 s, pelo relógio do navegador.
- O quiz continua com a tarja do timer (`css/tarja.css` e `js/modulos/tarja.js`).

### Tracking

O tracking é o mesmo da home (detalhes e origem de cada trecho em `relatorios/tracking.md`):

- **GTM-KCJQPMC** no `<head>`: o `dataLayer` nasce antes de tudo, mas o `gtm.js` só é baixado na primeira interação (toque, tecla, rolagem ou movimento do mouse). O `<noscript>` do GTM fica logo depois do `<body>`.
- **Pixel + API de Conversões** no fim do `<body>`: o `window.__eventID` casa o PageView do Pixel (que vem pelo GTM) com o POST para `https://backend-api-zero7.vercel.app/api/send-event`, enviado no DOMContentLoaded. A API só aceita a origem `https://zero7.com.br`; em localhost o console mostra um erro de CORS, e isso é esperado.
- **`js/modulos/tracking.js`:**
  - acrescenta `&sck=utm_source|utm_medium|utm_campaign|utm_term|utm_content` aos links do checkout, depois que os planos montam o href;
  - põe `{ event: 'cta_click', cta }` no `dataLayer` a cada clique num CTA.

Cada CTA tem um `data-cta`, o valor que vai no `cta_click`:

- `nav`
- `hero`
- `beneficios`
- `plano-trainee`, `plano-junior`, `plano-pleno`, `plano-senior`, `plano-expert`, `plano-master`
- `plano-bit_trainee` e `plano-bit_junior` (os cards BIT 8 e BIT 16 do Bitcoin)
- `fechamento`
- `tarja` (a tarja do topo da LP, que leva para os planos)
- `barra-mobile`

Os CTAs dos planos repassam para o checkout os parâmetros da URL da página (as UTMs), como na home, e o `sck`.

## Scripts de manutenção (`scripts/`)

| Script | O que faz |
|---|---|
| `portar-planos-html.mjs` | Copia o HTML da seção de planos da home (`../Zero7/index.html`, só leitura) para o `index.html`. |
| `portar-planos-css.mjs` | Gera `css/secoes/planos.css` a partir do CSS da home (precisa de rede). |
| `medir-planos.mjs` | Aceite da seção de planos: mede a home e a LP e compara, com tolerância de ±2 px. Em 390 px, o Bitcoin diverge de propósito: a LP não repete o loop defeituoso da home. |
| `portar-motion-logo.mjs` | Gera os módulos da logo animada do fechamento a partir do brand kit. |
| `gerar-icones-og.mjs` | Gera o favicon, o ícone do iOS e a imagem de compartilhamento (1200 × 630). |
| `gerar-grafico-planos.mjs` | Gera o gráfico de candles do fundo dos planos. |
| `imagens.mjs` e `fontes.mjs` | Geram os assets otimizados (AVIF/WebP) e copiam as fontes woff2 (licenças OFL em `assets/fonts/`). |
| `servir-subpasta.mjs` | O servidor de teste em subpasta (`npm run subpasta`). |
| `shots.mjs` | As capturas (`npm run shots`). |
| `snapshot-planos.mjs` | O fallback dos preços (`npm run planos:snapshot`). |
| `diff-rodape.mjs` | Compara os textos e links do rodapé com os da home. |
| `versao.mjs` | O cache busting (`npm run versao`): grava a versão em `js/versao.js` e em todos os `?v=`. Com `--conferir`, só confere. |

Se a home mudar a seção de planos, rode os dois `portar-planos-*` e depois o `medir-planos.mjs`.

## Dependências embutidas

Ficam em `vendor/`, com as licenças:

- **Swiper 11.2.10**, só nos carrosséis de planos e da comunidade, carregado sob demanda;
- **Lenis 1.1.14**, a rolagem suave, desligada com movimento reduzido.

## Quiz (/a-maior-black/quiz/)

Página de quiz integrada à RD Station Marketing. Relatório: `relatorios/quiz.md`.

- **Página:** `quiz/index.html`, `quiz/quiz.css` (tema claro, tokens no escopo `.qz`), `quiz/quiz.js` (fluxo, validação e envio) e `quiz/palco.js` (só visual: o palco de mídia e os segmentos do progresso, pelo evento `quiz:passo`). Usa a base da LP (`../css`, `../assets`) e o mesmo tracking (GTM na primeira interação, Pixel + CAPI). Rodapé: só a linha legal.
- **Palco de mídia:** vídeos e legendas por etapa no objeto `CENAS` de `quiz/palco.js`. Só o vídeo da etapa atual baixa; da próxima, só o poster. Movimento reduzido ou economia de dados: só o poster.
- **Repasse:** `quiz/api/lead.php` recebe o lead e manda para a RD. A chave da RD **nunca** vai para o navegador, para o código ou para o git.
  - Ela fica em `/home7/zero7/config/rd-quiz.php`, fora do `public_html` (criado à mão no Gerenciador de Arquivos, permissão 600; nunca no git). O modelo é `quiz/api/rd-quiz.example.php`.
  - Funciona em PHP 7.4 e 8.x, e precisa da extensão curl.
- **PHP 8.3 só na pasta do quiz:** `quiz/api/.htaccess` (`SetHandler application/x-lsphp83`, LiteSpeed + CloudLinux alt-php), testado no ar. O resto do domínio segue no 7.4.
- **Evento para o GTM:** `quiz_lead` (com `quiz_e_trader` e `quiz_mercado`, sem dado pessoal), para ligar o Lead do Meta e a conversão do Google Ads.
