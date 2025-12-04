import { useState } from 'react';
import { gerarSequencia, verificarMemoria } from '../utils/MemoriaUtil';

export default function JogoMemoria() {
  const [sequencia, setSequencia] = useState('');
  const [sequenciaAtual, setSequenciaAtual] = useState('');
  const [resposta, setResposta] = useState('');
  const [bloqueado, setBloqueado] = useState(true);
  const [feedback, setFeedback] = useState('');

  const salvarNoHistorico = (texto) => {
    const historico = JSON.parse(localStorage.getItem('historicoMemoria')) || [];
    historico.push(texto);
    localStorage.setItem('historicoMemoria', JSON.stringify(historico));
  };

  const handleVerificar = () => {
    const acertou = verificarMemoria(resposta, sequenciaAtual);
    const texto = acertou
      ? `Exercício de Memória: ACERTOU (${sequenciaAtual})`
      : `Exercício de Memória: ERROU (Sequência era ${sequenciaAtual})`;

    setFeedback(acertou ? '✅ Muito bem! Você acertou!' : `❌ Errado! A sequência era: ${sequenciaAtual}`);
    salvarNoHistorico(texto);

    setTimeout(() => {
      setResposta('');
      gerarSequencia(setSequencia, setBloqueado, setSequenciaAtual);
    }, 2000);
  };

  return (
    <div>
      <p>{sequencia}</p>
      <input
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        disabled={bloqueado}
        placeholder="Digite a sequência aqui"
      />
      <button onClick={handleVerificar} disabled={bloqueado}>Verificar</button>
      <button onClick={() => gerarSequencia(setSequencia, setBloqueado, setSequenciaAtual)} disabled={bloqueado}>Nova Sequência</button>
      <p>{feedback}</p>
    </div>
  );
}
