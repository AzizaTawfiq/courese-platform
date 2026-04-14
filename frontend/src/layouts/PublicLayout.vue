<template>
  <div class="min-h-screen text-brand-900">
    <header class="border-b border-brand-100 bg-white/80 backdrop-blur">
      <nav
        class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <RouterLink
          class="text-lg font-semibold tracking-wide text-brand-700"
          :to="localePrefix || '/'"
          >MA Training</RouterLink
        >
        <div class="flex items-center gap-3 text-sm">
          <LanguageSwitcher />
          <RouterLink class="hover:text-brand-500" :to="`${localePrefix}/login`">{{
            t('auth.login')
          }}</RouterLink>
          <RouterLink
            class="rounded-full bg-brand-700 px-4 py-2 text-white"
            :to="`${localePrefix}/register`"
          >
            {{ t('auth.register') }}
          </RouterLink>
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer
      class="border-t border-brand-100 bg-white/70 px-6 py-6 text-center text-sm text-brand-700"
    >
      {{ t('common.footer') }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher.vue';
import { useUIStore } from '@/shared/stores/ui';

const route = useRoute();
const { t } = useI18n();
const uiStore = useUIStore();
const localePrefix = computed(() => {
  const locale =
    route.params.locale === 'en' || uiStore.locale === 'en' ? 'en' : 'ar';
  return locale === 'en' ? '/en' : '';
});
</script>
