import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi, type LoginPayload } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input, InputWrapper, Label, ErrorText } from '../components/ui/Input';
import { color, font, radius, shadow } from '../styles/tokens';
import { useState } from 'react';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${color.surface.subtle};
`;

const Box = styled.div`
  width: 400px;
  background: ${color.surface.white};
  border-radius: ${radius.xl};
  padding: 40px;
  box-shadow: ${shadow.card};
`;

const Logo = styled.h1`
  font-family: ${font.family};
  font-size: 24px;
  font-weight: 700;
  color: ${color.ink[100]};
  margin: 0 0 4px;
  letter-spacing: -0.5px;
`;

const Sub = styled.p`
  font-family: ${font.family};
  font-size: ${font.size.base};
  color: ${color.ink[40]};
  margin: 0 0 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ServerError = styled.p`
  font-family: ${font.family};
  font-size: ${font.size.sm};
  color: ${color.status.error};
  margin: 0;
  padding: 10px 14px;
  background: rgba(255,59,48,0.06);
  border-radius: ${radius.sm};
`;

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>();

  const onSubmit = async (data: LoginPayload) => {
    setServerError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.access_token, res.user, res.refresh_token);
      navigate('/dashboard');
    } catch {
      setServerError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <Page>
      <Box>
        <Logo>STK-HR</Logo>
        <Sub>STK Engineering 근태·지출 관리 시스템</Sub>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputWrapper>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              hasError={!!errors.email}
              {...register('email', { required: '이메일을 입력해 주세요.' })}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              hasError={!!errors.password}
              {...register('password', { required: '비밀번호를 입력해 주세요.' })}
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </InputWrapper>

          {serverError && <ServerError>{serverError}</ServerError>}

          <Button type="submit" disabled={isSubmitting} style={{ marginTop: 8 }}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </Form>
      </Box>
    </Page>
  );
};
