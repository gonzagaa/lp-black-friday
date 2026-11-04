<?php
/*
 * MODELO da configuração do quiz (quiz/api/lead.php). NÃO coloque a chave aqui nem em nenhum arquivo do repositório.
 *
 * Como usar na hospedagem (cPanel):
 *   1. Crie a pasta "config" na sua pasta pessoal, AO LADO do public_html (fora da pasta pública):
 *        /home/<usuario>/config/
 *   2. Copie este arquivo para lá com o nome rd-quiz.php:
 *        /home/<usuario>/config/rd-quiz.php
 *   3. Troque o valor de api_key pela chave da RD Station Marketing (Integrações > Chave de API).
 *   4. Permissão 600 (só o dono lê e grava).
 *
 * O lead.php procura sempre na pasta pessoal da conta: /home/<usuario>/config/rd-quiz.php (a variável de ambiente
 * RD_QUIZ_CONFIG só serve para o teste local). O caminho real está no .gitignore.
 */

return [
    'api_key' => 'COLE_AQUI_A_CHAVE_DA_RD',

    // Opcionais:
    // 'sal' => 'troque-por-um-texto-qualquer',      // entra no hash do IP do limite de envios
    // 'pasta_temporaria' => '/home/<usuario>/tmp',   // se a pasta temporária do PHP não aceitar escrita
    // 'cabecalho_ip' => 'HTTP_X_FORWARDED_FOR',      // só se a hospedagem estiver atrás de um proxy confiável
    // 'endpoint' => 'http://127.0.0.1:5511/',        // SÓ para teste local com servidor falso; nunca em produção
];
