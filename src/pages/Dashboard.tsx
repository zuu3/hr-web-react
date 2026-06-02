import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { attendanceApi } from '../api/attendance';
import { exportApi } from '../api/export';
import { Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Header } from '../components/layout/Header';
import { DarkCard, StatLabel, StatValue } from '../components/ui/Card';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { color, font, bp } from '../styles/tokens';

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;

const fmtHours = (h: number) => {
  const totalMin = Math.round(h * 60);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hrs === 0) return `${mins}분`;
  if (mins === 0) return `${hrs}시간`;
  return `${hrs}시간 ${mins}분`;
};

const fmtTime = (iso: string | null) =>
  iso ? format(new Date(iso), 'HH:mm') : '—';

const Grid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  ${bp.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: ${font.weight.bold};
  color: ${color.ink[96]};
  margin: 0 0 16px;
  letter-spacing: -0.3px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  font-family: ${font.family};
  font-size: ${font.size.xs};
  font-weight: ${font.weight.semibold};
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


export const Dashboard = () => {
  const { data: summary } = useQuery({
    queryKey: ['attendance', 'summary', year, month],
    queryFn: () => attendanceApi.summary({ year, month }),
  });

  const { data: records = [] } = useQuery({
    queryKey: ['attendance', 'list', year, month],
    queryFn: () => attendanceApi.list({ year, month }),
  });

  const chartData = records.slice(0, 14).map((r) => ({
    day: format(new Date(r.date), 'd일', { locale: ko }),
    hours: r.work_hours ?? 0,
  }));

  return (
    <>
      <Header title={`${format(now, 'M월', { locale: ko })} 근태 현황`} />

      <Grid4>
        <DarkCard>
          <StatLabel>총 근로시간</StatLabel>
          <StatValue>{summary ? fmtHours(summary.total_work_hours) : '—'}</StatValue>
        </DarkCard>
        <DarkCard>
          <StatLabel>OT 시간</StatLabel>
          <StatValue>{summary ? fmtHours(summary.ot_hours) : '—'}</StatValue>
        </DarkCard>
        <DarkCard>
          <StatLabel>야간 근무</StatLabel>
          <StatValue>{summary ? fmtHours(summary.night_hours) : '—'}</StatValue>
        </DarkCard>
        <DarkCard>
          <StatLabel>휴일 근무</StatLabel>
          <StatValue>{summary ? fmtHours(summary.holiday_hours) : '—'}</StatValue>
        </DarkCard>
      </Grid4>

      <Row>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionTitle style={{ margin: 0 }}>근로시간 추이</SectionTitle>
            <Button variant="secondary" size="sm" type="button"
              onClick={() => exportApi.attendance({ year, month })}>
              <Download size={13} strokeWidth={1.5} />
              엑셀
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid stroke={color.ink[10]} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontFamily: font.family, fontSize: 11, fill: color.ink[40] }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: font.family, fontSize: 11, fill: color.ink[40] }}
                axisLine={false}
                tickLine={false}
                unit="h"
              />
              <Tooltip
                contentStyle={{
                  fontFamily: font.family,
                  fontSize: 12,
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
                formatter={(val) => [fmtHours(Number(val)), '근로시간']}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke={color.ink[100]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color.ink[100] }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>최근 출퇴근</SectionTitle>
          {records.length === 0 ? (
            <EmptyState message="이번 달 근태 데이터가 없습니다." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th>출근</Th>
                  <Th>퇴근</Th>
                  <Th>상태</Th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 8).map((r) => (
                  <tr key={r.id}>
                    <Td>{format(new Date(r.date), 'M월 d일 (EEE)', { locale: ko })}</Td>
                    <Td>{fmtTime(r.check_in)}</Td>
                    <Td>{fmtTime(r.check_out)}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Row>
    </>
  );
};
