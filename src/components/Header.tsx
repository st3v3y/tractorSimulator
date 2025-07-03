import styled from 'styled-components';

const HeaderContainer = styled.header.attrs({
  className:
    'bg-white/95 backdrop-blur-md px-8 py-4 shadow-md flex justify-between items-center relative z-[1000]'
})``;

const Logo = styled.div.attrs({
  className: 'text-xl font-bold text-gray-800 flex items-center gap-2'
})``;

const NavButtons = styled.div.attrs({
  className: 'flex gap-4'
})``;

const NavButton = styled.button.attrs<{ active?: boolean }>(props => ({
  className:
    `px-4 py-2 rounded-lg border-none font-medium transition-all duration-200 cursor-pointer text-white ` +
    (props.active
      ? 'bg-blue-700 hover:bg-blue-600'
      : 'bg-blue-400 hover:bg-blue-600') +
    ' hover:-translate-y-0.5'
}))``;

export function Header({ currentRoute, navigate }: {
  currentRoute: string;
  navigate: (path: string) => void;
}) {
  return (
    <HeaderContainer>
      <Logo>🚜 TractorTrack Pro</Logo>
      <NavButtons>
        <NavButton
          active={currentRoute === '/'}
          onClick={() => navigate('/')}
        >
          Dashboard
        </NavButton>
        <NavButton
          active={currentRoute === '/map'}
          onClick={() => navigate('/map')}
        >
          Live Map
        </NavButton>
      </NavButtons>
    </HeaderContainer>
  );
}