import styled from '@emotion/styled';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Clock, ClipboardList, Receipt, Car, LogOut,
} from 'lucide-react';
import { color, font, shadow, duration, easing } from '../../styles/tokens';
import { useAuthStore } from '../../store/authStore';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { to: '/attendance', icon: Clock, label: '출퇴근' },
  { to: '/work-log', icon: ClipboardList, label: '작업 기록' },
  { to: '/expense', icon: Receipt, label: '지출 관리' },
  { to: '/mileage', icon: Car, label: '마일리지' },
];

const Aside = styled.aside`
  width: 240px;
  min-height: 100vh;
  background: ${color.surface.subtle};
  border-right: 1px solid ${color.ink[10]};
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: ${font.weight.bold};
  color: ${color.ink[100]};
  padding: 12px 12px 24px;
  letter-spacing: -0.3px;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: ${font.weight.medium};
  color: ${color.ink[72]};
  text-decoration: none;
  transition: background ${duration.short} ${easing.outQuart},
              box-shadow ${duration.short} ${easing.outQuart},
              color ${duration.short};

  &:hover { background: ${color.ink[4]}; color: ${color.ink[100]}; }

  &.active {
    background: ${color.ink[4]};
    box-shadow: ${shadow.ringActive};
    color: ${color.ink[100]};
    font-weight: ${font.weight.bold};
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: ${font.weight.medium};
  color: ${color.ink[40]};
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: color ${duration.short};

  &:hover { color: ${color.ink[72]}; }
`;

export const Sidebar = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <Aside>
      <Logo>STK-HR</Logo>
      <NavList>
        {nav.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavItem to={to}>
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </NavItem>
          </li>
        ))}
      </NavList>
      <LogoutBtn onClick={logout}>
        <LogOut size={16} strokeWidth={1.5} />
        로그아웃
      </LogoutBtn>
    </Aside>
  );
};
