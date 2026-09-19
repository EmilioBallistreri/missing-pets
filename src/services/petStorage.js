// Servicio de persistencia en LocalStorage para las mascotas y reportes

import { INITIAL_PETS } from './mockData';
import { generateId, calculateDistanceKm } from '../utils/helpers';

const STORAGE_KEY = 'patitas_a_casa_pets_cba_v1';
const FLAGS_KEY = 'patitas_a_casa_flags_v1';

export const PetStorage = {
  getAll: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PETS));
        return INITIAL_PETS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].location?.city === 'Buenos Aires') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PETS));
        return INITIAL_PETS;
      }
      return parsed;
    } catch (err) {
      console.error('Error al leer de localStorage:', err);
      return INITIAL_PETS;
    }
  },

  saveAll: (pets) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
      return true;
    } catch (err) {
      console.error('Error al guardar en localStorage:', err);
      // Notificar si hay fallo por cuota de almacenamiento
      if (err && err.name === 'QuotaExceededError') {
        console.warn('Almacenamiento local lleno. Las fotos previas están ocupando el espacio disponible.');
      }
      return false;
    }
  },

  addPet: (newPetData) => {
    const pets = PetStorage.getAll();
    const newPet = {
      id: generateId(),
      dateReported: new Date().toISOString(),
      sightings: [],
      ...newPetData
    };
    const updated = [newPet, ...pets];
    PetStorage.saveAll(updated);
    return newPet;
  },

  updatePet: (id, updates) => {
    const pets = PetStorage.getAll();
    const updated = pets.map((p) => (p.id === id ? { ...p, ...updates } : p));
    PetStorage.saveAll(updated);
    return updated.find((p) => p.id === id);
  },

  addSighting: (petId, sightingData) => {
    const pets = PetStorage.getAll();
    const newSighting = {
      id: 's_' + Date.now().toString(36),
      date: new Date().toISOString(),
      certainty: sightingData.certainty || 'media',
      ...sightingData
    };
    const updated = pets.map((pet) => {
      if (pet.id === petId) {
        return {
          ...pet,
          sightings: [newSighting, ...(pet.sightings || [])]
        };
      }
      return pet;
    });
    PetStorage.saveAll(updated);
    return updated.find((p) => p.id === petId);
  },

  markStatus: (id, newStatus) => {
    return PetStorage.updatePet(id, { status: newStatus });
  },

  deletePet: (id) => {
    const pets = PetStorage.getAll();
    const updated = pets.filter((p) => p.id !== id);
    PetStorage.saveAll(updated);
    return updated;
  },

  // Algoritmo de Matching entre Perdidos y Encontrados
  findMatches: (petId) => {
    const pets = PetStorage.getAll();
    const target = pets.find((p) => p.id === petId);
    if (!target) return [];

    const isTargetLost = target.status === 'perdido';
    const complementaryStatus = isTargetLost ? 'encontrado' : 'perdido';

    return pets
      .filter((p) => p.id !== target.id && p.status === complementaryStatus && p.species === target.species)
      .map((candidate) => {
        let score = 35; // Misma especie

        if (candidate.gender && target.gender && candidate.gender === target.gender) {
          score += 20;
        }
        if (candidate.size && target.size && candidate.size === target.size) {
          score += 20;
        }

        const distance = calculateDistanceKm(
          target.location?.lat,
          target.location?.lng,
          candidate.location?.lat,
          candidate.location?.lng
        );

        if (distance !== null) {
          if (distance <= 2) score += 25;
          else if (distance <= 5) score += 15;
          else score += 5;
        }

        return {
          candidate,
          matchScore: Math.min(100, score),
          distanceKm: distance
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  // Denuncia comunitaria / Moderación
  addFlag: (petId, flagData) => {
    try {
      const flags = JSON.parse(localStorage.getItem(FLAGS_KEY) || '[]');
      const newFlag = {
        id: 'flag_' + Date.now(),
        petId,
        date: new Date().toISOString(),
        ...flagData
      };
      flags.push(newFlag);
      localStorage.setItem(FLAGS_KEY, JSON.stringify(flags));
      return newFlag;
    } catch (err) {
      console.error('Error al guardar reporte de moderación:', err);
    }
  },

  resetDefaults: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PETS));
    return INITIAL_PETS;
  },

  getStats: (petsList = null) => {
    const pets = petsList || PetStorage.getAll();
    return {
      total: pets.length,
      perdidos: pets.filter((p) => p.status === 'perdido').length,
      encontrados: pets.filter((p) => p.status === 'encontrado').length,
      adopcion: pets.filter((p) => p.status === 'adopcion').length,
      reunidos: pets.filter((p) => p.status === 'reunido' || p.status === 'adoptado').length + 142
    };
  }
};
