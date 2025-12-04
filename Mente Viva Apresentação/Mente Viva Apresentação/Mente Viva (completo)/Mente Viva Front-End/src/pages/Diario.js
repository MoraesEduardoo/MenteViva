import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";

const MOODS = [
  { k: "feliz", label: "Feliz", emoji: "😊" },
  { k: "neutro", label: "Neutro", emoji: "😐" },
  { k: "triste", label: "Triste", emoji: "😔" },
];

const QUICK_TAGS = ["família", "saúde", "passeio", "lembrança", "amigos", "tarefas"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Diario() {
  const { user } = useAuth();
  const key = useMemo(() => `mv_diary_${user?.email || "anon"}`, [user]);
  const draftKey = useMemo(() => `${key}_draft`, [key]);

  const [lista, setLista] = useState([]);
  const [texto, setTexto] = useState("");
  const [mood, setMood] = useState("neutro");
  const [tags, setTags] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroMood, setFiltroMood] = useState("todos");
  const [ordem, setOrdem] = useState("desc");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setLista(JSON.parse(raw));
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const d = JSON.parse(draft);
        setTexto(d.texto || "");
        setMood(d.mood || "neutro");
        setTags(d.tags || []);
      }
    } catch {}
  }, [key, draftKey]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(lista));
  }, [key, lista]);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify({ texto, mood, tags }));
    }, 400);
    return () => clearTimeout(t);
  }, [draftKey, texto, mood, tags]);

  const chars = texto.length;
  const maxChars = 1000;

  function toggleTag(t) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  function limparForm() {
    setTexto("");
    setMood("neutro");
    setTags([]);
    setEditId(null);
    localStorage.removeItem(draftKey);
  }

  // 🔥🔥🔥 FUNÇÃO SALVAR COM DEBUG COMPLETO
  async function salvar() {
    if (!texto.trim()) return;

    const payload = {
      texto: texto.trim(),
      mood,
      tags,
      data: todayISO()
    };

    // DEBUG: MOSTRAR TUDO NO CONSOLE
    console.log("=== DEBUG SALVAR ===");
    console.log("ENVIANDO PARA API:", payload);
    console.log("TOKEN:", user?.token);
    console.log("EMAIL:", user?.email);
    console.log("====================");

    try {
      const resp = await fetch("http://localhost:3000/api/diario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("RESPOSTA DO BACKEND:", resp.status);

      if (!resp.ok) {
        console.error("ERRO DO BACKEND:", await resp.text());
      }
    } catch (err) {
      console.error("ERRO AO ENVIAR PARA O SERVIDOR:", err);
    }

    // Salvar local
    const base = {
      id: editId || crypto.randomUUID(),
      data: todayISO(),
      ts: Date.now(),
      texto: texto.trim(),
      mood,
      tags,
    };

    setLista(prev => {
      if (editId) {
        return prev.map(n => (n.id === editId ? { ...base, ts: n.ts } : n));
      }
      return [...prev, base];
    });

    limparForm();
  }

  function editar(nota) {
    setEditId(nota.id);
    setTexto(nota.texto);
    setMood(nota.mood);
    setTags(nota.tags || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function apagar(id) {
    if (window.confirm("Excluir esta anotação?")) {
      setLista(prev => prev.filter(n => n.id !== id));
    }
  }

  const filtrada = React.useMemo(() => {
    let arr = [...lista];
    if (busca.trim()) {
      const b = busca.trim().toLowerCase();
      arr = arr.filter(n =>
        n.texto.toLowerCase().includes(b) ||
        (n.tags || []).some(t => t.toLowerCase().includes(b))
      );
    }
    if (filtroMood !== "todos") {
      arr = arr.filter(n => n.mood === filtroMood);
    }
    arr.sort((a, b) => (ordem === "desc" ? b.ts - a.ts : a.ts - b.ts));
    return arr;
  }, [lista, busca, filtroMood, ordem]);

  return (
    <div className="container">
      <section className="section card-lg">
        <h1>Diário de Memória</h1>
        <p className="lead">Anote lembranças, pensamentos e momentos do dia.</p>

        <div className="btn-row" style={{ marginTop: 10 }}>
          {MOODS.map(m => (
            <button
              key={m.k}
              type="button"
              className={"btn " + (mood === m.k ? "" : "btn-ghost")}
              onClick={() => setMood(m.k)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <div className="btn-row" style={{ marginTop: 10 }}>
          {QUICK_TAGS.map(t => (
            <button
              key={t}
              type="button"
              className={"btn " + (tags.includes(t) ? "" : "btn-ghost")}
              onClick={() => toggleTag(t)}
            >
              #{t}
            </button>
          ))}
        </div>

        <label className="label" style={{ marginTop: 12 }}>
          Sua anotação ({chars}/{maxChars})
        </label>
        <textarea
          className="input"
          rows={6}
          maxLength={maxChars}
          placeholder="Escreva suas lembranças aqui..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          style={{ resize: "vertical" }}
        />

        <div className="btn-row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={salvar}>
            {editId ? "Salvar alterações" : "Salvar Anotação"}
          </button>
          {editId && (
            <button className="btn btn-ghost" onClick={limparForm}>Cancelar</button>
          )}
        </div>
      </section>

      <section className="section card-lg">
        <div className="grid-2" style={{ alignItems: "end" }}>
          <div>
            <label className="label">Buscar</label>
            <input
              className="input"
              placeholder="Procure por texto ou #tag"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <div className="btn-row">
            <select className="input" value={filtroMood} onChange={e => setFiltroMood(e.target.value)}>
              <option value="todos">Todos os humores</option>
              {MOODS.map(m => (
                <option key={m.k} value={m.k}>{m.label}</option>
              ))}
            </select>
            <select className="input" value={ordem} onChange={e => setOrdem(e.target.value)}>
              <option value="desc">Mais recentes primeiro</option>
              <option value="asc">Mais antigas primeiro</option>
            </select>
          </div>
        </div>

        {filtrada.length === 0 ? (
          <p style={{ marginTop: 16 }}>Sem anotações ainda.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {filtrada.map(n => (
              <article key={n.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className="kbd">{MOODS.find(m => m.k === n.mood)?.emoji}</span>
                    <span>{new Date(n.ts).toLocaleString()}</span>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-ghost" onClick={() => editar(n)}>Editar</button>
                    <button className="btn btn-ghost" onClick={() => apagar(n.id)}>Apagar</button>
                  </div>
                </div>

                <p style={{ margin: "10px 0", whiteSpace: "pre-wrap" }}>{n.texto}</p>

                {n.tags?.length > 0 && (
                  <div className="btn-row" style={{ marginTop: 6 }}>
                    {n.tags.map(t => (
                      <span key={t} className="kbd">#{t}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
