import type { RouteRecordRaw } from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AdminCategories from './views/AdminCategories.vue';
import AdminCourses from './views/AdminCourses.vue';
import AdminLogin from './views/AdminLogin.vue';
import AdminPrograms from './views/AdminPrograms.vue';
import AdminScheduleFile from './views/AdminScheduleFile.vue';
import AdminSchedules from './views/AdminSchedules.vue';
import CategoryEdit from './views/CategoryEdit.vue';
import CourseEdit from './views/CourseEdit.vue';
import ProgramEdit from './views/ProgramEdit.vue';

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: PublicLayout,
    children: [
      {
        path: 'login',
        name: 'admin-login',
        component: AdminLogin,
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
        component: AdminPrograms,
      },
      {
        path: 'programs/new',
        name: 'admin-program-create',
        component: ProgramEdit,
      },
      {
        path: 'programs/:id/edit',
        name: 'admin-program-edit',
        component: ProgramEdit,
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: AdminCategories,
      },
      {
        path: 'categories/new',
        name: 'admin-category-create',
        component: CategoryEdit,
      },
      {
        path: 'categories/:id/edit',
        name: 'admin-category-edit',
        component: CategoryEdit,
      },
      {
        path: 'courses',
        name: 'admin-courses',
        component: AdminCourses,
      },
      {
        path: 'courses/new',
        name: 'admin-course-create',
        component: CourseEdit,
      },
      {
        path: 'courses/:id/edit',
        name: 'admin-course-edit',
        component: CourseEdit,
      },
      {
        path: 'schedules',
        name: 'admin-schedules',
        component: AdminSchedules,
      },
      {
        path: 'schedule-file',
        name: 'admin-schedule-file',
        component: AdminScheduleFile,
      },
    ],
  },
];
