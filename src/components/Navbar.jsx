import React from 'react';
import { MapPin, Grid, PlusCircle, Sun, Moon, Info } from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  onOpenPublish,
  onOpenHelp,
  darkMode,
  setDarkMode
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <a
          href="#"
          className="brand-logo"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('grid');
          }}
          id="nav-logo"
        >
          <div className="brand-icon-wrapper">
            <span style={{ fontSize: '1.35rem' }}>🐾</span>
          </div>
          <div className="brand-title-group">
            <span>Patitas</span> <span className="brand-text-accent">a Casa</span>
          </div>
        </a>

        {/* View Switcher Tabs */}
        <nav className="nav-tabs" aria-label="Navegación principal">
          <button
            id="tab-view-grid"
            className={`nav-tab-btn ${activeView === 'grid' ? 'active' : ''}`}
            onClick={() => setActiveView('grid')}
          >
            <Grid size={16} />
            <span className="nav-tab-label">Mascotas</span>
          </button>
          <button
            id="tab-view-map"
            className={`nav-tab-btn ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => setActiveView('map')}
          >
            <MapPin size={16} />
            <span className="nav-tab-label">Mapa</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          <button
            id="btn-help-guide"
            className="theme-toggle-btn"
            onClick={onOpenHelp}
            title="Consejos y protocolos de rescate"
            aria-label="Guía de ayuda"
          >
            <Info size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            id="btn-theme-toggle"
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Cambiar tema de color"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Publish Button */}
          <button
            id="btn-publish-pet"
            className="publish-btn"
            onClick={() => onOpenPublish()}
          >
            <PlusCircle size={17} />
            <span className="publish-btn-text">Publicar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
