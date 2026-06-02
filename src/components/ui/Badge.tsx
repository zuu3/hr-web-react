import styled from '@emotion/styled';
import { color, font } from '../../styles/tokens';

type Status = 'present' | 'absent' | 'late' | 'half' | 'pending' | 'approved' | 'rejected';

const statusMap: Record<Status, { dot: string; label: string }> = {
  present: { dot: color.status.success, label: '정상' },
  absent: { dot: color.status.error, label: '결근' },
  late: { dot: color.status.warning, label: '지각' },
  half: { dot: color.status.info, label: '반차' },
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

const Dot = styled.span<{ dotColor: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ dotColor }) => dotColor};
  flex-shrink: 0;
`;

export const StatusBadge = ({ status }: { status: Status }) => {
  const entry = statusMap[status] ?? { dot: color.ink[40], label: status };
  return (
    <Wrapper>
      <Dot dotColor={entry.dot} />
      {entry.label}
    </Wrapper>
  );
};
