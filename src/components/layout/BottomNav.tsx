import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clock, ClipboardList, Receipt, Car } from 'lucide-react';
import { color, font, bp } from '../../styles/tokens';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { to: '/attendance', icon: Clock, label: '출퇴근' },
  { to: '/work-log', icon: ClipboardList, label: '작업' },
  { to: '/expense', icon: Receipt, label: '지출' },
  { to: '/mileage', icon: Car, label: '마일리지' },
];

const Bar = styled.nav`
  display: none;
  ${bp.mobile} {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: ${color.surface.white};
    border-top: 1px solid ${color.ink[10]};
    z-index: 20;
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

const Item = styled(NavLink)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: ${color.ink[40]};
  font-family: ${font.family};
  font-size: 10px;
  font-weight: ${font.weight.medium};
  transition: color 150ms;

  &.active {
    color: ${color.ink[100]};
  }
`;

export const BottomNav = () => (
  <Bar>
    {nav.map(({ to, icon: Icon, label }) => (
      <Item key={to} to={to}>
        <Icon size={20} strokeWidth={1.5} />
        {label}
      </Item>
    ))}
  </Bar>
);
