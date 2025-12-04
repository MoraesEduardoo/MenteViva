import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Diario from './pages/Diario'; // Certifique-se de que este componente inclui AudioCapture
import ExerciseMemory from './pages/ExerciseMemory';
import Historico from './pages/Historico';
import Institucional from './pages/Institucional';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import MemoryGame from './pages/MemoryGame';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Institucional />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/exercicios" element={<ProtectedRoute><ExerciseMemory /></ProtectedRoute>} />
          <Route path="/diario" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
          <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
          <Route path="/memoria" element={<ProtectedRoute><MemoryGame /></ProtectedRoute>} />

          <Route path="*" element={<h2 style={{ padding: 24 }}>Página não encontrada (404)</h2>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
