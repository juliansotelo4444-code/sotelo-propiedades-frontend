import { useState, useEffect } from 'react'
import { propertyTypesAPI } from '../../services/apiServices'

export default function PropertyModal({ property, onClose, onSave }) {
  const [form, setForm] = useState({
    title: property?.title || '',
    description: property?.description || '',
    operationType: property?.operationType || 'venta',
    price: property?.price || '',
    currency: property?.currency || 'USD',
    address: property?.address || '',
    neighborhood: property?.neighborhood || '',
    surfaceM2: property?.surfaceM2 || '',
    rooms: property?.rooms || '',
    status: property?.status || 'disponible',
    propertyType: property?.propertyType?._id || property?.propertyType || '',
    photos: property?.photos?.join('\n') || '',
  })
  const [types, setTypes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    propertyTypesAPI.getAll().then(({ data }) => setTypes(data)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('El título es requerido'); return }
    if (!form.price || isNaN(form.price)) { setError('El precio es requerido'); return }
    setError(''); setLoading(true)

    try {
      // Convertir fotos de texto multilinea a array
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
      await onSave(payload)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{property ? 'Editar propiedad' : 'Nueva propiedad'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          <div className="form-grid">
            <div className="field span-2">
              <label>Título *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Ej: Casa 3 ambientes en Palermo" maxLength={200} />
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

            <div className="field">
              <label>Precio *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="150000" min="0" />
            </div>

            <div className="field">
              <label>Moneda</label>
              <select name="currency" value={form.currency} onChange={handleChange}>
                <option value="USD">USD — Dólares</option>
                <option value="ARS">ARS — Pesos</option>
              </select>
            </div>

            <div className="field">
              <label>Superficie (m²)</label>
              <input type="number" name="surfaceM2" value={form.surfaceM2} onChange={handleChange} placeholder="120" min="0" />
            </div>

            <div className="field">
              <label>Ambientes</label>
              <input type="number" name="rooms" value={form.rooms} onChange={handleChange} placeholder="3" min="0" />
            </div>

            <div className="field">
              <label>Barrio / Zona</label>
              <input name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="Palermo, Belgrano..." />
            </div>

            <div className="field">
              <label>Dirección</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Av. Santa Fe 1234" />
            </div>

            <div className="field">
              <label>Estado</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido / Alquilado</option>
              </select>
            </div>

            <div className="field span-2">
              <label>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="Descripción de la propiedad..." maxLength={2000}
                style={{ resize: 'vertical' }} />
            </div>

            <div className="field span-2">
              <label>URLs de fotos <small style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(una por línea)</small></label>
              <textarea name="photos" value={form.photos} onChange={handleChange}
                rows={3} placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
                style={{ resize: 'vertical', fontSize: '.875rem' }} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : property ? 'Guardar cambios' : 'Publicar propiedad'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .modal {
          background: #fff; border-radius: 14px; padding: 28px;
          width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
        }
        .modal-header h3 { font-size: 1.25rem; font-weight: 700; }
        .modal-close {
          background: none; border: none; font-size: 1.1rem;
          color: var(--gray-400); padding: 4px 8px; border-radius: 6px;
        }
        .modal-close:hover { background: var(--gray-100); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .span-2 { grid-column: span 2; }
        .modal-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--gray-100);
        }
        @media (max-width: 520px) {
          .form-grid { grid-template-columns: 1fr; }
          .span-2 { grid-column: span 1; }
        }
      `}</style>
    </div>
  )
}
