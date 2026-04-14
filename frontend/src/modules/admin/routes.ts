import { defineComponent, h } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const makeAdminView = (title: string, compact = false) =>
  defineComponent({
    name: `${title.replace(/\s+/g, '')}AdminView`,
    setup() {
      return () =>
        h('section', { class: compact ? 'mx-auto max-w-xl px-6 py-20' : '' }, [
          h('h1', { class: 'text-3xl font-semibold' }, title),
        ]);
    },
  });

const adminLoginView = makeAdminView('Admin Login', true);
const adminProgramsView = makeAdminView('Programs');
const adminCategoriesView = makeAdminView('Categories');
const adminCoursesView = makeAdminView('Courses');
const adminSchedulesView = makeAdminView('Schedules');
const adminScheduleFileView = makeAdminView('Schedule File');

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
