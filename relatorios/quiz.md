# Quiz: estrutura e integração RD

Página em `/a-maior-black/quiz/`, com envio para a RD Station Marketing por um repasse em PHP na própria hospedagem. Design fica para depois: aqui é estrutura, conteúdo e integração, com a base visual da LP.

**Nada foi publicado nem enviado para a RD.** Todos os testes rodaram com uma RD falsa local e uma chave falsa.

## Hospedagem

| O quê | Resultado |
|---|---|
| PHP do domínio | **7.4.33**. O 404 do PHP na pasta da LP responde `X-Powered-By: PHP/7.4.33`. O Gustavo confirmou no cPanel: CloudLinux PHP Selector com 7.4 em todos os domínios (não mexer) e cURL ativo; o seletor oferece de 5.1 a 8.5. |
| Servidor web | **LiteSpeed**. O cabeçalho `Server` vem renomeado ("Servidor: Nucleo Brasil Servidores"), mas a resposta traz o `alt-svc` do LiteSpeed (`h3`, `h3-29`) e cabeçalhos `X-LiteSpeed-Cache-Control` e `X-LiteSpeed-Tag`. Handler: `application/x-lsphp83`. |
| `lead.php` | Compatível com **7.4 e 8.x sem mudar uma linha** (revisão abaixo). Funciona no 7.4 que já está no ar; o PHP 8.3 só na pasta é opcional. |

## Teste do PHP 8.3 só na pasta (aguardando o seu ok para publicar)

**O que subir** (cPanel > Gerenciador de Arquivos, na pasta onde a LP está publicada, a mesma do `index.html` da LP):

1. Crie as pastas `quiz/api/`, se ainda não existirem: `a-maior-black/quiz/api/`.
2. Suba **só** estes dois arquivos, a partir de `quiz/api/` deste repositório:
   - `check-2y5cxto7.php`, com o mesmo nome;
   - `htaccess-php83-teste.txt`, e depois renomeie para **`.htaccess`**. Ligue "Mostrar arquivos ocultos" nas Configurações do Gerenciador para ver o arquivo.
3. Abra **uma vez**: `https://zero7.com.br/a-maior-black/quiz/api/check-2y5cxto7.php`.

**O que a checagem mostra:** só 4 linhas, sem `phpinfo()`:

```
PHP: 8.3.x
curl carregado: sim
pasta temporária aceita gravação (file_put_contents): sim
este arquivo foi apagado: sim
```

A última linha quer dizer que o próprio arquivo se apagou ao terminar. Testei numa cópia local: as 3 checagens rodaram e a cópia sumiu.

**O que fazer depois:**

- **Mostrou PHP 8.3, curl "sim" e gravação "sim":** mantenha o `.htaccess` e confira no Gerenciador que o `check-2y5cxto7.php` sumiu. Se o "apagado" veio "NÃO", apague à mão.
- **Erro 500, ou ainda PHP 7.4:** apague o `.htaccess` na hora. Apague também o `check-2y5cxto7.php`, porque com erro 500 ele não chega a rodar nem a se apagar. Seguimos em 7.4. Me avise.
- **Gravação "não":** o limite por IP não consegue contar e deixa os envios passarem (o resto funciona). Nesse caso, defino `pasta_temporaria` na configuração, apontando para uma pasta gravável fora do `public_html`.

Se o PHP 8.3 der certo, o `quiz/api/.htaccess` do repositório (hoje todo comentado) passa a ser a versão ativa.

## O que foi feito

### Página (`quiz/index.html`, `quiz/quiz.css`, `quiz/quiz.js`)

