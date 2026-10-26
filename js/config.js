// Constantes de negócio da LP. Todo número ou data que não está na copy mora aqui.

// Fim da Black, usado pelo contador da hero (Fase 2). Horário de Brasília.
// TODO: confirmar data e hora de término (pendência P1). O valor abaixo é provisório: fim do dia da Black Friday 2026.
export const BLACK_FIM = '2026-11-27T23:59:59-03:00';

// De onde a seção de planos lê preços, checkout, modo e prazo (Fase 4).
// É o planos.json PRÓPRIO da LP, relativo à pasta da página: publicada em https://zero7.com.br/a-maior-black/,
// ela lê https://zero7.com.br/a-maior-black/data/planos.json. Não aponte para o painel da home
// (/home/script/planos.json): os preços da Black são diferentes dos da home (P3 resolvida). Os preços e
// checkouts da Black ainda vão chegar do cliente (P2); até lá, este arquivo é o snapshot atual.
export const PLANOS_URL = 'data/planos.json';
