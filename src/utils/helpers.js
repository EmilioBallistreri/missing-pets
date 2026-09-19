// Helpers y utilidades para Patitas a Casa

export const STATUS_CONFIG = {
  perdido: {
    label: 'Perdido',
    color: '#ef4444',
    bgLight: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    icon: 'AlertTriangle',
    tag: '🚨 Alerta Urgente',
  },
  encontrado: {
    label: 'Encontrado',
    color: '#f59e0b',
    bgLight: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    icon: 'Search',
    tag: '🔍 En Resguardo',
  },
  adopcion: {
    label: 'En Adopción',
    color: '#10b981',
    bgLight: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    icon: 'Heart',
    tag: '🏡 Busca Hogar',
  },
  reunido: {
    label: 'Reunido con su familia',
    color: '#6366f1',
    bgLight: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.35)',
    icon: 'CheckCircle2',
    tag: '🎉 ¡En Casa!',
  },
  adoptado: {
    label: 'Adoptado',
    color: '#8b5cf6',
    bgLight: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.35)',
    icon: 'Sparkles',
    tag: '💖 ¡Adoptado con amor!',
  }
};

export const SPECIES_CONFIG = {
  perro: { label: 'Perro', emoji: '🐶' },
  gato: { label: 'Gato', emoji: '🐱' },
  otro: { label: 'Otro', emoji: '🐾' }
};

export function getSpeciesLabel(pet) {
  if (!pet) return '';
  if (pet.species === 'perro') return '🐶 Perro';
  if (pet.species === 'gato') return '🐱 Gato';
  if (pet.otherSpecies) return `🐾 ${pet.otherSpecies}`;
  return '🐾 Otro animal';
}

export const SIZES_CONFIG = {
  pequeño: 'Pequeño (hasta 10 kg)',
  mediano: 'Mediano (10 a 25 kg)',
  grande: 'Grande (+25 kg)'
};

export function formatTimeAgo(dateString) {
  if (!dateString) return 'Recientemente';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Hace unos momentos';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function formatExactDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function buildWhatsAppLink(phone, pet) {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  let message = '';
  if (pet.status === 'perdido') {
    message = `Hola, te escribo desde la app Patitas a Casa por tu publicación sobre ${pet.name || 'tu mascota perdida'}. Tengo información / novedades para compartirte.`;
  } else if (pet.status === 'encontrado') {
    message = `Hola, vi tu publicación de la mascota encontrada (${pet.species} en ${pet.location?.neighborhood || pet.location?.city}). Creo que puede ser mía o conozco a sus dueños.`;
  } else {
    message = `Hola, estoy muy interesado/a en iniciar el proceso de adopción de ${pet.name || 'la mascota'} que publicaste en Patitas a Casa.`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateId() {
  return 'pet_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

/**
 * Fórmula de Haversine para calcular distancia en kilómetros entre dos coordenadas GPS
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm) {
  if (distanceKm === null || distanceKm === undefined) return '';
  if (distanceKm < 1) {
    return `a ${Math.round(distanceKm * 1000)} m`;
  }
  return `a ${distanceKm.toFixed(1)} km`;
}

/**
 * Genera la URL del código QR para escanear el reporte
 */
export function getQrCodeUrl(content, size = 180) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}&bgcolor=ffffff&color=0f172a&margin=4`;
}

/**
 * Normaliza texto eliminando acentos y convirtiendo a minúsculas para búsquedas insensibles
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Comprime y redimensiona una imagen en el navegador usando un Canvas antes de almacenarla
 * Reduce archivos de varios MB a ~60-90 KB en formato WebP o JPEG, evitando QuotaExceededError
 */
export function compressImage(file, maxWidth = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen válida'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al decodificar la imagen'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Intenta WebP primero, si no es soportado cae en JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
