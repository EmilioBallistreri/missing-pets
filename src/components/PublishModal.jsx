import React, { useState } from 'react';
import { X, Upload, AlertCircle, Search, Heart, Check, Zap, Navigation, PlusCircle } from 'lucide-react';
import { compressImage } from '../utils/helpers';

const PRESET_SAMPLE_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80', label: 'Perro beagle' },
  { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80', label: 'Perro border' },
  { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80', label: 'Gato siamés' },
  { url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80', label: 'Gato naranja' },
  { url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80', label: 'Perrito mixto' },
  { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80', label: 'Perro galgo' },
];

export default function PublishModal({ initialStatus = 'perdido', initialPetData = null, onClose, onSubmitPet, onShowToast }) {
  const isEditing = Boolean(initialPetData);
  const [isExpressMode, setIsExpressMode] = useState(!isEditing && initialStatus === 'perdido');
  const [status, setStatus] = useState(initialPetData?.status || initialStatus);
  const [species, setSpecies] = useState(initialPetData?.species || 'perro');
  const [name, setName] = useState(initialPetData?.name || '');
  const [breed, setBreed] = useState(initialPetData?.breed || '');
  const [gender, setGender] = useState(initialPetData?.gender || 'Macho');
  const [size, setSize] = useState(initialPetData?.size || 'mediano');
  const [age, setAge] = useState(initialPetData?.age || '');
  const [color, setColor] = useState(initialPetData?.color || '');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState(initialPetData?.distinctiveFeatures || '');
  const [description, setDescription] = useState(initialPetData?.description || '');
  const [reward, setReward] = useState(initialPetData?.reward || '');

  // Location
  const [city, setCity] = useState(initialPetData?.location?.city || 'Buenos Aires');
  const [neighborhood, setNeighborhood] = useState(initialPetData?.location?.neighborhood || '');
  const [address, setAddress] = useState(initialPetData?.location?.address || '');
  const [lat, setLat] = useState(initialPetData?.location?.lat || -34.6037);
  const [lng, setLng] = useState(initialPetData?.location?.lng || -58.3816);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(Boolean(initialPetData?.location?.lat));

  // Images
  const [images, setImages] = useState(initialPetData?.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Contact
  const [contactName, setContactName] = useState(initialPetData?.contact?.name || '');
  const [phone, setPhone] = useState(initialPetData?.contact?.phone || '');
  const [email, setEmail] = useState(initialPetData?.contact?.email || '');

  // Auto-detect GPS coordinates
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      if (onShowToast) onShowToast('⚠️ La geolocalización no es compatible con este navegador.');
      else alert('La geolocalización no es compatible con este navegador.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        setGpsLoading(false);
        setGpsSuccess(true);
        if (!neighborhood) {
          setNeighborhood('Ubicación detectada por GPS');
        }
        if (!address) {
          setAddress(`Coordenadas precisas (${userLat.toFixed(4)}, ${userLng.toFixed(4)})`);
        }
        if (onShowToast) onShowToast('📍 Coordenadas GPS fijadas con precisión.');
      },
      (error) => {
        console.warn('Error al obtener GPS:', error);
        setGpsLoading(false);
        setLat(-34.6037);
        setLng(-58.3816);
        setNeighborhood('Centro / CABA');
        if (onShowToast) {
          onShowToast('⚠️ No se pudo acceder al GPS automáticamente. Puedes indicar tu barrio manualmente.');
        } else {
          alert('No se pudo acceder al GPS automáticamente. Puedes indicar tu barrio manualmente.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        // Comprime cada imagen en el cliente para evitar QuotaExceeded
        const compressedDataUrl = await compressImage(file, 900, 0.78);
        setImages((prev) => [...prev, compressedDataUrl]);
      }
      if (onShowToast) onShowToast('✓ Foto(s) procesada(s) y optimizada(s) con éxito.');
    } catch (err) {
      console.error('Error al procesar imagen:', err);
      if (onShowToast) onShowToast('⚠️ Error al procesar una o más imágenes.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (trimmed) {
      if (!images.includes(trimmed)) {
        setImages((prev) => [...prev, trimmed]);
      }
      setImageUrlInput('');
      if (onShowToast) onShowToast('✓ Imagen agregada desde enlace web.');
    }
  };

  const handleSelectPresetPhoto = (url) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      if (onShowToast) onShowToast('✓ Foto de muestra agregada.');
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (status !== 'encontrado' && !name.trim()) {
      if (onShowToast) onShowToast('⚠️ Por favor introduce el nombre de la mascota.');
      else alert('Por favor introduce el nombre de la mascota.');
      return;
    }

    if (!phone.trim()) {
      if (onShowToast) onShowToast('⚠️ Por favor añade un teléfono o WhatsApp de contacto.');
      else alert('Por favor añade un número de teléfono o WhatsApp para que puedan contactarte.');
      return;
    }

    const finalImages = images.length > 0 ? images : [
      species === 'gato'
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
    ];

    const petData = {
      status,
      species,
      name: name.trim() || 'Mascota Encontrada',
      breed: breed.trim() || 'Mestizo',
      gender,
      size,
      age: age.trim() || 'No especificada',
      color: color.trim() || 'No especificado',
      distinctiveFeatures: distinctiveFeatures.trim(),
      description: description.trim() || (status === 'perdido' ? 'Extraviado recientemente. Por favor avisar si lo ves.' : 'Encontrado en la vía pública buscando a sus dueños.'),
      reward: status === 'perdido' && reward.trim() ? reward.trim() : null,
      location: {
        city: city.trim() || 'Buenos Aires',
        neighborhood: neighborhood.trim() || 'Zona de búsqueda',
        address: address.trim() || neighborhood.trim() || 'Punto reportado',
        lat: Number(lat),
        lng: Number(lng)
      },
      images: finalImages,
      contact: {
        name: contactName.trim() || 'Familia / Rescatista',
        phone: phone.trim(),
        email: email.trim(),
        showPhone: true
      }
    };

    onSubmitPet(petData);
    if (onShowToast) {
      onShowToast(status === 'perdido' ? '🚨 ¡Alerta de búsqueda activada con éxito!' : '✓ Mascota publicada correctamente en la red.');
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-drag-handle" aria-hidden="true" />
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar ventana">
          <X size={20} />
        </button>

        {/* Modal Header with Express vs Detailed Mode Switcher */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {isEditing ? 'Editar Publicación' : 'Publicar Reporte de Mascota'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {isEditing
                  ? 'Modifica los datos, fotos o información de contacto de esta mascota.'
                  : isExpressMode
                    ? '⚡ Modo Express: activa la búsqueda en 30 segundos con tu GPS'
                    : 'Completa todos los detalles para una ficha completa'}
              </p>
            </div>

            {/* Mode Toggle Button only if creating new */}
            {!isEditing && (
              <button
                type="button"
                id="btn-toggle-express-mode"
                className="status-pill"
                onClick={() => setIsExpressMode(!isExpressMode)}
                style={{
                  background: isExpressMode ? '#fef2f2' : 'var(--bg-surface-soft)',
                  borderColor: isExpressMode ? '#ef4444' : 'var(--border-medium)',
                  color: isExpressMode ? '#dc2626' : 'var(--text-main)',
                  fontWeight: 700
                }}
              >
                <Zap size={16} />
                <span>{isExpressMode ? 'Modo Express Activo' : 'Cambiar a Modo Express'}</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Type selector */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Tipo de publicación *</label>
              <div className="type-selector-cards">
                <button
                  type="button"
                  className={`type-card-btn type-perdido ${status === 'perdido' ? 'active' : ''}`}
                  onClick={() => setStatus('perdido')}
                >
                  <AlertCircle size={26} color="#ef4444" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ef4444' }}>Perdido</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Búsqueda urgente</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`type-card-btn type-encontrado ${status === 'encontrado' ? 'active' : ''}`}
                  onClick={() => setStatus('encontrado')}
                >
                  <Search size={26} color="#f59e0b" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f59e0b' }}>Encontrado</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En resguardo</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`type-card-btn type-adopcion ${status === 'adopcion' ? 'active' : ''}`}
                  onClick={() => setStatus('adopcion')}
                >
                  <Heart size={26} color="#10b981" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#10b981' }}>En Adopción</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Busca hogar</div>
                  </div>
                </button>
              </div>
            </div>

            {/* GPS ONE-CLICK CALLOUT */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(244, 63, 94, 0.08))',
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Navigation size={18} style={{ color: '#6366f1' }} />
                  <span>Geolocalización Inmediata por GPS</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {gpsSuccess
                    ? `✓ Ubicación fijada en (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                    : 'Fija el punto en el mapa usando el sensor de tu teléfono o navegador'}
                </div>
              </div>

              <button
                type="button"
                id="btn-detect-gps-publish"
                className="hero-btn"
                onClick={handleDetectGPS}
                disabled={gpsLoading}
                style={{
                  background: gpsSuccess ? '#10b981' : '#6366f1',
                  color: 'white',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.85rem'
                }}
              >
                {gpsLoading ? 'Detectando señal...' : gpsSuccess ? '✓ GPS Capturado' : '📍 Usar Mi Ubicación Actual'}
              </button>
            </div>

            {/* Basic Info Fields */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="pub-name">
                  {status === 'encontrado' ? 'Nombre o apodo' : 'Nombre de la mascota *'}
                </label>
                <input
                  id="pub-name"
                  type="text"
                  className="form-input"
                  placeholder={status === 'encontrado' ? 'Ej. Perrito callejero / Sin nombre' : 'Ej. Milo, Luna, Rocky'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={status !== 'encontrado'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pub-species">Especie *</label>
                <select
                  id="pub-species"
                  className="form-select"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                >
                  <option value="perro">🐶 Perro</option>
                  <option value="gato">🐱 Gato</option>
                  <option value="otro">🐾 Otro animal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pub-phone">
                  Teléfono / WhatsApp de contacto *
                </label>
                <input
                  id="pub-phone"
                  type="tel"
                  className="form-input"
                  placeholder="Ej. +5491145678910"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pub-neighborhood">
                  Barrio o Zona *
                </label>
                <input
                  id="pub-neighborhood"
                  type="text"
                  className="form-input"
                  placeholder="Ej. Palermo, Caballito, Belgrano"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  required
                />
              </div>

              {/* Extra detailed fields if not express */}
              {!isExpressMode && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-gender">Sexo *</label>
                    <select
                      id="pub-gender"
                      className="form-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Macho">Macho</option>
                      <option value="Hembra">Hembra</option>
                      <option value="Desconocido">Desconocido</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-breed">Raza o Tipo</label>
                    <input
                      id="pub-breed"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Mestizo, Caniche, Siamés"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-size">Tamaño</label>
                    <select
                      id="pub-size"
                      className="form-select"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <option value="pequeño">Pequeño (hasta 10 kg)</option>
                      <option value="mediano">Mediano (10 a 25 kg)</option>
                      <option value="grande">Grande (+25 kg)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-age">Edad aproximada</label>
                    <input
                      id="pub-age"
                      type="text"
                      className="form-input"
                      placeholder="Ej. 2 años, Cachorro, Adulto mayor"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-color">Color del pelaje</label>
                    <input
                      id="pub-color"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Dorado claro, Negro con pecho blanco"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-city">Ciudad / Localidad</label>
                    <input
                      id="pub-city"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Buenos Aires, Rosario, Córdoba"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-contact-name">Nombre de quien publica</label>
                    <input
                      id="pub-contact-name"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Camila Rodríguez / Refugio Patas"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pub-email">Email (opcional)</label>
                    <input
                      id="pub-email"
                      type="email"
                      className="form-input"
                      placeholder="contacto@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {status === 'perdido' && (
                    <div className="form-group col-span-2">
                      <label className="form-label" htmlFor="pub-reward">Recompensa ofrecida (opcional)</label>
                      <input
                        id="pub-reward"
                        type="text"
                        className="form-input"
                        placeholder="Ej. $50.000"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="form-group col-span-2">
                    <label className="form-label" htmlFor="pub-distinctive">
                      Señas particulares & Collar
                    </label>
                    <input
                      id="pub-distinctive"
                      type="text"
                      className="form-input"
                      placeholder="Ej. Collar rojo desgastado, mancha blanca en ojo derecho, renguea"
                      value={distinctiveFeatures}
                      onChange={(e) => setDistinctiveFeatures(e.target.value)}
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <label className="form-label" htmlFor="pub-description">
                      Descripción de la situación y comportamiento
                    </label>
                    <textarea
                      id="pub-description"
                      className="form-textarea"
                      rows="2"
                      placeholder="Dónde fue visto por última vez, cómo reacciona con extraños, si necesita medicación..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Photos Upload Strip */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Fotos de la mascota (subir archivos o enlace web)</label>
              
              <div
                className="image-dropzone"
                onClick={() => document.getElementById('file-upload-input').click()}
                style={{ padding: isExpressMode ? '1.2rem' : '2rem' }}
              >
                <Upload size={28} style={{ color: 'var(--primary)', margin: '0 auto 0.4rem auto' }} />
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {isUploading ? 'Comprimiendo y optimizando fotos...' : 'Haz clic para elegir fotos desde tu dispositivo'}
                </p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Las fotos se optimizan automáticamente para ahorrar espacio y cargar al instante
                </span>
                <input
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>

              {/* Add by image URL input */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="O pega una URL directa de imagen (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-detail"
                  onClick={handleAddImageUrl}
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <PlusCircle size={16} />
                  <span>Agregar URL</span>
                </button>
              </div>

              {/* Sample Quick Selector */}
              <div className="preset-photos-container">
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Fotos de muestra instantáneas para prueba:
                </span>
                <div className="preset-photos-strip">
                  {PRESET_SAMPLE_PHOTOS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="preset-thumb-btn"
                      onClick={() => handleSelectPresetPhoto(item.url)}
                      title={item.label}
                    >
                      <img src={item.url} alt={item.label} />
                    </button>
                  ))}
                </div>
              </div>

              {images.length > 0 && (
                <div className="image-preview-strip">
                  {images.map((img, idx) => (
                    <div key={idx} className="preview-thumbnail">
                      <img src={img} alt="Vista previa" />
                      <button
                        type="button"
                        className="btn-remove-thumb"
                        onClick={() => handleRemoveImage(idx)}
                        aria-label="Quitar foto"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-detail" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="publish-btn" id="btn-submit-pet" disabled={isUploading}>
              <Check size={18} />
              <span>
                {isEditing
                  ? 'Guardar Cambios'
                  : isExpressMode
                    ? '🚨 Activar Búsqueda Inmediata'
                    : 'Publicar Mascota'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
