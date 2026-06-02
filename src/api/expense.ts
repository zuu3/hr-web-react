import { client } from './client';

export type ExpenseCategory = 'transport' | 'meal' | 'accommodation' | 'mileage' | 'etc';

export interface ExpenseRecord {
  id: number;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  receipt_url?: string;
  created_at: string;
}

export interface ExpensePayload {
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
}

export interface ExpenseSummary {
  total: number;
  by_category: Record<ExpenseCategory, number>;
}

export const expenseApi = {
  list: (params: { year: number; month: number }) =>
    client.get<ExpenseRecord[]>('/expense', { params }).then((r) => r.data),

  summary: (params: { year: number; month: number }) =>
    client.get<ExpenseSummary>('/expense/summary', { params }).then((r) => r.data),

  create: (data: ExpensePayload) =>
    client.post<ExpenseRecord>('/expense', data).then((r) => r.data),

  update: (id: number, data: Partial<ExpensePayload>) =>
    client.put<ExpenseRecord>(`/expense/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    client.delete(`/expense/${id}`),
};
