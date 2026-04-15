<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-white">
          {{ t('admin.categories') }}
        </h1>
      </div>
      <RouterLink
        class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
        to="/admin/categories/new"
      >
        {{ t('admin.createCategory') }}
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
            <th class="px-4 py-3 text-start">{{ t('admin.categoryName') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.programs') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.courses') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="category in categories" :key="category.id">
            <td class="px-4 py-4">
              {{ locale === 'ar' ? category.nameAr : category.nameEn }}
            </td>
            <td class="px-4 py-4">
              {{
                locale === 'ar'
                  ? category.programNameAr
                  : category.programNameEn
              }}
            </td>
            <td class="px-4 py-4">{{ category.courseCount }}</td>
            <td class="px-4 py-4">
              <div class="flex gap-3">
                <RouterLink
                  class="text-cyan-300"
                  :to="`/admin/categories/${category.id}/edit`"
                >
                  {{ t('admin.editCategory') }}
                </RouterLink>
                <button
                  class="text-red-300"
                  type="button"
                  @click="handleDelete(category.programSlug, category.id)"
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
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { adminService } from '@/shared/services/adminService';
import { useUIStore } from '@/shared/stores/ui';
import type { AdminCategory } from '@/shared/types/admin';

defineOptions({
  name: 'AdminCategoriesView',
});

const { t } = useI18n();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const categories = ref<AdminCategory[]>([]);

const loadCategories = async () => {
  const response = await adminService.listAdminCategories();
  categories.value = response.data;
};

const handleDelete = async (programSlug: string, id: string) => {
  if (!globalThis.confirm(t('admin.confirmDelete'))) {
    return;
  }

  try {
    await adminService.deleteCategory(programSlug, id);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409 &&
      globalThis.confirm(
        String(error.response.data?.warning ?? t('admin.confirmDelete')),
      )
    ) {
      await adminService.deleteCategory(programSlug, id, true);
    } else {
      throw error;
    }
  }

  await loadCategories();
};

onMounted(loadCategories);
</script>
