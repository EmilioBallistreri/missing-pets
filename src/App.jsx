import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import PetFilters from './components/PetFilters';
import PetCard from './components/PetCard';
import PetDetailModal from './components/PetDetailModal';
import PublishModal from './components/PublishModal';
import SightingModal from './components/SightingModal';
import CelebrationModal from './components/CelebrationModal';
import ToastNotification from './components/ToastNotification';
import MobileBottomNav from './components/MobileBottomNav';
import { usePets } from './hooks/usePets';
import { usePetFilters } from './hooks/usePetFilters';

// Code-splitting de componentes pesados o bajo demanda
const InteractiveMap = lazy(() => import('./components/InteractiveMap'));
const FlyerGeneratorModal = lazy(() => import('./components/FlyerGeneratorModal'));
const MatchCompareModal = lazy(() => import('./components/MatchCompareModal'));
const HowToHelpModal = lazy(() => import('./components/HowToHelpModal'));

export default function App() {
  const [activeView, setActiveView] = useState('grid'); // 'grid' | 'map'
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('patitas_theme') === 'dark';
  });

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

  // Hook centralizado de mascotas
  const {
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
  } = usePets();

  // Hook centralizado de filtros, proximidad GPS y búsqueda
  const {
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
  } = usePetFilters(pets, showToast);

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

  // Handlers para acciones de mascotas
  const handleSavePet = (petData) => {
    if (editingPet) {
      const updated = updatePet(editingPet.id, petData);
      if (selectedPet && selectedPet.id === editingPet.id) {
        setSelectedPet(updated);
      }
      setEditingPet(null);
      setIsPublishOpen(false);
      showToast('✓ Publicación actualizada con éxito.');
    } else {
      const created = addPet(petData);
      setSelectedPet(created);
    }
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setIsPublishOpen(true);
  };

  const handleUpdateStatus = (petId, newStatus) => {
    const updated = updateStatus(petId, newStatus);
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet(updated);
    }
    if (newStatus === 'reunido' || newStatus === 'adoptado') {
      setCelebrationPet(updated);
      setCelebrationType(newStatus);
    }
  };

  const handleAddSighting = (petId, sightingData) => {
    const updated = addSighting(petId, sightingData);
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet(updated);
    }
  };

  const handleDeletePet = (petId) => {
    deletePet(petId);
    setSelectedPet(null);
    showToast('La publicación ha sido eliminada.');
  };

  const handleReportFlag = (petId, flagData) => {
    reportFlag(petId, flagData);
    showToast('Gracias. Tu reporte de moderación ha sido registrado.');
  };

  const handleResetData = () => {
    resetData();
    setSelectedPet(null);
    showToast('✓ Datos de muestra restaurados con éxito.');
  };

  const openPublishWithStatus = (status) => {
    setEditingPet(null);
    setPublishInitialStatus(status);
    setIsPublishOpen(true);
  };

  // Coincidencias para MatchCompareModal
  const currentMatches = useMemo(() => {
    if (!matchComparePet) return [];
    return findMatches(matchComparePet.id);
  }, [matchComparePet, findMatches]);

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
                  onClick={resetFilters}
                >
                  Restablecer filtros de búsqueda
                </button>
              </div>
            )}
          </div>
        ) : (
          <Suspense fallback={
            <div style={{ height: '550px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2rem' }}>🗺️</div>
              <p style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Cargando mapa interactivo...</p>
            </div>
          }>
            <InteractiveMap
              pets={filteredPets}
              onSelectPet={setSelectedPet}
              userCoords={userCoords}
              proximityKm={proximityKm}
              darkMode={darkMode}
            />
          </Suspense>
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
        <Suspense fallback={null}>
          <MatchCompareModal
            targetPet={matchComparePet}
            matches={currentMatches}
            onClose={() => setMatchComparePet(null)}
          />
        </Suspense>
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
        <Suspense fallback={null}>
          <FlyerGeneratorModal
            pet={flyerTargetPet}
            onClose={() => setFlyerTargetPet(null)}
            onShowToast={showToast}
          />
        </Suspense>
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
        <Suspense fallback={null}>
          <HowToHelpModal
            onClose={() => setIsHelpOpen(false)}
            onResetData={handleResetData}
          />
        </Suspense>
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
