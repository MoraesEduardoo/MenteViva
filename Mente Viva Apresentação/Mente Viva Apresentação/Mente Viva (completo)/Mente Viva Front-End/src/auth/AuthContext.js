import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const raw = localStorage.getItem('mv_auth');
    if (raw) {
      try { 
        setUser(JSON.parse(raw)); 
      } catch {}
    }
  }, []);

  // Login NORMALIZADO
  const login = (data) => {
    // Backend retorna:
    // { message, token, user: { _id, email, nome } }

    const normalized = {
      token: data.token,
      email: data.user.email,
      nome: data.user.nome,
      id: data.user._id
    };

    setUser(normalized);
    localStorage.setItem('mv_auth', JSON.stringify(normalized));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mv_auth');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
