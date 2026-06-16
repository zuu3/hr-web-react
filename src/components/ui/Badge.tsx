import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { color, font } from '../../styles/tokens';

type Status = 'present' | 'absent' | 'late' | 'half' | 'working' | 'pending' | 'approved' | 'rejected';

const statusMap: Record<Status, { dot: string; label: string }> = {
  present: { dot: color.status.success, label: '정상' },
  absent: { dot: color.status.error, label: '결근' },
  late: { dot: color.status.warning, label: '지각' },
  half: { dot: color.status.info, label: '반차' },
  working: { dot: color.status.info, label: '근무중' },
  pending: { dot: color.status.warning, label: '대기중' },
  approved: { dot: color.status.success, label: '승인' },
  rejected: { dot: color.status.error, label: '거절' },
};

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${font.family};
  font-size: ${font.size.xs};
  font-weight: ${font.weight.medium};
  color: ${color.ink[72]};
`;

const ping = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.9); opacity: 0; }
`;

const DotWrapper = styled.span`
  position: relative;
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.span<{ dotColor: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ dotColor }) => dotColor};
  flex-shrink: 0;
`;

const PingRing = styled.span<{ dotColor: string }>`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ dotColor }) => dotColor};
  animation: ${ping} 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
`;

export const StatusBadge = ({ status }: { status: Status }) => {
  const entry = statusMap[status] ?? { dot: color.ink[40], label: status };
  return (
    <Wrapper>
      {status === 'working' ? (
        <DotWrapper>
          <PingRing dotColor={entry.dot} />
          <Dot dotColor={entry.dot} />
        </DotWrapper>
      ) : (
        <Dot dotColor={entry.dot} />
      )}
      {entry.label}
    </Wrapper>
  );
};
