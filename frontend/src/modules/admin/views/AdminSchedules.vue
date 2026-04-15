<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-3xl font-semibold text-white">
        {{ t('admin.schedules') }}
      </h1>
    </div>

    <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-6">
      <Form
        :key="formKey"
        class="grid gap-4 md:grid-cols-5"
        :validation-schema="validationSchema"
        :initial-values="initialValues"
        @submit="onSubmit"
      >
        <Field
          as="select"
          name="courseId"
          class="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        >
          <option value="">{{ t('admin.selectCourse') }}</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ locale === 'ar' ? course.nameAr : course.nameEn }}
          </option>
        </Field>
        <Field
          name="startDate"
          type="datetime-local"
          class="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        />
        <Field
          name="endDate"
          type="datetime-local"
          class="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        />
        <Field
          name="location"
          class="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        />
        <Field
          name="maxCapacity"
          type="number"
          class="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        />
        <button
          class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 md:col-span-5 md:justify-self-start"
          type="submit"
        >
          {{ editingId ? t('admin.editSchedule') : t('admin.createSchedule') }}
        </button>
      </Form>
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
            <th class="px-4 py-3 text-start">{{ t('dashboard.startDate') }}</th>
            <th class="px-4 py-3 text-start">{{ t('admin.capacity') }}</th>
            <th class="px-4 py-3 text-start">
              {{ t('catalog.availableSeats') }}
            </th>
            <th class="px-4 py-3 text-start">{{ t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800">
          <tr v-for="schedule in schedules" :key="schedule.id">
            <td class="px-4 py-4">
              {{
                locale === 'ar' ? schedule.courseNameAr : schedule.courseNameEn
              }}
            </td>
            <td class="px-4 py-4">{{ schedule.startDate }}</td>
            <td class="px-4 py-4">{{ schedule.maxCapacity }}</td>
            <td class="px-4 py-4">{{ schedule.availableSeats }}</td>
            <td class="px-4 py-4">
              <div class="flex gap-3">
                <button
                  class="text-cyan-300"
                  type="button"
                  @click="startEdit(schedule)"
                >
                  {{ t('admin.editSchedule') }}
                </button>
                <button
                  class="text-red-300"
                  type="button"
                  @click="handleDelete(schedule.id)"
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
import { Form, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { adminService } from '@/shared/services/adminService';
import { useUIStore } from '@/shared/stores/ui';
import type { AdminCourse, AdminSchedule } from '@/shared/types/admin';

const { t } = useI18n();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const schedules = ref<AdminSchedule[]>([]);
const courses = ref<AdminCourse[]>([]);
const editingId = ref('');
const formKey = ref(0);
const initialValues = ref({
  courseId: '',
  startDate: '',
  endDate: '',
  location: '',
  maxCapacity: 1,
});

const validationSchema = toTypedSchema(
  z.object({
    courseId: z.string().trim().min(1),
    startDate: z.string().trim().min(1),
    endDate: z.string().trim().min(1),
    location: z.string().trim().optional(),
    maxCapacity: z.coerce.number().int().positive(),
  }),
);

const toLocalDateTimeInputValue = (value: string) => {
  const date = new Date(value);
  const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
};

const toUtcIsoString = (value: string) => {
  return new Date(value).toISOString();
};

const loadData = async () => {
  const [scheduleResponse, courseResponse] = await Promise.all([
    adminService.listAdminSchedules(),
    adminService.listAdminCourses(),
  ]);

  schedules.value = scheduleResponse.data;
  courses.value = courseResponse.data;
};

const startEdit = (schedule: AdminSchedule) => {
  editingId.value = schedule.id;
  initialValues.value = {
    courseId: schedule.courseId,
    startDate: toLocalDateTimeInputValue(schedule.startDate),
    endDate: toLocalDateTimeInputValue(schedule.endDate),
    location: schedule.location ?? '',
    maxCapacity: schedule.maxCapacity,
  };
  formKey.value += 1;
};

const onSubmit = async (values: Record<string, unknown>) => {
  const payload = {
    courseId: String(values.courseId ?? ''),
    startDate: toUtcIsoString(String(values.startDate ?? '')),
    endDate: toUtcIsoString(String(values.endDate ?? '')),
    location: String(values.location ?? ''),
    maxCapacity: Number(values.maxCapacity ?? 1),
  };

  if (editingId.value) {
    await adminService.updateSchedule(editingId.value, payload);
  } else {
    await adminService.createSchedule(payload);
  }

  editingId.value = '';
  initialValues.value = {
    courseId: '',
    startDate: '',
    endDate: '',
    location: '',
    maxCapacity: 1,
  };
  formKey.value += 1;
  await loadData();
};

const handleDelete = async (id: string) => {
  if (!globalThis.confirm(t('admin.confirmDelete'))) {
    return;
  }

  try {
    await adminService.deleteSchedule(id);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409 &&
      globalThis.confirm(
        String(error.response.data?.warning ?? t('admin.confirmDelete')),
      )
    ) {
      await adminService.deleteSchedule(id, true);
    } else {
      throw error;
    }
  }

  await loadData();
};

onMounted(loadData);
</script>
