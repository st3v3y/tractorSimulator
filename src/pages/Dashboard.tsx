import styled from 'styled-components';
import { TractorList } from "../components/TractorList";
import { Card } from '../components/ui/Card';
import { LiveTracking } from '../components/LiveTracking';
import { OverviewCards } from '../components/OverviewCards';

const DashboardContainer = styled.div.attrs({
  className: 'p-8 overflow-auto ',
})``;
const CardsContainer = styled.div.attrs({
  className: 'pt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto w-full overflow-auto flex-1',
})``;


export function Dashboard() {
  return (
    <DashboardContainer>
      <OverviewCards />
      <CardsContainer>
        <Card>
          <TractorList />
        </Card>
        <Card>
          <LiveTracking />
        </Card>
      </CardsContainer>
    </DashboardContainer>
  );
}