import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import PetFilters from './components/PetFilters';
import PetCard from './components/PetCard';
import InteractiveMap from './components/InteractiveMap';
import PetDetailModal from './components/PetDetailModal';
import PublishModal from './components/PublishModal';
import SightingModal from './components/SightingModal';
import FlyerGeneratorModal from './components/FlyerGeneratorModal';
import HowToHelpModal from './components/HowToHelpModal';
import CelebrationModal from './components/CelebrationModal';
import MatchCompareModal from './components/MatchCompareModal';
import ToastNotification from './components/ToastNotification';
import MobileBottomNav from './components/MobileBottomNav';
import { PetStorage } from './services/petStorage';
import { calculateDistanceKm, normalizeText } from './utils/helpers';

export default function App() {
  const [pets, setPets] = useState(() => PetStorage.getAll());
  const [activeView, setActiveView] = useState('grid'); // 'grid' | 'map'
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('patitas_theme') === 'dark';
  });

  // User GPS coordinates & Proximity filter
  const [userCoords, setUserCoords] = useState(null);
  const [proximityKm, setProximityKm] = useState(0); // 0 = sin límite

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Modals state
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [publishInitialStatus, setPublishInitialStatus] = useState('perdido');
  const [sightingTargetPet, setSightingTargetPet] = useState(null);
  const [flyerTargetPet, setFlyerTargetPet] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [celebrationPet, setCelebrationPet] = useState(null);
  const [celebrationType, setCelebrationType] = useState('reunido');
  const [matchComparePet, setMatchComparePet] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos'); // 'todos' | 'perdido' | 'encontrado' | 'adopcion'
  const [selectedSpecies, setSelectedSpecies] = useState('todos'); // 'todos' | 'perro' | 'gato' | 'otro'

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      selectedPet || isPublishOpen || sightingTargetPet || flyerTargetPet ||
      isHelpOpen || celebrationPet || matchComparePet
    );
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedPet, isPublishOpen, sightingTargetPet, flyerTargetPet, isHelpOpen, celebrationPet, matchComparePet]);

  // Synchronize deep-linking from window.location.hash (#pet-:id)
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#pet-')) {
        const petId = hash.replace('#pet-', '');
        const target = pets.find((p) => String(p.id) === petId);
        if (target) {
          setSelectedPet(target);
        }
      } else if (!hash) {
        setSelectedPet((prev) => (prev ? null : prev));
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [pets]);

  // Update browser URL hash when selectedPet changes from UI clicks
  useEffect(() => {
    if (selectedPet) {
      const targetHash = `#pet-${selectedPet.id}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
      }
    } else {
      if (window.location.hash && window.location.hash.startsWith('#pet-')) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    }
  }, [selectedPet]);

  // Handle Dark Mode toggling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('patitas_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('patitas_theme', 'light');
    }
  }, [darkMode]);

  // GPS User Location Detection
  const handleDetectUserLocation = () => {
    if (!navigator.geolocation) {
      showToast('⚠️ Tu navegador no soporta geolocalización.', 'warning');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserCoords(coords);
        setProximityKm(5); // Activar por defecto a 5 km
        showToast('📍 Ubicación GPS detectada. Filtrando a 5 km a la redonda.');
      },
      (err) => {
        console.warn('GPS error, usando centro de Córdoba de prueba:', err);
        const coords = { lat: -31.4201, lng: -64.1888 };
        setUserCoords(coords);
        setProximityKm(5);
        showToast('📍 Ubicación fijada en Centro / Córdoba.', 'warning');
      },
      { timeout: 6000 }
    );
  };

  const handleClearProximity = () => {
    setUserCoords(null);
    setProximityKm(0);
    showToast('Filtro de proximidad GPS desactivado.');
  };

  // CRUD Handlers
  const handleAddPet = (newPetData) => {
    const created = PetStorage.addPet(newPetData);
    setPets(PetStorage.getAll());
    setSelectedPet(created);
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setIsPublishOpen(true);
  };

  const handleSavePet = (petData) => {
    if (editingPet) {
      const updated = PetStorage.updatePet(editingPet.id, petData);
      setPets(PetStorage.getAll());
      if (selectedPet && selectedPet.id === editingPet.id) {
        setSelectedPet(updated);
      }
      setEditingPet(null);
      setIsPublishOpen(false);
      showToast('✓ Publicación actualizada con éxito.');
    } else {
      handleAddPet(petData);
    }
  };

  const handleUpdateStatus = (petId, newStatus) => {
    const updated = PetStorage.markStatus(petId, newStatus);
    setPets(PetStorage.getAll());
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet(updated);
    }
    if (newStatus === 'reunido' || newStatus === 'adoptado') {
      setCelebrationPet(updated);
      setCelebrationType(newStatus);
    }
  };

  const handleAddSighting = (petId, sightingData) => {
    const updated = PetStorage.addSighting(petId, sightingData);
    setPets(PetStorage.getAll());
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet(updated);
    }
  };

  const handleDeletePet = (petId) => {
    const updated = PetStorage.deletePet(petId);
    setPets(updated);
    setSelectedPet(null);
    showToast('La publicación ha sido eliminada.');
  };

  const handleReportFlag = (petId, flagData) => {
    PetStorage.addFlag(petId, flagData);
    showToast('Gracias. Tu reporte de moderación ha sido registrado.');
  };

  const handleResetData = () => {
    const defaults = PetStorage.resetDefaults();
    setPets(defaults);
    setSelectedPet(null);
    showToast('✓ Datos de muestra restaurados con éxito.');
  };

  const openPublishWithStatus = (status) => {
    setEditingPet(null);
    setPublishInitialStatus(status);
    setIsPublishOpen(true);
  };

  // Stats calculation directly from memory
  const stats = useMemo(() => {
    return PetStorage.getStats(pets);
  }, [pets]);

  // Counts for status tabs directly from memory
  const counts = useMemo(() => {
    return {
      todos: pets.length,
      perdidos: pets.filter((p) => p.status === 'perdido').length,
      encontrados: pets.filter((p) => p.status === 'encontrado').length,
      adopcion: pets.filter((p) => p.status === 'adopcion').length,
    };
  }, [pets]);

  // Potential matches for MatchCompareModal
  const currentMatches = useMemo(() => {
    if (!matchComparePet) return [];
    return PetStorage.findMatches(matchComparePet.id);
  }, [matchComparePet]);

  // Filtered & Sorted Pets with diacritic-insensitive search
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

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenPublish={() => openPublishWithStatus('perdido')}
        onOpenHelp={() => setIsHelpOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="main-content">
        {/* Community Hero Banner with CTA and Statistics */}
        <HeroBanner
          stats={stats}
          onOpenPublishWithStatus={openPublishWithStatus}
        />

        {/* Filters, GPS proximity and Search toolbar */}
        <PetFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedSpecies={selectedSpecies}
          setSelectedSpecies={setSelectedSpecies}
          proximityKm={proximityKm}
          setProximityKm={setProximityKm}
          userCoords={userCoords}
          onDetectUserLocation={handleDetectUserLocation}
          onClearProximity={handleClearProximity}
          counts={counts}
        />

        {/* Main View: Grid vs Interactive Map */}
        {activeView === 'grid' ? (
          <div>
            {filteredPets.length > 0 ? (
              <div className="pet-grid">
                {filteredPets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onSelectPet={setSelectedPet}
                    onOpenSighting={setSightingTargetPet}
                    userCoords={userCoords}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No encontramos mascotas con esos filtros</h3>
                <p className="empty-subtitle">
                  {proximityKm > 0
                    ? `No hay mascotas registradas a menos de ${proximityKm} km de tu ubicación. Prueba ampliando el radio.`
                    : 'Prueba cambiando los criterios de búsqueda o limpia los filtros para ver todas las publicaciones activas.'}
                </p>
                <button
                  className="btn-detail"
                  style={{ margin: '0 auto' }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('todos');
                    setSelectedSpecies('todos');
                    setProximityKm(0);
                  }}
                >
                  Restablecer filtros de búsqueda
                </button>
              </div>
            )}
          </div>
        ) : (
          <InteractiveMap
            pets={filteredPets}
            onSelectPet={setSelectedPet}
            userCoords={userCoords}
            proximityKm={proximityKm}
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--text-main)', fontSize: '1.2rem' }}>
            <span>🐾</span>
            <span>Patitas a Casa</span>
          </div>
          <p style={{ maxWidth: '540px', lineHeight: 1.5 }}>
            Una iniciativa comunitaria y de código abierto para que ningún animal quede desamparado ni una familia sufra por su amigo extraviado.
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Plataforma comunitaria de reporte de mascotas y adopción responsable • {new Date().getFullYear()}
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onOpenSighting={(pet) => {
            setSightingTargetPet(pet);
          }}
          onOpenFlyer={(pet) => {
            setFlyerTargetPet(pet);
          }}
          onOpenMatchCompare={(pet) => {
            setMatchComparePet(pet);
          }}
          onUpdateStatus={handleUpdateStatus}
          onDeletePet={handleDeletePet}
          onReportFlag={handleReportFlag}
          onEditPet={handleEditPet}
          onShowToast={showToast}
        />
      )}

      {matchComparePet && (
        <MatchCompareModal
          targetPet={matchComparePet}
          matches={currentMatches}
          onClose={() => setMatchComparePet(null)}
        />
      )}

      {isPublishOpen && (
        <PublishModal
          initialStatus={publishInitialStatus}
          initialPetData={editingPet}
          onClose={() => {
            setIsPublishOpen(false);
            setEditingPet(null);
          }}
          onSubmitPet={handleSavePet}
          onShowToast={showToast}
        />
      )}

      {sightingTargetPet && (
        <SightingModal
          pet={sightingTargetPet}
          onClose={() => setSightingTargetPet(null)}
          onSubmitSighting={handleAddSighting}
          onShowToast={showToast}
        />
      )}

      {flyerTargetPet && (
        <FlyerGeneratorModal
          pet={flyerTargetPet}
          onClose={() => setFlyerTargetPet(null)}
          onShowToast={showToast}
        />
      )}

      {celebrationPet && (
        <CelebrationModal
          pet={celebrationPet}
          statusType={celebrationType}
          onClose={() => setCelebrationPet(null)}
          onShowToast={showToast}
        />
      )}

      {isHelpOpen && (
        <HowToHelpModal
          onClose={() => setIsHelpOpen(false)}
          onResetData={handleResetData}
        />
      )}

      {/* Floating Toast Notification */}
      <ToastNotification
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Native Mobile Bottom Navigation Bar (visible <= 768px) */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenPublish={() => openPublishWithStatus('perdido')}
        onOpenHelp={() => setIsHelpOpen(true)}
        onDetectUserLocation={handleDetectUserLocation}
        userCoords={userCoords}
        proximityKm={proximityKm}
      />
    </div>
  );
}
