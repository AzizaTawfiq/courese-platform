import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';
import { useUIStore } from '@/shared/stores/ui';
import { customerRoutes } from '@/modules/customer/routes';
import { adminRoutes } from '@/modules/admin/routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [...customerRoutes, ...adminRoutes],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  const requiresAuth = Boolean(to.meta.requiresAuth);
  const requiredRoles = (to.meta.roles as string[] | undefined) ?? [];
  const locale = to.params.locale === 'en' ? 'en' : 'ar';
  const localePrefix = locale === 'en' ? '/en' : '';

  uiStore.locale = locale;

  if (requiresAuth && !authStore.accessToken) {
    return to.path.startsWith('/admin')
      ? '/admin/login'
      : `${localePrefix}/login`;
  }

  if (
    requiredRoles.length > 0 &&
    authStore.role &&
    !requiredRoles.includes(authStore.role)
  ) {
    return authStore.role === 'ADMIN' || authStore.role === 'SUPER_ADMIN'
      ? '/admin/programs'
      : `${localePrefix}/dashboard`;
  }

  return true;
});

export default router;
