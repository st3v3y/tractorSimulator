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

export function Dashboard() {
  return (
    <DashboardContainer>
      <OverviewCards />
      <Card>
        <TractorList />
      </Card>
      <Card>
       <LiveTracking />
      </Card>
    </DashboardContainer>
  );
}