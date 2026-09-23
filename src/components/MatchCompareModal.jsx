import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink, formatDistance } from '../utils/helpers';

export default function MatchCompareModal({ targetPet, matches, onClose }) {
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!targetPet) return null;

  const currentMatch = matches && matches.length > 0 ? matches[selectedMatchIndex] || null : null;
  const candidate = currentMatch?.candidate;

  const targetImage = targetPet.images && targetPet.images.length > 0
    ? targetPet.images[0]
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  const candidateImage = candidate?.images && candidate?.images.length > 0
    ? candidate.images[0]
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  const candidateWhatsapp = candidate ? buildWhatsAppLink(candidate.contact?.phone, candidate) : '#';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        <div className="modal-drag-handle" aria-hidden="true" />
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingRight: '2.5rem' }}>
            <Sparkles size={22} style={{ color: '#6366f1', flexShrink: 0 }} />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                Comparativa Inteligente de Coincidencias
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Cruzamos reportes de mascotas perdidas y encontradas en la misma zona.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {matches.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">Sin coincidencias cercanas por ahora</h3>
              <p className="empty-subtitle">
                No encontramos mascotas de la misma especie reportadas como {targetPet.status === 'perdido' ? 'encontradas' : 'perdidas'} en un radio cercano.
                Te sugerimos generar el cartel de búsqueda con QR o compartirlo en redes.
              </p>
            </div>
          ) : (
            <div>
              {/* Candidate selector tabs if multiple */}
              {matches.length > 1 && (
                <div className="horizontal-scroll-pills" style={{ marginBottom: '1.25rem' }}>
                  {matches.map((m, idx) => (
                    <button
                      key={m.candidate.id}
                      type="button"
                      className={`status-pill ${selectedMatchIndex === idx ? 'active' : ''}`}
                      onClick={() => setSelectedMatchIndex(idx)}
                      style={{ fontSize: '0.82rem', flexShrink: 0 }}
                    >
                      <span>Candidato #{idx + 1} ({m.matchScore}% coincidencia)</span>
                    </button>
                  ))}
                </div>
              )}

              {/* SPLIT SCREEN COMPARISON */}
              <div className="split-compare-grid">
                {/* LEFT: TARGET PET */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: targetPet.status === 'perdido' ? '#ef4444' : '#f59e0b',
                    background: targetPet.status === 'perdido' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    width: 'fit-content'
                  }}>
                    Tu Mascota ({targetPet.status === 'perdido' ? 'Perdida' : 'Encontrada'})
                  </div>

                  <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={targetImage} alt={targetPet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{targetPet.name || 'Sin nombre'}</h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {targetPet.breed} • {targetPet.gender} • {targetPet.size}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    📍 {targetPet.location?.neighborhood}
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                    <strong>Señas:</strong> {targetPet.distinctiveFeatures || 'Sin señas registradas'}
                  </div>
                </div>

                {/* RIGHT: CANDIDATE PET */}
                {candidate && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: candidate.status === 'perdido' ? '#ef4444' : '#f59e0b',
                        background: candidate.status === 'perdido' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        width: 'fit-content'
                      }}>
                        Mascota {candidate.status === 'perdido' ? 'Perdida (Buscada)' : 'Encontrada (En Resguardo)'}
                      </div>

                      <div style={{
                        fontWeight: 900,
                        fontSize: '0.88rem',
                        color: currentMatch.matchScore >= 80 ? '#10b981' : '#f59e0b',
                        background: 'var(--bg-surface)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        ★ {currentMatch.matchScore}% Coincidencia
                      </div>
                    </div>

                    <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <img src={candidateImage} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{candidate.name || (candidate.status === 'perdido' ? 'Mascota perdida' : 'Animal en resguardo')}</h3>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      {candidate.breed} • {candidate.gender} • {candidate.size}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      📍 {candidate.location?.neighborhood} ({formatDistance(currentMatch.distanceKm)} de distancia)
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                      <strong>Señas:</strong> {candidate.distinctiveFeatures || candidate.description}
                    </div>

                    {candidate.contact?.phone && (
                      <a
                        href={candidateWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-btn"
                        style={{
                          background: '#25d366',
                          color: 'white',
                          marginTop: 'auto',
                          padding: '0.65rem 1rem',
                          fontSize: '0.88rem',
                          justifyContent: 'center'
                        }}
                      >
                        <MessageCircle size={18} />
                        <span>{targetPet.status === 'perdido' ? 'Contactar al Rescatista' : 'Contactar a la Familia / Dueño'}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-detail" onClick={onClose} style={{ width: '100%' }}>
            Cerrar Comparador
          </button>
        </div>
      </div>
    </div>
  );
}
