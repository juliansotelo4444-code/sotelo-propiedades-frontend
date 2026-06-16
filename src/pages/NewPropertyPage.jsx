import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertiesAPI, propertyTypesAPI } from '../services/apiServices'

export default function NewPropertyPage() {
  const navigate = useNavigate()
  const [types, setTypes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    operationType: 'venta',
    price: '',
    currency: 'USD',
    address: '',
    neighborhood: '',
    surfaceM2: '',
    rooms: '',
    status: 'disponible',
    propertyType: '',
    photos: '',
  })

  useEffect(() => {
    propertyTypesAPI.getAll().then(({ data }) => setTypes(data)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) { setError('El título es requerido'); return }
    if (!form.price || isNaN(form.price)) { setError('El precio es requerido y debe ser un número'); return }

    setLoading(true)
    try {
      // Las fotos se ingresan una por línea y las convertimos a array
      const photos = form.photos
        .split('\n')
        .map(u => u.trim())
        .filter(u => u.length > 0)

      const payload = {
        ...form,
        price: Number(form.price),
        surfaceM2: form.surfaceM2 ? Number(form.surfaceM2) : null,
        rooms: form.rooms ? Number(form.rooms) : null,
        propertyType: form.propertyType || null,
        photos,
      }

      const { data } = await propertiesAPI.create(payload)
      navigate(`/propiedades/${data._id}`)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Error al crear la propiedad'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-prop-wrap">
      <div className="new-prop-inner">
        <h1 className="page-title">Publicar nueva propiedad</h1>
        <p className="page-sub">Completá los datos de la propiedad que querés publicar</p>

        <form onSubmit={handleSubmit} className="new-prop-form">
          {error && <div className="alert-error">{error}</div>}

          {/* Datos principales */}
          <section className="form-section">
            <h3>Datos principales</h3>
            <div className="form-grid">
              <div className="field span-2">
                <label>Título *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="Ej: Casa 3 ambientes en Palermo" maxLength={200} />
              </div>

              <div className="field">
                <label>Operación *</label>
                <select name="operationType" value={form.operationType} onChange={handleChange}>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              <div className="field">
                <label>Tipo de propiedad</label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                  <option value="">Sin especificar</option>
                  {types.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>

              <div className="field span-2">
                <label>Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={4} placeholder="Describí la propiedad: ambientes, estado, comodidades..."
                  maxLength={2000} style={{ resize: 'vertical' }} />
              </div>
            </div>
          </section>

          {/* Precio */}
          <section className="form-section">
            <h3>Precio</h3>
            <div className="form-grid">
              <div className="field">
                <label>Precio *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange}
                  placeholder="150000" min="0" />
              </div>
              <div className="field">
                <label>Moneda</label>
                <select name="currency" value={form.currency} onChange={handleChange}>
                  <option value="USD">USD — Dólares</option>
                  <option value="ARS">ARS — Pesos</option>
                </select>
              </div>
              <div className="field">
                <label>Estado</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido / Alquilado</option>
                </select>
              </div>
            </div>
          </section>

          {/* Ubicación y características */}
          <section className="form-section">
            <h3>Ubicación y características</h3>
            <div className="form-grid">
              <div className="field">
                <label>Barrio / Zona</label>
                <input name="neighborhood" value={form.neighborhood} onChange={handleChange}
                  placeholder="Palermo, Belgrano..." />
              </div>
              <div className="field">
                <label>Dirección</label>
                <input name="address" value={form.address} onChange={handleChange}
                  placeholder="Av. Santa Fe 1234" />
              </div>
              <div className="field">
                <label>Superficie (m²)</label>
                <input type="number" name="surfaceM2" value={form.surfaceM2} onChange={handleChange}
                  placeholder="120" min="0" />
              </div>
              <div className="field">
                <label>Ambientes</label>
                <input type="number" name="rooms" value={form.rooms} onChange={handleChange}
                  placeholder="3" min="0" />
              </div>
            </div>
          </section>

          {/* Fotos */}
          <section className="form-section">
            <h3>Fotos</h3>
            <div className="field">
              <label>URLs de las fotos <small style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(una por línea)</small></label>
              <textarea name="photos" value={form.photos} onChange={handleChange}
                rows={4} placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
                style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '.85rem' }} />
              <p className="field-hint">Pegá los links de las fotos de la propiedad, una en cada línea. La primera foto va a ser la principal.</p>
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar propiedad'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .new-prop-wrap { padding: clamp(24px, 4vw, 48px) 24px; }
        .new-prop-inner { max-width: 760px; margin: 0 auto; }
        .page-title { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 800; }
        .page-sub { color: var(--gray-500); margin-top: 4px; margin-bottom: 28px; }
        .new-prop-form { display: flex; flex-direction: column; gap: 24px; }
        .form-section {
          background: #fff; border-radius: var(--radius); padding: 24px;
          box-shadow: var(--shadow);
        }
        .form-section h3 {
          font-size: 1rem; font-weight: 700; margin-bottom: 18px;
          color: var(--gray-800);
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .span-2 { grid-column: span 2; }
        .field-hint { font-size: .8125rem; color: var(--gray-400); margin-top: 4px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .span-2 { grid-column: span 1; }
          .form-actions { flex-direction: column-reverse; }
          .form-actions button { width: 100%; }
        }
      `}</style>
    </div>
  )
}
