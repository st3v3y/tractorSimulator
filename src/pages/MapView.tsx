import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';
import { IconChartBar, IconCrosshair, IconMenu, IconMinus, IconPlus, IconTractor, IconX } from "@tabler/icons-react";
import { Card } from "../components/ui/Card";
import { Tractor } from "../mock/MockTracktors";
import { useTractorTracking } from "../context/TractorTrackingContext";

// Extend ImportMeta to include env for Vite
interface ImportMetaEnv {
  VITE_MAPBOX_PUBLIC_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

const MapContainer = styled.div.attrs<{ panelCollapsed?: boolean }>((props) => ({
  className: [
    'h-full min-h-screen relative transition-all duration-300',
    props.panelCollapsed ? 'w-full flex-none' : 'flex-1 w-auto',
  ].join(' '),
}))<{ panelCollapsed?: boolean }>``;

const MapDiv = styled.div.attrs({
  className: 'w-full h-full min-h-[300px] rounded-xl'
})``;

const MapControls = styled.div.attrs({
  className: 'absolute top-4 right-4 z-[1000] flex flex-col gap-2'
})``;

const ControlButton = styled.button.attrs({
  className: 'p-3 bg-white/95 border-none rounded-lg cursor-pointer shadow-md transition-colors duration-200 hover:bg-slate-100'
})``;

const StatusBox = styled.div.attrs({
  className: 'absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-sm shadow-md'
})``;

const ToggleButton = styled.button.attrs({
  className: 'absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 z-10 cursor-pointer transition-colors duration-200',
})``;

const SlidingPanel = styled.div.attrs<{ collapsed?: boolean; }>((props) => ({
  className: `bg-white border-r border-gray-200 transition-all duration-300 h-full flex-shrink-0 ${
    props.collapsed ? 'w-0 min-w-0 overflow-hidden' : 'w-96 min-w-[24rem]'
  }`,
}))``;

export function MapView() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const pathRef = useRef<[number, number][]>([]);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const { activeTractor, gpsData } = useTractorTracking();

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

  // Resize map when panelCollapsed changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Wait for the CSS transition to finish (300ms)
      const timeout = setTimeout(() => {
        mapInstanceRef.current?.resize();
      }, 320);
      return () => clearTimeout(timeout);
    }
  }, [panelCollapsed]);

  const handleCenterMap = () => {
    if (activeTractor && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [activeTractor.location.lng, activeTractor.location.lat],
        zoom: 18,
        duration: 1500,
      });
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
    <div className="flex h-full w-full">
      <SlidingPanel collapsed={panelCollapsed}>
        <div className="p-6 h-full overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Tractor Details</h2>
          {activeTractor ? (
            <>
              <Card>
                <div className="flex items-center gap-3 mb-3">
                  <IconTractor className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{activeTractor.name}</h3>
                    <p className="text-sm text-gray-600">{activeTractor.model}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium">
                      {activeTractor.location.lat}. {activeTractor.location.lng}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {activeTractor.status}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Speed:</span>
                    <span className="text-sm font-medium">
                      {gpsData[gpsData.length - 1]?.speed?.toFixed(1) || '0'} km/h
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <IconChartBar className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Performance Chart</h3>
                </div>
                {/* 
              <ChartContainer>
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>AmCharts integration goes here</p>
                  <p className="text-sm">Distance & Speed over Time</p>
                </div>
              </ChartContainer> */}
              </Card>
            </>
          ) : (
            <Card>
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold">No Tractor Selected</p>
                <p className="text-sm">Select a tractor from the dashboard to see details</p>
              </div>
            </Card>
          )}
        </div>
      </SlidingPanel>
      <MapContainer panelCollapsed={panelCollapsed}>
        <MapDiv ref={mapRef} />
        <ToggleButton onClick={() => setPanelCollapsed(!panelCollapsed)}>
          {panelCollapsed ? <IconMenu className="w-5 h-5" /> : <IconX className="w-5 h-5" />}
        </ToggleButton>
        <MapControls>
          <ControlButton onClick={handleCenterMap} title="Center on Tractor">
            <IconCrosshair className="w-5 h-5" />
          </ControlButton>
          <ControlButton onClick={handleZoomIn} title="Zoom In">
            <IconPlus className="w-5 h-5" />
          </ControlButton>
          <ControlButton onClick={handleZoomOut} title="Zoom Out">
            <IconMinus className="w-5 h-5" />
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
    </div>
  );
}