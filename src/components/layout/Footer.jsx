import SoteloLogo from '../common/SoteloLogo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <SoteloLogo size="sm" dark />
          <p className="footer-tagline">Tu hogar, nuestra prioridad.</p>
        </div>
        <div className="footer-links">
          <span className="footer-section-title">Propiedades</span>
          <a href="/propiedades?operationType=venta">En venta</a>
          <a href="/propiedades?operationType=alquiler">En alquiler</a>
        </div>
        <div className="footer-links">
          <span className="footer-section-title">Cuenta</span>
          <a href="/registro">Registrarse</a>
          <a href="/login">Ingresar</a>
          <a href="/nueva-propiedad">Publicar propiedad</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Sotelo Propiedades — Martillero Público</p>
      </div>
      <style>{`
        .footer {
          background: var(--gray-900);
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 48px 24px 32px;
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
        }
        .footer-tagline { color: var(--gray-400); font-size: .875rem; margin-top: 12px; }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-section-title { color: #fff; font-weight: 700; font-size: .875rem; margin-bottom: 4px; }
        .footer-links a { color: var(--gray-400); font-size: .875rem; transition: color .15s; }
        .footer-links a:hover { color: var(--red); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,.08);
          padding: 16px 24px;
          text-align: center;
        }
        .footer-bottom p { color: var(--gray-400); font-size: .8125rem; }
        @media (max-width: 640px) {
          .footer-inner { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </footer>
  )
}
