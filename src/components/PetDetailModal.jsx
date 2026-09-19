import React, { useState } from 'react';
import {
  X, MapPin, Phone, MessageCircle,
  Share2, Printer, CheckCircle, Radio, Sparkles, Trash2, Heart, Flag
} from 'lucide-react';
import { STATUS_CONFIG, formatTimeAgo, buildWhatsAppLink } from '../utils/helpers';

export default function PetDetailModal({
  pet,
  onClose,
  onOpenSighting,
  onOpenFlyer,
  onOpenMatchCompare,
  onUpdateStatus,
  onDeletePet,
  onReportFlag,
  onShowToast
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRescueBefore, setShowRescueBefore] = useState(false);
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [showFlagOptions, setShowFlagOptions] = useState(false);
  const [flagReason, setFlagReason] = useState('estafa_recompensa');

  if (!pet) return null;

  const images = pet.images && pet.images.length > 0 ? pet.images : [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
  ];

  const statusInfo = STATUS_CONFIG[pet.status] || STATUS_CONFIG.perdido;
  const whatsappUrl = buildWhatsAppLink(pet.contact?.phone, pet);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mascota en Patitas a Casa: ${pet.name || pet.breed}`,
          text: `¡Ayúdanos! ${pet.status === 'perdido' ? 'Se busca a' : 'Mascota en'} ${pet.name || 'este animalito'} en ${pet.location?.neighborhood || pet.location?.city}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error compartiendo:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      if (onShowToast) {
        onShowToast('¡Enlace de la mascota copiado al portapapeles! 📋');
      } else {
        alert('¡Enlace copiado al portapapeles!');
      }
    }
  };

  const handleSubmitFlag = (e) => {
    e.preventDefault();
    onReportFlag(pet.id, { reason: flagReason });
    setFlagSubmitted(true);
    setShowFlagOptions(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-drag-handle" aria-hidden="true" />
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar ventana">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '3.5rem' }}>
          <div>
            <span className={`card-badge-status badge-${pet.status}`} style={{ position: 'static', display: 'inline-flex', marginBottom: '0.4rem' }}>
              {statusInfo.tag}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {pet.name || (pet.status === 'encontrado' ? 'Mascota Encontrada' : 'Sin Nombre')}
            </h2>
          </div>

          <button
            onClick={handleShare}
            className="filter-btn-subtle"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem' }}
            title="Compartir publicación"
          >
            <Share2 size={16} />
            <span>Compartir</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="detail-grid">
            {/* Gallery column */}
            <div className="detail-gallery">
              {/* Adoption Before / After Toggle if rescueBeforeImage is present */}
              {pet.rescueBeforeImage && pet.status === 'adopcion' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-surface-soft)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.4rem'
                }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {showRescueBefore ? '⚠️ Foto: El día del rescate' : '✨ Foto: Hoy en recuperación'}
                  </span>
                  <button
                    type="button"
                    className="filter-btn-subtle"
                    onClick={() => setShowRescueBefore(!showRescueBefore)}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    {showRescueBefore ? 'Ver Hoy' : 'Ver Antes'}
                  </button>
                </div>
              )}

              <img
                src={showRescueBefore && pet.rescueBeforeImage ? pet.rescueBeforeImage : images[activeImageIndex]}
                alt={pet.name || pet.breed}
                className="detail-main-image"
              />

              {!showRescueBefore && images.length > 1 && (
                <div className="detail-thumbnails">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Miniatura"
                      className={`detail-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                    />
                  ))}
                </div>
              )}

              {/* Action: Open Matching Comparer (Lost vs Found) */}
              {(pet.status === 'perdido' || pet.status === 'encontrado') && (
                <button
                  type="button"
                  id="btn-open-match-compare"
                  className="btn-detail"
                  onClick={() => onOpenMatchCompare(pet)}
                  style={{ width: '100%', marginTop: '0.5rem', background: '#eef2ff', borderColor: '#c7d2fe', color: '#4338ca', fontWeight: 700 }}
                >
                  <Sparkles size={16} />
                  <span>Comparar con Mascotas Encontradas en la Zona</span>
                </button>
              )}

              {/* Flyer Generator button */}
              {(pet.status === 'perdido' || pet.status === 'encontrado') && (
                <button
                  id="btn-open-flyer"
                  className="btn-detail"
                  onClick={() => onOpenFlyer(pet)}
                  style={{ width: '100%', marginTop: '0.4rem', background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}
                >
                  <Printer size={16} />
                  <span>Generar Carteles (A4, Historia 9:16 y Post)</span>
                </button>
              )}

              {/* Status Update Quick Toggles */}
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--bg-surface-soft)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Gestión Comunitaria de Estado:
                </span>
                
                {pet.status === 'perdido' && (
                  <button
                    className="btn-detail"
                    onClick={() => onUpdateStatus(pet.id, 'reunido')}
                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', borderColor: 'rgba(99, 102, 241, 0.3)' }}
                  >
                    <CheckCircle size={16} />
                    <span>¡Marcar como Reunido con su Familia! 🎉</span>
                  </button>
                )}

                {pet.status === 'adopcion' && (
                  <button
                    className="btn-detail"
                    onClick={() => onUpdateStatus(pet.id, 'adoptado')}
                    style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <Heart size={16} />
                    <span>¡Marcar como Adoptado Felizmente! 💖</span>
                  </button>
                )}

                {/* Moderation / Flagging */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  {!showFlagOptions ? (
                    <button
                      type="button"
                      onClick={() => setShowFlagOptions(true)}
                      style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Flag size={12} />
                      <span>{flagSubmitted ? 'Denuncia registrada ✓' : 'Denunciar publicación sospechosa'}</span>
                    </button>
                  ) : (
                    <form onSubmit={handleSubmitFlag} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <select
                        className="sort-select"
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <option value="estafa_recompensa">Posible intento de estafa con recompensa</option>
                        <option value="datos_falsos">Foto o datos falsos / duplicados</option>
                        <option value="venta_ilegal">Venta de animales no permitida</option>
                      </select>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="filter-btn-subtle" onClick={() => setShowFlagOptions(false)} style={{ fontSize: '0.75rem' }}>
                          Cancelar
                        </button>
                        <button type="submit" className="publish-btn" style={{ background: '#ef4444', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                          Enviar reporte
                        </button>
                      </div>
                    </form>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm('¿Seguro que deseas eliminar este reporte?')) {
                        onDeletePet(pet.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      color: '#ef4444'
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Info details column */}
            <div className="detail-info-block">
              {/* Reward Callout */}
              {pet.reward && (
                <div style={{
                  background: '#fef3c7',
                  border: '2px solid #f59e0b',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#92400e'
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>RECOMPENSA OFRECIDA</span>
                  <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>{pet.reward}</span>
                </div>
              )}

              {/* Key attributes grid */}
              <div className="detail-param-row">
                <div className="param-item">
                  <span className="param-label">Especie y Raza</span>
                  <span className="param-value">{pet.species === 'perro' ? '🐶 Perro' : pet.species === 'gato' ? '🐱 Gato' : '🐾 Otro'} • {pet.breed}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">Sexo y Edad</span>
                  <span className="param-value">{pet.gender || 'No especificado'} • {pet.age || 'Edad desc.'}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">Tamaño</span>
                  <span className="param-value" style={{ textTransform: 'capitalize' }}>{pet.size || 'Mediano'}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">Color del Pelaje</span>
                  <span className="param-value">{pet.color || 'No especificado'}</span>
                </div>
              </div>

              {/* Distinctive features */}
              {pet.distinctiveFeatures && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    SEÑAS PARTICULARES & COLLAR
                  </h4>
                  <p style={{ background: 'var(--bg-surface-soft)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    {pet.distinctiveFeatures}
                  </p>
                </div>
              )}

              {/* Full Description */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  HISTORIA Y SITUACIÓN
                </h4>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                  {pet.description}
                </p>
              </div>

              {/* Location */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  {pet.status === 'perdido' ? 'ÚLTIMO LUGAR VISTO' : 'UBICACIÓN ACTUAL'}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)' }} />
                  <span>{pet.location?.address}, {pet.location?.neighborhood} ({pet.location?.city})</span>
                </div>
              </div>

              {/* Contact Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05), rgba(99, 102, 241, 0.05))',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginTop: '0.5rem'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  Contacto de {pet.contact?.name || 'la persona a cargo'}
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {pet.contact?.phone && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-btn"
                      style={{ background: '#25d366', color: 'white', padding: '0.65rem 1.25rem', fontSize: '0.92rem' }}
                    >
                      <MessageCircle size={18} />
                      <span>Escribir por WhatsApp</span>
                    </a>
                  )}
                  {pet.contact?.phone && (
                    <a
                      href={`tel:${pet.contact.phone}`}
                      className="hero-btn"
                      style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', border: '1px solid var(--border-medium)', padding: '0.65rem 1.25rem', fontSize: '0.92rem' }}
                    >
                      <Phone size={18} />
                      <span>Llamar ({pet.contact.phone})</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SIGHTINGS SECTION WITH CERTAINTY BADGES AND PHOTOS */}
          {pet.status === 'perdido' && (
            <div className="sightings-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Historial de Avistamientos Comunitarios
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Pistas reportadas por vecinos con nivel de certeza verificado.
                  </p>
                </div>
                <button
                  id="btn-add-sighting"
                  className="hero-btn hero-btn-urgent"
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                  onClick={() => onOpenSighting(pet)}
                >
                  <Radio size={16} />
                  <span>+ Lo vi / Reportar Avistamiento</span>
                </button>
              </div>

              {pet.sightings && pet.sightings.length > 0 ? (
                <div className="sightings-timeline">
                  {pet.sightings.map((s) => (
                    <div key={s.id} className="sighting-item">
                      <div className="sighting-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            📍 {s.locationText}
                          </span>
                          {/* Certainty badge */}
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            background: s.certainty === 'alta' ? 'rgba(16, 185, 129, 0.15)' : s.certainty === 'media' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                            color: s.certainty === 'alta' ? '#059669' : s.certainty === 'media' ? '#d97706' : '#64748b'
                          }}>
                            {s.certainty === 'alta' ? '🟢 Certeza Alta' : s.certainty === 'media' ? '🟡 Parecido' : '⚪ Pista lejana'}
                          </span>
                        </div>
                        <span>{formatTimeAgo(s.date)}</span>
                      </div>

                      <p className="sighting-notes">{s.notes}</p>

                      {/* Photo if provided */}
                      {s.photoUrl && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <img
                            src={s.photoUrl}
                            alt="Foto del avistamiento"
                            style={{ height: '70px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                          />
                        </div>
                      )}

                      {s.reportedBy && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                          Aportado por: {s.reportedBy}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
                  Aún no se han registrado avistamientos comunitarios. Si viste a esta mascota recientemente, haz clic en el botón superior.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
