import { useState } from 'react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { adminApi } from '../api/admin';
import type { AdminAttendanceRecord, AdminExpenseRecord, AdminMileageRecord, AdminWorkLogEntry } from '../api/admin';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Label, InputWrapper } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonTableRows } from '../components/ui/Skeleton';
import { color, font, shadow } from '../styles/tokens';
import type { ExpenseCategory } from '../api/expense';

const _now = new Date();

const categoryLabel: Record<ExpenseCategory, string> = {
  transport: '교통비',
  meal: '식비',
  accommodation: '숙박비',
  mileage: '마일리지',
  etc: '기타',
};

const jobTypeLabel: Record<string, string> = {
  engineer: '엔지니어',
  material: '자재관리',
};

type Tab = 'attendance' | 'expense' | 'mileage' | 'worklog';
const tabs: { key: Tab; label: string }[] = [
  { key: 'attendance', label: '근태' },
  { key: 'expense', label: '지출' },
  { key: 'mileage', label: '마일리지' },
  { key: 'worklog', label: '업무일지' },
];

const Filters = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const FilterItem = styled(InputWrapper)`
  min-width: 100px;
  flex: 0 0 auto;
`;

const TabRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const TabBtn = styled(Button)<{ active: boolean }>`
  ${({ active }) => active ? '' : `
    background: #fff;
    box-shadow: ${shadow.ringInactive};
    font-weight: ${font.weight.semibold};
  `}
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${font.family};
`;

const Th = styled.th`
  background: ${color.surface.subtle};
  color: ${color.ink[72]};
  font-size: ${font.size.xs};
  font-weight: ${font.weight.semibold};
  text-align: left;
  padding: 0 16px;
  height: 40px;
  border-bottom: 1px solid ${color.ink[10]};
  white-space: nowrap;
`;

const ThRight = styled(Th)`text-align: right;`;

const Td = styled.td`
  font-size: ${font.size.base};
  font-weight: ${font.weight.medium};
  color: ${color.ink[100]};
  padding: 0 16px;
  height: 48px;
  border-bottom: 1px solid rgba(29,29,31,0.06);
  white-space: nowrap;
`;

const TdRight = styled(Td)`
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: ${font.weight.bold};
`;

const TdMuted = styled(Td)`color: ${color.ink[72]};`;

const Tr = styled.tr`
  &:hover td { background: rgba(29,29,31,0.02); }
`;


