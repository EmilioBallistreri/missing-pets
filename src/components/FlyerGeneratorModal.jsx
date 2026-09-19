import React, { useState } from 'react';
import { X, Printer, Copy, Smartphone, Square, FileText, Share2 } from 'lucide-react';
import { formatExactDate, getQrCodeUrl } from '../utils/helpers';

export default function FlyerGeneratorModal({ pet, onClose, onShowToast }) {
  const [flyerFormat, setFlyerFormat] = useState('a4'); // 'a4' | 'story' | 'square'

  if (!pet) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}#pet-${pet.id}`;
  const qrCodeImageUrl = getQrCodeUrl(shareUrl, 160);

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cartel de búsqueda: ${pet.name || 'Mascota'}`,
          text: `🚨 ¡Ayúdanos a encontrar a ${pet.name || 'esta mascota'}!`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      if (onShowToast) {
        onShowToast('¡Enlace del cartel y ficha copiado! 🔗');
      } else {
        alert('¡Enlace copiado al portapapeles!');
      }
    }
  };

  const handleCopySummary = () => {
    const text = `🚨 ¡SE BUSCA A ${pet.name?.toUpperCase() || 'ESTA MASCOTA'}! 🚨
Raza: ${pet.breed}
Zona: ${pet.location?.neighborhood || pet.location?.address} (${pet.location?.city})
Señas: ${pet.distinctiveFeatures || 'Sin señas especiales'}
${pet.reward ? `💰 RECOMPENSA: ${pet.reward}` : ''}
Contacto urgente: ${pet.contact?.phone}
Por favor comparte para que vuelva a casa.
Enlace directo: ${shareUrl}`;

    navigator.clipboard.writeText(text);
    if (onShowToast) {
      onShowToast('¡Texto del cartel copiado al portapapeles! 📋');
    } else {
      alert('¡Texto del cartel copiado al portapapeles!');
    }
  };

  const mainImage = pet.images && pet.images.length > 0
    ? pet.images[0]
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: flyerFormat === 'story' ? '460px' : '720px' }}>
        <div className="modal-drag-handle" aria-hidden="true" />
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar ventana">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingRight: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Generador de Carteles Multiformato</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Diseñado para imprimir en la calle o viralizar en redes sociales
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {flyerFormat === 'a4' && (
                <button
                  id="btn-print-flyer"
                  className="publish-btn"
                  style={{ background: '#ef4444', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                  onClick={handlePrint}
                >
                  <Printer size={16} />
                  <span>Imprimir A4</span>
                </button>
              )}
              <button
                className="btn-detail"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                onClick={handleCopySummary}
              >
                <Copy size={15} />
                <span>Copiar Texto</span>
              </button>
              <button
                className="btn-detail"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                onClick={handleShareLink}
                title="Compartir enlace directo con código QR"
              >
                <Share2 size={15} />
                <span>Compartir Link</span>
              </button>
            </div>
          </div>

          {/* Format Selector Pills (Scrollable on mobile) */}
          <div className="horizontal-scroll-pills flyer-format-pills" style={{ marginTop: '0.85rem' }}>
            <button
              type="button"
              className={`filter-btn-subtle ${flyerFormat === 'a4' ? 'active' : ''}`}
              onClick={() => setFlyerFormat('a4')}
            >
              <FileText size={15} />
              <span>📄 Afiche A4 (con QR)</span>
            </button>
            <button
              type="button"
              className={`filter-btn-subtle ${flyerFormat === 'story' ? 'active' : ''}`}
              onClick={() => setFlyerFormat('story')}
            >
              <Smartphone size={15} />
              <span>📱 Historia 9:16</span>
            </button>
            <button
              type="button"
              className={`filter-btn-subtle ${flyerFormat === 'square' ? 'active' : ''}`}
              onClick={() => setFlyerFormat('square')}
            >
              <Square size={15} />
              <span>🔲 Post 1:1</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Sheet Canvas */}
        <div className="modal-body" style={{ background: 'var(--bg-app)', padding: '1.25rem', overflowY: 'auto', maxHeight: '72vh' }}>
          
          {/* FORMAT 1: CLASSIC A4 PRINTABLE POSTER */}
          {flyerFormat === 'a4' && (
            <div className="flyer-sheet" id="printable-flyer-area">
              <div className="flyer-header-banner">
                <h1 className="flyer-main-title">
                  {pet.status === 'encontrado' ? '¡MASCOTA ENCONTRADA!' : '¡SE BUSCA URGENTE!'}
                </h1>
              </div>

              {pet.reward && (
                <div className="flyer-reward-banner">
                  💰 SE OFRECE RECOMPENSA: {pet.reward} 💰
                </div>
              )}

              <img src={mainImage} alt={pet.name} className="flyer-photo" />

              <h2 className="flyer-pet-name">
                {pet.name ? pet.name.toUpperCase() : 'MASCOTA EXTRAVIADA'}
              </h2>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#475569', marginBottom: '1rem' }}>
                {pet.species === 'perro' ? 'Perro' : pet.species === 'gato' ? 'Gato' : 'Animal'} • {pet.breed} • {pet.gender}
              </p>

              <div className="flyer-info-box">
                <p><strong>📍 Zona:</strong> {pet.location?.address}, {pet.location?.neighborhood} ({pet.location?.city})</p>
                <p style={{ marginTop: '0.35rem' }}><strong>📅 Fecha:</strong> {formatExactDate(pet.lastSeenDate || pet.dateReported)}</p>
                {pet.distinctiveFeatures && (
                  <p style={{ marginTop: '0.35rem' }}><strong>🔍 Señas:</strong> {pet.distinctiveFeatures}</p>
                )}
                <p style={{ marginTop: '0.35rem' }}><strong>ℹ️ Situación:</strong> {pet.description}</p>
              </div>

              <div className="flyer-contact-grid">
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
                    SI TIENES DATOS COMUNÍCATE:
                  </div>
                  <div className="flyer-phone-number">
                    {pet.contact?.phone || 'CONTACTO EN APP'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                    Contacto: {pet.contact?.name || 'Familia'} • Disponible 24h
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: 'fit-content',
                  margin: '0 auto'
                }}>
                  <img src={qrCodeImageUrl} alt="QR" style={{ width: '90px', height: '90px' }} />
                  <span style={{ color: '#0f172a', fontSize: '9px', fontWeight: 800, marginTop: '2px' }}>
                    ESCANEA CON LA CÁMARA
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>
                Publicado en Patitas a Casa • Por favor no arrancar este cartel
              </div>
            </div>
          )}

          {/* FORMAT 2: 9:16 VERTICAL STORY (Instagram / WhatsApp Status) */}
          {flyerFormat === 'story' && (
            <div className="flyer-story-sheet">
              <div style={{
                background: 'white',
                color: '#ef4444',
                fontWeight: 900,
                fontSize: '1.25rem',
                padding: '0.4rem',
                borderRadius: '12px',
                letterSpacing: '0.05em',
                marginBottom: '0.65rem'
              }}>
                🚨 ¡SE BUSCA! 🚨
              </div>

              {pet.reward && (
                <div style={{
                  background: '#fef08a',
                  color: '#854d0e',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  padding: '0.25rem',
                  borderRadius: '8px',
                  marginBottom: '0.65rem'
                }}>
                  RECOMPENSA: {pet.reward}
                </div>
              )}

              <div style={{ flex: 1, minHeight: '160px', borderRadius: '16px', overflow: 'hidden', border: '3px solid white', marginBottom: '0.65rem' }}>
                <img src={mainImage} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '0.2rem' }}>
                {pet.name ? pet.name.toUpperCase() : 'MASCOTA EXTRAVIADA'}
              </h2>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fecaca', marginBottom: '0.5rem' }}>
                {pet.breed} • {pet.location?.neighborhood}
              </div>

              {pet.distinctiveFeatures && (
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.35rem 0.5rem', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '0.65rem' }}>
                  {pet.distinctiveFeatures}
                </div>
              )}

              <div style={{ background: 'white', color: '#0f172a', padding: '0.65rem', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                  CONTACTO INMEDIATO (24H)
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#dc2626' }}>
                  {pet.contact?.phone}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {pet.contact?.name} • Patitas a Casa
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 3: 1:1 SQUARE POST (Facebook / Twitter) */}
          {flyerFormat === 'square' && (
            <div className="flyer-square-sheet">
              <div style={{
                background: '#ef4444',
                color: 'white',
                fontWeight: 900,
                fontSize: '1.25rem',
                padding: '0.35rem',
                borderRadius: '8px'
              }}>
                🚨 ALERTA: MASCOTA EXTRAVIADA
              </div>

              <div className="flyer-square-grid">
                <img src={mainImage} alt={pet.name} style={{ width: '100%', height: '100%', minHeight: '130px', objectFit: 'cover', borderRadius: '12px' }} />
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{pet.name}</h2>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>{pet.breed}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>📍 {pet.location?.neighborhood}</div>
                  {pet.reward && (
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#b45309' }}>💰 Recompensa {pet.reward}</div>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineClamp: 2, overflow: 'hidden' }}>{pet.distinctiveFeatures || pet.description}</p>
                </div>
              </div>

              <div style={{ background: '#0f172a', color: 'white', padding: '0.65rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>SI TIENES DATOS COMUNÍCATE AL:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399' }}>{pet.contact?.phone}</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