- **Base visual:** a da LP (tokens, base, componentes e rodapé; fundo com a grade de 72 px e o grão; Jakarta no título, Inter no corpo; o `.fbtn` laranja), com o mínimo de estilo próprio.
- **Topo:** logo Zero7 branca, título "Responda 4 perguntas e receba sua oferta da Black." e subtítulo "Leva 30 segundos.".
- **Perguntas:** uma por tela, com barra de progresso, "Pergunta X de 4" e "← Voltar" (a partir da P2). Ao escolher a opção, avança sozinho. As opções são `<button>`.
- **P1 = "Ainda não opero":** pula a P2 e grava a experiência como "Não opera". A contagem vira "Pergunta X de **3**" e a barra se ajusta (ver a pergunta 2).
- **Último passo ("Para onde enviamos sua oferta?"):** Nome, WhatsApp (com DDD), E-mail, a caixa obrigatória de consentimento e o botão "Quero minha oferta".
- **Validação no navegador:**
  - nome com 2 letras ou mais (letras, espaço, apóstrofo, ponto e hífen);
  - WhatsApp com máscara `(DD) 9XXXX-XXXX`, 10 ou 11 dígitos, DDD de 11 a 99 e, com 11 dígitos, começando com 9. Aceita o "+55" colado;
  - e-mail válido;
  - consentimento marcado.
  - O erro aparece em texto ao lado do campo (`aria-invalid`, `aria-describedby`), sem `alert()`, e o foco vai para o primeiro campo errado.
- **Envio:**
  - o botão fica em "Enviando…" e travado;
  - deu certo: tela de sucesso e `dataLayer.push({ event: 'quiz_lead', quiz_e_trader, quiz_mercado })`, sem nenhum dado pessoal;
  - deu erro: "Não conseguimos enviar agora. Tente de novo." e o botão liberado.
