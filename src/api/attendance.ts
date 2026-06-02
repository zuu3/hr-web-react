import { client } from './client';

export interface AttendanceRecord {
  id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  work_hours: number | null;
  ot_hours: number | null;
  night_hours: number | null;
  holiday_hours: number | null;
  status: 'present' | 'absent' | 'late' | 'half';
  location_in?: string;
  location_out?: string;
}

export interface AttendanceSummary {
  total_work_hours: number;
  ot_hours: number;
  night_hours: number;
  holiday_hours: number;
  present_days: number;
  absent_days: number;
  late_days: number;
}

export interface CheckInPayload {
  latitude?: number;
  longitude?: number;
}

export const attendanceApi = {
  list: (params: { year: number; month: number }) =>
    client.get<AttendanceRecord[]>('/attendance', { params }).then((r) => r.data),

  summary: (params: { year: number; month: number }) =>
    client.get<AttendanceSummary>('/attendance/summary', { params }).then((r) => r.data),

  checkIn: (data: CheckInPayload) =>
    client.post<AttendanceRecord>('/attendance/check-in', data).then((r) => r.data),

  checkOut: (data: CheckInPayload) =>
    client.post<AttendanceRecord>('/attendance/check-out', data).then((r) => r.data),

  today: () =>
    client.get<AttendanceRecord | null>('/attendance/today').then((r) => r.data),

  timeClassification: (id: number, data: { work_time: number; travel_time: number; wait_time: number; memo?: string }) =>
    client.put<AttendanceRecord>(`/attendance/${id}/time-classification`, data).then((r) => r.data),
};
