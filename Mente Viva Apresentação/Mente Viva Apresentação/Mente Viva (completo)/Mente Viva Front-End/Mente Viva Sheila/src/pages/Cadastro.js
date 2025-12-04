import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { API_URL } from "../config/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirma) {
      setErro("As senhas não conferem.");
      return;
    }

    const payload = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
    };

    try {
      // 1) cadastra usuário
      const resp = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const dataErr = await resp.json().catch(() => ({}));
        setErro(dataErr.message || "Erro ao cadastrar. Tente novamente.");
        return;
      }

      // 2) faz login após cadastro para pegar token
      const respLogin = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          senha: payload.senha,
        }),
      });

      if (!respLogin.ok) {
        setErro("Cadastro feito, mas houve erro ao fazer login automático.");
        return;
      }

      const dataLogin = await respLogin.json(); // { token, user: { id, nome, email } }

      // guarda token
      localStorage.setItem("mv_token", dataLogin.token);

      // guarda no contexto
      login({
        name: dataLogin.user.nome,
        email: dataLogin.user.email,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setErro("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    }
  }

  return (
    <div className="container">
      <section className="section card-lg" style={{ maxWidth: 520, margin: "40px auto" }}>
        <h1>Cadastrar</h1>
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
          <label className="label">Nome</label>
          <input
            className="input"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label">Senha</label>
          <input
            className="input"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <label className="label">Confirmar senha</label>
          <input
            className="input"
            type="password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            required
          />

          {erro && <p style={{ color: "#b44545", marginTop: 6 }}>{erro}</p>}

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">
              Criar conta
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}