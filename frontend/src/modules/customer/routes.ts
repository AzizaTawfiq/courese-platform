/* eslint-disable vue/one-component-per-file */
import { defineComponent, h } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteRecordRaw } from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import Categories from './views/Categories.vue';
import CourseDetail from './views/CourseDetail.vue';
import CustomerHome from './views/CustomerHome.vue';
import Programs from './views/Programs.vue';

const loginView = defineComponent({
  name: 'CustomerLoginPlaceholder',
  setup() {
    const { t } = useI18n();
    return () =>
      h('section', { class: 'mx-auto max-w-3xl px-6 py-16' }, [
        h(
          'h1',
          { class: 'text-3xl font-semibold text-brand-900' },
          t('auth.login'),
        ),
      ]);
  },
});

const registerView = defineComponent({
  name: 'CustomerRegisterPlaceholder',
  setup() {
    const { t } = useI18n();
    return () =>
      h('section', { class: 'mx-auto max-w-3xl px-6 py-16' }, [
        h(
          'h1',
          { class: 'text-3xl font-semibold text-brand-900' },
          t('auth.register'),
        ),
      ]);
  },
});

const dashboardView = defineComponent({
  name: 'CustomerDashboardPlaceholder',
  setup() {
    const { t } = useI18n();
    return () =>
      h('section', { class: 'mx-auto max-w-4xl px-6 py-16' }, [
        h(
          'h1',
          { class: 'text-3xl font-semibold text-brand-900' },
          t('dashboard.title'),
        ),
      ]);
  },
});

const publicChildren = (localized: boolean): RouteRecordRaw[] => [
  {
    path: '',
    name: localized ? 'home-locale' : 'home',
    component: CustomerHome,
  },
  {
    path: 'programs/:slug',
    name: localized ? 'programs-locale' : 'programs',
    component: Programs,
  },
  {
    path: 'programs/:programSlug/categories/:id',
    name: localized ? 'categories-locale' : 'categories',
    component: Categories,
  },
  {
    path: 'programs/:slug/courses/:courseSlug',
    name: localized ? 'course-detail-locale' : 'course-detail',
    component: CourseDetail,
  },
  {
    path: 'login',
    name: localized ? 'login-locale' : 'login',
    component: loginView,
  },
  {
    path: 'register',
    name: localized ? 'register-locale' : 'register',
    component: registerView,
  },
];

const customerChildren = (localized: boolean): RouteRecordRaw[] => [
  {
    path: 'dashboard',
    name: localized ? 'dashboard-locale' : 'dashboard',
    meta: { requiresAuth: true },
    component: dashboardView,
  },
];

export const customerRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: publicChildren(false),
  },
  {
    path: '/:locale(ar|en)',
    component: PublicLayout,
    children: publicChildren(true),
  },
  {
    path: '/',
    component: CustomerLayout,
    children: customerChildren(false),
  },
  {
    path: '/:locale(ar|en)',
    component: CustomerLayout,
    children: customerChildren(true),
  },
];
