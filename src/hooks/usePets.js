import { useState, useMemo, useCallback } from 'react';
import { PetStorage } from '../services/petStorage';

/**
 * Custom Hook para gestionar la colección de mascotas, persistencia y estadísticas
 */
export function usePets() {
  const [pets, setPets] = useState(() => PetStorage.getAll());

  // Agregar nueva mascota
  const addPet = useCallback((newPetData) => {
    const created = PetStorage.addPet(newPetData);
    setPets(PetStorage.getAll());
    return created;
  }, []);

  // Actualizar datos de mascota existente
  const updatePet = useCallback((id, updates) => {
    const updated = PetStorage.updatePet(id, updates);
    setPets(PetStorage.getAll());
    return updated;
  }, []);

  // Actualizar estado (perdido, encontrado, adopcion, reunido, adoptado)
  const updateStatus = useCallback((id, newStatus) => {
    const updated = PetStorage.markStatus(id, newStatus);
    setPets(PetStorage.getAll());
    return updated;
  }, []);

  // Añadir un avistamiento a una mascota
  const addSighting = useCallback((petId, sightingData) => {
    const updated = PetStorage.addSighting(petId, sightingData);
    setPets(PetStorage.getAll());
    return updated;
  }, []);

  // Eliminar una mascota
  const deletePet = useCallback((id) => {
    const updated = PetStorage.deletePet(id);
    setPets(updated);
    return updated;
  }, []);

  // Denuncia / moderación comunitaria
  const reportFlag = useCallback((petId, flagData) => {
    return PetStorage.addFlag(petId, flagData);
  }, []);

  // Restaurar datos de prueba
  const resetData = useCallback(() => {
    const defaults = PetStorage.resetDefaults();
    setPets(defaults);
    return defaults;
  }, []);

  // Algoritmo de coincidencias
  const findMatches = useCallback((petId) => {
    return PetStorage.findMatches(petId);
  }, []);

  // Estadísticas memorizadas
  const stats = useMemo(() => {
    return PetStorage.getStats(pets);
  }, [pets]);

  // Conteo por estado memorizado
  const counts = useMemo(() => {
    return {
      todos: pets.length,
      perdidos: pets.filter((p) => p.status === 'perdido').length,
      encontrados: pets.filter((p) => p.status === 'encontrado').length,
      adopcion: pets.filter((p) => p.status === 'adopcion').length,
    };
  }, [pets]);

  return {
    pets,
    stats,
    counts,
    addPet,
    updatePet,
    updateStatus,
    addSighting,
    deletePet,
    reportFlag,
    resetData,
    findMatches,
  };
}
