import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';
import { customerRoutes } from '@/modules/customer/routes';
import { adminRoutes } from '@/modules/admin/routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [...customerRoutes, ...adminRoutes],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const requiresAuth = Boolean(to.meta.requiresAuth);
  const requiredRoles = (to.meta.roles as string[] | undefined) ?? [];

  if (requiresAuth && !authStore.accessToken) {
    return to.path.startsWith('/admin') ? '/admin/login' : '/login';
  }

  if (
    requiredRoles.length > 0 &&
    authStore.role &&
    !requiredRoles.includes(authStore.role)
  ) {
    return authStore.role === 'ADMIN' || authStore.role === 'SUPER_ADMIN'
      ? '/admin/programs'
      : '/dashboard';
  }

  return true;
});

export default router;
