import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const cx = ({ isActive }) => "nav-link" + (isActive ? " nav-active" : "");

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <img src="/imagens/logo-mente-viva.png" alt="Mente Viva" />
          <span>Mente Viva</span>
        </Link>

        <div className="links">
          <NavLink className={cx} to="/">Início</NavLink>

          {isAuthenticated && (
            <>
              <NavLink className={cx} to="/exercicios">Exercícios</NavLink>
              <NavLink className={cx} to="/diario">Diário</NavLink>
              <NavLink className={cx} to="/historico">Histórico</NavLink>
              <NavLink className={cx} to="/perfil">Perfil</NavLink>
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink className={cx} to="/login">Entrar</NavLink>
              <NavLink className={cx} to="/cadastro">Cadastrar</NavLink>
            </>
          )}

          {isAuthenticated && (
            <button onClick={logout} className="nav-link" style={{ border: 'none', cursor: 'pointer' }}>
              Sair {user?.name ? `(${user.name})` : ''}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
