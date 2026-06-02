import { useState } from 'react';
import styled from '@emotion/styled';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MapPin, Clock } from 'lucide-react';
import { attendanceApi, type AttendanceRecord } from '../api/attendance';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, InputWrapper, Label } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { color, font, bp } from '../styles/tokens';

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  margin-bottom: 24px;
  ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const CheckCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TimeNow = styled.div`
  font-family: ${font.family};
  font-size: 36px;
  font-weight: 700;
  color: ${color.ink[100]};
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
`;

const DateStr = styled.div`
  font-family: ${font.family};
  font-size: ${font.size.base};
  color: ${color.ink[40]};
  margin-top: 4px;
`;

const CheckRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeLabel = styled.span`
  font-family: ${font.family};
  font-size: ${font.size.xs};
  font-weight: 500;
  color: ${color.ink[40]};
`;

const TimeVal = styled.span`
  font-family: ${font.family};
  font-size: ${font.size.md};
  font-weight: 700;
  color: ${color.ink[100]};
  font-variant-numeric: tabular-nums;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-family: ${font.family};
  font-size: ${font.size.xs};
  font-weight: 600;
  color: ${color.ink[72]};
  text-align: left;
  padding: 10px 16px;
  background: ${color.surface.subtle};
  border-bottom: 1px solid ${color.ink[10]};
  &:last-child { text-align: right; }
`;

const Td = styled.td`
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: 500;
  color: ${color.ink[100]};
  padding: 14px 16px;
  border-bottom: 1px solid rgba(29,29,31,0.06);
  font-variant-numeric: tabular-nums;
  &:last-child { text-align: right; }
  tr:hover & { background: ${color.ink[4]}; }
`;

const SectionTitle = styled.h2`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: 700;
  color: ${color.ink[96]};
  margin: 0 0 16px;
  letter-spacing: -0.3px;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalBox = styled.div`
  background: ${color.surface.white};
  border-radius: 12px;
  padding: 24px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h3`
  font-family: ${font.family};
  font-size: ${font.size.md};
  font-weight: 700;
  color: ${color.ink[96]};
  margin: 0;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${color.ink[40]};
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  &:hover { color: ${color.ink[100]}; }
`;

const Toast = styled.div<{ type: 'success' | 'error' }>`
  font-family: ${font.family};
  font-size: ${font.size.base};
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ type }) => type === 'success' ? 'rgba(52,199,89,0.08)' : 'rgba(255,59,48,0.08)'};
  color: ${({ type }) => type === 'success' ? color.status.success : color.status.error};
  font-weight: 500;
`;

