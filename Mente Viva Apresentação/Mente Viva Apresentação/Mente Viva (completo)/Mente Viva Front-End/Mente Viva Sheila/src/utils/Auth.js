export function atualizarVisibilidadeNavbar(setLogado) {
  const usuarioLogado = localStorage.getItem('usuarioLogin');
  setLogado(!!usuarioLogado);
}

export function fazerLogout(navigate) {
  localStorage.clear();
  alert('Você saiu da conta.');
  navigate('/');
}
