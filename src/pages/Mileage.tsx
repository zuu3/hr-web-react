import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Trash2, Download } from 'lucide-react';
import { utils, writeFileXLSX } from 'xlsx';
import { mileageApi, calcMileage, type MileagePayload } from '../api/mileage';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, InputWrapper, Label, ErrorText } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { color, font, radius, bp } from '../styles/tokens';
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

const FormTitle = styled.h2`
  font-family: ${font.family};
  font-size: ${font.size.lg};
  font-weight: 700;
  color: ${color.ink[96]};
  margin: 0 0 20px;
  letter-spacing: -0.3px;
`;

const FormulaBox = styled.div`
  background: ${color.surface.subtle};
  border-radius: ${radius.md};
  padding: 16px;
  font-family: ${font.family};
  font-size: ${font.size.base};
  color: ${color.ink[72]};
  font-variant-numeric: tabular-nums;
`;

const FormulaExpr = styled.div`
  font-size: ${font.size.sm};
  color: ${color.ink[40]};
  margin-bottom: 6px;
`;

const FormulaResult = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${color.ink[100]};
  letter-spacing: -0.3px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
  &:nth-of-type(4) { text-align: right; }
`;

const Td = styled.td`
  font-family: ${font.family};
  font-size: ${font.size.base};
  font-weight: 500;
  color: ${color.ink[100]};
  padding: 14px 16px;
  border-bottom: 1px solid rgba(29,29,31,0.06);
  font-variant-numeric: tabular-nums;
  &:nth-of-type(4) { text-align: right; font-weight: 700; }
  tr:hover & { background: ${color.ink[4]}; }
`;

const TotalRow = styled.tr`
  background: ${color.surface.subtle};
  td { font-weight: 700 !important; border-bottom: none; }
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

export const Mileage = () => {
  const qc = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['mileage', year, month],
    queryFn: () => mileageApi.list({ year, month }),
    select: (d) => Array.isArray(d) ? d : [],
  });

  const {
    register, handleSubmit, watch, reset,
    formState: { errors },
  } = useForm<MileagePayload>({
    defaultValues: { date: format(now, 'yyyy-MM-dd'), km: undefined, oil_price: 1750 },
  });

  const km = watch('km');
  const oilPrice = watch('oil_price');
  const preview = km > 0 && oilPrice > 0 ? calcMileage(km, oilPrice) : null;

  const createMut = useMutation({
    mutationFn: mileageApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mileage'] });
      reset({ date: format(now, 'yyyy-MM-dd'), km: undefined, oil_price: 1750 });
      toast.success('저장되었습니다.');
    },
    onError: () => toast.error('저장에 실패했습니다.'),
  });

  const deleteMut = useMutation({
    mutationFn: mileageApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mileage'] });
      toast.success('삭제되었습니다.');
    },
    onError: () => toast.error('삭제에 실패했습니다.'),
  });

  const total = records.reduce((s, r) => s + r.amount, 0);

  const handleExport = () => {
    const rows = records.map((r) => ({
      날짜: r.date,
      'km': r.km,
      '유가(원/L)': r.oil_price,
      '정산금액(원)': r.amount,
      '계산식': `${r.km}km × ${r.oil_price.toLocaleString()}원 × 0.1 = ${r.amount.toLocaleString()}원`,
      메모: r.description ?? '',
    }));
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, '마일리지');
    writeFileXLSX(wb, `마일리지_${year}${String(month).padStart(2, '0')}.xlsx`);
  };

  return (
    <>
      <Header title="마일리지" />

      <Grid>
        <Card>
          <FormTitle>마일리지 입력</FormTitle>

          <form onSubmit={handleSubmit((d) => createMut.mutate(d))}>
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

              <FormGrid>
                <InputWrapper>
                  <Label htmlFor="km">이동 거리 (km)</Label>
                  <Input
                    id="km"
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="0"
                    hasError={!!errors.km}
                    {...register('km', {
                      required: '이동 거리를 입력해 주세요.',
                      valueAsNumber: true,
                      min: { value: 0.1, message: '이동 거리를 입력해 주세요.' },
                    })}
                  />
                  {errors.km && <ErrorText>{errors.km.message}</ErrorText>}
                </InputWrapper>

                <InputWrapper>
                  <Label htmlFor="oil_price">유가 (원/L)</Label>
                  <Input
                    id="oil_price"
                    type="number"
                    min={0}
                    placeholder="1750"
                    hasError={!!errors.oil_price}
                    {...register('oil_price', {
                      required: '유가를 입력해 주세요.',
                      valueAsNumber: true,
                      min: { value: 1, message: '유가를 입력해 주세요.' },
                    })}
                  />
                  {errors.oil_price && <ErrorText>{errors.oil_price.message}</ErrorText>}
                </InputWrapper>
              </FormGrid>

              <FormulaBox>
                <FormulaExpr>
                  {km > 0 && oilPrice > 0
                    ? `${km}km × ${oilPrice.toLocaleString()}원 × 0.1`
                    : 'km × 유가 × 0.1'}
                </FormulaExpr>
                <FormulaResult>
                  {preview != null ? `${preview.toLocaleString()}원` : '—'}
                </FormulaResult>
              </FormulaBox>

              <InputWrapper>
                <Label htmlFor="description">메모 (선택)</Label>
                <Input id="description" type="text" placeholder="출장지 등 메모" {...register('description')} />
              </InputWrapper>

              <Button
                type="submit"
                disabled={createMut.isPending || !preview}
                style={{ marginTop: 4 }}
              >
                {createMut.isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <SectionHeader>
            <SectionTitle>이번 달 마일리지</SectionTitle>
            <Button variant="secondary" size="sm" onClick={handleExport} type="button">
              <Download size={13} strokeWidth={1.5} />
              엑셀 다운로드
            </Button>
          </SectionHeader>

          {isLoading ? (
            <Table><tbody><SkeletonTableRows rows={4} cols={6} /></tbody></Table>
          ) : records.length === 0 ? (
            <EmptyState message="이번 달 마일리지 내역이 없습니다." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>날짜</Th>
                  <Th>거리</Th>
                  <Th>유가</Th>
                  <Th>정산금액</Th>
                  <Th>메모</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <Td>{format(new Date(r.date), 'M월 d일 (EEE)', { locale: ko })}</Td>
                    <Td>{r.km}km</Td>
                    <Td>{r.oil_price.toLocaleString()}원/L</Td>
                    <Td>{r.amount.toLocaleString()}원</Td>
                    <Td>{r.description ?? '—'}</Td>
                    <Td>
                      <DeleteBtn onClick={() => deleteMut.mutate(r.id)}>
                        <Trash2 size={14} strokeWidth={1.5} />
                      </DeleteBtn>
                    </Td>
                  </tr>
                ))}
                <TotalRow>
                  <Td colSpan={3}>합계</Td>
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
