import { useState } from 'react';
import AudioCapture from './AudioCapture';

export default function DiarioMemoria() {
  const [texto, setTexto] = useState('');
  const [textoAudio, setTextoAudio] = useState('');

  const salvarNoHistorico = (entrada) => {
    const historico = JSON.parse(localStorage.getItem('historicoMemoria')) || [];
    historico.push(entrada);
    localStorage.setItem('historicoMemoria', JSON.stringify(historico));
  };

  const salvarDiario = () => {
    const entrada = `${texto.trim()} ${textoAudio.trim()}`.trim();
    if (entrada.length < 5) {
      alert('Escreva ou grave pelo menos 5 caracteres.');
      return;
    }

    salvarNoHistorico(`Anotação: ${entrada}`);
    alert('Anotação salva com sucesso!');
    setTexto('');
    setTextoAudio('');
  };

  return (
    <div className="diario-container">
      <h1>📝 Diário de Memória</h1>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva suas lembranças aqui..."
        rows={6}
        cols={40}
        className="diario-textarea"
      />

      <h2>🎤 Ou grave seu diário em áudio</h2>
      <AudioCapture onTranscript={(text) => setTextoAudio(text)} />

      <br />
      <button onClick={salvarDiario}>Salvar Anotação</button>
    </div>
  );
}
