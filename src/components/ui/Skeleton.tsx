import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { color } from '../../styles/tokens';

const shimmer = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const SkeletonBase = styled.div`
  background: ${color.ink[10]};
  border-radius: 6px;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

export const SkeletonRow = styled.tr`
  td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(29,29,31,0.06);
  }
`;

export const SkeletonCell = styled(SkeletonBase.withComponent('div'))<{ w?: string }>`
  height: 14px;
  width: ${({ w }) => w ?? '80%'};
`;

export const SkeletonTableRows = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i}>
        {Array.from({ length: cols }).map((__, j) => (
          <td key={j}><SkeletonCell w={j === 0 ? '60%' : j === cols - 1 ? '40%' : '75%'} /></td>
        ))}
      </SkeletonRow>
    ))}
  </>
);
