import styled from '@emotion/styled';
import { color, font, bp } from '../../styles/tokens';
import { useAuthStore } from '../../store/authStore';

const Bar = styled.header`
  height: 64px;
  border-bottom: 1px solid ${color.ink[10]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: ${color.surface.white};
  position: sticky;
  top: 0;
  z-index: 5;
  ${bp.mobile} {
    padding: 0 16px;
    height: 56px;
  }
`;

const PageTitle = styled.h1`
  font-family: ${font.family};
  font-size: ${font.size['2xl']};
  font-weight: ${font.weight.bold};
  color: ${color.ink[96]};
  margin: 0;
  letter-spacing: -0.5px;
  line-height: 36px;
  ${bp.mobile} {
    font-size: ${font.size.xl};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: ${font.weight.medium};
  color: ${color.ink[72]};
  ${bp.mobile} {
    font-size: ${font.size.sm};
  }
`;

const RoleBadge = styled.span`
  font-size: ${font.size.xs};
  font-weight: ${font.weight.medium};
  color: ${color.ink[40]};
  background: ${color.ink[4]};
  padding: 2px 8px;
  border-radius: 4px;
  ${bp.mobile} { display: none; }
`;

const roleLabel: Record<string, string> = {
  engineer: '엔지니어',
  material_manager: '자재관리',
  admin: '관리자',
};

export const Header = ({ title }: { title: string }) => {
  const user = useAuthStore((s) => s.user);

  return (
    <Bar>
      <PageTitle>{title}</PageTitle>
      {user && (
        <UserInfo>
          <RoleBadge>{roleLabel[user.role] ?? user.role}</RoleBadge>
          {user.name}
        </UserInfo>
      )}
    </Bar>
  );
};
