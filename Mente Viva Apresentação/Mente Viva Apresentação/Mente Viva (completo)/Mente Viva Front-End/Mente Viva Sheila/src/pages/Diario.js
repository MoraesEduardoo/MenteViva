// src/pages/Diario.js
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { API_URL } from "../config/api";

const MOODS = [
  { k: "feliz", label: "Feliz", emoji: "😊" },
  { k: "neutro", label: "Neutro", emoji: "😐" },
  { k: "triste", label: "Triste", emoji: "😔" },
];

const QUICK_TAGS = ["família", "saúde", "passeio", "lembrança", "amigos", "tarefas"];

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function Diario() {
  const { user } = useAuth();
  const draftKey = useMemo(
    () => `mv_diary_draft_${user?.email || "anon"}`,
    [user]
  );

  const [lista, setLista] = useState([]);
  const [texto, setTexto] = useState("");
  const [mood, setMood] = useState("neutro");
  const [tags, setTags] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroMood, setFiltroMood] = useState("todos");
  const [ordem, setOrdem] = useState("desc");
  const [editId, setEditId] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // carregar lista do backend + rascunho local
  useEffect(() => {
    async function carregar() {
      const token = localStorage.getItem("mv_token");
      if (!token) return;

      try {
        setCarregando(true);
        const resp = await fetch(`${API_URL}/api/diario`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (resp.ok) {
          const dados = await resp.json();
          setLista(dados || []);
        }
      } catch (err) {
        console.error("Erro ao buscar diário:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregar();

    // carrega rascunho
    try {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const d = JSON.parse(draft);
        setTexto(d.texto || "");
        setMood(d.mood || "neutro");
        setTags(d.tags || []);
      }
    } catch {}
  }, [draftKey]);

  // autosave rascunho
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ texto, mood, tags })
      );
    }, 400);
    return () => clearTimeout(t);
  }, [draftKey, texto, mood, tags]);

  const chars = texto.length;
  const maxChars = 1000;

  function toggleTag(t) {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function limparForm() {
    setTexto("");
    setMood("neutro");
    setTags([]);
    setEditId(null);
    localStorage.removeItem(draftKey);
  }

  async function salvar() {
    if (!texto.trim()) return;

    const token = localStorage.getItem("mv_token");
    if (!token) {
      alert("Você precisa estar logado para salvar o diário.");
      return;
    }

    const payload = {
      texto: texto.trim(),
      mood,
      tags,
      data: todayISO(),
    };

    try {
      if (editId) {
        // edição
        const resp = await fetch(`${API_URL}/api/diario/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) throw new Error("Erro ao editar anotação.");

        const atualizado = await resp.json();
        setLista((prev) =>
          prev.map((n) => (n._id === editId ? atualizado : n))
        );
      } else {
        // criação
        const resp = await fetch(`${API_URL}/api/diario`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) throw new Error("Erro ao salvar anotação.");

        const novo = await resp.json();
        setLista((prev) => [...prev, novo]);
      }

      limparForm();
    } catch (err) {
      console.error(err);
      alert("Não foi possível salvar sua anotação. Tente novamente.");
    }
  }

  function editar(nota) {
    setEditId(nota._id);
    setTexto(nota.texto);
    setMood(nota.mood);
    setTags(nota.tags || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function apagar(id) {
    if (!window.confirm("Excluir esta anotação?")) return;

    const token = localStorage.getItem("mv_token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/diario/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) throw new Error("Erro ao excluir anotação.");

      setLista((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
      alert("Não foi possível excluir. Tente novamente.");
    }
  }

  // filtros
  const filtrada = useMemo(() => {
    let arr = [...lista];
    if (busca.trim()) {
      const b = busca.trim().toLowerCase();
      arr = arr.filter(
        (n) =>
          n.texto.toLowerCase().includes(b) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(b))
      );
    }
    if (filtroMood !== "todos") {
      arr = arr.filter((n) => n.mood === filtroMood);
    }
    arr.sort((a, b) =>
      ordem === "desc"
        ? new Date(b.ts).getTime() - new Date(a.ts).getTime()
        : new Date(a.ts).getTime() - new Date(b.ts).getTime()
    );
    return arr;
  }, [lista, busca, filtroMood, ordem]);

  return (
    <div className="container">
      {/* FORM */}
      <section className="section card-lg">
        <h1>Diário de Memória</h1>
        <p className="lead">
          Anote lembranças, pensamentos e momentos do dia. Você pode marcar humor e tags.
        </p>

        <div className="btn-row" style={{ marginTop: 10 }}>
          {MOODS.map((m) => (
            <button
              key={m.k}
              type="button"
              className={"btn " + (mood === m.k ? "" : "btn-ghost")}
              onClick={() => setMood(m.k)}
              title={m.label}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <div className="btn-row" style={{ marginTop: 10 }}>
          {QUICK_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              className={"btn " + (tags.includes(t) ? "" : "btn-ghost")}
              onClick={() => toggleTag(t)}
              title={"Tag: " + t}
            >
              #{t}
            </button>
          ))}
        </div>

        <label className="label" style={{ marginTop: 12 }}>
          Sua anotação{" "}
          <span style={{ color: "#789" }}>
            ({chars}/{maxChars})
          </span>
        </label>
        <textarea
          className="input"
          rows={6}
          maxLength={maxChars}
          placeholder="Escreva suas lembranças aqui..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={{ resize: "vertical" }}
        />

        <div className="btn-row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={salvar}>
            {editId ? "Salvar alterações" : "Salvar Anotação"}
          </button>
          {editId && (
            <button className="btn btn-ghost" onClick={limparForm}>
              Cancelar
            </button>
          )}
        </div>

        {carregando && (
          <p style={{ marginTop: 10, color: "#567" }}>
            Carregando anotações...
          </p>
        )}
      </section>

      {/* LISTA */}
      <section className="section card-lg">
        <div className="grid-2" style={{ alignItems: "end" }}>
          <div>
            <label className="label">Buscar</label>
            <input
              className="input"
              placeholder="Procure por texto ou #tag"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="btn-row" style={{ justifyContent: "flex-end" }}>
            <select
              className="input"
              value={filtroMood}
              onChange={(e) => setFiltroMood(e.target.value)}
            >
              <option value="todos">Todos os humores</option>
              {MOODS.map((m) => (
                <option key={m.k} value={m.k}>
                  {m.emoji} {m.label}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
            >
              <option value="desc">Mais recentes primeiro</option>
              <option value="asc">Mais antigas primeiro</option>
            </select>
          </div>
        </div>

        {filtrada.length === 0 ? (
          <p style={{ marginTop: 16, color: "#567" }}>
            Sem anotações ainda.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {filtrada.map((n) => (
              <article key={n._id} className="card" style={{ padding: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className="kbd">
                      {MOODS.find((m) => m.k === n.mood)?.emoji}{" "}
                      {MOODS.find((m) => m.k === n.mood)?.label}
                    </span>
                    <span style={{ color: "#567" }}>
                      {new Date(n.ts).toLocaleString()}
                    </span>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-ghost" onClick={() => editar(n)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => apagar(n._id)}
                    >
                      Apagar
                    </button>
                  </div>
                </div>
                <p
                  style={{
                    margin: "10px 0 6px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {n.texto}
                </p>
                {n.tags?.length > 0 && (
                  <div className="btn-row" style={{ marginTop: 6 }}>
                    {n.tags.map((t) => (
                      <span key={t} className="kbd">
                        #{t}
                      </span>
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
