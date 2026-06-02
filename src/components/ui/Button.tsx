import styled from '@emotion/styled';
import { color, radius, shadow, duration, easing, font } from '../../styles/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  font-family: ${font.family};
  font-weight: ${font.weight.semibold};
  transition: background ${duration.short} ${easing.outQuart},
              box-shadow ${duration.short} ${easing.outQuart},
              opacity ${duration.short};
  white-space: nowrap;
  text-decoration: none;

  ${({ size = 'md' }) =>
    size === 'md'
      ? `padding: 10px 16px; height: 40px; font-size: ${font.size.base}; border-radius: ${radius.md};`
      : `padding: 6px 12px; height: 32px; font-size: ${font.size.sm}; border-radius: ${radius.sm};`}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${color.ink[100]};
          color: ${color.surface.white};
          &:hover { background: rgba(29,29,31,0.85); }
          &:disabled { background: ${color.ink[10]}; color: ${color.ink[40]}; cursor: not-allowed; }
        `;
      case 'secondary':
        return `
          background: ${color.surface.white};
          color: ${color.ink[100]};
          box-shadow: ${shadow.ringInactive};
          &:hover { box-shadow: ${shadow.ringActive}; background: ${color.ink[4]}; }
          &:disabled { opacity: 0.4; cursor: not-allowed; }
        `;
      case 'ghost':
        return `
          background: ${color.ink[4]};
          color: ${color.ink[100]};
          box-shadow: ${shadow.ringActive};
          &:hover { background: ${color.ink[10]}; }
          &:disabled { opacity: 0.4; cursor: not-allowed; }
        `;
    }
  }}
`;
