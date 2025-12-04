// src/auth/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  // carrega usuário salvo
  useEffect(() => {
    const raw = localStorage.getItem("mv_auth");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        console.error("Falha ao ler mv_auth do localStorage");
      }
    }
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem("mv_auth", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mv_auth");
    localStorage.removeItem("mv_token"); // limpa token da API
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}