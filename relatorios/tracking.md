# Tracking: mesmo da home (tarefa avulsa)

## O que foi feito

| # | Trecho | Origem (`../Zero7/index.html`, só leitura) | Destino na LP | Mudança |
|---|---|---|---|---|
| 1 | GTM no `<head>` com o comentário C5: `dataLayer` antes de tudo e `gtm.js?id=GTM-KCJQPMC` injetado só na **primeira interação** (pointerdown, touchstart, keydown, scroll ou mousemove; `once`, `passive`, `capture`) | linhas 15–44 | `index.html` 31–60, no lugar do comentário `<!-- TRACKING: … -->` | Nenhuma: cópia literal, por script |
| 2 | `<noscript>` do GTM (iframe `ns.html?id=GTM-KCJQPMC`) | linhas 1926–1929 | `index.html` 95–98, logo depois do `<body>` | Só o lugar. Na home ele fica perto do fim do `<body>`; aqui vai logo no começo, como pedido. O texto e até o comentário "(noscriptt)" são os da home. |
| 3 | Pixel + API de Conversões: `window.__eventID`, `pixelReady` + `safeTrackPageView` (até 20 tentativas de 150 ms), `getFbp`, `getFbc` e `sendCapiPageView` (POST para `https://backend-api-zero7.vercel.app/api/send-event` com o mesmo `event_id`, no DOMContentLoaded) | linhas 2000–2062 (os dois `<script>`) | `index.html` 834–895, no fim do `<body>` | Saíram só os 3 `console.*` (detalhe abaixo) |
| 4 | UTM + sck nos links do checkout | linhas 2064–2084 (`prefix` + `getParams`) | `js/modulos/tracking.js` | Adaptado (detalhe abaixo) |
| 5 | `cta_click`: listener delegado em `document` que faz `dataLayer.push({ event: 'cta_click', cta })` para todo `[data-cta]` | adição nossa | `js/modulos/tracking.js` | Sem `preventDefault`, na fase de captura, sem esperar nada |

O `iniciarTracking()` é o primeiro módulo chamado em `js/main.js`.

**Os 3 `console.*` retirados do item 3:**

- o `console.log('📤 Pixel PageView enviado…')`;
- o `.then(d => console.log('📥 Resposta API Facebook:', d))`;
- o `.catch(e => console.error(…))`, que virou `.catch(function () {})`. Ele continua engolindo o erro como na home, então nenhuma promessa fica sem tratamento. A lógica é a mesma.

### Item 4: sck no checkout

**O que a LP já fazia:** o `withCurrentQueryParams` do `blackPlanos.js` (porte da home) já repassa a query string inteira para o href de cada CTA de plano, quando monta o card a partir do `planos.json`. O `selet4.js` (porte do `4selet.js`) não toca nesses CTAs, igual à home.

**O problema do script da home:**

- ele só age em links que começam com `https://app.4st.com.br`;
- todos os checkouts do `planos.json` (home e LP) são `https://app.zero7.com.br/checkout/…`;
- ele roda uma vez, quando os hrefs dos planos ainda não existem.

Por isso, hoje, **o sck não chega a nenhum checkout na home**. Perguntei, e a decisão foi incluir `app.zero7.com.br`.

**Como ficou no `tracking.js`:**

- `getParams` igual ao da home (sem o `console.log(t)`); gera `&sck=utm_source|utm_medium|utm_campaign|utm_term|utm_content`;
- prefixos: `https://app.4st.com.br` (o da home) + `https://app.zero7.com.br/checkout`;
- como a query já foi repassada pelo `withCurrentQueryParams`, este módulo **só acrescenta o sck**. O href final tem o mesmo formato que o script da home produziria (`checkout?<query da página>&sck=…`);
- um `MutationObserver` em `href` e em nós novos aplica o sck a cada href que o `blackPlanos` montar ou remontar (troca de modo ou de mercado);
- link que já tem `sck=` não é tocado, então nunca duplica;
- sem query string na página, não faz nada (o `getParams` da home devolve vazio).

