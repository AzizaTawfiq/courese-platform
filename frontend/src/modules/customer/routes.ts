import { defineComponent, h } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import CustomerLayout from '@/layouts/CustomerLayout.vue';

const makeView = (title: string, body?: string, compact = false) =>
  defineComponent({
    name: `${title.replace(/\s+/g, '')}View`,
    setup() {
      return () =>
        h('section', { class: compact ? '' : 'mx-auto max-w-6xl px-6 py-24' }, [
          h(
            'h1',
            {
              class: compact
                ? 'text-3xl font-semibold'
                : 'text-5xl font-semibold',
            },
            title,
          ),
          body
            ? h('p', { class: 'mt-4 max-w-2xl text-lg text-brand-700' }, body)
            : null,
        ]);
    },
  });

const homeView = makeView(
  'MA Training',
  'Customer portal foundation is ready for the catalog modules.',
);
const loginView = makeView('Login');
const registerView = makeView('Register');
const dashboardView = makeView('Dashboard', undefined, true);

const publicChildren = (localized: boolean): RouteRecordRaw[] => [
  {
    path: '',
    name: localized ? 'home-locale' : 'home',
    component: homeView,
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
