import { computed, unref, type MaybeRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useUIStore } from '@/shared/stores/ui';

export const useLocaleContent = <T extends Record<string, unknown>>(
  source: MaybeRef<T | null | undefined>,
  baseKey: string,
) => {
  const uiStore = useUIStore();
  const { locale } = storeToRefs(uiStore);

  return computed(() => {
    const record = unref(source);
    const suffix = locale.value === 'ar' ? 'Ar' : 'En';
    const value = record?.[`${baseKey}${suffix}`];
    return typeof value === 'string' ? value : '';
  });
};