## Arquivos criados/alterados

**Criados:**

- `js/modulos/tracking.js`;
- `relatorios/tracking.md`.

**Alterados:**

- `index.html` (itens 1–3);
- `js/main.js` (chama `iniciarTracking()`);
- `CLAUDE.md` (regra 11);
- `PROMPTS-LP-BLACK.md` (P7 resolvida);
- `README.md` (seção de tracking; CSP no servidor).

Nada foi alterado em `../Zero7`. O Zendesk não entrou. O selo do Reclame Aqui continua como estava.

## Teste de UTM

URL: `http://localhost:5501/?utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e`

Hrefs finais, em 1440:

```
Sênior:  https://app.zero7.com.br/checkout/bb0320?utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e&sck=a|b|c|d|e
BIT 8:   https://app.zero7.com.br/checkout/02aff1?utm_source=a&utm_medium=b&utm_campaign=c&utm_term=d&utm_content=e&sck=a|b|c|d|e
```

- **Os 8 CTAs** (6 do índice e 2 do Bitcoin), em 1440 e em 390, têm exatamente 1 `sck=` e 1 `utm_source=`.
- **Troca de mercado** (Bitcoin e de volta): continua com 1 sck.
- **Remontagem do href** (o `blackPlanos` reescreve o link numa troca de modo): o sck volta 1 vez, sem duplicar.
- Hoje o `planos.json` só tem o modo 60 dias ativo, então a troca de modo não aparece na tela. Por isso simulei a remontagem.

## Checagens rodadas

Teste automatizado em 1440 e 390 (`localhost:5501`). No teste, o `gtm.js` e o POST do `send-event` foram **interceptados** (respostas vazias), para não mandar PageView falso para o Google e para o Meta.

| Checagem | 1440 | 390 |
|---|---|---|
| `gtm.js` 3 s depois do load, sem interação | **0 pedidos** | **0 pedidos** |
| `gtm.js` depois de mouse, roda e Tab | **1 pedido** | **1 pedido** |
| POST `send-event` | 1, no DOMContentLoaded | 1, no DOMContentLoaded |
| `event_id` do POST × `window.__eventID` | **iguais** (`_k7oroe3wb`) | **iguais** (`_z83gv5pnk`) |
| `dataLayer[0]` | `{"gtm.start":…, "event":"gtm.js"}` | igual |
| `cta_click` (hero, depois um plano) | `["hero", "plano-pleno"]` | `["hero", "plano-senior"]` |
| Navegação depois do clique | hero rolou até `#planos`; plano abriu o checkout em nova aba | igual |
| Erros no console (fora o selo do RA) | nenhum | nenhum |

- O POST levava `{"event_name":"PageView","event_id":"_k7oroe3wb","fbp":"fb.1.…","fbc":"","email":"anonimo@teste.com"}`.
- O `defaultPrevented: true` que aparece no clique da hero é da rolagem suave da âncora (`rolagem.js`/`nav.js`, de antes). O `tracking.js` não chama `preventDefault`.

**CORS da API (sem interceptar):**

- O preflight do `send-event` responde `Access-Control-Allow-Origin: https://zero7.com.br`.
- Em localhost, o navegador bloqueia o POST e o console mostra `Access to fetch … blocked by CORS policy` + `net::ERR_FAILED`. É esperado; em produção, no domínio zero7.com.br, passa.
- O mesmo erro faz o Lighthouse dar boas práticas 96 em vez de 100 (`errors-in-console`) só em localhost.

**Pixel:** a home não tem o código base do Pixel (`fbevents.js`) no HTML. Ele vem pelo container do GTM.

- Com o GTM só na primeira interação, o `safeTrackPageView` tenta por ~3 s depois do DOMContentLoaded.
- Se a pessoa não interagir nesse tempo, o PageView do Pixel com o `eventID` não sai por esse script.
- O PageView da API de Conversões sai sempre.
- É exatamente o comportamento da home, que o comentário C5 descreve. Não mexi.

