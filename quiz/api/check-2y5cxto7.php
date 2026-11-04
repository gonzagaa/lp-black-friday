<?php
/*
 * Checagem ÚNICA da hospedagem para o quiz (não é phpinfo): mostra só a versão do PHP, se a extensão curl está
 * carregada e se a pasta temporária aceita gravação (o limite por IP do lead.php grava lá). No fim, apaga a si mesmo.
 * Entra só no commit temporário "quiz: teste php83" e sai no commit seguinte (o sync do cPanel apaga a cópia do servidor).
 */
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

$pasta = sys_get_temp_dir();
$arquivo = rtrim($pasta, '/\\') . '/rd-quiz-check-' . bin2hex(random_bytes(4)) . '.txt';
$gravou = @file_put_contents($arquivo, 'ok') === 2;
$leu = $gravou && @file_get_contents($arquivo) === 'ok';
if ($gravou) {
    @unlink($arquivo);
}

echo 'PHP: ' . PHP_VERSION . "\n";
echo 'curl carregado: ' . (extension_loaded('curl') ? 'sim' : 'não') . "\n";
echo 'pasta temporária aceita gravação (file_put_contents): ' . ($leu ? 'sim' : 'não') . "\n";
echo 'este arquivo foi apagado: ' . (@unlink(__FILE__) ? 'sim' : 'NÃO (apague pelo Gerenciador de Arquivos)') . "\n";
