<?php
/*
 * Quiz da Black: repasse do lead para a RD Station Marketing (conversão via API Key).
 *
 * POST JSON, do mesmo domínio (quiz/index.html → quiz/api/lead.php). Responde {"ok":true} ou {"ok":false,"erro":"…"}.
 *
 * - A chave da RD NUNCA vai para o navegador, para o código ou para o git: ela fica num arquivo FORA da pasta pública
 *   (por padrão ~/config/rd-quiz.php, ao lado do public_html; modelo em rd-quiz.example.php). Ver carregar_config().
 * - Valida tudo de novo aqui: as respostas só podem ser exatamente as opções do quiz (lista branca).
 * - Honeypot: o campo "site" é invisível na página; se vier preenchido, respondemos ok e não enviamos nada.
 * - Limite por IP: 5 envios a cada 10 minutos, contados num arquivo da pasta temporária (o IP fica só como hash).
 * - No log fica só o status HTTP da RD (nunca nome, e-mail ou telefone).
 *
 * Compatível com PHP 7.4 e 8.x sem mudar uma linha: nada de match, enum, readonly, union types, nullsafe (?->),
 * argumentos nomeados, str_contains/str_starts_with nem promoção no construtor (aqui não há classes). Só extensões
 * que vêm ligadas por padrão (json, pcre, filter, hash) e a curl; sem mbstring.
 * Doc da RD: https://developers.rdstation.com/reference/conversao
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

const QUIZ_LIMITE_ENVIOS = 5;
const QUIZ_LIMITE_JANELA = 600; // segundos
const QUIZ_CORPO_MAXIMO = 10000; // bytes
const QUIZ_RD_URL = 'https://api.rd.services/platform/conversions';
const QUIZ_ERRO_ENVIO = 'Não conseguimos enviar agora. Tente de novo.';

// Lista branca: o texto exato de cada opção, que vai igual para os campos de texto da RD
const QUIZ_E_TRADER = ['Sim, opero na B3', 'Estou começando a estudar', 'Ainda não opero'];
const QUIZ_NAO_OPERA = 'Ainda não opero';
const QUIZ_EXPERIENCIA = ['Menos de 6 meses', 'De 6 meses a 2 anos', 'Mais de 2 anos'];
const QUIZ_EXPERIENCIA_NAO_OPERA = 'Não opera';
const QUIZ_MERCADO = ['Mini índice', 'Mini dólar', 'Os dois', 'Ainda não sei'];
const QUIZ_DESAFIO = ['Controle emocional', 'Operar poucos contratos', 'Falta de segurança nas decisões', 'Capital limitado'];

function responder(int $status, array $corpo): void
{
    http_response_code($status);
    echo json_encode($corpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function erro(int $status, string $mensagem): void
{
    responder($status, ['ok' => false, 'erro' => $mensagem]);
}

/* Configuração fora da pasta pública. Ordem: variável de ambiente RD_QUIZ_CONFIG (teste local), a pasta config ao
   lado do public_html (dirname do DOCUMENT_ROOT) e ~/config. O arquivo devolve ['api_key' => '…']. */
function carregar_config(): ?array
{
    $candidatos = [];
    $ambiente = getenv('RD_QUIZ_CONFIG');
    if (is_string($ambiente) && $ambiente !== '') {
        $candidatos[] = $ambiente;
    }
    $raiz = isset($_SERVER['DOCUMENT_ROOT']) ? (string) $_SERVER['DOCUMENT_ROOT'] : '';
    if ($raiz !== '') {
        $candidatos[] = dirname(rtrim($raiz, '/\\')) . '/config/rd-quiz.php';
    }
    $home = getenv('HOME');
    if (is_string($home) && $home !== '') {
        $candidatos[] = rtrim($home, '/\\') . '/config/rd-quiz.php';
    }
    foreach ($candidatos as $caminho) {
        if (is_file($caminho) && is_readable($caminho)) {
            $config = include $caminho;
            if (is_array($config) && isset($config['api_key']) && is_string($config['api_key']) && $config['api_key'] !== '') {
                return $config;
            }
        }
    }
    return null;
}

function texto($valor, int $maximo): string
{
    if (!is_string($valor)) {
        return '';
    }
    $limpo = preg_replace('/[\x00-\x1F\x7F]/u', '', $valor);
    $limpo = trim((string) preg_replace('/\s+/u', ' ', (string) $limpo));
    // corta em $maximo caracteres (não bytes) sem depender da extensão mbstring
    return preg_match('/^.{0,' . $maximo . '}/us', $limpo, $corte) ? $corte[0] : '';
}

function ip_do_cliente(array $config): string
{
    // Por padrão, o REMOTE_ADDR. Se a hospedagem ficar atrás de um proxy confiável, o nome do cabeçalho com o IP
    // real vai em 'cabecalho_ip' na configuração (ex.: 'HTTP_X_FORWARDED_FOR'); o primeiro IP da lista vale.
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    if (!empty($config['cabecalho_ip']) && is_string($config['cabecalho_ip']) && !empty($_SERVER[$config['cabecalho_ip']])) {
        $partes = explode(',', (string) $_SERVER[$config['cabecalho_ip']]);
        $ip = trim($partes[0]);
    }
    return $ip;
}

