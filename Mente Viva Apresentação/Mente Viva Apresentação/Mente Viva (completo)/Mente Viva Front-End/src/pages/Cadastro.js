import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6)
      return setErro("A senha deve ter pelo menos 6 caracteres.");

    if (senha !== confirma)
      return setErro("As senhas não conferem.");

    try {
      // 🔹 1) CADASTRAR
      const respRegister = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      });

      const regData = await respRegister.json();

      if (!respRegister.ok) {
        return setErro(regData.message || "Erro ao cadastrar.");
      }

      // 🔹 2) LOGIN AUTOMÁTICO PARA PEGAR TOKEN
      const respLogin = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const loginData = await respLogin.json();

      if (!respLogin.ok) {
        return setErro(loginData.message || "Erro ao fazer login.");
      }

      // 🔹 3) SALVAR USUÁRIO + TOKEN NO AUTH CONTEXT
      login(loginData);

      // 🔹 4) REDIRECIONAR
      navigate('/diario', { replace: true });

    } catch (err) {
      console.error("Erro no frontend:", err);
      setErro("Erro ao conectar ao servidor.");
    }
  }

  return (
    <div className="container">
      <section className="section card-lg" style={{ maxWidth: 520, margin: '40px auto' }}>
        <h1>Cadastrar</h1>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label className="label">Nome</label>
          <input className="input" value={nome} onChange={e => setNome(e.target.value)} required />

          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />

          <label className="label">Senha</label>
          <input className="input" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />

          <label className="label">Confirmar senha</label>
          <input className="input" type="password" value={confirma} onChange={e => setConfirma(e.target.value)} required />

          {erro && <p style={{ color: '#b44545', marginTop: 6 }}>{erro}</p>}

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">Criar conta</button>
          </div>
        </form>
      </section>
    </div>
  );
}
