import type { RouteRecordRaw } from 'vue-router';
import PublicLayout from '@/layouts/PublicLayout.vue';
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import Categories from './views/Categories.vue';
import CourseDetail from './views/CourseDetail.vue';
import CustomerHome from './views/CustomerHome.vue';
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import Programs from './views/Programs.vue';
import Register from './views/Register.vue';

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
    component: Login,
  },
  {
    path: 'register',
    name: localized ? 'register-locale' : 'register',
    component: Register,
  },
];

const customerChildren = (localized: boolean): RouteRecordRaw[] => [
  {
    path: 'dashboard',
    name: localized ? 'dashboard-locale' : 'dashboard',
    meta: { requiresAuth: true },
    component: Dashboard,
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
