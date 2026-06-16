import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { SkeletonTableRows } from '../components/ui/Skeleton';

const _now = new Date();
const year = _now.getFullYear();
const month = _now.getMonth() + 1;
const todayDate = format(_now, 'yyyy-MM-dd');

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


export const Attendance = () => {
  const qc = useQueryClient();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    let intervalId: ReturnType<typeof setInterval>;
    const alignId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, 1000);
    }, 1000 - new Date().getMilliseconds());
    return () => { clearTimeout(alignId); clearInterval(intervalId); };
  }, []);

  const [tcTarget, setTcTarget] = useState<AttendanceRecord | null>(null);
  const [tcForm, setTcForm] = useState({ work_time: '', travel_time: '', wait_time: '', memo: '' });
  const [showCheckInConfirm, setShowCheckInConfirm] = useState(false);
  const [showCheckOutConfirm, setShowCheckOutConfirm] = useState(false);

  const { data: today } = useQuery({
    queryKey: ['attendance', 'today', todayDate],
    queryFn: attendanceApi.today,
    staleTime: 0,
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['attendance', 'list', year, month],
    queryFn: () => attendanceApi.list({ year, month }),
    select: (d) => Array.isArray(d) ? d : [],
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
      toast.success('출근 기록이 저장되었습니다.');
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 400) {
        qc.invalidateQueries({ queryKey: ['attendance'] });
        toast.error('이미 출근 처리되었습니다.');
      } else {
        toast.error('출근 기록에 실패했습니다.');
      }
    },
  });

  const checkOutMut = useMutation({
    mutationFn: async () => {
      const loc = await getLocation();
      return attendanceApi.checkOut(loc);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('퇴근 기록이 저장되었습니다.');
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 400) {
        qc.invalidateQueries({ queryKey: ['attendance'] });
        toast.error('이미 퇴근 처리되었습니다.');
      } else {
        toast.error('퇴근 기록에 실패했습니다.');
      }
    },
  });

  const tcMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { work_time: number; travel_time: number; wait_time: number; memo?: string } }) =>
      attendanceApi.timeClassification(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      setTcTarget(null);
      toast.success('시간 분류가 저장되었습니다.');
    },
    onError: () => toast.error('시간 분류 저장에 실패했습니다.'),
  });

  const timeStr = format(now, 'HH:mm:ss');
  const dateStr = format(now, 'yyyy년 M월 d일 (EEE)', { locale: ko });

  return (
    <>
      <Header title="출퇴근" />

      {showCheckInConfirm && (
        <Modal onClick={() => setShowCheckInConfirm(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>출근 처리</ModalTitle>
            <div style={{ fontFamily: 'inherit', fontSize: 14, color: 'rgba(29,29,31,0.72)' }}>
              출근하시겠습니까?
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                onClick={() => { setShowCheckInConfirm(false); checkInMut.mutate(); }}
                disabled={checkInMut.isPending}
              >
                {checkInMut.isPending ? '처리 중...' : '출근'}
              </Button>
              <Button variant="secondary" onClick={() => setShowCheckInConfirm(false)}>취소</Button>
            </div>
          </ModalBox>
        </Modal>
      )}

      {showCheckOutConfirm && (
        <Modal onClick={() => setShowCheckOutConfirm(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>퇴근 처리</ModalTitle>
            <div style={{ fontFamily: 'inherit', fontSize: 14, color: 'rgba(29,29,31,0.72)' }}>
              퇴근하시겠습니까? 퇴근 후에는 수정할 수 없습니다.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                onClick={() => { setShowCheckOutConfirm(false); checkOutMut.mutate(); }}
                disabled={checkOutMut.isPending}
              >
                {checkOutMut.isPending ? '처리 중...' : '퇴근'}
              </Button>
              <Button variant="secondary" onClick={() => setShowCheckOutConfirm(false)}>취소</Button>
            </div>
          </ModalBox>
        </Modal>
      )}

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

          <CheckRow>
            <Button
              onClick={() => setShowCheckInConfirm(true)}
              disabled={!!today?.check_in || checkInMut.isPending}
            >
              <MapPin size={14} strokeWidth={1.5} />
              출근
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowCheckOutConfirm(true)}
              disabled={!today?.check_in || !!today?.check_out || checkOutMut.isPending}
            >
              <MapPin size={14} strokeWidth={1.5} />
              퇴근
            </Button>
          </CheckRow>
        </CheckCard>

        <Card>
          <SectionTitle>이번 달 출퇴근 기록</SectionTitle>
          {isLoading ? (
            <Table><tbody><SkeletonTableRows rows={4} cols={6} /></tbody></Table>
          ) : records.length === 0 ? (
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
                  const whStr = wh == null ? '—' : (() => {
                    const totalMin = Math.round(wh * 60);
                    const hrs = Math.floor(totalMin / 60);
                    const mins = totalMin % 60;
                    if (hrs === 0) return `${mins}분`;
                    if (mins === 0) return `${hrs}시간`;
                    return `${hrs}시간 ${mins}분`;
                  })();
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
