import { client } from './client';
import type { AttendanceRecord } from './attendance';
import type { ExpenseRecord } from './expense';
import type { MileageRecord } from './mileage';
import type { WorkLogEntry } from './worklog';
import type { User } from './auth';

export interface AdminAttendanceRecord extends AttendanceRecord { user: User }
export interface AdminExpenseRecord extends ExpenseRecord { user: User }
export interface AdminMileageRecord extends MileageRecord { user: User }
export interface AdminWorkLogEntry extends WorkLogEntry { user: User }

export const adminApi = {
  attendance: (params: { year: number; month: number; user_id?: number }) =>
    client.get<AdminAttendanceRecord[]>('/attendance/admin/all', { params }).then(r => r.data),

  expenses: (params: { year: number; month: number; user_id?: number }) =>
    client.get<AdminExpenseRecord[]>('/expense/admin/all', { params }).then(r => r.data),

  mileage: (params: { year: number; month: number; user_id?: number }) =>
    client.get<AdminMileageRecord[]>('/mileage/admin/all', { params }).then(r => r.data),

  worklog: (params: { year: number; month: number; user_id?: number }) =>
    client.get<AdminWorkLogEntry[]>('/worklog/admin/all', { params }).then(r => r.data),

  users: () =>
    client.get<User[]>('/users/').then(r => r.data),
};
