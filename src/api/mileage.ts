import { client } from './client';

export interface MileageRecord {
  id: number;
  date: string;
  km: number;
  oil_price: number;
  amount: number;
  description?: string;
  created_at: string;
}

export interface MileagePayload {
  date: string;
  km: number;
  oil_price: number;
  description?: string;
}

export const mileageApi = {
  list: (params: { year: number; month: number }) =>
    client.get<MileageRecord[]>('/mileage', { params }).then((r) => r.data),

  create: (data: MileagePayload) =>
    client.post<MileageRecord>('/mileage', data).then((r) => r.data),

  delete: (id: number) =>
    client.delete(`/mileage/${id}`),
};

export const calcMileage = (km: number, oilPrice: number) =>
  Math.round(km * oilPrice * 0.1);
