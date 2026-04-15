<template>
  <div
    class="grid min-h-screen bg-slate-950 text-slate-100 lg:grid-cols-[260px_1fr]"
  >
    <aside class="border-e border-slate-800 bg-slate-900 p-6">
      <RouterLink
        class="mb-8 block text-xl font-semibold tracking-wide text-cyan-300"
        to="/admin/programs"
      >
        {{ t('admin.portal') }}
      </RouterLink>
      <nav class="space-y-3 text-sm">
        <RouterLink
          class="block rounded-xl px-4 py-3 hover:bg-slate-800"
          to="/admin/programs"
          >{{ t('admin.programs') }}</RouterLink
        >
        <RouterLink
          class="block rounded-xl px-4 py-3 hover:bg-slate-800"
          to="/admin/categories"
          >{{ t('admin.categories') }}</RouterLink
        >
        <RouterLink
          class="block rounded-xl px-4 py-3 hover:bg-slate-800"
          to="/admin/courses"
          >{{ t('admin.courses') }}</RouterLink
        >
        <RouterLink
          class="block rounded-xl px-4 py-3 hover:bg-slate-800"
          to="/admin/schedules"
          >{{ t('admin.schedules') }}</RouterLink
        >
        <RouterLink
          class="block rounded-xl px-4 py-3 hover:bg-slate-800"
          to="/admin/schedule-file"
          >{{ t('admin.scheduleFile') }}</RouterLink
        >
      </nav>
    </aside>

    <div>
      <header
        class="border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur"
      >
        <div class="flex items-center justify-end">
          <button
            class="rounded-full border border-slate-700 px-4 py-2 text-sm"
            type="button"
            @click="handleLogout"
          >
            {{ t('auth.logout') }}
          </button>
        </div>
      </header>
      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink, RouterView } from 'vue-router';
import { authService } from '@/shared/services/authService';
import { useAuthStore } from '@/shared/stores/auth';

const { t } = useI18n();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await authService.logout();
  } catch {
    // Keep logout responsive even if the API is unavailable.
  }

  await authStore.logout();
};
</script>
