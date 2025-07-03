import styled from 'styled-components';
import { TractorList } from "../components/TractorList";

const DashboardContainer = styled.div.attrs({
  className: 'p-8 grid grid-cols-2 gap-8 max-w-[1200px] mx-auto w-full'
})``;

const Card = styled.div.attrs({
  className: 'bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-lg'
})``;

const LatestPosition = styled.div.attrs({
  className: 'mt-4'
})``;

const LatestPositionText = styled.p.attrs({
  className: 'text-sm text-gray-500'
})``;

export function Dashboard({ tractors, onRequestTractor, activeTractor, gpsData }: {
  tractors: any[];
  onRequestTractor: (tractorId: string) => void;
  activeTractor: any;
  gpsData: any[];
}) {
  return (
    <DashboardContainer>
      <TractorList
        tractors={tractors}
        onRequestTractor={onRequestTractor}
        activeTractor={activeTractor}
      />
      <Card>
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
          </div>
        ) : (
          <p>Select a tractor to start tracking</p>
        )}
      </Card>
    </DashboardContainer>
  );
}