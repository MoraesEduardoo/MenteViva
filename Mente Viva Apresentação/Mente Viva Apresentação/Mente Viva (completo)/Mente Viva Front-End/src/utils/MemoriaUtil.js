export function gerarSequencia(setSequencia, setBloqueado, setSequenciaAtual) {
  let nova = '';
  for (let i = 0; i < 4; i++) {
    nova += Math.floor(Math.random() * 10) + ' ';
  }
  setSequenciaAtual(nova.trim());
  setBloqueado(true);
  setSequencia('Memorize...');
  setTimeout(() => {
    setSequencia(nova.trim());
    setTimeout(() => {
      setSequencia('????');
      setBloqueado(false);
    }, 2500);
  }, 500);
}

export function verificarMemoria(resposta, sequenciaAtual) {
  const r = resposta.replace(/\s+/g, '');
  const s = sequenciaAtual.replace(/\s+/g, '');
  return r === s;
}