export const Attendance = () => {
  const qc = useQueryClient();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [tcTarget, setTcTarget] = useState<AttendanceRecord | null>(null);
  const [tcForm, setTcForm] = useState({ work_time: '', travel_time: '', wait_time: '', memo: '' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data: today } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: attendanceApi.today,
  });

  const { data: records = [] } = useQuery({
    queryKey: ['attendance', 'list', year, month],
    queryFn: () => attendanceApi.list({ year, month }),
  });

  const getLocation = () =>
    new Promise<{ latitude: number; longitude: number }>((resolve, _reject) =>
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
        () => resolve({ latitude: 0, longitude: 0 }),
      ),
    );

  const checkInMut = useMutation({
    mutationFn: async () => {
      const loc = await getLocation();
      return attendanceApi.checkIn(loc);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      showToast('출근 기록이 저장되었습니다.', 'success');
    },
    onError: () => showToast('출근 기록에 실패했습니다.', 'error'),
  });

  const checkOutMut = useMutation({
    mutationFn: async () => {
      const loc = await getLocation();
      return attendanceApi.checkOut(loc);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      showToast('퇴근 기록이 저장되었습니다.', 'success');
    },
    onError: () => showToast('퇴근 기록에 실패했습니다.', 'error'),
  });

  const tcMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { work_time: number; travel_time: number; wait_time: number; memo?: string } }) =>
      attendanceApi.timeClassification(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      setTcTarget(null);
      showToast('시간 분류가 저장되었습니다.', 'success');
    },
    onError: () => showToast('시간 분류 저장에 실패했습니다.', 'error'),
  });

  const timeStr = format(now, 'HH:mm');
  const dateStr = format(now, 'yyyy년 M월 d일 (EEE)', { locale: ko });

  return (
    <>
      <Header title="출퇴근" />

      {tcTarget && (
        <Modal onClick={() => setTcTarget(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>시간 분류 — {format(new Date(tcTarget.date), 'M월 d일 (EEE)', { locale: ko })}</ModalTitle>
            <InputWrapper>
              <Label>작업 시간 (분)</Label>
              <Input type="number" min={0} value={tcForm.work_time}
                onChange={(e) => setTcForm((f) => ({ ...f, work_time: e.target.value }))} />
            </InputWrapper>
            <InputWrapper>
              <Label>이동 시간 (분)</Label>
              <Input type="number" min={0} value={tcForm.travel_time}
                onChange={(e) => setTcForm((f) => ({ ...f, travel_time: e.target.value }))} />
            </InputWrapper>
            <InputWrapper>
              <Label>대기 시간 (분)</Label>
              <Input type="number" min={0} value={tcForm.wait_time}
                onChange={(e) => setTcForm((f) => ({ ...f, wait_time: e.target.value }))} />
            </InputWrapper>
            <InputWrapper>
              <Label>메모 (선택)</Label>
              <Input type="text" value={tcForm.memo}
                onChange={(e) => setTcForm((f) => ({ ...f, memo: e.target.value }))} />
            </InputWrapper>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                onClick={() => tcMut.mutate({ id: tcTarget.id, data: {
                  work_time: Number(tcForm.work_time) || 0,
                  travel_time: Number(tcForm.travel_time) || 0,
                  wait_time: Number(tcForm.wait_time) || 0,
                  memo: tcForm.memo || undefined,
                }})}
                disabled={tcMut.isPending}
              >
                {tcMut.isPending ? '저장 중...' : '저장'}
              </Button>
              <Button variant="secondary" onClick={() => setTcTarget(null)}>취소</Button>
            </div>
          </ModalBox>
        </Modal>
      )}

      <TopRow>
        <CheckCard>
          <div>
            <TimeNow>{timeStr}</TimeNow>
            <DateStr>{dateStr}</DateStr>
          </div>

          <CheckRow>
            <TimeItem>
              <TimeLabel>출근</TimeLabel>
              <TimeVal>{today?.check_in ? format(new Date(today.check_in), 'HH:mm') : '—'}</TimeVal>
            </TimeItem>
            <TimeItem>
              <TimeLabel>퇴근</TimeLabel>
              <TimeVal>{today?.check_out ? format(new Date(today.check_out), 'HH:mm') : '—'}</TimeVal>
            </TimeItem>
          </CheckRow>

          {toast && <Toast type={toast.type}>{toast.msg}</Toast>}

          <CheckRow>
            <Button
              onClick={() => checkInMut.mutate()}
              disabled={!!today?.check_in || checkInMut.isPending}
            >
              <MapPin size={14} strokeWidth={1.5} />
              출근
            </Button>
            <Button
              variant="secondary"
              onClick={() => checkOutMut.mutate()}
              disabled={!today?.check_in || !!today?.check_out || checkOutMut.isPending}
            >
              <MapPin size={14} strokeWidth={1.5} />
              퇴근
            </Button>
          </CheckRow>
        </CheckCard>

        <Card>
          <SectionTitle>이번 달 출퇴근 기록</SectionTitle>
          {records.length === 0 ? (
            <EmptyState message="이번 달 근태 데이터가 없습니다." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th>출근</Th>
                  <Th>퇴근</Th>
                  <Th>근무시간</Th>
                  <Th>상태</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const wh = r.work_hours;
                  const whStr = wh == null ? '—' : `${Math.floor(wh)}h ${Math.round((wh % 1) * 60)}m`;
                  return (
                    <tr key={r.id}>
                      <Td>{format(new Date(r.date), 'M월 d일 (EEE)', { locale: ko })}</Td>
                      <Td>{r.check_in ? format(new Date(r.check_in), 'HH:mm') : '—'}</Td>
                      <Td>{r.check_out ? format(new Date(r.check_out), 'HH:mm') : '—'}</Td>
                      <Td>{whStr}</Td>
                      <Td><StatusBadge status={r.status} /></Td>
                      <Td>
                        {r.check_out && (
                          <ActionBtn onClick={() => {
                            setTcTarget(r);
                            setTcForm({ work_time: '', travel_time: '', wait_time: '', memo: '' });
                          }}>
                            <Clock size={14} strokeWidth={1.5} />
                          </ActionBtn>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </TopRow>
    </>
  );
};
