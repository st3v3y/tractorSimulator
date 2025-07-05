import { useLocation } from 'wouter';
import './App.css';
import { mockTractors } from './mock/MockTractors';
import { useQuery } from './hooks/useQuery';
import { SidebarMenu } from './components/SidebarMenu';
import { Notification } from './components/ui/Notification';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Dashboard } from './pages/Dashboard';
import { MapView } from './pages/MapView';
import styled from 'styled-components';
import { TractorTrackingProvider } from './context/TractorTrackingContext';
import { useTractorTracking } from './context/TractorTrackingContext';

const AppContainer = styled.div.attrs({
  className: 'flex h-full bg-gray-100',
})``;

const MainContent = styled.div.attrs({
  className: 'flex-1 flex flex-col h-full',
})``;

function AppContent({ currentRoute, navigate, tractors, isLoading }: any) {
  const {
    notification,
    closeNotification,
  } = useTractorTracking();

  if (isLoading) {
    return (
      <AppContainer>
        <SidebarMenu currentRoute={currentRoute} navigate={navigate} />
        <MainContent>
          <LoadingSpinner />
        </MainContent>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <SidebarMenu currentRoute={currentRoute} navigate={navigate} />
      <MainContent>
        {currentRoute === '/' && (
          <Dashboard />
        )}
        {currentRoute === '/map' && (
          <MapView />
        )}
      </MainContent>
      {notification && <Notification message={notification} onClose={closeNotification} />}
    </AppContainer>
  );
}

function App() {
  const [currentRoute, navigate] = useLocation();
  const { data: tractors, isLoading } = useQuery('tractors', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockTractors;
  });

  return (
    <TractorTrackingProvider tractors={tractors || []} isLoading={isLoading}>
      <AppContent
        currentRoute={currentRoute}
        navigate={navigate}
        tractors={tractors || []}
        isLoading={isLoading}
      />
    </TractorTrackingProvider>
  );
}

export default App;
