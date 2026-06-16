import { useState } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Trash2, Download, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { expenseApi, type ExpensePayload, type ExpenseCategory, type ExpenseRecord } from '../api/expense';
import { exportApi } from '../api/export';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, InputWrapper, Label, ErrorText, Select } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonTableRows } from '../components/ui/Skeleton';
import { color, font, bp } from '../styles/tokens';

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 24px;
  ${bp.mobile} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormTitle = styled.h2`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: 700;
  color: ${color.ink[96]};
  margin: 0 0 20px;
  letter-spacing: -0.3px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: 700;
  color: ${color.ink[96]};
  margin: 0;
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
  &:nth-of-type(3) { text-align: right; }
`;

const Td = styled.td`
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: 500;
  color: ${color.ink[100]};
  padding: 14px 16px;
  border-bottom: 1px solid rgba(29,29,31,0.06);
  font-variant-numeric: tabular-nums;
  &:nth-of-type(3) { text-align: right; font-weight: 700; }
  tr:hover & { background: ${color.ink[4]}; }
`;

const TotalRow = styled.tr`
  background: ${color.surface.subtle};
  td { font-weight: 700 !important; border-bottom: none; }
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

const DeleteBtn = styled(ActionBtn)`
  &:hover { color: ${color.status.error}; }
`;

const EditModeBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(29,29,31,0.04);
  border-radius: 8px;
  margin-bottom: 16px;
  font-family: ${font.family};
  font-size: ${font.size.sm};
  color: ${color.ink[72]};
`;

const categoryLabel: Record<ExpenseCategory, string> = {
  transport: '교통비',
  meal: '식비',
  accommodation: '숙박비',
  mileage: '마일리지',
  etc: '기타',
};

export const Expense = () => {
  const qc = useQueryClient();
  const [editTarget, setEditTarget] = useState<ExpenseRecord | null>(null);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['expense', year, month],
    queryFn: () => expenseApi.list({ year, month }),
    select: (d) => d ?? [],
  });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } =
    useForm<ExpensePayload>({ defaultValues: { date: format(now, 'yyyy-MM-dd'), category: 'transport' } });

  const createMut = useMutation({
    mutationFn: expenseApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expense'] });
      reset({ date: format(now, 'yyyy-MM-dd'), category: 'transport' });
      toast.success('저장되었습니다.');
    },
    onError: () => toast.error('저장에 실패했습니다. 다시 시도해 주세요.'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExpensePayload> }) =>
      expenseApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expense'] });
      setEditTarget(null);
      reset({ date: format(now, 'yyyy-MM-dd'), category: 'transport' });
      toast.success('수정되었습니다.');
    },
    onError: () => toast.error('수정에 실패했습니다. 다시 시도해 주세요.'),
  });

  const deleteMut = useMutation({
    mutationFn: expenseApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expense'] });
      toast.success('삭제되었습니다.');
    },
    onError: () => toast.error('삭제에 실패했습니다.'),
  });

  const total = records.reduce((s, r) => s + r.amount, 0);

  const startEdit = (r: ExpenseRecord) => {
    setEditTarget(r);
    setValue('date', r.date);
    setValue('category', r.category);
    setValue('amount', r.amount);
    setValue('description', r.description ?? '');
  };

  const cancelEdit = () => {
    setEditTarget(null);
    reset({ date: format(now, 'yyyy-MM-dd'), category: 'transport' });
  };

  const onSubmit = (d: ExpensePayload) => {
    if (editTarget) {
      updateMut.mutate({ id: editTarget.id, data: d });
    } else {
      createMut.mutate(d);
    }
  };

  const isPending = createMut.isPending || updateMut.isPending;

  const handleExport = () => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    exportApi.expenses({ start_date: startDate, end_date: endDate });
  };

  return (
    <>
      <Header title="지출 관리" />

      <Grid>
        <Card>
          <FormTitle>{editTarget ? '지출 수정' : '지출 입력'}</FormTitle>
          {editTarget && (
            <EditModeBar>
              <span>수정 중: {format(new Date(editTarget.date), 'M월 d일')} {categoryLabel[editTarget.category]}</span>
              <ActionBtn onClick={cancelEdit} type="button" style={{ fontSize: '12px', padding: '2px 8px' }}>취소</ActionBtn>
            </EditModeBar>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <InputWrapper>
                <Label htmlFor="date">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  hasError={!!errors.date}
                  {...register('date', { required: '날짜를 선택해 주세요.' })}
                />
                {errors.date && <ErrorText>{errors.date.message}</ErrorText>}
              </InputWrapper>

              <InputWrapper>
                <Label htmlFor="category">항목</Label>
                <Select id="category" {...register('category', { required: true })}>
                  {(Object.keys(categoryLabel) as ExpenseCategory[]).map((k) => (
                    <option key={k} value={k}>{categoryLabel[k]}</option>
                  ))}
                </Select>
              </InputWrapper>

              <InputWrapper>
                <Label htmlFor="amount">금액 (원)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  placeholder="금액 입력"
                  hasError={!!errors.amount}
                  {...register('amount', { required: '금액을 입력해 주세요.', valueAsNumber: true, min: { value: 1, message: '금액을 입력해 주세요.' } })}
                />
                {errors.amount && <ErrorText>{errors.amount.message}</ErrorText>}
              </InputWrapper>

              <InputWrapper>
                <Label htmlFor="description">메모</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="메모 입력"
                  hasError={!!errors.description}
                  {...register('description', { required: '메모를 입력해 주세요.' })}
                />
                {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
              </InputWrapper>

              <Button type="submit" disabled={isSubmitting || isPending} style={{ marginTop: 4 }}>
                {isPending ? '저장 중...' : editTarget ? '수정 완료' : '저장'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <SectionHeader>
            <SectionTitle>이번 달 지출 내역</SectionTitle>
            <Button variant="secondary" size="sm" onClick={handleExport} type="button">
              <Download size={13} strokeWidth={1.5} />
              엑셀 다운로드
            </Button>
          </SectionHeader>

          {isLoading ? (
            <Table><tbody><SkeletonTableRows rows={4} cols={5} /></tbody></Table>
          ) : records.length === 0 ? (
            <EmptyState message="이번 달 지출 내역이 없습니다." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th>항목</Th>
                  <Th>금액</Th>
                  <Th>메모</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <Td>{format(new Date(r.date), 'M월 d일 (EEE)', { locale: ko })}</Td>
                    <Td>{categoryLabel[r.category]}</Td>
                    <Td>{r.amount.toLocaleString()}원</Td>
                    <Td>{r.description ?? '—'}</Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <ActionBtn onClick={() => startEdit(r)}>
                          <Pencil size={14} strokeWidth={1.5} />
                        </ActionBtn>
                        <DeleteBtn onClick={() => deleteMut.mutate(r.id)}>
                          <Trash2 size={14} strokeWidth={1.5} />
                        </DeleteBtn>
                      </div>
                    </Td>
                  </tr>
                ))}
                <TotalRow>
                  <Td colSpan={2}>합계</Td>
                  <Td>{total.toLocaleString()}원</Td>
                  <Td colSpan={2}></Td>
                </TotalRow>
              </tbody>
            </Table>
          )}
        </Card>
      </Grid>
    </>
  );
};
