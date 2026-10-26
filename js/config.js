// Constantes de negócio da LP. Todo número ou data que não está na copy mora aqui.

// Fim da Black, usado pelo contador da hero (Fase 2). Horário de Brasília.
// TODO: confirmar data e hora de término (pendência P1). O valor abaixo é provisório: fim do dia da Black Friday 2026.
export const BLACK_FIM = '2026-11-27T23:59:59-03:00';

// De onde a seção de planos lê preços, checkout, modo e prazo (Fase 4).
// TODO: confirmar. Em produção deve apontar para o mesmo painel da home (pendência P3).
// Não aponte para produção sem pedido: por enquanto usa o snapshot local.
export const PLANOS_URL = 'data/planos.json';
