import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { generateGPSPath, GPSPoint } from '../utils/gpsUtils';
import { MockWebSocket } from '../mock/MockWebsocket';

interface TractorTrackingContextProps {
  activeTractor: any;
  gpsData: GPSPoint[];
  notification: string | null;
  isLoading: boolean;
  tractors: any[];
  handleRequestTractor: (tractor: any) => Promise<void>;
  closeNotification: () => void;
}

const TractorTrackingContext = createContext<TractorTrackingContextProps | undefined>(undefined);

export const useTractorTracking = () => {
  const ctx = useContext(TractorTrackingContext);
  if (!ctx) throw new Error('useTractorTracking must be used within TractorTrackingProvider');
  return ctx;
};

export const TractorTrackingProvider: React.FC<{ children: React.ReactNode, tractors: any[], isLoading: boolean }> = ({ children, tractors, isLoading }) => {
  const [activeTractor, setActiveTractor] = useState<any>(null);
  const [gpsData, setGpsData] = useState<GPSPoint[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<MockWebSocket | null>(null);
  const gpsPathRef = useRef<GPSPoint[]>([]);
  const gpsIndexRef = useRef<number>(0);

  const handleRequestTractor = useCallback(async (tractor: any) => {
    try {
      setActiveTractor(tractor);
      setGpsData([]);
      const gpsPath = generateGPSPath(tractor.location.lat, tractor.location.lng);
      gpsPathRef.current = gpsPath;
      gpsIndexRef.current = 0;
      const ws = new MockWebSocket();
      setWebsocket(ws);
      ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'gps_update') {
          setGpsData((prev) => [...prev, data.payload]);
        }
      });
      const interval = setInterval(() => {
        if (gpsIndexRef.current < gpsPath.length) {
          ws.emit('message', {
            type: 'gps_update',
            payload: gpsPath[gpsIndexRef.current],
            tractorId: tractor.id,
          });
          gpsIndexRef.current++;
        } else {
          clearInterval(interval);
        }
      }, 1000);
      setNotification(`Started tracking ${tractor.name}`);
    } catch (error) {
      setNotification('Error requesting tractor');
    }
  }, []);

  const closeNotification = useCallback(() => setNotification(null), []);

  return (
    <TractorTrackingContext.Provider value={{
      activeTractor,
      gpsData,
      notification,
      isLoading,
      tractors,
      handleRequestTractor,
      closeNotification,
    }}>
      {children}
    </TractorTrackingContext.Provider>
  );
};
