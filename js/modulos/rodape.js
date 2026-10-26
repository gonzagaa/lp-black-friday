// Rodapé: o ano do "© {ano} | Todos os direitos reservados." (na home, .js-ano). O HTML traz 2026 de reserva.
export function iniciarRodape() {
  const ano = String(new Date().getFullYear());
  document.querySelectorAll('.js-ano').forEach((el) => { el.textContent = ano; });
}
