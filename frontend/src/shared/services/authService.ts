import api from './api';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/shared/types/auth';

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async refresh() {
    const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async me(accessToken?: string) {
    const { data } = await api.get<User>('/auth/me', {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    });
    return data;
  },
};
