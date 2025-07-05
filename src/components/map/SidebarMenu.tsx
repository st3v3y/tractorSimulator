import { IconLayoutDashboard, IconMap2, IconSettings, IconTractor, IconUser } from '@tabler/icons-react';
import styled from 'styled-components';
import avatarImg from '../../assets/avatar.jpg';

const HeaderContainer = styled.header.attrs({
  className:
    'bg-white/95 backdrop-blur-md px-2 py-4 shadow-md flex flex-col justify-between items-center relative z-[1000]'
})``;

const Logo = styled.div.attrs({
  className: 'p-4 flex items-center gap-3',
})``;

const NavButtons = styled.div.attrs({
  className: 'flex grow flex-col gap-4 mt-8'
})``;

const NavButton = styled.button
  .withConfig({
    shouldForwardProp: (prop) => prop !== 'active',
  })
  .attrs<{ active?: boolean }>(({ active }) => ({
    className:
      `px-2 py-2 rounded-lg border-none transition-color duration-200 cursor-pointer flex flex-col items-center gap-2 text-green-700 text-xs stroke-green-700 ` +
      (active ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-slate-100'),
  }))``;

const UserSection = styled.div.attrs({
  className: 'p-4 border-t border-gray-200 flex flex-col items-center justify-between w-full gap-4',
})``;

const Avatar = styled.div.attrs({
  className: 'w-10 h-10 bg-green-600 rounded-full flex items-center justify-center',
})``;

const mainItems = [
  { title: 'Dashboard', url: '/', icon: IconLayoutDashboard },
  { title: 'Live Map', url: '/map', icon: IconMap2 },
];

export function SidebarMenu({
  currentRoute,
  navigate,
}: {
  currentRoute: string;
  navigate: (path: string) => void;
}) {
  return (
    <HeaderContainer>
      <Logo>
        <div
          className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate('/')}>
          <IconTractor className="w-6 h-6 text-white" />
        </div>
      </Logo>
      <NavButtons>
        {mainItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavButton
              key={item.title}
              active={currentRoute === item.url}
              onClick={() => navigate(item.url)}>
              <IconComponent className="w-8 h-8" stroke={1.5} />
              <span>{item.title}</span>
            </NavButton>
          );
        })}
      </NavButtons>
      <UserSection>
        <button className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
          <IconSettings className="w-6 h-6 stroke-gray-500" stroke={1.5} />
        </button>
        <Avatar>
          <img src={avatarImg} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
        </Avatar>
      </UserSection>
    </HeaderContainer>
  );
}