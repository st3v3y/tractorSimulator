import styled, { keyframes } from 'styled-components';

const LoadingContainer = styled.div.attrs({
  className: 'flex items-center justify-center p-8 text-gray-500'
})``;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div.attrs({
  className: 'w-6 h-6 border-2 border-gray-200 border-t-blue-400 rounded-full mr-2'
})`
  animation: ${spin} 1s linear infinite;
`;

export function LoadingSpinner() {
  return(
    <LoadingContainer>
      <Spinner />
      Loading tractors...
    </LoadingContainer>
  );
}