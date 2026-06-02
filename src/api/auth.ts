import { client } from './client';

export interface LoginPayload { email: string; password: string }
export interface LoginResponse { access_token: string; token_type: string; user: User }
export interface User { id: number; name: string; email: string; role: 'engineer' | 'material_manager' | 'admin'; department?: string }

export const authApi = {
  login: (data: LoginPayload) =>
    client.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  me: () =>
    client.get<User>('/users/me').then((r) => r.data),
};
