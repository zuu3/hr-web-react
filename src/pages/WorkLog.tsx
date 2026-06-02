import { useState } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { worklogApi, type WorkLogPayload, type JobType } from '../api/worklog';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, InputWrapper, Label, ErrorText } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuthStore } from '../store/authStore';
import { color, font, bp } from '../styles/tokens';
import { toast } from 'sonner';
import { SkeletonTableRows } from '../components/ui/Skeleton';

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const FormTitle = styled.h2`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: 700;
  color: ${color.ink[96]};
  margin: 0 0 20px;
  letter-spacing: -0.3px;
`;

const TabRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: ${({ active }) => active ? 700 : 600};
  border: none;
  cursor: pointer;
  transition: all 150ms;
  background: ${({ active }) => active ? 'rgba(29,29,31,0.04)' : '#fff'};
  box-shadow: ${({ active }) =>
    active ? 'rgba(29,29,31,0.24) 0px 0px 0px 1.5px inset' : 'rgba(29,29,31,0.10) 0px 0px 0px 1px inset'};
  color: ${color.ink[100]};
`;

const Divider = styled.div`
  height: 1px;
  background: ${color.ink[10]};
  margin: 16px 0;
`;

const SectionTitle = styled.h2`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: 700;
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
  font-weight: 600;
  color: ${color.ink[72]};
  text-align: left;
  padding: 10px 16px;
  background: ${color.surface.subtle};
  border-bottom: 1px solid ${color.ink[10]};
