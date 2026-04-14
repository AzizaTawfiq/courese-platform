import { ref } from 'vue';
import { defineStore } from 'pinia';
import router from '@/router';
import { useUIStore } from '@/shared/stores/ui';
import type { User, UserRole } from '@/shared/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<User | null>(null);
  const role = ref<UserRole | null>(null);

  const setSession = (token: string, authUser: User) => {
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
    const uiStore = useUIStore();
    const localePrefix = uiStore.locale === 'en' ? '/en' : '';
    clearSession();
    await router.push(`${localePrefix}/login`);
  };

  return { accessToken, user, role, setSession, clearSession, logout };
});
