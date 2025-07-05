import styled from "styled-components";

const StyledCard = styled.div.attrs({
  className: 'bg-white/95 backdrop-blur-md rounded p-8 shadow-sm'
})``;

export function Card({ children }: { children: React.ReactNode }) {
  return(
    <StyledCard>
      {children}
    </StyledCard>
  );
}