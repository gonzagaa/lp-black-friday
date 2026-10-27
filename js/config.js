// Constantes de negócio da LP. Todo número ou data que não está na copy mora aqui.

// Fim da Black, para o contador (hoje sem uso na página). Horário de Brasília.
// Data da planilha do cliente ("Planos Black 80% OFF 29/10 até 30/11"). TODO: confirmar a hora (P1); usei o fim do dia.
export const BLACK_FIM = '2026-11-30T23:59:59-03:00';

// De onde a seção de planos lê preços, checkout, modo e prazo (Fase 4).
// É o planos.json PRÓPRIO da LP, relativo à pasta da página: publicada em https://zero7.com.br/a-maior-black/,
// ela lê https://zero7.com.br/a-maior-black/data/planos.json. Não aponte para o painel da home
// (/home/script/planos.json): os preços da Black são diferentes dos da home (P3 resolvida). Os preços e
// checkouts da Black (P2) estão no modo ativo "60dias", pela planilha "Planos Black 80% OFF 29/10 até 30/11".
export const PLANOS_URL = 'data/planos.json';
