import { defineComponent, h } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteRecordRaw } from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const makeAdminView = (titleKey: string, compact = false) =>
  defineComponent({
    name: `${titleKey.replace(/\W+/g, '')}AdminView`,
    setup() {
      const { t } = useI18n();
      return () =>
        h('section', { class: compact ? 'mx-auto max-w-xl px-6 py-20' : '' }, [
          h('h1', { class: 'text-3xl font-semibold' }, t(titleKey)),
        ]);
    },
  });

const adminLoginView = makeAdminView('admin.login', true);
const adminProgramsView = makeAdminView('admin.programs');
const adminCategoriesView = makeAdminView('admin.categories');
const adminCoursesView = makeAdminView('admin.courses');
const adminSchedulesView = makeAdminView('admin.schedules');
const adminScheduleFileView = makeAdminView('admin.scheduleFile');

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: PublicLayout,
    children: [
      {
        path: 'login',
        name: 'admin-login',
        component: adminLoginView,
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['ADMIN', 'SUPER_ADMIN'] },
    children: [
      {
        path: 'programs',
        name: 'admin-programs',
        component: adminProgramsView,
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: adminCategoriesView,
      },
      {
        path: 'courses',
        name: 'admin-courses',
        component: adminCoursesView,
      },
      {
        path: 'schedules',
        name: 'admin-schedules',
        component: adminSchedulesView,
      },
      {
        path: 'schedule-file',
        name: 'admin-schedule-file',
        component: adminScheduleFileView,
      },
    ],
  },
];
