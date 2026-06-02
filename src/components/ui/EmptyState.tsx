import styled from '@emotion/styled';
import { color, font } from '../../styles/tokens';

const Wrapper = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: ${color.ink[40]};
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: ${font.weight.medium};
`;

export const EmptyState = ({ message }: { message: string }) => (
  <Wrapper>{message}</Wrapper>
);
