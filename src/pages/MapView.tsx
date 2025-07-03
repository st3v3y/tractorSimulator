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
      zoom: 12,
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
        zoom: 14,
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

    const latestPosition = gpsData[gpsData.length - 1];

    // Update marker position with smooth animation
    markerRef.current.setLngLat([latestPosition.lng, latestPosition.lat]);

    // Add to path
    pathRef.current.push([latestPosition.lng, latestPosition.lat]);

    // Update path on map (simplified - in real app you'd use map layers)
    if (pathRef.current.length > 1) {
      // This would normally use map.addSource and addLayer for the path
      console.log('Path updated:', pathRef.current.length, 'points');
    }
  }, [gpsData]);

  const handleCenterMap = () => {
    if (activeTractor && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [activeTractor.location.lng, activeTractor.location.lat],
        zoom: 14,
      });
    }
  };

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" />
      <div className="map-controls">
        <button className="control-button" onClick={handleCenterMap} title="Center on Tractor">
          🎯
        </button>
        <button className="control-button" title="Zoom In">
          ➕
        </button>
        <button className="control-button" title="Zoom Out">
          ➖
        </button>
      </div>
    </div>
  );
}