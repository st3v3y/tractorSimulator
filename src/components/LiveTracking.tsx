import styled from "styled-components";
import { Button } from "./ui/Button";
import { useLocation } from "wouter";
import { useTractorTracking } from "../context/TractorTrackingContext";

const LatestPosition = styled.div.attrs({
  className: 'mt-4',
})``;

const LatestPositionText = styled.p.attrs({
  className: 'text-sm text-gray-500',
})``;

export function LiveTracking() {
  const [, navigate] = useLocation();
  const { activeTractor, gpsData } = useTractorTracking();
  
  return (
    <>
      <h2 className="text-lg mb-2 font-bold">Live Tracking</h2>
      {activeTractor ? (
        <div>
          <h3>Tracking: {activeTractor.name}</h3>
          <p>GPS Points Received: {gpsData.length}</p>
          <p>Status: {gpsData.length > 0 ? 'Moving' : 'Waiting for GPS data...'}</p>
          {gpsData.length > 0 && (
            <LatestPosition>
              <p>Latest Position:</p>
              <LatestPositionText>
                Lat: {gpsData[gpsData.length - 1]?.lat.toFixed(6)}
              </LatestPositionText>
              <LatestPositionText>
                Lng: {gpsData[gpsData.length - 1]?.lng.toFixed(6)}
              </LatestPositionText>
              <LatestPositionText>
                Speed: {gpsData[gpsData.length - 1]?.speed.toFixed(1)} km/h
              </LatestPositionText>
            </LatestPosition>
          )}
          <Button onClick={() => navigate('/map')} className="mt-5">See live location</Button>
        </div>
      ) : (
        <p>Select a tractor to start tracking</p>
      )}
    </>
  );
}
