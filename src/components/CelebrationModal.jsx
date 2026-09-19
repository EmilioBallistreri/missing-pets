import React from 'react';
import { X, Share2 } from 'lucide-react';

const STATIC_CONFETTI = [
  { left: 5, delay: 0.1, color: '#f43f5e' },
  { left: 12, delay: 0.8, color: '#10b981' },
  { left: 18, delay: 0.3, color: '#f59e0b' },
  { left: 24, delay: 1.2, color: '#6366f1' },
  { left: 30, delay: 0.5, color: '#ec4899' },
  { left: 38, delay: 1.5, color: '#f43f5e' },
  { left: 45, delay: 0.2, color: '#10b981' },
  { left: 52, delay: 0.9, color: '#f59e0b' },
  { left: 58, delay: 1.4, color: '#6366f1' },
  { left: 64, delay: 0.4, color: '#ec4899' },
  { left: 70, delay: 1.1, color: '#f43f5e' },
  { left: 76, delay: 0.6, color: '#10b981' },
  { left: 82, delay: 1.3, color: '#f59e0b' },
  { left: 88, delay: 0.2, color: '#6366f1' },
  { left: 95, delay: 0.7, color: '#ec4899' },
];

export default function CelebrationModal({ pet, statusType, onClose, onShowToast }) {
  if (!pet) return null;

  const isReunited = statusType === 'reunido';

  const handleShareHappyEnd = () => {
    const text = `🎉 ¡GRAN NOTICIA! ${pet.name || 'La mascota'} que estaba ${isReunited ? 'perdida' : 'en adopción'} ¡ya está ${isReunited ? 'en casa con su familia' : 'felizmente adoptada'}! Muchas gracias a toda la comunidad de Patitas a Casa por compartir y ayudar. ❤️🐾`;
    if (navigator.share) {
      navigator.share({ title: '¡Final Feliz!', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      if (onShowToast) {
        onShowToast('¡Mensaje copiado al portapapeles! 🎉');
      } else {
        alert('¡Mensaje copiado al portapapeles!');
      }
    }
  };

  const mainImage = pet.images && pet.images.length > 0
    ? pet.images[0]
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          textAlign: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '2.5rem 2rem'
        }}
      >
        <div className="modal-drag-handle" aria-hidden="true" />
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        {/* Confetti particles CSS */}
        <div className="confetti-container" aria-hidden="true">
          {STATIC_CONFETTI.map((piece, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                backgroundColor: piece.color
              }}
            />
          ))}
        </div>

        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem', animation: 'scaleUp 0.4s ease-out' }}>
          {isReunited ? '🎉🏠' : '💖🏡'}
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          {isReunited ? '¡Reunido con su Familia!' : '¡Mascota Adoptada!'}
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {isReunited
            ? `Gracias a la ayuda de los vecinos y la red comunitaria, ${pet.name || 'este compañero'} está a salvo y de vuelta en su hogar.`
            : `¡Felicitaciones! ${pet.name || 'Este animalito'} encontró a la familia que tanto merecía para toda su vida.`}
        </p>

        {/* Pet Avatar Card */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 1.5rem auto',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid #10b981',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
        }}>
          <img src={mainImage} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className="hero-btn"
            onClick={handleShareHappyEnd}
            style={{ background: '#10b981', color: 'white', padding: '0.7rem 1.4rem' }}
          >
            <Share2 size={17} />
            <span>Compartir Final Feliz</span>
          </button>
          <button
            className="btn-detail"
            onClick={onClose}
            style={{ padding: '0.7rem 1.2rem' }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
