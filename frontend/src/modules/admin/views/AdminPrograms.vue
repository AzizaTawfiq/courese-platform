<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-white">
          {{ t('admin.programs') }}
        </h1>
        <p class="mt-2 text-sm text-slate-400">{{ t('admin.programsHelp') }}</p>
      </div>
      <RouterLink
        class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
        to="/admin/programs/new"
      >
        {{ t('admin.createProgram') }}
      </RouterLink>
    </div>

    <div
      class="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-900"
    >
      <table
        class="min-w-full divide-y divide-slate-800 text-sm text-slate-200"
      >
        <thead class="bg-slate-950/60 text-slate-400">
          <tr>
            <th class="px-4 py-3 text-start">{{ t('admin.programName') }}</th>
            <th class="px-4 py-3 text-start">Slug</th>
            <th class="px-4 py-3 text-start">{{ t('admin.categories') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="program in programs" :key="program.id">
            <td class="px-4 py-4">
              <div class="font-medium">
                {{ locale === 'ar' ? program.nameAr : program.nameEn }}
              </div>
              <div class="text-xs text-slate-400">{{ program.slug }}</div>
            </td>
            <td class="px-4 py-4">{{ program.slug }}</td>
            <td class="px-4 py-4">{{ program.categoryCount }}</td>
            <td class="px-4 py-4">
              <div class="flex gap-3">
                <RouterLink
                  class="text-cyan-300"
                  :to="`/admin/programs/${program.id}/edit`"
                >
                  {{ t('admin.editProgram') }}
                </RouterLink>
                <button
                  class="text-red-300"
                  type="button"
                  @click="handleDelete(program.id)"
                >
                  {{ t('admin.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { adminService } from '@/shared/services/adminService';
import { useUIStore } from '@/shared/stores/ui';
import type { AdminProgram } from '@/shared/types/admin';

defineOptions({
  name: 'AdminProgramsView',
});

const { t } = useI18n();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const programs = ref<AdminProgram[]>([]);

const loadPrograms = async () => {
  const response = await adminService.listAdminPrograms();
  programs.value = response.data;
};

const handleDelete = async (id: string) => {
  if (!globalThis.confirm(t('admin.confirmDelete'))) {
    return;
  }

  await adminService.deleteProgram(id);
  await loadPrograms();
};

onMounted(loadPrograms);
</script>
