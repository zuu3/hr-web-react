import { client } from './client';

export interface LoginPayload { email: string; password: string }
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: User;
}
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'engineer' | 'material_manager' | 'admin';
  department?: string;
  position?: string;
  is_active?: boolean;
}

export const authApi = {
  login: (data: LoginPayload) =>
    client.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  refresh: (refresh_token: string) =>
    client.post<LoginResponse>('/auth/refresh', { refresh_token }).then((r) => r.data),

  logout: () =>
    client.post('/auth/logout'),

  me: () =>
    client.get<User>('/users/me').then((r) => r.data),
};
