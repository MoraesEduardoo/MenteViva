import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    try {
      const resp = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await resp.json();

      if (!resp.ok) {
        setErro(data.message || "Credenciais inválidas.");
        return;
      }

      // salvando o usuário e token no AuthContext
      login(data);

      navigate(from, { replace: true });

    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Erro ao conectar ao servidor.");
    }
  }

  return (
    <div className="container">
      <section className="section card-lg" style={{ maxWidth: 520, margin: '40px auto' }}>
        <h1>Entrar</h1>

        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label className="label">Email</label>
          <input
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />

          <label className="label">Senha</label>
          <input
            className="input"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            type="password"
            required
          />

          {erro && <p style={{ color: '#b44545', marginTop: 6 }}>{erro}</p>}

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">Acessar</button>
            <Link className="btn btn-ghost" to="/cadastro">Cadastrar</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
