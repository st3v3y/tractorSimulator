import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';

// Extend ImportMeta to include env for Vite
interface ImportMetaEnv {
  VITE_MAPBOX_PUBLIC_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

const MapContainer = styled.div.attrs({
  className: 'flex-1 min-h-[600px] h-screen w-full relative'
})``;

const MapDiv = styled.div.attrs({
  className: 'w-full h-[400px] min-h-[300px] rounded-xl'
})``;

const MapControls = styled.div.attrs({
  className: 'absolute top-4 right-4 z-[1000] flex flex-col gap-2'
})``;

const ControlButton = styled.button.attrs({
  className: 'p-3 bg-white/95 border-none rounded-lg cursor-pointer shadow-md transition-all duration-200 hover:bg-white hover:-translate-y-0.5'
})``;

const StatusBox = styled.div.attrs({
  className: 'absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-sm shadow-md'
})``;

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
    <MapContainer>
      <MapDiv ref={mapRef} />
      <MapControls>
        <ControlButton onClick={handleCenterMap} title="Center on Tractor">
          🎯
        </ControlButton>
        <ControlButton onClick={handleZoomIn} title="Zoom In">
          ➕
        </ControlButton>
        <ControlButton onClick={handleZoomOut} title="Zoom Out">
          ➖
        </ControlButton>
      </MapControls>
      {gpsData.length > 0 && (
        <StatusBox>
          Speed: {gpsData[gpsData.length - 1]?.speed?.toFixed(1) || '0'} km/h
          <br />
          Points: {gpsData.length}
        </StatusBox>
      )}
    </MapContainer>
  );
}