# LP Black Friday Zero7 2026

Landing page da Black Friday 2026 da Zero7 Tesouraria, publicada em **https://zero7.com.br/a-maior-black/**.

É feita em HTML, CSS e JS puros. Não tem framework nem etapa de build: o que está na pasta é o que vai para o servidor.

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

## O que vai para o servidor

Envie para a pasta `/a-maior-black/` do site:

```
index.html
css/
js/
data/
assets/
vendor/
```

**Não envie:**

- `_brandkit/`, `_referencia/` e `_videos-fora-do-site/`: material de origem e vídeos fora de uso;
- `shots/` e `relatorios/`: capturas e relatórios das fases;
- `node_modules/`, `scripts/`, `package.json` e `package-lock.json`: ferramentas de desenvolvimento;
- `componentes.html`: vitrine interna dos componentes;
- `CLAUDE.md`, `PROMPTS-LP-BLACK.md` e `README.md`.

Todos os caminhos da página são relativos, então ela funciona em qualquer subpasta.

Em `assets/3d/`, a página usa só uma parte dos elementos 3D do brand kit. Os outros 82 arquivos dessa pasta podem ficar fora do upload sem quebrar nada. Se em dúvida, envie a pasta inteira.

Configuração recomendada no servidor:

- **Compressão** gzip ou brotli para HTML, CSS, JS, JSON e SVG. Sem ela, a página pesa cerca de 620 KB em vez de 365 KB.
- **Cache longo** (por exemplo, `max-age=31536000`) para `assets/fonts/`, `assets/3d/`, `assets/texturas/`, `assets/video/` e `vendor/`.
- **Cache curto ou revalidação** (`no-cache`) para `index.html`, `css/`, `js/` e `data/planos.json`. Os nomes desses arquivos não mudam a cada versão, então um cache longo serviria uma versão velha depois de uma atualização.
- **Vídeos** (`.mp4`, `.webm`) servidos com suporte a `Range` (o padrão de Apache e Nginx).
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
| Cards e vídeos da comunidade | Array `MIDIA` em `js/modulos/comunidade.js`. Cada item tem `titulo`, `descricao` e, se tiver vídeo, `video: { mp4, webm }` e `poster`. Sem `video`, o card mostra "Vídeo em breve". Os vídeos ficam em `assets/video/`, em 9:16, sem som (tocam mudos e em loop). O poster vai em AVIF ou WebP. |
| Textos | `index.html`. Use a copy aprovada palavra por palavra. |
| Cores, raios, degradê da marca e durações | `css/tokens.css`. |
| Pele da seção de planos | `css/secoes/planos-black.css`. O `css/secoes/planos.css` é **gerado** a partir da home (veja abaixo); não edite à mão. |
| Imagem de compartilhamento e favicons | Gerados por `node scripts/gerar-icones-og.mjs`, com o `npm run dev` rodando. |

### Tracking

Nenhum script de terceiros está instalado. O lugar do GTM e do Meta Pixel está marcado no `<head>` com `<!-- TRACKING: GTM/Meta entram aqui -->`.

Cada CTA tem um `data-cta` para os gatilhos de clique:

- `nav`
- `hero`
- `beneficios`
- `plano-trainee`, `plano-junior`, `plano-pleno`, `plano-senior`, `plano-expert`, `plano-master`
- `plano-bit_trainee` e `plano-bit_junior` (os cards BIT 8 e BIT 16 do Bitcoin)
- `fechamento`
- `barra-mobile`

Os CTAs dos planos repassam para o checkout os parâmetros da URL da página (as UTMs), como na home.

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

Se a home mudar a seção de planos, rode os dois `portar-planos-*` e depois o `medir-planos.mjs`.

## Dependências embutidas

Ficam em `vendor/`, com as licenças:

- **Swiper 11.2.10**, só nos carrosséis de planos e da comunidade, carregado sob demanda;
- **Lenis 1.1.14**, a rolagem suave, desligada com movimento reduzido.
