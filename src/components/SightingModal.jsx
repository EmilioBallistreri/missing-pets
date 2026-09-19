import React, { useState } from 'react';
import { X, Radio, Send, Clock, Camera } from 'lucide-react';
import { compressImage } from '../utils/helpers';

export default function SightingModal({ pet, onClose, onSubmitSighting, onShowToast }) {
  const [locationText, setLocationText] = useState('');
  const [notes, setNotes] = useState('');
  const [certainty, setCertainty] = useState('alta');
  const [timeApprox, setTimeApprox] = useState('Recientemente (hace minutos)');
  const [reportedBy, setReportedBy] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  if (!pet) return null;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingPhoto(true);
    try {
      const dataUrl = await compressImage(file, 800, 0.75);
      setPhotoUrl(dataUrl);
      if (onShowToast) onShowToast('✓ Foto capturada y optimizada con éxito.');
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('⚠️ Error al procesar la foto.');
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!locationText.trim() || !notes.trim()) {
      if (onShowToast) {
        onShowToast('⚠️ Por favor indica al menos el lugar y qué viste.');
      } else {
        alert('Por favor indica al menos el lugar del avistamiento y qué viste.');
      }
      return;
    }

    const fullNotes = timeApprox ? `[Visto: ${timeApprox}] ${notes.trim()}` : notes.trim();

    onSubmitSighting(pet.id, {
      locationText: locationText.trim(),
      notes: fullNotes,
      certainty,
      reportedBy: reportedBy.trim() || 'Vecino anónimo',
      photoUrl: photoUrl.trim() || null
    });
    if (onShowToast) {
      onShowToast('¡Avistamiento registrado con éxito! Gracias por colaborar. 🐾');
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-drag-handle" aria-hidden="true" />
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar ventana">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ef4444' }}>
            <Radio size={22} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              Reportar Avistamiento de {pet.name || 'la Mascota'}
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Toda pista ayuda a su familia a orientar la búsqueda.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Certainty selector */}
            <div className="form-group">
              <label className="form-label">¿Qué tan seguro/a estás de que era esta mascota? *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`status-pill ${certainty === 'alta' ? 'active pill-adopcion' : ''}`}
                  onClick={() => setCertainty('alta')}
                  style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  🟢 Alta certeza
                </button>
                <button
                  type="button"
                  className={`status-pill ${certainty === 'media' ? 'active pill-encontrado' : ''}`}
                  onClick={() => setCertainty('media')}
                  style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  🟡 Parecido
                </button>
                <button
                  type="button"
                  className={`status-pill ${certainty === 'baja' ? 'active' : ''}`}
                  onClick={() => setCertainty('baja')}
                  style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                >
                  ⚪ Pista lejana
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sighting-time" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                <span>¿Cuándo ocurrió el avistamiento?</span>
              </label>
              <select
                id="sighting-time"
                className="form-select"
                value={timeApprox}
                onChange={(e) => setTimeApprox(e.target.value)}
              >
                <option value="Recientemente (hace minutos)">Recientemente (hace minutos)</option>
                <option value="Hace 1 a 2 horas">Hace 1 a 2 horas</option>
                <option value="Hoy por la mañana">Hoy por la mañana</option>
                <option value="Ayer por la tarde / noche">Ayer por la tarde / noche</option>
                <option value="Hace más de 2 días">Hace más de 2 días</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sighting-location">
                ¿Dónde lo viste exactamente? *
              </label>
              <input
                id="sighting-location"
                type="text"
                className="form-input"
                placeholder="Ej. Esquina Corrientes y Scalabrini Ortiz, frente a la farmacia"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sighting-notes">
                Detalles del momento y dirección hacia donde iba *
              </label>
              <textarea
                id="sighting-notes"
                className="form-textarea"
                rows="3"
                placeholder="Ej. Iba trotando hacia el parque hace 15 min. Llevaba el collar que describen y parecía asustado."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sighting-photo">
                Foto o captura del momento (Opcional)
              </label>

              {photoUrl ? (
                <div style={{ position: 'relative', display: 'inline-block', width: 'fit-content' }}>
                  <img
                    src={photoUrl}
                    alt="Foto del avistamiento"
                    style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border-medium)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                    title="Quitar foto"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label
                      htmlFor="sighting-file-input"
                      className="filter-btn-subtle"
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.85rem',
                        background: 'var(--bg-surface-elevated)'
                      }}
                    >
                      <Camera size={16} />
                      <span>{isCompressingPhoto ? 'Procesando foto...' : 'Tomar / Subir Foto'}</span>
                    </label>
                    <input
                      id="sighting-file-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                      disabled={isCompressingPhoto}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>o ingresa un enlace web:</span>
                  </div>

                  <input
                    id="sighting-photo"
                    type="url"
                    className="form-input"
                    placeholder="https://... o foto en línea"
                    value={photoUrl.startsWith('data:') ? '' : photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sighting-reporter">
                Tu nombre o teléfono (opcional, para avisarte si se reunió)
              </label>
              <input
                id="sighting-reporter"
                type="text"
                className="form-input"
                placeholder="Ej. Juan Gómez (11-4567-8910)"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-detail" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="publish-btn" style={{ background: '#ef4444' }}>
              <Send size={16} />
              <span>Enviar Avistamiento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
