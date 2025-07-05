import styled from 'styled-components';
import { TractorList } from "../components/TractorList";
import { Card } from '../components/ui/Card';
import { LiveTracking } from '../components/LiveTracking';
import { OverviewCards } from '../components/OverviewCards';

const DashboardContainer = styled.div.attrs({
  className: 'p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto w-full min-h-screen overflow-auto flex-1',
})`
  & > :first-child {
    grid-column: 1 / -1;
  }
`;

export function Dashboard({ tractors, onRequestTractor, activeTractor, gpsData }: {
  tractors: any[];
  onRequestTractor: (tractorId: string) => void;
  activeTractor: any;
  gpsData: any[];
}) {
  return (
    <DashboardContainer>
      <OverviewCards />
      <Card>
        <TractorList
          tractors={tractors}
          onRequestTractor={onRequestTractor}
          activeTractor={activeTractor}
        />
      </Card>
      <Card>
       <LiveTracking
          activeTractor={activeTractor}
          gpsData={gpsData}
        />
      </Card>
    </DashboardContainer>
  );
}