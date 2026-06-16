import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { propertiesAPI, propertyTypesAPI } from '../services/apiServices'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyModal from '../components/properties/PropertyModal'

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProperty, setEditProperty] = useState(null)
  const [activeTab, setActiveTab] = useState('props') // props | types
  const [newTypeName, setNewTypeName] = useState('')
  const [typeError, setTypeError] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [propsRes, typesRes] = await Promise.all([
        propertiesAPI.getMine(),
        propertyTypesAPI.getAll(),
      ])
      setProperties(propsRes.data)
      setTypes(typesRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (data) => { await propertiesAPI.create(data); fetchAll() }
  const handleUpdate = async (data) => { await propertiesAPI.update(editProperty._id, data); fetchAll() }
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    await propertiesAPI.delete(id); fetchAll()
  }

  const handleCreateType = async (e) => {
    e.preventDefault()
    if (!newTypeName.trim()) return
    setTypeError('')
    try {
      await propertyTypesAPI.create({ name: newTypeName.trim() })
      setNewTypeName('')
      fetchAll()
    } catch (err) {
      setTypeError(err.response?.data?.error || 'Error al crear el tipo')
    }
  }

  const handleDeleteType = async (id) => {
    if (!confirm('¿Eliminar este tipo?')) return
    await propertyTypesAPI.delete(id); fetchAll()
  }

  return (
    <div className="myprops-wrap">
      <div className="myprops-inner">
        <div className="myprops-header">
          <div>
            <h1 className="page-title">Mis publicaciones</h1>
            <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>{properties.length} propiedad{properties.length !== 1 ? 'es' : ''} publicada{properties.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn-primary" onClick={() => { setEditProperty(null); setShowModal(true) }}>
            + Nueva propiedad
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab${activeTab === 'props' ? ' active' : ''}`} onClick={() => setActiveTab('props')}>
            Propiedades
          </button>
          <button className={`tab${activeTab === 'types' ? ' active' : ''}`} onClick={() => setActiveTab('types')}>
            Tipos de propiedad
          </button>
        </div>

        {/* Tab propiedades */}
        {activeTab === 'props' && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}><span className="spinner" /></div>
            ) : properties.length === 0 ? (
              <div className="empty-state">
                <span>🏠</span>
                <p>Todavía no publicaste ninguna propiedad.</p>
                <button className="btn-primary" onClick={() => setShowModal(true)}>Publicar primera propiedad</button>
              </div>
            ) : (
              <div className="props-grid">
                {properties.map(p => (
                  <PropertyCard
                    key={p._id}
                    property={p}
                    onEdit={(prop) => { setEditProperty(prop); setShowModal(true) }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab tipos */}
        {activeTab === 'types' && (
          <div className="types-section">
            <p style={{ color: 'var(--gray-500)', marginBottom: 20, fontSize: '.9375rem' }}>
              Los tipos de propiedad se usan para clasificar tus publicaciones.
            </p>

            {/* Crear tipo */}
            <form onSubmit={handleCreateType} className="new-type-form">
              <input
                value={newTypeName}
                onChange={e => setNewTypeName(e.target.value)}
                placeholder="Ej: Casa, Departamento, Local..."
                maxLength={50}
              />
              <button type="submit" className="btn-primary">Agregar</button>
            </form>
            {typeError && <p className="type-error">{typeError}</p>}

            {/* Lista de tipos */}
            {types.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', marginTop: 24 }}>No tenés tipos creados.</p>
            ) : (
              <div className="types-list">
                {types.map(t => (
                  <div key={t._id} className="type-item">
                    <span className="type-name">{t.name}</span>
                    <button className="type-delete" onClick={() => handleDeleteType(t._id)}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <PropertyModal
          property={editProperty}
          onClose={() => { setShowModal(false); setEditProperty(null) }}
          onSave={editProperty ? handleUpdate : handleCreate}
        />
      )}

      <style>{`
        .myprops-wrap { padding: clamp(24px, 4vw, 48px) 24px; }
        .myprops-inner { max-width: 1280px; margin: 0 auto; }
        .myprops-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 28px; }
        .page-title { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 800; }
        .tabs { display: flex; gap: 0; border-bottom: 2px solid var(--gray-200); margin-bottom: 28px; }
        .tab {
          padding: 12px 24px; background: none; border: none; font-size: .9375rem;
          font-weight: 600; color: var(--gray-500); cursor: pointer; border-bottom: 3px solid transparent; margin-bottom: -2px;
          transition: color .15s;
        }
        .tab.active { color: var(--red); border-bottom-color: var(--red); }
        .tab:hover:not(.active) { color: var(--gray-800); }
        .props-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .empty-state { text-align: center; padding: 60px 0; color: var(--gray-400); display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .empty-state span { font-size: 3rem; }
        .types-section { max-width: 540px; }
        .new-type-form { display: flex; gap: 10px; }
        .new-type-form input {
          flex: 1; padding: 10px 14px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm);
          font-size: .9375rem; outline: none; font-family: inherit;
        }
        .new-type-form input:focus { border-color: var(--red); }
        .type-error { color: var(--red); font-size: .875rem; margin-top: 8px; }
        .types-list { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
        .type-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 16px; background: #fff; border-radius: var(--radius-sm);
          border: 1px solid var(--gray-200); box-shadow: var(--shadow);
        }
        .type-name { font-weight: 600; }
        .type-delete { background: none; border: none; color: #dc2626; font-size: .875rem; font-weight: 500; padding: 4px 8px; border-radius: 4px; }
        .type-delete:hover { background: #fef2f2; }
      `}</style>
    </div>
  )
}