export const Admin = () => {
  const [year, setYear] = useState(_now.getFullYear());
  const [month, setMonth] = useState(_now.getMonth() + 1);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('attendance');

  const { data: usersRaw } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.users,
    staleTime: 60_000,
  });
  const users = usersRaw ?? [];

  const params = { year, month };
  const filterUser = <T extends { user_id: number }>(list: T[]) =>
    userId ? list.filter(r => r.user_id === userId) : list;

  const { data: attendanceRaw, isLoading: loadingAttendance } = useQuery({
    queryKey: ['admin', 'attendance', year, month],
    queryFn: () => adminApi.attendance(params),
    enabled: tab === 'attendance',
  });
  const attendance = filterUser(attendanceRaw ?? []);

  const { data: expensesRaw, isLoading: loadingExpense } = useQuery({
    queryKey: ['admin', 'expense', year, month],
    queryFn: () => adminApi.expenses(params),
    enabled: tab === 'expense',
  });
  const expenses = filterUser(expensesRaw ?? []);

  const { data: mileageRaw, isLoading: loadingMileage } = useQuery({
    queryKey: ['admin', 'mileage', year, month],
    queryFn: () => adminApi.mileage(params),
    enabled: tab === 'mileage',
  });
  const mileage = filterUser(mileageRaw ?? []);

  const { data: worklogRaw, isLoading: loadingWorklog } = useQuery({
    queryKey: ['admin', 'worklog', year, month],
    queryFn: () => adminApi.worklog(params),
    enabled: tab === 'worklog',
  });
  const worklog = filterUser(worklogRaw ?? []);

  const years = Array.from({ length: 3 }, (_, i) => _now.getFullYear() - i);

  const isLoading = tab === 'attendance' ? loadingAttendance
    : tab === 'expense' ? loadingExpense
    : tab === 'mileage' ? loadingMileage
    : loadingWorklog;

  const getUserName = (uid: number) => users.find(u => u.id === uid)?.name ?? String(uid);

  const q = search.trim().toLowerCase();
  const matchSearch = (fields: (string | null | undefined)[]) =>
    !q || fields.some(f => f?.toLowerCase().includes(q));

  const filteredAttendance = attendance.filter(r =>
    matchSearch([getUserName(r.user_id), r.status, r.date]));
  const filteredExpenses = expenses.filter(r =>
    matchSearch([getUserName(r.user_id), categoryLabel[r.category], r.description, r.date]));
  const filteredMileage = mileage.filter(r =>
    matchSearch([getUserName(r.user_id), r.description, r.date]));
  const filteredWorklog = worklog.filter(r =>
    matchSearch([getUserName(r.user_id), r.description, r.material_name, r.location, r.date]));

  const fmtTime = (v: string | null) => v ? format(new Date(v), 'HH:mm') : '—';
  const fmtDate = (v: string) => format(new Date(v), 'MM/dd');
  const fmtNum = (v: number | null | undefined) => v != null ? v.toLocaleString() : '—';

  return (
    <>
      <Header title="관리자 현황" />

      <Card>
        <Filters>
          <FilterItem>
            <Label>연도</Label>
            <Select value={year} onChange={e => setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}년</option>)}
            </Select>
          </FilterItem>
          <FilterItem>
            <Label>월</Label>
            <Select value={month} onChange={e => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </Select>
          </FilterItem>
          <FilterItem style={{ minWidth: 140 }}>
            <Label>직원</Label>
            <Select value={userId ?? ''} onChange={e => setUserId(e.target.value ? Number(e.target.value) : undefined)}>
              <option value="">전체</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </Select>
          </FilterItem>
          <FilterItem style={{ minWidth: 180, flex: '1 1 180px' }}>
            <Label>검색</Label>
            <Input
              placeholder="이름 · 2026-06 · 06-16 · 내용"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </FilterItem>
        </Filters>

        <TabRow>
          {tabs.map(({ key, label }) => (
            <TabBtn
              key={key}
              active={tab === key}
              variant={tab === key ? 'ghost' : 'secondary'}
              size="sm"
              onClick={() => setTab(key)}
            >
              {label}
            </TabBtn>
          ))}
        </TabRow>

        <TableWrapper>
          {tab === 'attendance' && (
            <Table>
              <thead>
                <tr>
                  <Th>직원</Th>
                  <Th>날짜</Th>
                  <Th>출근</Th>
                  <Th>퇴근</Th>
                  <ThRight>근무시간</ThRight>
                  <ThRight>OT</ThRight>
                  <ThRight>야간</ThRight>
                  <Th>상태</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <SkeletonTableRows rows={8} cols={8} /> : filteredAttendance.length === 0 ? (
                  <tr><td colSpan={8}><EmptyState message="근태 데이터가 없습니다." /></td></tr>
                ) : filteredAttendance.map((r: AdminAttendanceRecord) => (
                  <Tr key={r.id}>
                    <Td>{getUserName(r.user_id)}</Td>
                    <TdMuted>{fmtDate(r.date)}</TdMuted>
                    <Td>{fmtTime(r.check_in)}</Td>
                    <Td>{fmtTime(r.check_out)}</Td>
                    <TdRight>{r.work_hours != null ? `${r.work_hours.toFixed(1)}h` : '—'}</TdRight>
                    <TdRight>{r.ot_hours != null ? `${r.ot_hours.toFixed(1)}h` : '—'}</TdRight>
                    <TdRight>{r.night_hours != null ? `${r.night_hours.toFixed(1)}h` : '—'}</TdRight>
                    <Td><StatusBadge status={r.status} /></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}

          {tab === 'expense' && (
            <Table>
              <thead>
                <tr>
                  <Th>직원</Th>
                  <Th>날짜</Th>
                  <Th>분류</Th>
                  <ThRight>금액</ThRight>
                  <Th>내용</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <SkeletonTableRows rows={8} cols={5} /> : filteredExpenses.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState message="지출 데이터가 없습니다." /></td></tr>
                ) : filteredExpenses.map((r: AdminExpenseRecord) => (
                  <Tr key={r.id}>
                    <Td>{getUserName(r.user_id)}</Td>
                    <TdMuted>{fmtDate(r.date)}</TdMuted>
                    <Td>{categoryLabel[r.category] ?? r.category}</Td>
                    <TdRight>{fmtNum(r.amount)}원</TdRight>
                    <TdMuted>{r.description ?? '—'}</TdMuted>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}

          {tab === 'mileage' && (
            <Table>
              <thead>
                <tr>
                  <Th>직원</Th>
                  <Th>날짜</Th>
                  <ThRight>거리</ThRight>
                  <ThRight>유가</ThRight>
                  <ThRight>금액</ThRight>
                  <Th>내용</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <SkeletonTableRows rows={8} cols={6} /> : filteredMileage.length === 0 ? (
                  <tr><td colSpan={6}><EmptyState message="마일리지 데이터가 없습니다." /></td></tr>
                ) : filteredMileage.map((r: AdminMileageRecord) => (
                  <Tr key={r.id}>
                    <Td>{getUserName(r.user_id)}</Td>
                    <TdMuted>{fmtDate(r.date)}</TdMuted>
                    <TdRight>{r.km}km</TdRight>
                    <TdRight>{fmtNum(r.oil_price)}원/L</TdRight>
                    <TdRight>{fmtNum(r.amount)}원</TdRight>
                    <TdMuted>{r.description ?? '—'}</TdMuted>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}

          {tab === 'worklog' && (
            <Table>
              <thead>
                <tr>
                  <Th>직원</Th>
                  <Th>날짜</Th>
                  <Th>직무</Th>
                  <ThRight>작업</ThRight>
                  <ThRight>이동</ThRight>
                  <ThRight>대기</ThRight>
                  <Th>내용</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <SkeletonTableRows rows={8} cols={7} /> : filteredWorklog.length === 0 ? (
                  <tr><td colSpan={7}><EmptyState message="업무일지 데이터가 없습니다." /></td></tr>
                ) : filteredWorklog.map((r: AdminWorkLogEntry) => (
                  <Tr key={r.id}>
                    <Td>{getUserName(r.user_id)}</Td>
                    <TdMuted>{fmtDate(r.date)}</TdMuted>
                    <Td>{jobTypeLabel[r.job_type] ?? r.job_type}</Td>
                    <TdRight>{r.work_minutes != null ? `${r.work_minutes}분` : '—'}</TdRight>
                    <TdRight>{r.travel_minutes != null ? `${r.travel_minutes}분` : '—'}</TdRight>
                    <TdRight>{r.wait_minutes != null ? `${r.wait_minutes}분` : '—'}</TdRight>
                    <TdMuted>{r.description ?? r.material_name ?? '—'}</TdMuted>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </TableWrapper>
      </Card>
    </>
  );
};
