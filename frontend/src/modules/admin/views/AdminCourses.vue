<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-3xl font-semibold text-white">
        {{ t('admin.courses') }}
      </h1>
      <RouterLink
        class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
        to="/admin/courses/new"
      >
        {{ t('admin.createCourse') }}
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
            <th class="px-4 py-3 text-start">{{ t('admin.courseName') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.programs') }}</th>
            <th class="px-4 py-3 text-start">{{ t('catalog.price') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.schedules') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="course in courses" :key="course.id">
            <td class="px-4 py-4">
              {{ locale === 'ar' ? course.nameAr : course.nameEn }}
            </td>
            <td class="px-4 py-4">
              {{
                locale === 'ar' ? course.programNameAr : course.programNameEn
              }}
            </td>
            <td class="px-4 py-4">{{ course.price }} {{ course.currency }}</td>
            <td class="px-4 py-4">{{ course.scheduleCount }}</td>
            <td class="px-4 py-4">
              <div class="flex gap-3">
                <RouterLink
                  class="text-cyan-300"
                  :to="`/admin/courses/${course.id}/edit`"
                >
                  {{ t('admin.editCourse') }}
                </RouterLink>
                <button
                  class="text-red-300"
                  type="button"
                  @click="handleDelete(course.id)"
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
import type { AdminCourse } from '@/shared/types/admin';

const { t } = useI18n();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const courses = ref<AdminCourse[]>([]);

const loadCourses = async () => {
  const response = await adminService.listAdminCourses();
  courses.value = response.data;
};

const handleDelete = async (id: string) => {
  if (!globalThis.confirm(t('admin.confirmDelete'))) {
    return;
  }

  try {
    await adminService.deleteCourse(id);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409 &&
      globalThis.confirm(
        String(error.response.data?.warning ?? t('admin.confirmDelete')),
      )
    ) {
      await adminService.deleteCourse(id, true);
    } else {
      throw error;
    }
  }

  await loadCourses();
};

onMounted(loadCourses);
</script>
