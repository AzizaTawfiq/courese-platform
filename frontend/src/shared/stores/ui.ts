import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export type Locale = 'ar' | 'en';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const useUIStore = defineStore('ui', () => {
  const locale = ref<Locale>('ar');
  const loading = ref(false);
  const toasts = ref<Toast[]>([]);

  watch(
    locale,
    (value) => {
      document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = value;
    },
    { immediate: true },
  );

  const pushToast = (toast: Omit<Toast, 'id'>) => {
    toasts.value.push({ ...toast, id: Date.now() });
  };

  const clearToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  return { locale, loading, toasts, pushToast, clearToast };
});
