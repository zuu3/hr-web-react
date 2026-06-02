import styled from '@emotion/styled';
import { color, radius, shadow, duration, easing, font } from '../../styles/tokens';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.label`
  font-family: ${font.family};
  font-size: ${font.size.xs};
  font-weight: ${font.weight.medium};
  color: ${color.ink[72]};
  line-height: 16px;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: ${font.weight.regular};
  color: ${color.ink[100]};
  background: ${color.surface.white};
  border: none;
  outline: none;
  border-radius: ${radius.md};
  padding: 10px 14px;
  height: 40px;
  width: 100%;
  box-shadow: ${({ hasError }) => (hasError ? shadow.ringError : shadow.ringInactive)};
  transition: box-shadow ${duration.short} ${easing.outQuart};
  box-sizing: border-box;

  &::placeholder { color: ${color.ink[40]}; }
  &:focus { box-shadow: ${({ hasError }) => (hasError ? shadow.ringError : shadow.ringFocus)}; }
  &:disabled { background: ${color.ink[4]}; color: ${color.ink[40]}; cursor: not-allowed; }

  /* tabular nums for number inputs */
  &[type='number'] { font-variant-numeric: tabular-nums; }
`;

export const Select = styled.select`
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: ${font.weight.regular};
  color: ${color.ink[100]};
  background: ${color.surface.white};
  border: none;
  outline: none;
  border-radius: ${radius.md};
  padding: 10px 14px;
  height: 40px;
  width: 100%;
  box-shadow: ${shadow.ringInactive};
  transition: box-shadow ${duration.short} ${easing.outQuart};
  box-sizing: border-box;
  cursor: pointer;

  &:focus { box-shadow: ${shadow.ringFocus}; }
`;

export const ErrorText = styled.span`
  font-family: ${font.family};
  font-size: ${font.size.xs};
  font-weight: ${font.weight.medium};
  color: ${color.status.error};
  line-height: 16px;
`;
