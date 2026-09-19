import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { STATUS_CONFIG, calculateDistanceKm, formatDistance } from '../utils/helpers';

export default function InteractiveMap({ pets, onSelectPet, userCoords, proximityKm }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userLayerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center
    // Default center
    const initialLat = userCoords?.lat || pets[0]?.location?.lat || -34.6037;
    const initialLng = userCoords?.lng || pets[0]?.location?.lng || -58.3816;

    // Initialize map if not already created
    if (!mapInstanceRef.current && mapContainerRef.current) {
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      userLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const userLayer = userLayerRef.current;

    markersLayer.clearLayers();
    userLayer.clearLayers();

    const bounds = [];

    // Render User Location & Proximity circle if active
    if (userCoords?.lat && userCoords?.lng) {
      bounds.push([userCoords.lat, userCoords.lng]);

      const userIcon = L.divIcon({
        html: `<div style="background: #3b82f6; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);"></div>`,
        className: 'user-leaflet-pin',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon });
      userMarker.bindPopup('<div style="font-weight: 800; font-size: 13px;">📍 Tu ubicación actual</div>');
      userLayer.addLayer(userMarker);

      if (proximityKm > 0) {
        const circle = L.circle([userCoords.lat, userCoords.lng], {
          radius: proximityKm * 1000,
          color: '#6366f1',
          fillColor: '#818cf8',
          fillOpacity: 0.12,
          weight: 2,
          dashArray: '5, 5'
        });
        userLayer.addLayer(circle);
      }
    }

    // Render Pet Markers
    pets.forEach((pet) => {
      const lat = pet.location?.lat;
      const lng = pet.location?.lng;
      if (!lat || !lng) return;

      bounds.push([lat, lng]);

      const status = pet.status || 'perdido';
      const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.perdido;

      const markerHtml = `
        <div class="custom-pet-marker marker-${status}" style="width: 36px; height: 36px; font-size: 16px;">
          ${pet.species === 'gato' ? '🐱' : pet.species === 'perro' ? '🐶' : '🐾'}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const mainImage = pet.images && pet.images.length > 0
        ? pet.images[0]
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80';

      const dist = userCoords ? calculateDistanceKm(userCoords.lat, userCoords.lng, lat, lng) : null;

      const popupContent = `
        <div class="map-popup-card">
          <img src="${mainImage}" alt="${pet.name || 'Mascota'}" class="map-popup-img" />
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: white; background: ${statusInfo.color}; padding: 2px 8px; border-radius: 9999px;">
              ${statusInfo.label}
            </div>
            ${dist !== null ? `<span style="font-size: 11px; font-weight: 700; color: #6366f1;">${formatDistance(dist)}</span>` : ''}
          </div>
          <div class="map-popup-title">${pet.name || 'Sin nombre'}</div>
          <div class="map-popup-desc">📍 ${pet.location?.neighborhood || pet.location?.city || ''}</div>
          <button id="btn-popup-${pet.id}" style="width: 100%; padding: 6px 10px; background: #0f172a; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
            Ver Ficha Completa
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${pet.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectPet(pet);
          };
        }
      });

      markersLayer.addLayer(marker);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [pets, onSelectPet, userCoords, proximityKm]);

  useEffect(() => {
    const container = mapContainerRef.current;
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (container) {
        delete container._leaflet_id;
      }
    };
  }, []);

  return (
    <div className="map-container-wrapper" style={{ position: 'relative' }}>
      {/* Floating Legend */}
      <div className="map-floating-legend">
        <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          Referencias en Mapa
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#ef4444' }}></span>
          <span>Perdido (Búsqueda Activa)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
          <span>Encontrado (En Resguardo)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#10b981' }}></span>
          <span>En Adopción Responsable</span>
        </div>
        {userCoords && (
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
            <span>Tu Ubicación (GPS)</span>
          </div>
        )}
      </div>

      <div ref={mapContainerRef} className="map-element" id="interactive-pets-map" />
    </div>
  );
}
