import { useState } from 'react';

export default function FraseDoDia() {
  const mensagens = [
    "Pequenos passos, grandes memórias.",
    "Você está indo muito bem — continue!",
    "Respire fundo: uma lembrança de cada vez.",
    "Praticar um pouquinho todo dia faz diferença."
  ];

  const [idx, setIdx] = useState(0);
  const proxima = () => setIdx((i) => (i + 1) % mensagens.length);

  return (
    <div className="card">
      <h3>💬 Frase do Dia</h3>
      <p>{mensagens[idx]}</p>
      <button onClick={proxima}>Trocar frase</button>
    </div>
  );
}
