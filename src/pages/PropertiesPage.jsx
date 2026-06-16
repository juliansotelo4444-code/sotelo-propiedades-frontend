import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { propertiesAPI, propertyTypesAPI } from '../services/apiServices'
import PropertyCard from '../components/properties/PropertyCard'

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    operationType: searchParams.get('operationType') || '',
    status: searchParams.get('status') || 'disponible',
    propertyType: searchParams.get('propertyType') || '',
    currency: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  })

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      const { data } = await propertiesAPI.getAll(params)
      setProperties(data)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchProperties() }, [fetchProperties])
  useEffect(() => { propertyTypesAPI.getAll().then(({ data }) => setTypes(data)).catch(() => {}) }, [])

  const handleFilter = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value }
    setFilters(updated)
  }

  const clearFilters = () => setFilters({
    operationType: '', status: '', propertyType: '', currency: '', minPrice: '', maxPrice: '', search: '',
  })

  return (
    <div className="page-wrap">
      <div className="page-inner">
        <div className="page-top">
          <div>
            <h1 className="page-title">Propiedades</h1>
            <p className="page-sub">{properties.length} resultado{properties.length !== 1 ? 's' : ''} encontrado{properties.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="layout">
          {/* Sidebar filtros */}
          <aside className="filters-panel">
            <div className="filters-header">
              <span className="filters-title">Filtros</span>
              <button className="clear-filters" onClick={clearFilters}>Limpiar</button>
            </div>

            <div className="filter-group">
              <label>Buscar</label>
              <input name="search" value={filters.search} onChange={handleFilter} placeholder="Barrio, título..." />
            </div>
            <div className="filter-group">
              <label>Operación</label>
              <select name="operationType" value={filters.operationType} onChange={handleFilter}>
                <option value="">Todas</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Estado</label>
              <select name="status" value={filters.status} onChange={handleFilter}>
                <option value="">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Tipo</label>
              <select name="propertyType" value={filters.propertyType} onChange={handleFilter}>
                <option value="">Todos</option>
                {types.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Moneda</label>
              <select name="currency" value={filters.currency} onChange={handleFilter}>
                <option value="">Todas</option>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Precio mínimo</label>
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilter} placeholder="0" />
            </div>
            <div className="filter-group">
              <label>Precio máximo</label>
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilter} placeholder="Sin límite" />
            </div>
          </aside>

          {/* Grilla */}
          <div className="results">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}><span className="spinner" /></div>
            ) : properties.length === 0 ? (
              <div className="empty-state">
                <span>🔍</span>
                <p>No se encontraron propiedades con esos filtros.</p>
                <button className="btn-ghost" onClick={clearFilters}>Limpiar filtros</button>
              </div>
            ) : (
              <div className="props-grid">
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .page-wrap { padding: clamp(24px, 4vw, 48px) 24px; }
        .page-inner { max-width: 1280px; margin: 0 auto; }
        .page-top { margin-bottom: 28px; }
        .page-title { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 800; }
        .page-sub { color: var(--gray-500); margin-top: 4px; }
        .layout { display: grid; grid-template-columns: 260px 1fr; gap: 28px; align-items: start; }
        .filters-panel {
          background: #fff; border-radius: var(--radius); padding: 20px;
          box-shadow: var(--shadow); position: sticky; top: 88px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .filters-header { display: flex; justify-content: space-between; align-items: center; }
        .filters-title { font-weight: 700; font-size: 1rem; }
        .clear-filters { background: none; border: none; color: var(--red); font-size: .875rem; font-weight: 600; }
        .filter-group { display: flex; flex-direction: column; gap: 5px; }
        .filter-group label { font-size: .8125rem; font-weight: 600; color: var(--gray-600); }
        .filter-group input, .filter-group select {
          padding: 8px 12px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-sm);
          font-size: .875rem; outline: none; background: #fff;
        }
        .filter-group input:focus, .filter-group select:focus { border-color: var(--red); }
        .props-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .empty-state { text-align: center; padding: 80px 0; color: var(--gray-400); display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .empty-state span { font-size: 3rem; }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .filters-panel { position: static; }
        }
      `}</style>
    </div>
  )
}
