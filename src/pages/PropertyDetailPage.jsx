import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { propertiesAPI } from '../services/apiServices'
import { useAuth } from '../context/AuthContext'
import PropertyModal from '../components/properties/PropertyModal'

function formatPrice(price, currency) {
  const symbol = currency === 'USD' ? 'USD' : '$'
  return `${symbol} ${price.toLocaleString('es-AR')}`
}

const STATUS_LABELS = { disponible: 'Disponible', reservado: 'Reservado', vendido: 'Vendido / Alquilado' }
const STATUS_COLORS = {
  disponible: { bg: '#dcfce7', color: '#166534' },
  reservado: { bg: '#fef9c3', color: '#854d0e' },
  vendido: { bg: '#fee2e2', color: '#991b1b' },
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    propertiesAPI.getById(id)
      .then(({ data }) => setProperty(data))
      .catch(() => setError('Propiedad no encontrada'))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (data) => {
    const { data: updated } = await propertiesAPI.update(id, data)
    setProperty(updated)
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    await propertiesAPI.delete(id)
    navigate('/mis-propiedades')
  }

  const isOwner = user && property && property.user?._id === user.id

  if (loading) return <div className="loading-screen"><span className="spinner" /></div>
  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: 'var(--gray-500)', marginBottom: 16 }}>{error}</p>
      <Link to="/propiedades" className="btn-primary">← Volver</Link>
    </div>
  )

  const statusStyle = STATUS_COLORS[property.status]

  return (
    <div className="detail-wrap">
      <div className="detail-inner">
        <Link to="/propiedades" className="back-link">← Volver a propiedades</Link>

        <div className="detail-grid">
          {/* Galería fotos */}
          <div className="gallery">
            {property.photos?.length > 0 ? (
              <>
                <div className="gallery-main">
                  <img src={property.photos[activePhoto]} alt={property.title} />
                  <span className={`op-badge op-${property.operationType}`}>
                    {property.operationType === 'venta' ? 'Venta' : 'Alquiler'}
                  </span>
                </div>
                {property.photos.length > 1 && (
                  <div className="gallery-thumbs">
                    {property.photos.map((ph, i) => (
                      <img key={i} src={ph} alt="" className={i === activePhoto ? 'active' : ''}
                        onClick={() => setActivePhoto(i)} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-photo">🏠<p>Sin fotos</p></div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-top">
              <h1 className="detail-title">{property.title}</h1>
              <span className="detail-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                {STATUS_LABELS[property.status]}
              </span>
            </div>

            <div className="detail-price">{formatPrice(property.price, property.currency)}</div>

            {property.neighborhood && (
              <p className="detail-location">📍 {property.neighborhood}{property.address ? ` — ${property.address}` : ''}</p>
            )}

            <div className="detail-specs">
              {property.rooms && <div className="spec-item"><span className="spec-icon">🛏</span><div><span>{property.rooms}</span><small>Ambientes</small></div></div>}
              {property.surfaceM2 && <div className="spec-item"><span className="spec-icon">📐</span><div><span>{property.surfaceM2} m²</span><small>Superficie</small></div></div>}
              {property.propertyType && <div className="spec-item"><span className="spec-icon">🏘</span><div><span>{property.propertyType.name}</span><small>Tipo</small></div></div>}
            </div>

            {property.description && (
              <div className="detail-desc">
                <h3>Descripción</h3>
                <p>{property.description}</p>
              </div>
            )}

            <div className="detail-meta">
              <small>Publicado por: <strong>{property.user?.name}</strong></small>
              <small>Fecha: {new Date(property.createdAt).toLocaleDateString('es-AR')}</small>
            </div>

            {isOwner && (
              <div className="owner-actions">
                <button className="btn-ghost" onClick={() => setShowEdit(true)}>Editar propiedad</button>
                <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <PropertyModal property={property} onClose={() => setShowEdit(false)} onSave={handleUpdate} />
      )}

      <style>{`
        .detail-wrap { padding: clamp(20px, 4vw, 48px) 24px; }
        .detail-inner { max-width: 1100px; margin: 0 auto; }
        .back-link { color: var(--red); font-weight: 600; font-size: .9rem; display: inline-block; margin-bottom: 24px; }
        .back-link:hover { text-decoration: underline; }
        .detail-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; }
        .gallery-main { position: relative; border-radius: var(--radius); overflow: hidden; aspect-ratio: 4/3; background: var(--gray-100); }
        .gallery-main img { width: 100%; height: 100%; object-fit: cover; }
        .op-badge { position: absolute; top: 12px; left: 12px; padding: 5px 12px; border-radius: 20px; font-size: .8rem; font-weight: 700; }
        .op-venta { background: var(--red); color: #fff; }
        .op-alquiler { background: #1d4ed8; color: #fff; }
        .gallery-thumbs { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
        .gallery-thumbs img { width: 72px; height: 54px; object-fit: cover; border-radius: 6px; cursor: pointer; opacity: .65; border: 2px solid transparent; transition: all .15s; }
        .gallery-thumbs img.active, .gallery-thumbs img:hover { opacity: 1; border-color: var(--red); }
        .no-photo { background: var(--gray-100); border-radius: var(--radius); aspect-ratio: 4/3; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--gray-400); font-size: 3rem; gap: 8px; }
        .no-photo p { font-size: .9rem; }
        .detail-info { display: flex; flex-direction: column; gap: 16px; }
        .detail-top { display: flex; align-items: flex-start; gap: 12px; }
        .detail-title { font-size: clamp(1.25rem, 3vw, 1.75rem); font-weight: 800; flex: 1; }
        .detail-status { font-size: .8rem; padding: 5px 12px; border-radius: 20px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
        .detail-price { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 800; color: var(--red); }
        .detail-location { color: var(--gray-600); font-size: .9375rem; }
        .detail-specs { display: flex; gap: 16px; flex-wrap: wrap; }
        .spec-item { display: flex; align-items: center; gap: 8px; background: var(--gray-50); padding: 10px 14px; border-radius: 8px; }
        .spec-icon { font-size: 1.25rem; }
        .spec-item span { font-weight: 700; font-size: .9375rem; display: block; }
        .spec-item small { color: var(--gray-500); font-size: .75rem; }
        .detail-desc h3 { font-size: .875rem; font-weight: 700; color: var(--gray-600); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
        .detail-desc p { color: var(--gray-700); line-height: 1.75; white-space: pre-wrap; }
        .detail-meta { display: flex; flex-direction: column; gap: 4px; color: var(--gray-500); font-size: .8125rem; padding-top: 12px; border-top: 1px solid var(--gray-100); }
        .detail-meta strong { color: var(--gray-700); }
        .owner-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-danger { padding: 10px 20px; border-radius: var(--radius-sm); border: none; background: #fef2f2; color: #dc2626; font-weight: 600; cursor: pointer; }
        .btn-danger:hover { background: #fee2e2; }
        @media (max-width: 800px) {
          .detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
