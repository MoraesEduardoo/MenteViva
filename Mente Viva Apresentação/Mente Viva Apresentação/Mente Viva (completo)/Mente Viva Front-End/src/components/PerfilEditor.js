import { aplicarMascaraCelular } from '../utils/MascaraCelular';
import { useState } from 'react';

export default function PerfilEditor() {
  const [nome, setNome] = useState(localStorage.getItem('usuarioNome') || '');
  const [email, setEmail] = useState(localStorage.getItem('usuarioEmail') || '');
  const [celular, setCelular] = useState(localStorage.getItem('usuarioCelular') || '');

  const salvarPerfil = () => {
    if (!nome) return alert('O nome não pode estar vazio.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Email inválido.');
    if (celular.replace(/\D/g, '').length < 10) return alert('Número de celular incompleto.');

    const celularFormatado = aplicarMascaraCelular(celular);

    localStorage.setItem('usuarioNome', nome);
    localStorage.setItem('usuarioEmail', email);
    localStorage.setItem('usuarioCelular', celularFormatado);
    localStorage.setItem('usuarioLogin', email || celularFormatado);

    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div>
      <input value={nome} onChange={(e) => setNome(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={celular} onChange={(e) => setCelular(e.target.value)} />
      <button onClick={salvarPerfil}>Salvar</button>
    </div>
  );
}
