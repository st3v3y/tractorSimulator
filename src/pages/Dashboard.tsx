import { TractorList } from "../components/TractorList";

export function Dashboard({ tractors, onRequestTractor, activeTractor, gpsData }: {
  tractors: any[];
  onRequestTractor: (tractorId: string) => void;
  activeTractor: any;
  gpsData: any[];
}) {
  return (
    <div className="dashboard">
      <TractorList
        tractors={tractors}
        onRequestTractor={onRequestTractor}
        activeTractor={activeTractor}
      />
      <div className="card">
        <h2>Live Tracking</h2>
        {activeTractor ? (
          <div>
            <h3>Tracking: {activeTractor.name}</h3>
            <p>GPS Points Received: {gpsData.length}</p>
            <p>Status: {gpsData.length > 0 ? 'Moving' : 'Waiting for GPS data...'}</p>
            {gpsData.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p>Latest Position:</p>
                <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                  Lat: {gpsData[gpsData.length - 1]?.lat.toFixed(6)}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                  Lng: {gpsData[gpsData.length - 1]?.lng.toFixed(6)}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                  Speed: {gpsData[gpsData.length - 1]?.speed.toFixed(1)} km/h
                </p>
              </div>
            )}
          </div>
        ) : (
          <p>Select a tractor to start tracking</p>
        )}
      </div>
    </div>
  );
}