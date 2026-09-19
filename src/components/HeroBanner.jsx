import React from 'react';
import { AlertCircle, Search, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroBanner({ stats, onOpenPublishWithStatus }) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-badge">
        <Sparkles size={15} />
        <span>Red Comunitaria de Rescate y Búsqueda</span>
      </div>

      <h1 id="hero-title" className="hero-title">
        Cada minuto cuenta para traer a un compañero de vuelta a casa
      </h1>

      <p className="hero-subtitle">
        Conectamos a vecinos, rescatistas y familias. Publica alertas urgentes, comparte avistamientos en tiempo real o encuentra a tu próximo mejor amigo en adopción responsable.
      </p>

      <div className="hero-actions">
        <button
          id="hero-btn-lost"
          className="hero-btn hero-btn-urgent"
          onClick={() => onOpenPublishWithStatus('perdido')}
        >
          <AlertCircle size={19} />
          <span>Perdí mi Mascota</span>
        </button>

        <button
          id="hero-btn-found"
          className="hero-btn hero-btn-found"
          onClick={() => onOpenPublishWithStatus('encontrado')}
        >
          <Search size={19} />
          <span>Encontré un Animal</span>
        </button>

        <button
          id="hero-btn-adopt"
          className="hero-btn hero-btn-adopt"
          onClick={() => onOpenPublishWithStatus('adopcion')}
        >
          <Heart size={19} />
          <span>Dar en Adopción</span>
        </button>
      </div>

      {/* Stats Counter Ribbon */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.reunidos || 140}+</div>
            <div className="stat-label">Reunidos con su familia</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.perdidos || 0}</div>
            <div className="stat-label">Búsquedas activas</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <Search size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.encontrados || 0}</div>
            <div className="stat-label">En resguardo temporal</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <Heart size={24} />
          </div>
          <div>
            <div className="stat-number">{stats.adopcion || 0}</div>
            <div className="stat-label">Buscando un hogar</div>
          </div>
        </div>
      </div>
    </section>
  );
}