- **Sucesso:** "Pronto! Sua oferta está a caminho.", "Entre no grupo e receba as condições da Black antes de todo mundo." e o botão "Entrar no grupo do WhatsApp" (https://chat.whatsapp.com/G9ma9v4zI77BBvvhdswF2r, `data-cta="quiz-whatsapp"`).
- **Origem:** as UTMs (`utm_source/medium/campaign/term/content/id`) e o `fbclid`/`gclid` da URL de entrada ficam guardados na sessão ao abrir a página. O cookie de rastreamento da RD (`_rdtrk`) é lido no envio, e só o id vai, se tiver o formato certo.
- **Acessibilidade:** o foco vai para o título de cada passo; tudo funciona por teclado; o honeypot fica fora do Tab e do leitor de tela.
- **Rodapé:** o mesmo da LP (razão social, CNPJ, avisos legais, selo do Reclame Aqui), copiado do `index.html`. "Home" e "Planos" apontam para `../` e `../#planos`.
- **Tracking:** igual ao da LP, com os blocos copiados do `index.html` sem mudar nada: GTM-KCJQPMC na primeira interação, o noscript logo depois do `<body>` e Pixel + CAPI com o mesmo `window.__eventID`. Mais o `js/modulos/tracking.js` da LP (`cta_click`). Nenhuma tag nova: o `quiz_lead` fica pronto para quem cuida do GTM ligar o Lead do Meta e a conversão do Google Ads.

### Repasse (`quiz/api/lead.php`)

**Entrada:**
- só POST, JSON (415 se não for), corpo de até 10 KB (413);
- se vier `Origin`, ela precisa ser o mesmo host (403).

**Chave da RD:**
- vem de um arquivo **fora da pasta pública**, procurado nesta ordem: a variável `RD_QUIZ_CONFIG`, `<pasta acima do DOCUMENT_ROOT>/config/rd-quiz.php` (no cPanel, `/home/<usuario>/config/rd-quiz.php`) e `~/config/rd-quiz.php`;
- no repositório entra só o modelo `quiz/api/rd-quiz.example.php`. `config/rd-quiz.php` e `rd-quiz.php` estão no `.gitignore`;
- a chave não está em nenhum arquivo do projeto.

**Proteções:**
- **Limite por IP:** 5 envios a cada 10 minutos, contados num arquivo da pasta temporária do PHP. O nome do arquivo é um hash do IP com sal, então o IP não fica gravado. 429 depois do 5º. Se a pasta não aceitar escrita, ninguém é bloqueado.
- **Honeypot:** um campo `site` invisível. Se vier preenchido, responde `{"ok":true}` e não envia nada. Ele também conta no limite.

**Validação (de novo, no servidor):**
- os mesmos formatos do navegador, e o consentimento precisa ser `true` mesmo (o texto "true" não passa);
- **lista branca** das respostas: só o texto exato de cada opção;
- "Não opera" só vale quando a P1 é "Ainda não opero", e vice-versa.

**Envio:**
- `POST https://api.rd.services/platform/conversions?api_key=…`, com `Content-Type: application/json`, o corpo pedido e timeout de 8 s (conexão em 4 s);
- `mobile_phone` sai como `+55 DD 9XXXX-XXXX` (com 10 dígitos, `+55 DD XXXX-XXXX`);
- UTMs vazias, `traffic_*` vazios e `client_tracking_id` ausente **não vão**, em vez de irem vazios e apagar o que o contato já tinha na RD.

**Resposta:** `{"ok":true}` (2xx da RD) ou `{"ok":false,"erro":"…"}`.

**Log:** só `rd-quiz: status <HTTP>`, mais o código do cURL se a conexão falhar e "configuração ausente" / "extensão curl ausente". Nunca nome, e-mail ou telefone.

### Conferência com a documentação da RD

Página oficial: [Conversão, `POST /platform/conversions`](https://developers.rdstation.com/reference/conversao).

- **Autenticação e corpo:** `api_key` na query; `event_type: "CONVERSION"`, `event_family: "CDP"` e `payload`.
- **Campos padrão:** `conversion_identifier`, `name`, `email`, `mobile_phone`, `traffic_source`, `traffic_medium`, `traffic_campaign`, `tags` (lista), `available_for_mailing` (booleano), `legal_bases` (`category`/`type`/`status`; os valores padrão são `communications`, `consent` e `granted`) e `client_tracking_id`. Todos os nomes batem com o pedido.
- **`client_tracking_id`:** a doc diz que é o valor do cookie **`_rdtrk`**. A página lê `_rdtrk`, e `rdtrk` de reserva.
- **`traffic_source`:** pode ser o cookie `__trf.src`, e então os outros `traffic_*` precisam ir vazios, ou a UTM. Usei as UTMs, como pedido.
- **Campos personalizados (`cf_*`):** texto, com o nome no formato da doc.
- **Respostas:** 200 com `event_uuid`; 400 com `errors`.

### Revisão à mão para o PHP 7.4

O `php -l` rodou no 8.3. Para o 7.4 revisei os recursos um a um:

| Usado | Desde | Ok no 7.4 |
|---|---|---|
| `declare(strict_types=1)`, tipos escalares nos parâmetros | 7.0 | sim |
| retorno `?array` e `void` | 7.1 | sim |
| `const` com lista no topo do arquivo | 5.6 | sim |
| `random_bytes`, `hash('sha256')`, `filter_var`, `json_*`, `preg_*` com `/u`, `curl_*` | 5.x / 7.0 | sim |
| `strpos(...) !== 0` no lugar de `str_starts_with`; `isset(...) ? … : …` no lugar de `??=` | — | sim |

**Não usei:** `match`, enum, `readonly`, union types, nullsafe `?->`, argumentos nomeados, `str_contains`/`str_starts_with`, `fn` com tipo `mixed` nem classes.

**Duas armadilhas tratadas:**
- **`mb_substr`:** precisaria da extensão mbstring, que não está confirmada na hospedagem. Troquei por um corte com regex `/u`.
- **`curl_close()`:** desde o 8.0 não faz nada, e no 8.5 é obsoleta. Só roda com `PHP_VERSION_ID < 80000`.

## Arquivos criados/alterados

**Criados:**
- `quiz/index.html`, `quiz/quiz.css`, `quiz/quiz.js`;
- `quiz/api/lead.php`, `quiz/api/rd-quiz.example.php`;
- `quiz/api/.htaccess` (todo comentado) e `quiz/api/htaccess-php83-teste.txt` (a versão ativa, só para o teste);
- `quiz/api/check-2y5cxto7.php`, fora do git;
- `relatorios/quiz.md`.

**Alterados:**
- `.gitignore`: a configuração real e o `check-*.php`;
- `README.md`: seção "Quiz" e `quiz/` na lista do que vai para o servidor;
- `PROMPTS-LP-BLACK.md`: textos a aprovar do quiz.

## Capturas (shots/quiz/)

`{360,390,1440}-{1-p1, 2-p2, 3-dados, 4-erros, 5-erro-envio, 6-sucesso}.png`

## Checagens rodadas

Teste local com o PHP 8.3.36 instalado pelo winget (autorizado):

- **Servidores:** `php -S` na 5510, com `RD_QUIZ_CONFIG` apontando para uma configuração de teste com chave falsa, e uma **RD falsa** na 5511, que guarda o que recebe e responde o status pedido.
- **php.ini de teste:** no scratchpad, com curl, openssl e mbstring. A instalação ficou sem `php.ini`.
- **Tracking:** nada saiu para a RD de verdade, o Google ou o Meta. O tracking ficou bloqueado nos testes de navegador.

### API (`curl`)

| Caso | Resposta |
|---|---|
| GET | 405 "Método não permitido." |
| POST sem JSON | 415 |
| JSON quebrado | 400 |
| Corpo com 11 KB | 413 |
| `Origin` de outro domínio | 403 |
| Nome com 1 letra / com `<b>` | 422 "Confira o seu nome." |
| WhatsApp com 9 dígitos / 11 sem o 9 / DDD 01 | 422 "Confira o seu WhatsApp com DDD." |
| E-mail inválido | 422 |
| Sem consentimento / consentimento como texto `"true"` | 422 |
| Resposta fora da lista ("Ações") / com um espaço a mais | 422 "Responda as perguntas do quiz." |
| "Não opera" com P1 = Sim / P1 = Ainda não opero com P2 = Mais de 2 anos | 422 |
| Válido (11 dígitos, com UTMs e `client_tracking_id`) | **200 `{"ok":true}`** |
| Válido (Ainda não opero + Não opera, 10 dígitos, nome "João D’Ávila", sem UTMs) | **200 `{"ok":true}`** |
| Honeypot preenchido | 200 `{"ok":true}`, e **0** pedidos chegaram à RD falsa |
| 7 envios seguidos | 5 × 200, depois **429** "Muitas tentativas…" |
| RD responde 400 / 500 | 502 "Não conseguimos enviar agora. Tente de novo." |
| RD demora 12 s | 502 em **8 s** (timeout; log `status 0 (curl 28)`) |
| Sem o arquivo de configuração | 500 (log "configuração ausente") |

**O que a RD falsa recebeu (envio válido):**
- `POST ?api_key=chave-falsa-de-teste`, `Content-Type: application/json`;
- `event_type: CONVERSION`, `event_family: CDP`;
- `payload` com `conversion_identifier`, `name`, `email` em minúsculas e `mobile_phone: "+55 11 91234-5678"`;
- `cf_quiz_black_e_trader: "Estou começando a estudar"`, `cf_quiz_black_experiencia: "Menos de 6 meses"`, `cf_quiz_black_mercado: "Mini índice"`, `cf_qual_a_sua_maior_fraqueza_no_day_trade: "Falta de segurança nas decisões"`;
- `cf_utm_source/medium/campaign/content/id` e `traffic_source/medium/campaign`;
- `tags: ["quiz-black-2026"]`, `available_for_mailing: true`, `legal_bases` e `client_tracking_id`.

**Log do PHP:** só linhas como `rd-quiz: status 200`.

### Navegador (Playwright, 360×740, 390×844 e 1440×900)

- **Início:** "Pergunta 1 de 4", barra em 20%, sem "Voltar".
- **Caminho:** Sim → "Pergunta 2 de 4" (40%), com o foco no título da P2. Voltar → P1. "Ainda não opero" → "Pergunta 2 de 3" (50%). P3 → "3 de 3" (75%). P4 → contato (100%). Em cada troca, o foco foi para o título do passo.
- **Enviar vazio:** os 4 erros aparecem ao lado dos campos, e o foco vai para o Nome.
- **Máscara:** `11912345678` vira "(11) 91234-5678"; `+55 62 3333-4444` vira "(62) 3333-4444".
- **RD com erro:** aparece a mensagem, e o botão volta liberado e com o rótulo original.
- **Sucesso:**
  - o botão passou por "Enviando…" travado;
  - a tela de sucesso abre com o foco no título;
  - `dataLayer`: `{"event":"quiz_lead","quiz_e_trader":"Ainda não opero","quiz_mercado":"Os dois"}`, sem dado pessoal.
- **Teclado (390):** Tab + Enter do começo ao fim. No formulário, o Tab segue Nome → WhatsApp → E-mail → caixa → link da política → botão. O honeypot nunca recebe foco.
- **Scroll horizontal:** nenhum nas três larguras.
- **Console:** sem erros de JS. A única linha de erro é o "502 (Bad Gateway)" do teste em que a RD falsa respondeu 500 de propósito: é o navegador registrando a resposta com erro, não um erro do código.
- **Correções feitas nas capturas:**
  - o botão do WhatsApp vazava do painel em 360 e 390: o rótulo agora quebra;
  - o "← Voltar" estava com o fundo padrão do navegador: agora é transparente com borda fina.

## Textos a aprovar usados nesta fase

Todos os textos do quiz são novos e foram registrados em "Textos a aprovar" do `PROMPTS-LP-BLACK.md`:

- **Página:** `<title>` "Quiz da Black: receba sua oferta | Zero7" e a description; o aviso sem JavaScript "Para responder o quiz, ative o JavaScript do navegador.".
- **Perguntas e opções**, e "Pergunta X de 4/3".
- **Contato:** os rótulos, o exemplo "(11) 91234-5678", o consentimento e "Enviando…".
- **Erros:** os 4 do navegador, mais os do servidor ("Muitas tentativas. Tente de novo em alguns minutos.").
- **Sucesso:** os textos da tela.
- **Leitor de tela:** "Progresso do quiz".

## Perguntas / pendências

1. **Link da Política de Privacidade:** o pedido diz que está pendente "igual ao do rodapé da LP". No rodapé, porém, a Política de Privacidade **tem link** (`https://zero7.com.br/politica-de-privacidade/`, o mesmo da home); os pendentes são "Cookie" e "Políticas de Uso". No consentimento usei esse mesmo link, com um `TODO: confirmar` no HTML. Confirma?
2. **Contagem com a P2 pulada:** mostra "Pergunta 2 de 3" e "3 de 3", em vez de "de 4", para a barra e o texto contarem a mesma coisa. Ok?
3. **`fbclid` e `gclid`:** ficam guardados na sessão, mas **não vão para a RD**, porque o corpo pedido não tem campo para eles. Querem um `cf_` para cada?
4. **Teste do PHP 8.3 na pasta:** aguardando o seu ok para subir o `.htaccess` + a checagem (passo a passo acima).
5. **Teste real na RD:** aguardando a sua autorização. Passos:
   - a chave vai para `/home/<usuario>/config/rd-quiz.php`, a partir do modelo;
   - o quiz é publicado;
   - 1 envio com "Teste Quiz" / teste-quiz@zero7.com.br;
   - depois, o contato na RD com os campos preenchidos.
6. **Log no cPanel:** o `error_log` do PHP costuma ficar num arquivo `error_log` na própria pasta. Ele só terá linhas de status, mas, se preferirem, dá para bloquear esse arquivo na pasta `quiz/api/` pelo `.htaccess`.

O quiz fica aqui até o seu ok para os dois testes na hospedagem.