/* 5 envios a cada 10 minutos por IP. Um arquivo por IP (nome = hash do IP + sal), com as marcas de tempo da janela.
   Se a pasta temporária não aceitar escrita, não bloqueia ninguém (o envio segue). */
function dentro_do_limite(string $ip, array $config): bool
{
    $pasta = isset($config['pasta_temporaria']) && is_string($config['pasta_temporaria']) ? $config['pasta_temporaria'] : sys_get_temp_dir();
    $sal = isset($config['sal']) && is_string($config['sal']) ? $config['sal'] : 'quiz-a-maior-black-2026';
    $arquivo = rtrim($pasta, '/\\') . '/rd-quiz-' . hash('sha256', $sal . '|' . $ip) . '.json';
    $agora = time();

    $ponteiro = @fopen($arquivo, 'c+');
    if ($ponteiro === false) {
        return true;
    }
    flock($ponteiro, LOCK_EX);
    $conteudo = stream_get_contents($ponteiro);
    $marcas = json_decode($conteudo === false || $conteudo === '' ? '[]' : $conteudo, true);
    if (!is_array($marcas)) {
        $marcas = [];
    }
    $recentes = [];
    foreach ($marcas as $marca) {
        if (is_int($marca) && $marca > $agora - QUIZ_LIMITE_JANELA) {
            $recentes[] = $marca;
        }
    }
    $permitido = count($recentes) < QUIZ_LIMITE_ENVIOS;
    if ($permitido) {
        $recentes[] = $agora;
    }
    ftruncate($ponteiro, 0);
    rewind($ponteiro);
    fwrite($ponteiro, json_encode($recentes));
    fflush($ponteiro);
    flock($ponteiro, LOCK_UN);
    fclose($ponteiro);
    return $permitido;
}

/* WhatsApp: DDD + número, 10 ou 11 dígitos (com 11, o número começa com 9). Devolve "+55 DD 9XXXX-XXXX" ou "". */
function telefone_formatado(string $digitos): string
{
    if (!preg_match('/^[1-9][1-9]\d{8,9}$/', $digitos)) {
        return '';
    }
    $ddd = substr($digitos, 0, 2);
    $numero = substr($digitos, 2);
    if (strlen($numero) === 9) {
        if ($numero[0] !== '9') {
            return '';
        }
        return '+55 ' . $ddd . ' ' . substr($numero, 0, 5) . '-' . substr($numero, 5);
    }
    return '+55 ' . $ddd . ' ' . substr($numero, 0, 4) . '-' . substr($numero, 4);
}

// ---------- requisição ----------

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    erro(405, 'Método não permitido.');
}

// Mesmo domínio: se o navegador mandar Origin, ele tem de ser o host desta página
$origem = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
if ($origem !== '') {
    $hostOrigem = parse_url($origem, PHP_URL_HOST);
    $hostAqui = isset($_SERVER['HTTP_HOST']) ? preg_replace('/:\d+$/', '', (string) $_SERVER['HTTP_HOST']) : '';
    if (!is_string($hostOrigem) || strcasecmp($hostOrigem, (string) $hostAqui) !== 0) {
        erro(403, 'Origem não permitida.');
    }
}

$tipo = strtolower(isset($_SERVER['CONTENT_TYPE']) ? (string) $_SERVER['CONTENT_TYPE'] : '');
if (strpos($tipo, 'application/json') !== 0) {
    erro(415, 'Envie em JSON.');
}

$bruto = file_get_contents('php://input', false, null, 0, QUIZ_CORPO_MAXIMO + 1);
if ($bruto === false || strlen($bruto) > QUIZ_CORPO_MAXIMO) {
    erro(413, 'Pedido grande demais.');
}
$dados = json_decode($bruto, true);
if (!is_array($dados)) {
    erro(400, 'Pedido inválido.');
}

$config = carregar_config();
if ($config === null) {
    error_log('rd-quiz: configuração ausente');
    erro(500, QUIZ_ERRO_ENVIO);
}

if (!dentro_do_limite(ip_do_cliente($config), $config)) {
    erro(429, 'Muitas tentativas. Tente de novo em alguns minutos.');
}

// Honeypot: robô preencheu o campo invisível. Parece que deu certo, e nada é enviado.
if (texto(isset($dados['site']) ? $dados['site'] : '', 200) !== '') {
    responder(200, ['ok' => true]);
}

// ---------- validação ----------

$nome = texto(isset($dados['nome']) ? $dados['nome'] : '', 100);
if (preg_match_all('/\p{L}/u', $nome) < 2 || !preg_match('/^[\p{L}\p{M}][\p{L}\p{M} \'’.\-]*$/u', $nome)) {
    erro(422, 'Confira o seu nome.');
}

