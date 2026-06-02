import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { color, bp } from '../../styles/tokens';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${color.surface.white};
`;

const Main = styled.main`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  ${bp.mobile} {
    margin-left: 0;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px 32px 48px;
  ${bp.mobile} {
    padding: 16px 16px 80px;
  }
`;

export const Layout = () => (
  <Wrapper>
    <Sidebar />
    <Main>
      <Content>
        <Outlet />
      </Content>
    </Main>
    <BottomNav />
  </Wrapper>
);
