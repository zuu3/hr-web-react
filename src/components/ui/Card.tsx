import styled from '@emotion/styled';
import { color, radius, shadow, font } from '../../styles/tokens';

export const Card = styled.div`
  background: ${color.surface.white};
  border-radius: ${radius.lg};
  padding: 20px 24px;
  box-shadow: ${shadow.card};
`;

export const DarkCard = styled.div`
  background: ${color.surface.dark};
  border-radius: ${radius.xl};
  padding: 20px 24px;
  box-shadow: ${shadow.cardDark};
  color: ${color.surface.darkText};
`;

export const StatLabel = styled.p`
  font-family: ${font.family};
  font-size: ${font.size.xs};
  font-weight: ${font.weight.medium};
  color: ${color.onDark.muted};
  margin: 0 0 8px;
  line-height: 16px;
`;

export const StatValue = styled.p`
  font-family: ${font.family};
  font-size: 32px;
  font-weight: ${font.weight.bold};
  color: ${color.onDark.base};
  margin: 0;
  line-height: 38px;
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

export const StatUnit = styled.span`
  font-size: ${font.size.base};
  font-weight: ${font.weight.medium};
  color: ${color.onDark.muted};
`;
