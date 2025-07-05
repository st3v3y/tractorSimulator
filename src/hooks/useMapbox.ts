import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Tractor } from "../mock/MockTracktors";

// Define GpsDataPoint type if not already imported
export interface GpsDataPoint {
  lat: number;
  lng: number;
  speed?: number;
}

interface UseMapboxProps {
  activeTractor: Tractor | null;
  gpsData: GpsDataPoint[];
  mapboxToken: string;
}

export function useMapbox({ activeTractor, gpsData, mapboxToken }: UseMapboxProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const pathRef = useRef<[number, number][]>([]);

  // Map initialization
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    mapboxgl.accessToken = mapboxToken || "";
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.9654, 40.7829],
      zoom: 18,
    });
    // Add route line source and layer when map loads
    mapInstanceRef.current.on('load', () => {
      if (!mapInstanceRef.current!.getSource('route')) {
        mapInstanceRef.current!.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: pathRef.current,
            },
          },
        });
        mapInstanceRef.current!.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
          },
        });
      }
    });
    return () => {
      if (mapInstanceRef.current) {
        if (mapInstanceRef.current.getContainer().parentNode) {
          mapInstanceRef.current.remove();
        }
        mapInstanceRef.current = null;
      }
    };
  }, [mapboxToken]);

  // Marker and centering on activeTractor
  useEffect(() => {
    if (!mapInstanceRef.current || !activeTractor) return;
    const onMapLoad = () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      const el = document.createElement('div');
      el.innerHTML = '🚜';
      el.style.fontSize = '24px';
      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([activeTractor.location.lng, activeTractor.location.lat])
        .addTo(mapInstanceRef.current!);
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
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('load', onMapLoad);
      }
    };
  }, [activeTractor]);

  // Marker animation on gpsData change
  useEffect(() => {
    if (!mapInstanceRef.current || !gpsData.length || !markerRef.current) return;
    let animationFrameId: number;
    let startTime: number | null = null;
    const marker = markerRef.current;
    const start = marker.getLngLat();
    const end = gpsData[gpsData.length - 1];
    // If this is a new route, initialize path with the current marker position
    if (pathRef.current.length === 0) {
      pathRef.current.push([start.lng, start.lat]);
    }
    // Check if tractor is stopped (speed 0 or status 'stopped')
    const isStopped = (end.speed === 0) || (activeTractor && activeTractor.status === 'stopped');
    if (isStopped) {
      // Only update marker and path if not already at the last GPS point
      if (start.lng !== end.lng || start.lat !== end.lat) {
        marker.setLngLat([end.lng, end.lat]);
        // Do NOT push to pathRef here to avoid jump/straight line
        const map = mapInstanceRef.current;
        const routeSource = map?.getSource('route') as mapboxgl.GeoJSONSource;
        if (routeSource) {
          routeSource.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: pathRef.current,
            },
          });
        }
      }
      return;
    }
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
    const duration = speed > 0 ? (distance / speed) * 3600 * 1000 : 1000;
    // Add a new point for this segment
    pathRef.current.push([start.lng, start.lat]);
    animationFrameId = requestAnimationFrame(animateMarker);
    return () => cancelAnimationFrame(animationFrameId);

    function animateMarker(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const lng = start.lng + (end.lng - start.lng) * progress;
      const lat = start.lat + (end.lat - start.lat) * progress;
      marker.setLngLat([lng, lat]);
      // Update path and route line on every frame
      if (progress > 0) {
        pathRef.current[pathRef.current.length - 1] = [lng, lat];
        const map = mapInstanceRef.current;
        const routeSource = map?.getSource('route') as mapboxgl.GeoJSONSource;
        if (routeSource) {
          routeSource.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: pathRef.current,
            },
          });
        }
      }
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateMarker);
      } else {
        // Only push the final point if not stopped
        if (!isStopped) {
          pathRef.current.push([end.lng, end.lat]);
        }
      }
    }
  }, [gpsData, activeTractor]);

  return { mapRef, mapInstanceRef };
}
