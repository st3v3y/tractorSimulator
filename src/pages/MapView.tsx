import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

// Extend ImportMeta to include env for Vite
interface ImportMetaEnv {
  VITE_MAPBOX_PUBLIC_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

export function MapView({ activeTractor, gpsData, onCenterMap }: {
  activeTractor: any;
  gpsData: any[];
  onCenterMap: () => void;
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const pathRef = useRef<[number, number][]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Mapbox map
    mapboxgl.accessToken = (import.meta as any).env.VITE_MAPBOX_PUBLIC_KEY || "";

    // For demo purposes, we'll create a map without token (limited functionality)
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.9654, 40.7829],
      zoom: 18,
    });

    return () => {
      if (mapInstanceRef.current) {
        // Only remove if the map container is still in the DOM
        if (mapInstanceRef.current.getContainer().parentNode) {
          mapInstanceRef.current.remove();
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !activeTractor) return;

    const onMapLoad = () => {
      // Add or update marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const el = document.createElement('div');
      el.innerHTML = '🚜';
      el.style.fontSize = '24px';

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([activeTractor.location.lng, activeTractor.location.lat])
        .addTo(mapInstanceRef.current!);

      // Center map on tractor
      mapInstanceRef.current!.flyTo({
        center: [activeTractor.location.lng, activeTractor.location.lat],
        zoom: 18,
      });
    };

    if (mapInstanceRef.current.isStyleLoaded()) {
      onMapLoad();
    } else {
      mapInstanceRef.current.once('load', onMapLoad);
    }

    // Clean up event listener if effect re-runs
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('load', onMapLoad);
      }
    };
  }, [activeTractor]);

  useEffect(() => {
    if (!mapInstanceRef.current || !gpsData.length || !markerRef.current) return;

    let animationFrameId: number;
    let startTime: number | null = null;

    const marker = markerRef.current;
    const start = marker.getLngLat();
    const end = gpsData[gpsData.length - 1];

    // Calculate distance (km) and speed (km/h)
    const R = 6371;
    const dLat = ((end.lat - start.lat) * Math.PI) / 180;
    const dLng = ((end.lng - start.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((start.lat * Math.PI) / 180) *
      Math.cos((end.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const speed = end.speed || 10;
    // Calculate duration based on distance and speed (ms)
    // duration = (distance / speed) * 3600 * 1000
    const duration = speed > 0 ? (distance / speed) * 3600 * 1000 : 1000;

    // Debug log for validation
    console.log(
      `Moving from (${start.lat.toFixed(6)},${start.lng.toFixed(6)}) to (${end.lat.toFixed(6)},${end.lng.toFixed(6)}) | Distance: ${distance.toFixed(4)} km | Speed: ${speed} km/h | Duration: ${duration.toFixed(0)} ms`
    );

    function animateMarker(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const lng = start.lng + (end.lng - start.lng) * progress;
      const lat = start.lat + (end.lat - start.lat) * progress;

      marker.setLngLat([lng, lat]);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateMarker);
      }
    }

    animationFrameId = requestAnimationFrame(animateMarker);

    // Save to path (optional: for rendering later)
    pathRef.current.push([end.lng, end.lat]);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gpsData]);

  const handleCenterMap = () => {
    if (activeTractor && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [activeTractor.location.lng, activeTractor.location.lat],
        zoom: 18,
        duration: 1500,
      });
      onCenterMap();
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn({ duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut({ duration: 300 });
    }
  };

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" />
      <div className="map-controls">
        <button className="control-button" onClick={handleCenterMap} title="Center on Tractor">
          🎯
        </button>
        <button className="control-button" onClick={handleZoomIn} title="Zoom In">
          ➕
        </button>
        <button className="control-button" onClick={handleZoomOut} title="Zoom Out">
          ➖
        </button>
      </div>
      {gpsData.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
          Speed: {gpsData[gpsData.length - 1]?.speed?.toFixed(1) || '0'} km/h
          <br />
          Points: {gpsData.length}
        </div>
      )}
    </div>
  );
}