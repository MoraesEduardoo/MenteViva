import { useState } from 'react';

export default function DiarioMemoria() {
  const [texto, setTexto] = useState('');

  const salvarNoHistorico = (entrada) => {
    const historico = JSON.parse(localStorage.getItem('historicoMemoria')) || [];
    historico.push(entrada);
    localStorage.setItem('historicoMemoria', JSON.stringify(historico));
  };

  const salvarDiario = () => {
    const entrada = texto.trim();
    if (entrada.length < 5) {
      alert('Escreva pelo menos 5 caracteres.');
      return;
    }

    salvarNoHistorico(`Anotação: ${entrada}`);
    alert('Anotação salva com sucesso!');
    setTexto('');
  };

  return (
    <div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva suas lembranças aqui..."
        rows={6}
        cols={40}
      />
      <br />
      <button onClick={salvarDiario}>Salvar Anotação</button>
    </div>
  );
}
