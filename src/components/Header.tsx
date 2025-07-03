export function Header({ currentRoute, navigate }: {
  currentRoute: string;
  navigate: (path: string) => void;
}) {
  return (
    <div className="header">
      <div className="logo">🚜 TractorTrack Pro</div>
      <div className="nav-buttons">
        <button
          className={`nav-button ${currentRoute === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}>
          Dashboard
        </button>
        <button
          className={`nav-button ${currentRoute === '/map' ? 'active' : ''}`}
          onClick={() => navigate('/map')}>
          Live Map
        </button>
      </div>
    </div>
  );
}