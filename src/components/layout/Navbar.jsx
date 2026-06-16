import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import SoteloLogo from '../common/SoteloLogo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <SoteloLogo size="sm" />
        </Link>

        {/* Links desktop */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link${isActive('/') ? ' active' : ''}`}>Inicio</Link>
          <Link to="/propiedades" className={`nav-link${isActive('/propiedades') ? ' active' : ''}`}>Propiedades</Link>
          {user && (
            <Link to="/mis-propiedades" className={`nav-link${isActive('/mis-propiedades') ? ' active' : ''}`}>Mis Publicaciones</Link>
          )}
        </div>

        {/* Acciones desktop */}
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="nav-user">Hola, {user.name?.split(' ')[0]}</span>
              <Link to="/nueva-propiedad" className="btn-nav-primary">+ Publicar</Link>
              <button className="btn-nav-ghost" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost">Ingresar</Link>
              <Link to="/registro" className="btn-nav-primary">Registrarse</Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/propiedades" className="mobile-link" onClick={() => setMenuOpen(false)}>Propiedades</Link>
          {user && (
            <Link to="/mis-propiedades" className="mobile-link" onClick={() => setMenuOpen(false)}>Mis Publicaciones</Link>
          )}
          <div className="mobile-divider" />
          {user ? (
            <>
              <Link to="/nueva-propiedad" className="mobile-link red" onClick={() => setMenuOpen(false)}>+ Publicar propiedad</Link>
              <button className="mobile-link" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Ingresar</Link>
              <Link to="/registro" className="mobile-link red" onClick={() => setMenuOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          background: #fff;
          border-bottom: 2px solid #CC0000;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,.08);
        }
        .navbar-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; gap: 24px;
          padding: 0 24px; height: 68px;
        }
        .navbar-brand { display: flex; align-items: center; flex-shrink: 0; }
        .navbar-links { display: flex; gap: 4px; flex: 1; }
        .nav-link {
          padding: 8px 14px; border-radius: 6px; font-size: .9rem;
          font-weight: 500; color: var(--gray-600); transition: all .15s;
        }
        .nav-link:hover { color: var(--red); background: var(--red-light); }
        .nav-link.active { color: var(--red); font-weight: 700; }
        .navbar-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .nav-user { font-size: .875rem; color: var(--gray-500); font-weight: 500; }
        .btn-nav-primary {
          padding: 8px 18px; background: var(--red); color: #fff;
          border-radius: 6px; font-weight: 600; font-size: .875rem;
          border: none; transition: background .15s; white-space: nowrap;
        }
        .btn-nav-primary:hover { background: var(--red-dark); }
        .btn-nav-ghost {
          padding: 8px 16px; background: transparent; color: var(--gray-600);
          border-radius: 6px; font-weight: 500; font-size: .875rem;
          border: 1.5px solid var(--gray-200); transition: all .15s; white-space: nowrap;
        }
        .btn-nav-ghost:hover { border-color: var(--red); color: var(--red); }
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          width: 36px; height: 36px; background: none; border: none;
          justify-content: center; align-items: center; padding: 6px;
        }
        .hamburger span {
          display: block; height: 2px; width: 22px;
          background: var(--gray-800); border-radius: 2px; transition: all .2s;
        }
        .mobile-menu {
          display: flex; flex-direction: column;
          background: #fff; border-top: 1px solid var(--gray-100);
          padding: 12px 0;
        }
        .mobile-link {
          padding: 13px 24px; font-size: .9375rem; font-weight: 500;
          color: var(--gray-700); background: none; border: none;
          text-align: left; transition: background .15s;
        }
        .mobile-link:hover { background: var(--gray-50); }
        .mobile-link.red { color: var(--red); }
        .mobile-divider { height: 1px; background: var(--gray-100); margin: 8px 0; }
        @media (max-width: 768px) {
          .navbar-links, .navbar-actions { display: none; }
          .hamburger { display: flex; margin-left: auto; }
        }
      `}</style>
    </nav>
  )
}
