import React from 'react';
import { X, AlertTriangle, ShieldCheck, Heart, RotateCcw } from 'lucide-react';

export default function HowToHelpModal({ onClose, onResetData }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-drag-handle" aria-hidden="true" />
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar ventana">
          <X size={20} />
        </button>

        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Protocolos de Búsqueda y Rescate</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Recomendaciones de veterinarios y organizaciones protectoras de animales.
          </p>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Card 1: If you lost your pet */}
          <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>
              <AlertTriangle size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>¿Perdiste a tu mascota? Primeras 24 horas clave</h3>
            </div>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Publica de inmediato en Patitas a Casa:</strong> Genera el cartel e imprímelo para colocar en veterinarias, pet shops y almacenes en un radio de 10 cuadras.</li>
              <li><strong>Deja una prenda con tu olor:</strong> Coloca ropa usada o su camita en la puerta o balcón. El olfato de perros y gatos los guía cuando están desorientados.</li>
              <li><strong>Búsqueda nocturna:</strong> Sal a buscar en horarios silenciosos (medianoche o madrugada) llamándolo con voz suave y agitando su paquete de comida favorito.</li>
            </ul>
          </div>

          {/* Card 2: If you found a pet */}
          <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>¿Encontraste un animal en la calle?</h3>
            </div>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Lectura de microchip gratuita:</strong> Llévalo a la veterinaria más cercana para escanear si posee microchip subcutáneo de identificación.</li>
              <li><strong>Acércate despacio:</strong> Los animales perdidos suelen estar asustados. No hagas movimientos bruscos, ofrécele agua o comida antes de intentar sujetarlo.</li>
              <li><strong>Publica la foto clara:</strong> Sube su reporte con la zona exacta para que sus dueños puedan reconocerlo de inmediato.</li>
            </ul>
          </div>

          {/* Card 3: Adoptions */}
          <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '0.5rem' }}>
              <Heart size={20} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Adopción Responsable</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Adoptar es un compromiso de por vida (12 a 18 años). Asegúrate de contar con el tiempo, espacio seguro (redes de protección si tienes balcón/ventanas) y solvencia para su atención veterinaria y alimentación de calidad.
            </p>
          </div>

          {/* Reset data helper */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Reiniciar datos de prueba</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Restaura las mascotas de ejemplo originales.</p>
            </div>
            <button
              className="btn-detail"
              onClick={() => {
                if (window.confirm('¿Deseas restablecer las mascotas iniciales de demostración?')) {
                  onResetData();
                  onClose();
                }
              }}
              style={{ fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} />
              <span>Restaurar datos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
