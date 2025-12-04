import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { API_URL } from "../config/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          senha,
        }),
      });

      if (!resp.ok) {
        const dataErr = await resp.json().catch(() => ({}));
        setErro(dataErr.message || "Credenciais inválidas. Verifique e tente novamente.");
        return;
      }

      const data = await resp.json(); // { token, user: { id, nome, email } }

      localStorage.setItem("mv_token", data.token);

      login({
        name: data.user.nome,
        email: data.user.email,
      });

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setErro("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    }
  }

  return (
    <div className="container">
      <section className="section card-lg" style={{ maxWidth: 520, margin: "40px auto" }}>
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label className="label">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <label className="label">Senha</label>
          <input
            className="input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            required
          />

          {erro && <p style={{ color: "#b44545", marginTop: 6 }}>{erro}</p>}

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">
              Acessar
            </button>
            <Link className="btn btn-ghost" to="/cadastro">
              Cadastrar
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}