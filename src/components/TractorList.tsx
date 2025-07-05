import styled from 'styled-components';
import { Button } from './ui/Button';

const TractorListContainer = styled.div.attrs({
  className: 'flex flex-col gap-4'
})``;

const TractorItem = styled.div.attrs({
  className: 'flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-4 bg-gray-50 rounded border border-gray-200'
})``;

const TractorInfo = styled.div.attrs({
  className: ''
})``;

const TractorName = styled.h3.attrs({
  className: 'text-gray-800 mb-1'
})``;

const TractorDetails = styled.p.attrs({
  className: 'text-gray-500 text-sm'
})``;

const StatusBadge = styled.span.attrs<{ status: string }>(props => ({
  className:
    'px-3 py-1 rounded-full text-xs font-medium ' +
    (props.status === 'available'
      ? 'bg-green-100 text-green-900'
      : props.status === 'active'
      ? 'bg-red-100 text-red-900'
      : 'bg-gray-200 text-gray-800')
}))``;

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
    <>
      <h2 className='text-lg mb-2 font-bold'>Available Tractors</h2>
      <TractorListContainer>
        {tractors?.map((tractor) => (
          <TractorItem key={tractor.id}>
            <TractorInfo>
              <TractorName>{tractor.name}</TractorName>
              <TractorDetails>
                {tractor.model} • {tractor.lastSeen}
              </TractorDetails>
            </TractorInfo>
            <div className="flex items-center gap-4 flex-row-reverse sm:flex-row justify-between">
              <StatusBadge status={tractor.status}>
                {tractor.status.toUpperCase()}
              </StatusBadge>
              <Button
                onClick={() => onRequestTractor(tractor)}
                disabled={tractor.status !== 'available' || activeTractor?.id === tractor.id}>
                {activeTractor?.id === tractor.id ? 'Tracking' : 'Request'}
              </Button>
            </div>
          </TractorItem>
        ))}
      </TractorListContainer>
    </>
  );
}