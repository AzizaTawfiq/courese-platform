import axios from 'axios';
import { useAuthStore } from '@/shared/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    const requestUrl = originalRequest?.url ?? '';

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !requestUrl.includes('/auth/refresh') &&
      !requestUrl.includes('/auth/login') &&
      !requestUrl.includes('/auth/register') &&
      !requestUrl.includes('/auth/logout') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post<{ accessToken: string }>(
          '/auth/refresh',
        );
        authStore.accessToken = refreshResponse.data.accessToken;
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return api(originalRequest);
      } catch {
        await authStore.logout();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
