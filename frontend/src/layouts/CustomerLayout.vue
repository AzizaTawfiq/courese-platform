<template>
  <div class="min-h-screen bg-white text-brand-900">
    <header class="border-b border-brand-100 bg-brand-900 text-white">
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <RouterLink class="font-semibold" :to="`${localePrefix}/dashboard`">{{
          t('dashboard.title')
        }}</RouterLink>
        <button
          class="rounded-full border border-white/40 px-4 py-2 text-sm"
          type="button"
          @click="authStore.logout"
        >
          {{ t('auth.logout') }}
        </button>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-6 py-10">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';

const route = useRoute();
const { t } = useI18n();
const authStore = useAuthStore();
const localePrefix = computed(() => (route.params.locale === 'en' ? '/en' : ''));
</script>
