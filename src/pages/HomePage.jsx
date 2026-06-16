import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { propertiesAPI } from '../services/apiServices'
import PropertyCard from '../components/properties/PropertyCard'
import SoteloLogo from '../components/common/SoteloLogo'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      propertiesAPI.getAll({ status: 'disponible' }),
      propertiesAPI.getStats(),
    ]).then(([propsRes, statsRes]) => {
      setFeatured(propsRes.data.slice(0, 6))
      setStats(statsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-logo">
            <SoteloLogo size="lg" dark />
          </div>
          <h1 className="hero-title">Tu próxima propiedad<br />está acá</h1>
          <p className="hero-sub">Propiedades en venta y alquiler. Gestionadas por martillero público matriculado.</p>
          <div className="hero-btns">
            <Link to="/propiedades?operationType=venta" className="hero-btn-primary">Ver en venta</Link>
            <Link to="/propiedades?operationType=alquiler" className="hero-btn-ghost">Ver en alquiler</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="stats-bar">
          <div className="stats-inner">
            <div className="stat-item">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-lbl">Propiedades</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">{stats.disponible}</span>
              <span className="stat-lbl">Disponibles</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">{stats.reservado}</span>
              <span className="stat-lbl">Reservadas</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">{stats.vendido}</span>
              <span className="stat-lbl">Vendidas</span>
            </div>
          </div>
        </section>
      )}

      {/* Propiedades destacadas */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Propiedades disponibles</h2>
            <Link to="/propiedades" className="section-link">Ver todas →</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <span className="spinner" />
            </div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <span>🏠</span>
              <p>Todavía no hay propiedades publicadas.</p>
              <Link to="/registro" className="btn-primary">Registrate y publicá</Link>
            </div>
          ) : (
            <div className="props-grid">
              {featured.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>¿Tenés una propiedad para vender o alquilar?</h2>
          <p>Registrate gratis y publicá tu propiedad. Llegá a más compradores.</p>
          <Link to="/registro" className="cta-btn">Publicar propiedad</Link>
        </div>
      </section>

      <style>{`
        .hero {
          background: var(--gray-900);
          padding: clamp(60px, 10vw, 100px) 24px;
          text-align: center;
        }
        .hero-inner { max-width: 700px; margin: 0 auto; }
        .hero-logo { display: flex; justify-content: center; margin-bottom: 32px; }
        .hero-title {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 16px;
        }
        .hero-sub { color: var(--gray-400); font-size: 1.125rem; margin-bottom: 36px; }
        .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .hero-btn-primary {
          padding: 14px 32px; background: var(--red); color: #fff;
          border-radius: 8px; font-weight: 700; font-size: 1rem; transition: background .15s;
        }
        .hero-btn-primary:hover { background: var(--red-dark); }
        .hero-btn-ghost {
          padding: 14px 32px; background: transparent; color: #fff;
          border-radius: 8px; font-weight: 600; font-size: 1rem;
          border: 2px solid rgba(255,255,255,.25); transition: border .15s;
        }
        .hero-btn-ghost:hover { border-color: rgba(255,255,255,.6); }
        .stats-bar { background: var(--red); padding: 24px; }
        .stats-inner {
          max-width: 800px; margin: 0 auto;
          display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap;
        }
        .stat-item { text-align: center; padding: 8px 40px; }
        .stat-num { display: block; font-size: 2rem; font-weight: 800; color: #fff; line-height: 1; }
        .stat-lbl { font-size: .875rem; color: rgba(255,255,255,.8); font-weight: 500; }
        .stat-divider { width: 1px; height: 44px; background: rgba(255,255,255,.25); }
        .section { padding: clamp(40px, 6vw, 72px) 24px; }
        .section-inner { max-width: 1280px; margin: 0 auto; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .section-title { font-size: clamp(1.25rem, 3vw, 1.75rem); font-weight: 800; }
        .section-link { color: var(--red); font-weight: 600; font-size: .9375rem; }
        .section-link:hover { text-decoration: underline; }
        .props-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .empty-state {
          text-align: center; padding: 60px 0; color: var(--gray-400);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .empty-state span { font-size: 3rem; }
        .cta-section { background: var(--gray-900); padding: clamp(48px, 8vw, 80px) 24px; text-align: center; }
        .cta-inner { max-width: 600px; margin: 0 auto; }
        .cta-inner h2 { font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 800; color: #fff; margin-bottom: 12px; }
        .cta-inner p { color: var(--gray-400); margin-bottom: 28px; font-size: 1.0625rem; }
        .cta-btn {
          display: inline-block; padding: 14px 36px; background: var(--red); color: #fff;
          border-radius: 8px; font-weight: 700; font-size: 1rem; transition: background .15s;
        }
        .cta-btn:hover { background: var(--red-dark); }
        @media (max-width: 600px) {
          .stat-item { padding: 8px 20px; }
          .stat-divider { display: none; }
        }
      `}</style>
    </div>
  )
}
