<template>
  <button
    class="rounded-full border border-brand-200 px-3 py-1 text-brand-700 transition hover:bg-brand-50"
    type="button"
    @click="toggleLocale"
  >
    {{ uiStore.locale === 'ar' ? 'EN' : 'AR' }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUIStore } from '@/shared/stores/ui';

const uiStore = useUIStore();
const route = useRoute();
const router = useRouter();

const localizedPath = computed(() => {
  const currentPath = route.path;
  const pathWithoutLocale = currentPath.replace(/^\/(ar|en)(?=\/|$)/, '') || '/';
  return uiStore.locale === 'ar' ? `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}` : pathWithoutLocale;
});

const toggleLocale = async () => {
  uiStore.locale = uiStore.locale === 'ar' ? 'en' : 'ar';
  await router.push({
    path: localizedPath.value,
    query: route.query,
    hash: route.hash,
  });
};
</script>