`;

const Td = styled.td`
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: 500;
  color: ${color.ink[100]};
  padding: 14px 16px;
  border-bottom: 1px solid rgba(29,29,31,0.06);
  font-variant-numeric: tabular-nums;
  tr:hover & { background: ${color.ink[4]}; }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${color.ink[40]};
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  &:hover { color: ${color.status.error}; }
`;


export const WorkLog = () => {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  const defaultJobType: JobType = user?.role === 'material_manager' ? 'material' : 'engineer';
  const [jobType, setJobType] = useState<JobType>(defaultJobType);

  const switchTab = (t: JobType) => {
    setJobType(t);
    reset({
      date: format(now, 'yyyy-MM-dd'),
      job_type: t,
      work_minutes: undefined,
      travel_minutes: undefined,
      wait_minutes: undefined,
      material_name: '',
      quantity: undefined,
      unit: '',
      location: '',
      description: '',
    });
  };

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['worklog', year, month],
    queryFn: () => worklogApi.list({ year, month }),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<WorkLogPayload>({ defaultValues: { date: format(now, 'yyyy-MM-dd'), job_type: jobType }, shouldUnregister: true });

  const createMut = useMutation({
    mutationFn: worklogApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['worklog'] });
      reset({ date: format(now, 'yyyy-MM-dd'), job_type: jobType });
      toast.success('저장되었습니다.');
    },
    onError: () => toast.error('저장에 실패했습니다.'),
  });

  const deleteMut = useMutation({
    mutationFn: worklogApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['worklog'] });
      toast.success('삭제되었습니다.');
    },
    onError: () => toast.error('삭제에 실패했습니다.'),
  });

  const onSubmit = (data: WorkLogPayload) => {
    createMut.mutate({ ...data, job_type: jobType });
  };

  const fmtMin = (m?: number) => {
    if (m == null) return '—';
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    if (hrs === 0) return `${mins}분`;
    if (mins === 0) return `${hrs}시간`;
    return `${hrs}시간 ${mins}분`;
  };

  return (
    <>
      <Header title="작업 기록" />

      <Grid>
        <Card>
          <FormTitle>작업 입력</FormTitle>

          <TabRow>
            <Tab active={jobType === 'engineer'} onClick={() => switchTab('engineer')}>
              엔지니어
            </Tab>
            <Tab active={jobType === 'material'} onClick={() => switchTab('material')}>
              자재관리
            </Tab>
          </TabRow>

          <form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper style={{ marginBottom: 12 }}>
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                type="date"
                hasError={!!errors.date}
                {...register('date', { required: '날짜를 선택해 주세요.' })}
              />
              {errors.date && <ErrorText>{errors.date.message}</ErrorText>}
            </InputWrapper>

            {jobType === 'engineer' ? (
              <FormGrid>
                <InputWrapper>
                  <Label htmlFor="work_minutes">작업 시간 (분)</Label>
                  <Input id="work_minutes" type="number" min={0} {...register('work_minutes', { valueAsNumber: true })} />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="travel_minutes">이동 시간 (분)</Label>
                  <Input id="travel_minutes" type="number" min={0} {...register('travel_minutes', { valueAsNumber: true })} />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="wait_minutes">대기 시간 (분)</Label>
                  <Input id="wait_minutes" type="number" min={0} {...register('wait_minutes', { valueAsNumber: true })} />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="location">작업 장소</Label>
                  <Input id="location" type="text" placeholder="장소 입력" {...register('location')} />
                </InputWrapper>
              </FormGrid>
            ) : (
              <FormGrid>
                <InputWrapper style={{ gridColumn: '1 / -1' }}>
                  <Label htmlFor="material_name">자재명</Label>
                  <Input id="material_name" type="text" placeholder="자재명 입력" {...register('material_name')} />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="quantity">수량</Label>
                  <Input id="quantity" type="number" min={0} {...register('quantity', { valueAsNumber: true })} />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor="unit">단위</Label>
                  <Input id="unit" type="text" placeholder="개, 박스 등" {...register('unit')} />
                </InputWrapper>
                <InputWrapper style={{ gridColumn: '1 / -1' }}>
                  <Label htmlFor="location">장소</Label>
                  <Input id="location" type="text" placeholder="반출입 장소" {...register('location')} />
                </InputWrapper>
              </FormGrid>
            )}

            <Divider />

            <InputWrapper style={{ marginBottom: 16 }}>
              <Label htmlFor="description">메모 (선택)</Label>
              <Input id="description" type="text" placeholder="작업 내용 메모" {...register('description')} />
            </InputWrapper>

            <Button type="submit" disabled={isSubmitting || createMut.isPending} style={{ width: '100%' }}>
              {createMut.isPending ? '저장 중...' : '저장'}
            </Button>
          </form>
        </Card>

        <Card>
          <SectionTitle>이번 달 {jobType === 'engineer' ? '엔지니어' : '자재관리'} 기록</SectionTitle>
          {isLoading ? (
            <Table><tbody><SkeletonTableRows rows={4} cols={jobType === 'engineer' ? 6 : 5} /></tbody></Table>
          ) : logs.filter((l) => l.job_type === jobType).length === 0 ? (
            <EmptyState message="이번 달 작업 기록이 없습니다." />
          ) : jobType === 'engineer' ? (
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th>작업</Th>
                  <Th>이동</Th>
                  <Th>대기</Th>
                  <Th>장소</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {logs.filter((l) => l.job_type === 'engineer').map((l) => (
                  <tr key={l.id}>
                    <Td>{format(new Date(l.date), 'M월 d일 (EEE)', { locale: ko })}</Td>
                    <Td>{fmtMin(l.work_minutes)}</Td>
                    <Td>{fmtMin(l.travel_minutes)}</Td>
                    <Td>{fmtMin(l.wait_minutes)}</Td>
                    <Td>{l.location ?? '—'}</Td>
                    <Td>
                      <DeleteBtn onClick={() => deleteMut.mutate(l.id)}>
                        <Trash2 size={14} strokeWidth={1.5} />
                      </DeleteBtn>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th>자재명</Th>
                  <Th>수량</Th>
                  <Th>장소</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {logs.filter((l) => l.job_type === 'material').map((l) => (
                  <tr key={l.id}>
                    <Td>{format(new Date(l.date), 'M월 d일 (EEE)', { locale: ko })}</Td>
                    <Td>{l.material_name ?? '—'}</Td>
                    <Td>{l.quantity != null ? `${l.quantity}${l.unit ? ` ${l.unit}` : ''}` : '—'}</Td>
                    <Td>{l.location ?? '—'}</Td>
                    <Td>
                      <DeleteBtn onClick={() => deleteMut.mutate(l.id)}>
                        <Trash2 size={14} strokeWidth={1.5} />
                      </DeleteBtn>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Grid>
    </>
  );
};
