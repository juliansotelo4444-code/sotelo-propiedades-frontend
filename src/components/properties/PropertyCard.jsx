import { Link } from 'react-router-dom'

const STATUS_COLORS = {
  disponible: { bg: '#dcfce7', color: '#166534' },
  reservado: { bg: '#fef9c3', color: '#854d0e' },
  vendido: { bg: '#fee2e2', color: '#991b1b' },
}

const STATUS_LABELS = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido / Alquilado',
}

// Formatea precios: 150000 → $150.000
function formatPrice(price, currency) {
  const symbol = currency === 'USD' ? 'USD' : '$'
  return `${symbol} ${price.toLocaleString('es-AR')}`
}

export default function PropertyCard({ property, onEdit, onDelete }) {
  const mainPhoto = property.photos?.[0] || null
  const statusStyle = STATUS_COLORS[property.status] || STATUS_COLORS.disponible

  return (
    <div className="prop-card">
      {/* Imagen */}
      <Link to={`/propiedades/${property._id}`} className="prop-img-wrap">
        {mainPhoto ? (
          <img src={mainPhoto} alt={property.title} className="prop-img" />
        ) : (
          <div className="prop-img-placeholder">
            <span>🏠</span>
            <p>Sin foto</p>
          </div>
        )}
        {/* Badge operación */}
        <span className={`op-badge op-${property.operationType}`}>
          {property.operationType === 'venta' ? 'Venta' : 'Alquiler'}
        </span>
      </Link>

      {/* Contenido */}
      <div className="prop-body">
        <div className="prop-header">
          <Link to={`/propiedades/${property._id}`} className="prop-title">
            {property.title}
          </Link>
          <span className="prop-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
            {STATUS_LABELS[property.status]}
          </span>
        </div>

        {property.neighborhood && (
          <p className="prop-location">📍 {property.neighborhood}</p>
        )}

        <div className="prop-specs">
          {property.rooms && <span>🛏 {property.rooms} amb.</span>}
          {property.surfaceM2 && <span>📐 {property.surfaceM2} m²</span>}
          {property.propertyType && <span>🏘 {property.propertyType.name}</span>}
        </div>

        <div className="prop-footer">
          <span className="prop-price">{formatPrice(property.price, property.currency)}</span>
          {(onEdit || onDelete) && (
            <div className="prop-actions">
              {onEdit && (
                <button className="prop-btn-edit" onClick={() => onEdit(property)}>Editar</button>
              )}
              {onDelete && (
                <button className="prop-btn-delete" onClick={() => onDelete(property._id)}>Eliminar</button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .prop-card {
          background: #fff;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: transform .2s, box-shadow .2s;
          display: flex; flex-direction: column;
        }
        .prop-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        .prop-img-wrap {
          display: block; position: relative;
          height: 200px; overflow: hidden; background: var(--gray-100);
        }
        .prop-img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
        .prop-card:hover .prop-img { transform: scale(1.03); }
        .prop-img-placeholder {
          height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          color: var(--gray-400); font-size: .875rem; gap: 8px;
        }
        .prop-img-placeholder span { font-size: 2.5rem; }
        .op-badge {
          position: absolute; top: 12px; left: 12px;
          padding: 4px 10px; border-radius: 20px;
          font-size: .75rem; font-weight: 700; letter-spacing: .5px;
        }
        .op-venta { background: var(--red); color: #fff; }
        .op-alquiler { background: #1d4ed8; color: #fff; }
        .prop-body { padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .prop-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .prop-title {
          font-size: 1rem; font-weight: 700; color: var(--gray-900);
          line-height: 1.3; flex: 1;
        }
        .prop-title:hover { color: var(--red); }
        .prop-status {
          font-size: .7rem; padding: 3px 8px; border-radius: 20px;
          font-weight: 600; white-space: nowrap; flex-shrink: 0;
        }
        .prop-location { font-size: .875rem; color: var(--gray-500); }
        .prop-specs { display: flex; flex-wrap: wrap; gap: 10px; font-size: .8125rem; color: var(--gray-600); }
        .prop-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; border-top: 1px solid var(--gray-100); }
        .prop-price { font-size: 1.125rem; font-weight: 800; color: var(--red); }
        .prop-actions { display: flex; gap: 6px; }
        .prop-btn-edit {
          padding: 5px 12px; border-radius: 5px; border: 1px solid var(--gray-200);
          background: transparent; color: var(--gray-700); font-size: .8125rem; font-weight: 500;
        }
        .prop-btn-edit:hover { background: var(--gray-50); }
        .prop-btn-delete {
          padding: 5px 12px; border-radius: 5px; border: none;
          background: #fef2f2; color: #dc2626; font-size: .8125rem; font-weight: 500;
        }
        .prop-btn-delete:hover { background: #fee2e2; }
      `}</style>
    </div>
  )
}
