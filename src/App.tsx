import { useLocation } from 'wouter';
import './App.css';
import { SidebarMenu } from './components/map/SidebarMenu';
import { Notification } from './components/ui/Notification';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Dashboard } from './pages/Dashboard';
import { MapView } from './pages/MapView';
import styled from 'styled-components';
import { TractorTrackingProvider } from './context/TractorTrackingContext';
import { useTractorTracking } from './context/TractorTrackingContext';
import { mockTractors, Tractor } from './mock/MockTracktors';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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

function AppWithData() {
  const [currentRoute, navigate] = useLocation();
  const { data: tractors, isLoading } = useQuery<Tractor[]>({
    queryKey: ['tractors'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockTractors;
    },
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppWithData />
    </QueryClientProvider>
  );
}

export default App;
