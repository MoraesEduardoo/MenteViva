// src/pages/Dashboard.js
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [diary, setDiary] = useState([]);

  useEffect(() => {
    async function carregar() {
      const token = localStorage.getItem("mv_token");
      if (!token) return;

      try {
        const resp = await fetch(`${API_URL}/api/diario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.ok) {
          const dados = await resp.json();
          setDiary(dados || []);
        }
      } catch (err) {
        console.error("Erro ao carregar diário no dashboard:", err);
      }
    }

    carregar();
  }, [user]);

  const totalNotas = diary.length;
  const ultimaNota =
    diary
      .slice()
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())[0]
      ?.texto?.slice(0, 70) || "Nenhuma ainda.";

  const progresso = Math.min(100, (totalNotas / 10) * 100);

  const weeklyData = useMemo(() => {
    const score = { triste: 0, neutro: 1, feliz: 2 };
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        label: d.toLocaleDateString("pt-BR", { weekday: "short" }),
        pontos: null,
      });
    }

    const byDay = diary.reduce((acc, n) => {
      const k = new Date(n.ts).toISOString().slice(0, 10);
      if (!acc[k]) acc[k] = { soma: 0, qnt: 0 };
      acc[k].soma += score[n.mood] ?? 1;
      acc[k].qnt += 1;
      return acc;
    }, {});

    return days.map((d) => {
      const reg = byDay[d.key];
      const media = reg ? reg.soma / reg.qnt : null;
      return { dia: d.label, media };
    });
  }, [diary]);

  return (
    <div className="container">
      <section className="section card-lg">
        <h1>Olá, {user?.name || "Usuário"} 👋</h1>
        <p className="lead">Aqui está um resumo do seu progresso no Mente Viva.</p>

        <div className="grid-2" style={{ marginTop: 20 }}>
          <div className="card">
            <h3>Diário</h3>
            <p>
              Você registrou <b>{totalNotas}</b> lembranças.
            </p>
            <p style={{ color: "#567" }}>Última anotação:</p>
            <p style={{ fontStyle: "italic" }}>{ultimaNota}</p>
            <button className="btn" onClick={() => navigate("/diario")}>
              Abrir Diário
            </button>
          </div>

          <div className="card">
            <h3>Exercícios</h3>
            <p>Continue treinando sua memória e concentração.</p>
            <button className="btn" onClick={() => navigate("/exercicios")}>
              Ir para Exercícios
            </button>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3>Progresso Geral</h3>
          <div
            style={{
              marginTop: 10,
              background: "#dbe8ee",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progresso}%`,
                height: 20,
                background: "#0c3b57",
                transition: "width 0.5s",
              }}
            />
          </div>
          <p style={{ marginTop: 8 }}>
            {Math.round(progresso)}% completado (meta: 10 anotações)
          </p>
        </div>

        <div className="card" style={{ marginTop: 20, padding: 20 }}>
          <h3>Humor da Semana</h3>
          <p style={{ color: "#567", marginBottom: 10 }}>
            0 = Triste • 1 = Neutro • 2 = Feliz
          </p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={weeklyData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="dia" />
                <YAxis domain={[0, 2]} ticks={[0, 1, 2]} />
                <Tooltip />
                <Line type="monotone" dataKey="media" stroke="#37c978" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
