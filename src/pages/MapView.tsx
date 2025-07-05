import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';
import { IconMenu, IconX } from "@tabler/icons-react";
import { useTractorTracking } from "../context/TractorTrackingContext";
import { getCurrentSpeed } from "../utils/speedUtils";
import { MapControls } from "../components/map/MapControls";
import { SlidingPanel } from "../components/map/SlidingPanel";
import { useMapbox } from "../hooks/useMapbox";

// Extend ImportMeta to include env for Vite
interface ImportMetaEnv {
  VITE_MAPBOX_PUBLIC_KEY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

const MapContainer = styled.div
  .withConfig({
    shouldForwardProp: (prop) => prop !== 'panelCollapsed', // filter out boolean prop
  })
  .attrs<{ panelCollapsed?: boolean }>((props) => ({
    className: [
      'h-full min-h-screen relative transition-all duration-300',
      props.panelCollapsed ? 'w-full flex-none' : 'flex-1 w-auto',
    ].join(' '),
  }))<{ panelCollapsed?: boolean }>``;

const MapDiv = styled.div.attrs({
  className: 'w-full h-full min-h-[300px]'
})``;

const StatusBox = styled.div.attrs({
  className: 'absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-lg text-sm shadow-md'
})``;

const ToggleButton = styled.button.attrs({
  className: 'absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 z-10 cursor-pointer transition-colors duration-200',
})``;


export function MapView() {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const { activeTractor, gpsData } = useTractorTracking();

  const accessToken = (import.meta as any).env.VITE_MAPBOX_PUBLIC_KEY || '';
  const { mapRef, mapInstanceRef } = useMapbox({
    activeTractor,
    gpsData,
    mapboxToken: accessToken,
  });

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

  return (
    <div className="flex h-full w-full">
      <SlidingPanel collapsed={panelCollapsed} />
      <MapContainer panelCollapsed={panelCollapsed}>
        <MapDiv ref={mapRef} />
        <ToggleButton onClick={() => setPanelCollapsed(!panelCollapsed)}>
          {panelCollapsed ? <IconMenu className="w-5 h-5" /> : <IconX className="w-5 h-5" />}
        </ToggleButton>
        <MapControls mapInstanceRef={mapInstanceRef} />
        {gpsData.length > 0 && (
          <StatusBox>
            Speed: {getCurrentSpeed(activeTractor, gpsData)}
            <br />
            Points: {gpsData.length}
          </StatusBox>
        )}
      </MapContainer>
    </div>
  );
}
