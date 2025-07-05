import { IconCrosshair, IconMinus, IconPlus } from "@tabler/icons-react";
import styled from "styled-components";
import { useTractorTracking } from "../../context/TractorTrackingContext";

const MapControlsContainer = styled.div.attrs({
  className: 'absolute top-4 right-4 z-[1000] flex flex-col gap-2',
})``;

const ControlButton = styled.button.attrs({
  className:
    'p-3 bg-white/95 border-none rounded-lg cursor-pointer shadow-md transition-colors duration-200 hover:bg-slate-100',
})``;

export function MapControls({ mapInstanceRef }: { mapInstanceRef: React.RefObject<mapboxgl.Map | null> }) {
  const { activeTractor } = useTractorTracking();

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
    <MapControlsContainer>
      <ControlButton onClick={handleCenterMap} title="Center on Tractor">
        <IconCrosshair className="w-5 h-5" />
      </ControlButton>
      <ControlButton onClick={handleZoomIn} title="Zoom In">
        <IconPlus className="w-5 h-5" />
      </ControlButton>
      <ControlButton onClick={handleZoomOut} title="Zoom Out">
        <IconMinus className="w-5 h-5" />
      </ControlButton>
    </MapControlsContainer>
  );
}
