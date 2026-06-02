import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { color, font } from '../styles/tokens';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffffff;
  font-family: ${font.family};
`;

const Title = styled.h1`
  font-size: ${font.size['2xl']};
  font-weight: ${font.weight.bold};
  color: ${color.ink[100]};
  margin: 0;
  letter-spacing: -0.5px;
`;

const Message = styled.p`
  font-size: ${font.size.sm};
  color: ${color.ink[72]};
  margin: 0;
`;

const BackButton = styled.button`
  margin-top: 16px;
  height: 40px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: ${color.ink[100]};
  color: #ffffff;
  font-size: ${font.size.sm};
  font-weight: ${font.weight.semibold};
  font-family: ${font.family};
  cursor: pointer;
  &:hover {
    background: rgba(29, 29, 31, 0.85);
  }
`;

export const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let message = '알 수 없는 오류가 발생했습니다.';
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '페이지를 찾을 수 없습니다.' : error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Wrapper>
      <Title>오류가 발생했습니다.</Title>
      <Message>{message}</Message>
      <BackButton onClick={() => navigate('/dashboard')}>대시보드로 돌아가기</BackButton>
    </Wrapper>
  );
};