## Lighthouse mobile (servidor gzip, `localhost:5502/a-maior-black/`)

A máquina estava com carga variável durante as medições: o `benchmarkIndex` do Lighthouse foi de 575 a 1757. TBT e nota oscilam com isso. Os números estão com o índice de cada rodada.

| Rodada | Bench | Perf | LCP | TBT | Peso | Terceiros na carga |
|---|---|---|---|---|---|---|
| Antes 1 | 1517 | 88 | 3,34 s | 116 ms | 366 KiB | nenhum |
| Antes 2 | 1162 | 64 | 3,44 s | 1214 ms | 366 KiB | nenhum |
| Antes 3 | 1119 | 67 | 3,35 s | 1029 ms | 366 KiB | nenhum |
| Depois 1 | 1757 | 74 | 3,55 s | 575 ms | 369 KiB | só o `send-event` (bloqueado por CORS) |
| Depois 2 | 1481 | 71 | 3,62 s | 654 ms | 369 KiB | idem |
| Depois 3 | 576 | 41 | 4,72 s | 2400 ms | 369 KiB | idem (máquina sob carga) |

**Rodadas intercaladas** (mesmas condições), para separar o efeito do POST da CAPI:

| Variante | LCP (3 rodadas) | TBT |
|---|---|---|
| Com tracking | 3,6 / 3,7 / 3,6 s | 1400 / 830 / 810 ms |
| Com o `send-event` bloqueado | 3,4 / 3,4 / 3,5 s | 810 / 760 / 1000 ms |

- **GTM:** não entrou em nenhuma rodada do Lighthouse, que não interage com a página. Fica fora da janela inicial.
- **Peso da primeira dobra:** 366 → 369 KiB (+3 KiB: os scripts inline e o `tracking.js`).
- **LCP simulado:** sobe ~0,2 s (3,4 → 3,6 s). O POST da CAPI sai no DOMContentLoaded, e o Lighthouse conta a conexão com `backend-api-zero7.vercel.app` como parte da carga inicial. É o momento da home, mantido como pedido.
- **TBT:** a diferença entre as variantes está dentro do ruído da máquina. O `tracking.js` e os scripts inline não aparecem nas tarefas longas, que continuam sendo `nav.js`, `blackPlanos.js` e `planosAtivo.js`, como antes.

**Carga real com rede e CPU limitadas** (Chrome via CDP, 1,6 Mbps, 150 ms, CPU 4×, 390 × 844, sem interação):

| Medida | Resultado |
|---|---|
| LCP (H1) | 2,16 / 2,46 / 2,67 / 2,61 s |
| POST da CAPI | 3,6–5,5 s, sempre **depois** do LCP |
| Terceiro antes do LCP | nenhum |

- Com a máquina mais lenta agora, o mesmo teste da Fase 6 (que deu ~2,0 s) fica nessa faixa.
- **CLS:** a CLS segue abaixo da meta de 0,05. Mas, quando o GTM real carrega (o teste rola até os planos, e a rolagem dispara o GTM, que puxa 14 pedidos: Meta, Google Ads, DoubleClick), ele disputa a rede lenta com o Swiper dos planos. Em 2 de 3 cargas, a etiqueta 3D voltou a dar um deslocamento de 0,016. Com os terceiros bloqueados, 0.

## Perguntas / pendências

1. **POST da CAPI no DOMContentLoaded:** custa ~0,2 s no LCP simulado do Lighthouse, não no real. Mantive como na home. Se quiser, dá para mandar no `load` ou em idle, sem mudar o `event_id`. Só faço com pedido.
2. **Domínio do CORS:** a API aceita só `https://zero7.com.br`. Se a LP também abrir em `www.zero7.com.br`, o POST da CAPI vai falhar lá. Vale confirmar com quem mantém o backend.
3. **Mesmo bug na home:** o script do sck da home não chega aos checkouts dela (prefixo 4st × checkouts app.zero7). Fica registrado; a home não foi alterada.
