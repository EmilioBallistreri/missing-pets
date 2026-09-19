import React from 'react';
import { Search, Navigation, XCircle, X } from 'lucide-react';

export default function PetFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedSpecies,
  setSelectedSpecies,
  selectedSize,
  setSelectedSize,
  sortBy,
  setSortBy,
  proximityKm,
  setProximityKm,
  userCoords,
  onDetectUserLocation,
  onClearProximity,
  counts
}) {
  return (
    <div className="filters-wrapper">
      {/* Top row: Search input & Status segmented tabs */}
      <div className="filters-top-row">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            id="filter-search-input"
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, barrio o señas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="status-tabs" role="tablist">
          <button
            className={`status-pill ${selectedStatus === 'todos' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('todos')}
          >
            Todos ({counts.todos || 0})
          </button>
          <button
            className={`status-pill pill-perdido ${selectedStatus === 'perdido' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('perdido')}
          >
            🚨 Perdidos ({counts.perdidos || 0})
          </button>
          <button
            className={`status-pill pill-encontrado ${selectedStatus === 'encontrado' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('encontrado')}
          >
            🔍 Encontrados ({counts.encontrados || 0})
          </button>
          <button
            className={`status-pill pill-adopcion ${selectedStatus === 'adopcion' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('adopcion')}
          >
            🏡 En Adopción ({counts.adopcion || 0})
          </button>
        </div>
      </div>

      {/* Middle row: Proximity Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 0',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Navigation size={15} style={{ color: '#6366f1' }} />
            <span>Radio de Búsqueda:</span>
          </span>

          {!userCoords ? (
            <button
              type="button"
              id="btn-detect-location-filter"
              className="filter-btn-subtle"
              onClick={onDetectUserLocation}
              style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}
            >
              <span>📍 Activar filtro cerca de mí (GPS)</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="species-filter-group">
                {[
                  { val: 0, label: 'Sin límite' },
                  { val: 2, label: '2 km' },
                  { val: 5, label: '5 km' },
                  { val: 10, label: '10 km' }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    className={`filter-btn-subtle ${proximityKm === item.val ? 'active' : ''}`}
                    onClick={() => setProximityKm(item.val)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="filter-btn-subtle"
                onClick={onClearProximity}
                title="Desactivar filtro GPS"
                style={{ color: '#ef4444' }}
              >
                <XCircle size={14} />
                <span>Quitar GPS</span>
              </button>
            </div>
          )}
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ordenar:</span>
          <select
            id="filter-sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Ordenar publicaciones"
          >
            <option value="recent">Más recientes primero</option>
            <option value="urgent">Mayor urgencia</option>
            <option value="reward">Con recompensa</option>
            {userCoords && <option value="distance">Más cercanos a mí</option>}
          </select>
        </div>
      </div>

      {/* Bottom row: Species pills and Size filter */}
      <div className="filters-bottom-row">
        {/* Species selector */}
        <div className="species-filter-group">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Especie:
          </span>
          <button
            className={`filter-btn-subtle ${selectedSpecies === 'todos' ? 'active' : ''}`}
            onClick={() => setSelectedSpecies('todos')}
          >
            Todas
          </button>
          <button
            className={`filter-btn-subtle ${selectedSpecies === 'perro' ? 'active' : ''}`}
            onClick={() => setSelectedSpecies('perro')}
          >
            🐶 Perros
          </button>
          <button
            className={`filter-btn-subtle ${selectedSpecies === 'gato' ? 'active' : ''}`}
            onClick={() => setSelectedSpecies('gato')}
          >
            🐱 Gatos
          </button>
          <button
            className={`filter-btn-subtle ${selectedSpecies === 'otro' ? 'active' : ''}`}
            onClick={() => setSelectedSpecies('otro')}
          >
            🐾 Otros
          </button>
        </div>

        {/* Size dropdown */}
        <div>
          <select
            id="filter-size-select"
            className="sort-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            aria-label="Filtrar por tamaño"
          >
            <option value="todos">Todos los tamaños</option>
            <option value="pequeño">Tamaño pequeño</option>
            <option value="mediano">Tamaño mediano</option>
            <option value="grande">Tamaño grande</option>
          </select>
        </div>
      </div>
    </div>
  );
}
