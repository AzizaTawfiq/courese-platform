<template>
  <div class="min-h-screen text-brand-900">
    <header class="border-b border-brand-100 bg-white/80 backdrop-blur">
      <nav
        class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <RouterLink
          class="text-lg font-semibold tracking-wide text-brand-700"
          to="/"
          >MA Training</RouterLink
        >
        <div class="flex items-center gap-3 text-sm">
          <button
            class="rounded-full border border-brand-200 px-3 py-1 text-brand-700 transition hover:bg-brand-50"
            type="button"
            @click="toggleLocale"
          >
            {{ uiStore.locale === 'ar' ? 'EN' : 'AR' }}
          </button>
          <RouterLink class="hover:text-brand-500" to="/login">{{
            t('auth.login')
          }}</RouterLink>
          <RouterLink
            class="rounded-full bg-brand-700 px-4 py-2 text-white"
            to="/register"
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
import { useI18n } from 'vue-i18n';
import { RouterLink, RouterView } from 'vue-router';
import { useUIStore } from '@/shared/stores/ui';

const { t } = useI18n();
const uiStore = useUIStore();

const toggleLocale = () => {
  uiStore.locale = uiStore.locale === 'ar' ? 'en' : 'ar';
};
</script>
