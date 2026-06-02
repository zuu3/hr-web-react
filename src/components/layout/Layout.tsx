import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { color } from '../../styles/tokens';

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
`;

const Content = styled.div`
  flex: 1;
  padding: 32px 32px 48px;
`;

export const Layout = () => (
  <Wrapper>
    <Sidebar />
    <Main>
      <Content>
        <Outlet />
      </Content>
    </Main>
  </Wrapper>
);
