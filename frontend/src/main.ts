import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import ar from './locales/ar.json';
import en from './locales/en.json';
import { useUIStore } from '@/shared/stores/ui';
import './style.css';

const i18n = createI18n({
  legacy: false,
  locale: 'ar',
  fallbackLocale: 'en',
  messages: { ar, en },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(createHead());
app.use(i18n);
app.use(router);

const uiStore = useUIStore(pinia);
watch(
  () => uiStore.locale,
  (locale) => {
    i18n.global.locale.value = locale;
  },
  { immediate: true },
);

app.mount('#app');
