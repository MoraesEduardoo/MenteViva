// src/pages/Historico.js
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { API_URL } from "../config/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MOODS = {
  feliz: { label: "Feliz", color: "#37c978", emoji: "😊" },
  neutro: { label: "Neutro", color: "#f7c948", emoji: "😐" },
  triste: { label: "Triste", color: "#eb5e55", emoji: "😔" },
};

export default function Historico() {
  const { user } = useAuth();
  const [lista, setLista] = useState([]);

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
          setLista(dados || []);
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    }

    carregar();
  }, [user]);

  const dados = useMemo(() => {
    const byDay = {};
    lista.forEach((n) => {
      const dDate = new Date(n.ts);
      const diaLabel = dDate.toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
      });
      if (!byDay[diaLabel]) {
        byDay[diaLabel] = {
          dia: diaLabel,
          feliz: 0,
          neutro: 0,
          triste: 0,
          total: 0,
          ordem: dDate.getTime(),
        };
      }
      if (MOODS[n.mood]) {
        byDay[diaLabel][n.mood]++;
      }
      byDay[diaLabel].total++;
    });
    return Object.values(byDay).sort((a, b) => a.ordem - b.ordem);
  }, [lista]);

  const totalPorMood = useMemo(() => {
    const acc = { feliz: 0, neutro: 0, triste: 0 };
    lista.forEach((n) => {
      if (MOODS[n.mood]) acc[n.mood]++;
    });
    return acc;
  }, [lista]);

  const pieData = Object.entries(totalPorMood).map(([k, v]) => ({
    name: MOODS[k].label,
    value: v,
    color: MOODS[k].color,
  }));

  return (
    <div className="container">
      <section className="section card-lg">
        <h1>Histórico de Humor</h1>
        <p className="lead">Visualize suas anotações e humor ao longo do tempo.</p>

        {lista.length === 0 ? (
          <p style={{ marginTop: 12, color: "#567" }}>
            Sem dados ainda — escreva algo no Diário!
          </p>
        ) : (
          <div style={{ display: "grid", gap: 24, marginTop: 24 }}>
            <div className="card" style={{ padding: 20 }}>
              <h3>Humor por Dia</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={dados}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="feliz" stroke={MOODS.feliz.color} />
                  <Line type="monotone" dataKey="neutro" stroke={MOODS.neutro.color} />
                  <Line type="monotone" dataKey="triste" stroke={MOODS.triste.color} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <h3>Distribuição Geral</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" label outerRadius={100}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {pieData.map((m) => (
                  <span
                    key={m.name}
                    className="kbd"
                    style={{ background: m.color + "20" }}
                  >
                    {m.name}: {m.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
