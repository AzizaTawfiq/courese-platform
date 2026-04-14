import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUIStore } from '@/shared/stores/ui';

type LocalizedRecord = Record<string, string | undefined>;

export const useLocaleContent = <T extends LocalizedRecord>(
  source: T,
  baseKey: string,
) => {
  const uiStore = useUIStore();
  const { locale } = storeToRefs(uiStore);

  return computed(() => {
    const suffix = locale.value === 'ar' ? 'Ar' : 'En';
    return source[`${baseKey}${suffix}`];
  });
};
