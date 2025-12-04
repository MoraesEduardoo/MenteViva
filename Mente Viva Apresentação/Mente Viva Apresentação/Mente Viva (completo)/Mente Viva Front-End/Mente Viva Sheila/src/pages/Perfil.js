import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function Perfil() {
  const { user, logout } = useAuth();
  const letra = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="container">
      <section className="section card-lg" style={{ maxWidth: 720, margin: "24px auto" }}>
        <h1>Perfil</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 10 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, background: "#0c3b57",
            color: "#fff", display: "grid", placeItems: "center", fontSize: 30, fontWeight: 700
          }}>
            {letra}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{user?.name || "Usuário"}</div>
            <div style={{ color: "#456a78" }}>{user?.email || "sem e-mail"}</div>
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: 18 }}>
          <button className="btn">Editar dados (em breve)</button>
          <button className="btn btn-ghost" onClick={logout}>Sair</button>
        </div>
      </section>
    </div>
  );
}
