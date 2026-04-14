import { ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | null;

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  companyName?: string;
  role: Exclude<UserRole, null>;
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<AuthUser | null>(null);
  const role = ref<UserRole>(null);

  const setSession = (token: string, authUser: AuthUser) => {
    accessToken.value = token;
    user.value = authUser;
    role.value = authUser.role;
  };

  const clearSession = () => {
    accessToken.value = null;
    user.value = null;
    role.value = null;
  };

  const logout = async () => {
    clearSession();
    await router.push('/login');
  };

  return { accessToken, user, role, setSession, clearSession, logout };
});
