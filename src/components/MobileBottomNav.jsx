import React from 'react';
import { Grid, MapPin, Plus, Navigation, BookOpen } from 'lucide-react';

export default function MobileBottomNav({
  activeView,
  setActiveView,
  onOpenPublish,
  onOpenHelp,
  onDetectUserLocation,
  userCoords,
  proximityKm
}) {
  const isGpsActive = Boolean(userCoords && proximityKm > 0);

  return (
    <nav className="mobile-bottom-nav" aria-label="Navegación móvil principal">
      {/* 1. Mascotas Grid Tab */}
      <button
        type="button"
        id="mobile-nav-grid"
        className={`mobile-nav-item ${activeView === 'grid' ? 'active' : ''}`}
        onClick={() => {
          setActiveView('grid');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Ver lista de mascotas"
      >
        <div className="mobile-nav-icon-wrap">
          <Grid size={20} />
        </div>
        <span className="mobile-nav-label">Mascotas</span>
      </button>

      {/* 2. Mapa Interactivo Tab */}
      <button
        type="button"
        id="mobile-nav-map"
        className={`mobile-nav-item ${activeView === 'map' ? 'active' : ''}`}
        onClick={() => {
          setActiveView('map');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Ver mapa interactivo"
      >
        <div className="mobile-nav-icon-wrap">
          <MapPin size={20} />
        </div>
        <span className="mobile-nav-label">Mapa</span>
      </button>

      {/* 3. Center Elevated Action: Publicar */}
      <div className="mobile-nav-center-action">
        <button
          type="button"
          id="mobile-nav-publish"
          className="mobile-nav-publish-btn"
          onClick={onOpenPublish}
          aria-label="Publicar mascota perdida o encontrada"
        >
          <Plus size={24} strokeWidth={2.6} />
          <span className="sr-only">Publicar</span>
        </button>
        <span className="mobile-nav-center-label">Publicar</span>
      </div>

      {/* 4. GPS / Cerca de mí */}
      <button
        type="button"
        id="mobile-nav-gps"
        className={`mobile-nav-item ${isGpsActive ? 'active' : ''}`}
        onClick={onDetectUserLocation}
        aria-label="Activar búsqueda cercana por GPS"
      >
        <div className="mobile-nav-icon-wrap" style={{ position: 'relative' }}>
          <Navigation size={20} />
          {isGpsActive && <span className="mobile-nav-gps-dot" />}
        </div>
        <span className="mobile-nav-label">{isGpsActive ? `${proximityKm} km` : 'Cerca'}</span>
      </button>

      {/* 5. Guía de Ayuda */}
      <button
        type="button"
        id="mobile-nav-help"
        className="mobile-nav-item"
        onClick={onOpenHelp}
        aria-label="Ver protocolos y consejos de ayuda"
      >
        <div className="mobile-nav-icon-wrap">
          <BookOpen size={20} />
        </div>
        <span className="mobile-nav-label">Guía</span>
      </button>
    </nav>
  );
}
