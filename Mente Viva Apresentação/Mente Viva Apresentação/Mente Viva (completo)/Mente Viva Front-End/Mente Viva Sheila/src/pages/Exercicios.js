import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import MemoryGame from "./MemoryGame";

const DIGITOS = "123456789";
const rand = (n) => Math.floor(Math.random() * n);

function gerarSequencia(tamanho) {
  let s = "";
  for (let i = 0; i < tamanho; i++) s += DIGITOS[rand(DIGITOS.length)];
  return s;
}

export default function Exercicios() {
  const { user } = useAuth();
  const keyHistorico = useMemo(() => `mv_exercises_${user?.email || "anon"}`, [user]);

  const [atividade, setAtividade] = useState("sequencia");
  const [nivel, setNivel] = useState(1);
  const [seq, setSeq] = useState(gerarSequencia(3));
  const [mostrar, setMostrar] = useState(true);
  const [resposta, setResposta] = useState("");
  const [acertos, setAcertos] = useState(0);
  const [tentativas, setTentativas] = useState(0);
  const [msg, setMsg] = useState("");

  const passos = useMemo(() => seq.split(""), [seq]);

  useEffect(() => {
    if (atividade !== "sequencia") return;
    setMostrar(true);
    setResposta("");
    setMsg("");
    const t = setTimeout(() => setMostrar(false), 1800 + nivel * 150);
    return () => clearTimeout(t);
  }, [seq, nivel, atividade]);

  function novaSeq() {
    const base = 3 + Math.min(nivel - 1, 4);
    setSeq(gerarSequencia(base));
  }

  function salvarHistoricoSequencia(acertou) {
    const entrada = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      data: new Date().toISOString().slice(0, 10),
      tipo: "sequencia",
      nivel,
      sequencia: seq,
      resposta: resposta.trim(),
      acertou,
    };

    try {
      const historico = JSON.parse(localStorage.getItem(keyHistorico)) || [];
      historico.push(entrada);
      localStorage.setItem(keyHistorico, JSON.stringify(historico));
    } catch {
      localStorage.setItem(keyHistorico, JSON.stringify([entrada]));
    }
  }

  function salvarHistoricoMemoria(tentativasMemoria) {
    const entrada = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      data: new Date().toISOString().slice(0, 10),
      tipo: "memoria",
      acertou: true,
      tentativas: tentativasMemoria,
    };

    try {
      const historico = JSON.parse(localStorage.getItem(keyHistorico)) || [];
      historico.push(entrada);
      localStorage.setItem(keyHistorico, JSON.stringify(historico));
    } catch {
      localStorage.setItem(keyHistorico, JSON.stringify([entrada]));
    }
  }

  function verificar() {
    setTentativas((t) => t + 1);
    const acertou = resposta.trim() === seq;
    salvarHistoricoSequencia(acertou);

    if (acertou) {
      setAcertos((a) => a + 1);
      setMsg("✅ Mandou bem! Próxima sequência…");
      setNivel((n) => n + 1);
      setTimeout(novaSeq, 600);
    } else {
      setMsg(`❌ Quase! A resposta era ${seq}`);
      setNivel(1);
      setTimeout(novaSeq, 600);
    }
  }

  return (
    <div className="container">
      <section className="section card-lg">
        <h1>🧠 Exercícios de Memória</h1>
        <p className="lead">Escolha uma atividade para treinar sua mente.</p>

        <div className="btn-row" style={{ marginBottom: 20 }}>
          <button
            className={`btn ${atividade === "sequencia" ? "" : "btn-ghost"}`}
            onClick={() => setAtividade("sequencia")}
          >
            🔢 Sequência Numérica
          </button>
          <button
            className={`btn ${atividade === "memoria" ? "" : "btn-ghost"}`}
            onClick={() => setAtividade("memoria")}
          >
            🧠 Jogo de Cartas
          </button>
        </div>

        {atividade === "sequencia" ? (
          <div className="grid-2">
            <div>
              <h2>Exercício de Sequência</h2>
              <p>Observe a sequência, depois digite exatamente como viu.</p>

              <div style={{ margin: "14px 0 18px" }}>
                {mostrar ? (
                  <div className="kbd" style={{ fontSize: 22, letterSpacing: 6 }}>
                    {passos.join(" ")}
                  </div>
                ) : (
                  <div className="kbd" style={{ opacity: 0.6 }}>Sequência oculta. Digite abaixo.</div>
                )}
              </div>

              <label className="label">Sua resposta</label>
              <input
                className="input"
                placeholder="Digite a sequência aqui"
                value={resposta}
                onChange={(e) => setResposta(e.target.value.replace(/\s+/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && verificar()}
              />

              <div className="btn-row" style={{ marginTop: 12 }}>
                <button className="btn" onClick={verificar}>Verificar</button>
                <button className="btn btn-ghost" onClick={novaSeq}>Nova Sequência</button>
              </div>

              {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
            </div>

            <div>
              <div className="stat">
                <b>Nível {nivel}</b>
                <span> • </span>
                <span>Acertos: <b>{acertos}</b></span>
                <span>•</span>
                <span>Tentativas: <b>{tentativas}</b></span>
              </div>
              <p style={{ marginTop: 10, color: "#466574" }}>
                Dica: tente agrupar os números em pares/tríades para facilitar a retenção.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 20 }}>
            <h2>Jogo de Cartas</h2>
            <p>Encontre os pares iguais. Clique nas cartas para revelar.</p>
            <MemoryGame onFinish={(tentativas) => salvarHistoricoMemoria(tentativas)} />
          </div>
        )}
      </section>
    </div>
  );
}