$whatsapp = preg_replace('/\D+/', '', isset($dados['whatsapp']) && is_string($dados['whatsapp']) ? $dados['whatsapp'] : '');
$telefone = telefone_formatado((string) $whatsapp);
if ($telefone === '') {
    erro(422, 'Confira o seu WhatsApp com DDD.');
}

$email = strtolower(texto(isset($dados['email']) ? $dados['email'] : '', 254));
if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    erro(422, 'Confira o seu e-mail.');
}

if (!isset($dados['consentimento']) || $dados['consentimento'] !== true) {
    erro(422, 'Para receber a oferta, marque a autorização de contato.');
}

$respostas = isset($dados['respostas']) && is_array($dados['respostas']) ? $dados['respostas'] : [];
$eTrader = isset($respostas['e_trader']) ? $respostas['e_trader'] : null;
$experiencia = isset($respostas['experiencia']) ? $respostas['experiencia'] : null;
$mercado = isset($respostas['mercado']) ? $respostas['mercado'] : null;
$desafio = isset($respostas['desafio']) ? $respostas['desafio'] : null;

$respostasOk = in_array($eTrader, QUIZ_E_TRADER, true)
    && in_array($mercado, QUIZ_MERCADO, true)
    && in_array($desafio, QUIZ_DESAFIO, true);
if ($respostasOk) {
    // Quem ainda não opera pula a P2: a experiência vai como "Não opera" (e só nesse caso)
    $respostasOk = $eTrader === QUIZ_NAO_OPERA
        ? $experiencia === QUIZ_EXPERIENCIA_NAO_OPERA
        : in_array($experiencia, QUIZ_EXPERIENCIA, true);
}
if (!$respostasOk) {
    erro(422, 'Responda as perguntas do quiz.');
}

// ---------- conversão para a RD ----------

$payload = [
    'conversion_identifier' => 'quiz-a-maior-black-2026',
    'name' => $nome,
    'email' => $email,
    'mobile_phone' => $telefone,
    'cf_quiz_black_e_trader' => $eTrader,
    'cf_quiz_black_experiencia' => $experiencia,
    'cf_quiz_black_mercado' => $mercado,
    'cf_qual_a_sua_maior_fraqueza_no_day_trade' => $desafio,
];

// UTMs da URL de entrada: campos personalizados e a origem do tráfego (traffic_*). Vazias não vão.
$utm = isset($dados['utm']) && is_array($dados['utm']) ? $dados['utm'] : [];
$utms = [];
foreach (['source', 'medium', 'campaign', 'term', 'content', 'id'] as $chave) {
    $utms[$chave] = texto(isset($utm[$chave]) ? $utm[$chave] : '', 200);
    if ($utms[$chave] !== '') {
        $payload['cf_utm_' . $chave] = $utms[$chave];
    }
}
foreach (['source' => 'traffic_source', 'medium' => 'traffic_medium', 'campaign' => 'traffic_campaign'] as $chave => $campo) {
    if ($utms[$chave] !== '') {
        $payload[$campo] = $utms[$chave];
    }
}

$payload['tags'] = ['quiz-black-2026'];
$payload['available_for_mailing'] = true;
$payload['legal_bases'] = [['category' => 'communications', 'type' => 'consent', 'status' => 'granted']];

// Cookie de rastreamento da RD (_rdtrk), lido na página: só o formato de um id
$rastreio = texto(isset($dados['client_tracking_id']) ? $dados['client_tracking_id'] : '', 64);
if ($rastreio !== '' && preg_match('/^[A-Za-z0-9-]{8,64}$/', $rastreio)) {
    $payload['client_tracking_id'] = $rastreio;
}

$corpo = json_encode(
    ['event_type' => 'CONVERSION', 'event_family' => 'CDP', 'payload' => $payload],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if (!function_exists('curl_init')) {
    error_log('rd-quiz: extensão curl ausente');
    erro(500, QUIZ_ERRO_ENVIO);
}

// 'endpoint' só existe para o teste local (um servidor falso); em produção, fica de fora e vale a URL da RD
$destino = isset($config['endpoint']) && is_string($config['endpoint']) && $config['endpoint'] !== '' ? $config['endpoint'] : QUIZ_RD_URL;
$canal = curl_init($destino . '?api_key=' . rawurlencode($config['api_key']));
curl_setopt_array($canal, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $corpo,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);
curl_exec($canal);
$status = (int) curl_getinfo($canal, CURLINFO_HTTP_CODE);
$falha = curl_errno($canal);
if (PHP_VERSION_ID < 80000) {
    curl_close($canal); // a partir do 8.0 não faz nada (e no 8.5 é obsoleto): o handle se libera sozinho
}

// Só o status HTTP (e o código do cURL, se a conexão falhar). Nunca os dados do lead.
error_log('rd-quiz: status ' . $status . ($falha !== 0 ? ' (curl ' . $falha . ')' : ''));

if ($status >= 200 && $status < 300) {
    responder(200, ['ok' => true]);
}
erro(502, QUIZ_ERRO_ENVIO);
