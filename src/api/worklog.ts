import { client } from './client';

export type JobType = 'engineer' | 'material';

export interface WorkLogEntry {
  id: number;
  date: string;
  job_type: JobType;
  work_minutes?: number;
  travel_minutes?: number;
  wait_minutes?: number;
  material_name?: string;
  quantity?: number;
  unit?: string;
  location?: string;
  description?: string;
  created_at: string;
}

export interface WorkLogPayload {
  date: string;
  job_type: JobType;
  work_minutes?: number;
  travel_minutes?: number;
  wait_minutes?: number;
  material_name?: string;
  quantity?: number;
  unit?: string;
  location?: string;
  description?: string;
}

export const worklogApi = {
  list: (params: { year: number; month: number }) =>
    client.get<WorkLogEntry[]>('/worklog', { params }).then((r) => r.data),

  create: (data: WorkLogPayload) =>
    client.post<WorkLogEntry>('/worklog', data).then((r) => r.data),

  delete: (id: number) =>
    client.delete(`/worklog/${id}`),
};
