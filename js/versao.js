// Versão do deploy, para o cache busting (o ?v= de todos os arquivos locais).
// NÃO edite à mão: `npm run versao` troca o valor aqui e em todos os ?v= do HTML, do CSS e dos imports dos módulos
// (scripts/versao.mjs). Rode antes de cada deploy. Vale para a LP e para o quiz.
export const VERSAO = '202611041050';

// Para os endereços que o JS monta em tempo de execução (vídeos, posters, 3D, vendor): acrescenta ?v= antes do #.
export function comVersao(url) {
  const [caminho, fragmento] = url.split('#');
  const sep = caminho.includes('?') ? '&' : '?';
  return `${caminho}${sep}v=${VERSAO}${fragmento !== undefined ? `#${fragmento}` : ''}`;
}
