import React from 'react';
import { MapPin, MessageCircle, Eye, Award, Radio, Navigation } from 'lucide-react';
import { STATUS_CONFIG, formatTimeAgo, buildWhatsAppLink, calculateDistanceKm, formatDistance, getSpeciesLabel } from '../utils/helpers';

export default function PetCard({ pet, onSelectPet, userCoords }) {
  const statusInfo = STATUS_CONFIG[pet.status] || STATUS_CONFIG.perdido;
  const mainImage = pet.images && pet.images.length > 0
    ? pet.images[0]
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  const whatsappUrl = buildWhatsAppLink(pet.contact?.phone, pet);

  const distanceKm = userCoords && pet.location?.lat && pet.location?.lng
    ? calculateDistanceKm(userCoords.lat, userCoords.lng, pet.location.lat, pet.location.lng)
    : null;

  return (
    <article className="pet-card" id={`pet-card-${pet.id}`}>
      {/* Image container */}
      <div className="card-image-wrapper" onClick={() => onSelectPet(pet)} style={{ cursor: 'pointer' }}>
        <img
          src={mainImage}
          alt={pet.name ? `${pet.name} (${pet.breed})` : pet.breed}
          className="card-image"
          loading="lazy"
        />

        {/* Status Badge */}
        <span className={`card-badge-status badge-${pet.status}`}>
          {statusInfo.tag}
        </span>

        {/* Reward Badge */}
        {pet.reward && (
          <span className="card-badge-reward">
            <Award size={14} />
            <span>Recompensa {pet.reward}</span>
          </span>
        )}

        {/* Time Ago */}
        <span className="card-time-tag">
          {formatTimeAgo(pet.dateReported)}
        </span>
      </div>

      {/* Content */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title" onClick={() => onSelectPet(pet)} style={{ cursor: 'pointer' }}>
            {pet.name || (pet.status === 'encontrado' ? 'Mascota Encontrada' : 'Sin Nombre')}
          </h3>
          <span className="card-species-badge">
            {getSpeciesLabel(pet)}
          </span>
        </div>

        <p className="card-breed">
          {pet.breed || 'Mestizo'} {pet.gender ? `• ${pet.gender}` : ''} {pet.age ? `• ${pet.age}` : ''}
        </p>

        <div className="card-location" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
            <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pet.location?.neighborhood || pet.location?.address || pet.location?.city || 'Ubicación no especificada'}
            </span>
          </div>

          {distanceKm !== null && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#6366f1',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              flexShrink: 0
            }}>
              <Navigation size={11} />
              {formatDistance(distanceKm)}
            </span>
          )}
        </div>

        <p className="card-description">
          {pet.description}
        </p>

        {/* Sightings tag if any */}
        {pet.sightings && pet.sightings.length > 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.6rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '0.85rem'
          }}>
            <Radio size={13} />
            <span>{pet.sightings.length} {pet.sightings.length === 1 ? 'avistamiento reciente' : 'avistamientos'}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="card-footer-actions">
          <button
            id={`btn-view-details-${pet.id}`}
            className="btn-detail"
            onClick={() => onSelectPet(pet)}
          >
            <Eye size={16} />
            <span>Ver Ficha y Ayudar</span>
          </button>

          {pet.contact?.phone && (
            <a
              id={`btn-whatsapp-${pet.id}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-quick"
              title="Contactar directamente por WhatsApp"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
