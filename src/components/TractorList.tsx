export function TractorList({
  tractors,
  onRequestTractor,
  activeTractor,
}: {
  tractors: any[];
  onRequestTractor: (tractorId: string) => void;
  activeTractor: any;
}) {
  return (
    <div className="card">
      <h2>Available Tractors</h2>
      <div className="tractor-list">
        {tractors?.map((tractor) => (
          <div key={tractor.id} className="tractor-item">
            <div className="tractor-info">
              <h3>{tractor.name}</h3>
              <p>
                {tractor.model} • {tractor.lastSeen}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`status-badge status-${tractor.status}`}>
                {tractor.status.toUpperCase()}
              </span>
              <button
                className="request-button"
                onClick={() => onRequestTractor(tractor)}
                disabled={tractor.status !== 'available' || activeTractor?.id === tractor.id}>
                {activeTractor?.id === tractor.id ? 'Tracking' : 'Request'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}