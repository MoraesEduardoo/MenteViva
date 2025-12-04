import React, { useEffect, useMemo, useState } from "react";

const DIGITOS = "123456789";
const rand = (n) => Math.floor(Math.random() * n);

function gerarSequencia(tamanho) {
  let s = "";
  for (let i = 0; i < tamanho; i++) s += DIGITOS[rand(DIGITOS.length)];
  return s;
}

export default function Exercicios() {
  const [nivel, setNivel] = useState(1);
  const [seq, setSeq] = useState(gerarSequencia(3));
  const [mostrar, setMostrar] = useState(true);
  const [resposta, setResposta] = useState("");
  const [acertos, setAcertos] = useState(0);
  const [tentativas, setTentativas] = useState(0);
  const [msg, setMsg] = useState("");

  // sequência “espelhada” para exibir aos poucos
  const passos = useMemo(() => seq.split(""), [seq]);

  useEffect(() => {
    setMostrar(true);
    setResposta("");
    setMsg("");
    // esconde a sequência após 1.8s
    const t = setTimeout(() => setMostrar(false), 1800 + nivel * 150);
    return () => clearTimeout(t);
  }, [seq, nivel]);

  function novaSeq() {
    const base = 3 + Math.min(nivel - 1, 4);
    setSeq(gerarSequencia(base));
  }

  function verificar() {
    setTentativas((t) => t + 1);
    if (resposta.trim() === seq) {
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
        <div className="grid-2">
          {/* Coluna A */}
          <div>
            <h1>Exercício de Memória</h1>
            <p className="lead">Observe a sequência, depois digite exatamente como viu.</p>

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

          {/* Coluna B */}
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
      </section>
    </div>
  );
}
