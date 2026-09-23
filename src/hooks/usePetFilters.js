import { useState, useMemo, useCallback } from 'react';
import { calculateDistanceKm, normalizeText } from '../utils/helpers';

/**
 * Custom Hook para gestionar los filtros de búsqueda, estado, especie y radio GPS
 */
export function usePetFilters(pets, showToast) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos'); // 'todos' | 'perdido' | 'encontrado' | 'adopcion'
  const [selectedSpecies, setSelectedSpecies] = useState('todos'); // 'todos' | 'perro' | 'gato' | 'otro'
  const [userCoords, setUserCoords] = useState(null);
  const [proximityKm, setProximityKm] = useState(0); // 0 = sin límite

  // Detección de ubicación GPS del usuario
  const handleDetectUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      if (showToast) showToast('⚠️ Tu navegador no soporta geolocalización.', 'warning');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserCoords(coords);
        setProximityKm(5); // Activar por defecto a 5 km
        if (showToast) showToast('📍 Ubicación GPS detectada. Filtrando a 5 km a la redonda.');
      },
      (err) => {
        console.warn('GPS error, usando centro de Córdoba de prueba:', err);
        const coords = { lat: -31.4201, lng: -64.1888 };
        setUserCoords(coords);
        setProximityKm(5);
        if (showToast) showToast('📍 Ubicación fijada en Centro / Córdoba.', 'warning');
      },
      { timeout: 6000 }
    );
  }, [showToast]);

  const handleClearProximity = useCallback(() => {
    setUserCoords(null);
    setProximityKm(0);
    if (showToast) showToast('Filtro de proximidad GPS desactivado.');
  }, [showToast]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('todos');
    setSelectedSpecies('todos');
    setProximityKm(0);
  }, []);

  // Mascotas filtradas y ordenadas
  const filteredPets = useMemo(() => {
    return pets
      .filter((pet) => {
        if (selectedStatus !== 'todos' && pet.status !== selectedStatus) {
          return false;
        }
        if (selectedSpecies !== 'todos' && pet.species !== selectedSpecies) {
          return false;
        }

        if (proximityKm > 0 && userCoords && pet.location?.lat && pet.location?.lng) {
          const dist = calculateDistanceKm(
            userCoords.lat,
            userCoords.lng,
            pet.location.lat,
            pet.location.lng
          );
          if (dist !== null && dist > proximityKm) {
            return false;
          }
        }

        if (searchQuery.trim()) {
          const q = normalizeText(searchQuery);
          const matchName = normalizeText(pet.name).includes(q);
          const matchBreed = normalizeText(pet.breed).includes(q);
          const matchOtherSpecies = normalizeText(pet.otherSpecies).includes(q);
          const matchNeighborhood = normalizeText(pet.location?.neighborhood).includes(q);
          const matchCity = normalizeText(pet.location?.city).includes(q);
          const matchDesc = normalizeText(pet.description).includes(q);
          const matchDistinctive = normalizeText(pet.distinctiveFeatures).includes(q);

          if (!matchName && !matchBreed && !matchOtherSpecies && !matchNeighborhood && !matchCity && !matchDesc && !matchDistinctive) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (proximityKm > 0 && userCoords) {
          const distA = a.location?.lat ? calculateDistanceKm(userCoords.lat, userCoords.lng, a.location.lat, a.location.lng) : 9999;
          const distB = b.location?.lat ? calculateDistanceKm(userCoords.lat, userCoords.lng, b.location.lat, b.location.lng) : 9999;
          return distA - distB;
        }
        return new Date(b.dateReported) - new Date(a.dateReported);
      });
  }, [pets, selectedStatus, selectedSpecies, searchQuery, proximityKm, userCoords]);

  return {
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedSpecies,
    setSelectedSpecies,
    userCoords,
    proximityKm,
    setProximityKm,
    handleDetectUserLocation,
    handleClearProximity,
    resetFilters,
    filteredPets,
  };
}
