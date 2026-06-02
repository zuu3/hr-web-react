import { client } from './client';

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportApi = {
  attendance: async (params: { year: number; month: number }) => {
    const res = await client.get('/export/attendance', { params, responseType: 'blob' });
    downloadBlob(res.data, `근태내역_${params.year}${String(params.month).padStart(2, '0')}.xlsx`);
  },

  expenses: async (params: { start_date: string; end_date: string }) => {
    const res = await client.get('/export/expenses', { params, responseType: 'blob' });
    downloadBlob(res.data, `지출내역_${params.start_date}_${params.end_date}.xlsx`);
  },

  summary: async (params: { year: number; month: number }) => {
    const res = await client.get('/export/summary', { params, responseType: 'blob' });
    downloadBlob(res.data, `급여명세_${params.year}${String(params.month).padStart(2, '0')}.xlsx`);
  },
};
