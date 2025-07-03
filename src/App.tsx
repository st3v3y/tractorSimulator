import { useState, useRef, useCallback } from 'react'
import './App.css'
import { useLocation } from 'wouter'
import { mockTractors } from './mock/MockTracktors'
import { generateGPSPath, GPSPoint } from './utils/gpsUtils'
import { MockWebSocket } from './mock/MockWebsocket'
import { Header } from './components/Header'
import { Notification } from './components/Notification';
import { LoadingSpinner } from './components/LoadingSpinner'
import { Dashboard } from './pages/Dashboard'
import { MapView } from './pages/MapView'
import { useQuery } from './hooks/useQuery'


function App() {
  const [currentRoute, navigate] = useLocation();
  const [activeTractor, setActiveTractor] = useState(null);
  const [gpsData, setGpsData] = useState<GPSPoint[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<MockWebSocket | null>(null);
  // Define the GPSPoint type if not already imported
  // type GPSPoint = { lat: number; lng: number; [key: string]: any };

  const gpsPathRef = useRef<GPSPoint[]>([]);
  const gpsIndexRef = useRef<number>(0);

  // Fetch tractors using mock TanStack Query
  const { data: tractors, isLoading } = useQuery('tractors', async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTractors;
  });

  const handleRequestTractor = useCallback(async (tractor) => {
      try {
          setActiveTractor(tractor);
          setGpsData([]);
          
          // Generate GPS path for simulation
          const gpsPath = generateGPSPath(tractor.location.lat, tractor.location.lng);
          gpsPathRef.current = gpsPath;
          gpsIndexRef.current = 0;

          // Create mock WebSocket connection
          const ws = new MockWebSocket();
          setWebsocket(ws);

          // Set up WebSocket listener
          ws.addEventListener('message', (event) => {
              const data = JSON.parse(event.data);
              if (data.type === 'gps_update') {
                  setGpsData(prev => [...prev, data.payload]);
              }
          });

          // Simulate GPS data streaming
          const interval = setInterval(() => {
              if (gpsIndexRef.current < gpsPath.length) {
                  ws.emit('message', {
                      type: 'gps_update',
                      payload: gpsPath[gpsIndexRef.current],
                      tractorId: tractor.id
                  });
                  gpsIndexRef.current++;
              } else {
                  clearInterval(interval);
              }
          }, 1000);

          setNotification(`Started tracking ${tractor.name}`);
          navigate('/map');

      } catch (error) {
          console.error('Error requesting tractor:', error);
          setNotification('Error requesting tractor');
      }
  }, [navigate]);

  const closeNotification = useCallback(() => {
      setNotification(null);
  }, []);

  if (isLoading) {
      return (
          <div className="app-container">
              <Header currentRoute={currentRoute} navigate={navigate} />
              <div className="main-content">
                  <LoadingSpinner />
              </div>
          </div>
      );
  }

  return (
      <div className="app-container">
          <Header currentRoute={currentRoute} navigate={navigate} />
          <div className="main-content">
              {currentRoute === '/' && (
                  <Dashboard 
                      tractors={tractors || []}
                      onRequestTractor={handleRequestTractor}
                      activeTractor={activeTractor}
                      gpsData={gpsData}
                  />
              )}
              {currentRoute === '/map' && (
                  <MapView 
                      activeTractor={activeTractor}
                      gpsData={gpsData} 
                      onCenterMap={function (): void {
                          throw new Error('Function not implemented.')
                      } }                  
                    />
              )}
          </div>
          {notification && (
              <Notification 
                  message={notification} 
                  onClose={closeNotification}
              />
          )}
      </div>
  );
}

export default App
