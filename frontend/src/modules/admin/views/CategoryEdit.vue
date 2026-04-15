<template>
  <section class="space-y-6">
    <h1 class="text-3xl font-semibold text-white">
      {{ isEditing ? t('admin.editCategory') : t('admin.createCategory') }}
    </h1>

    <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-6">
      <Form
        :key="formKey"
        class="space-y-5"
        :validation-schema="validationSchema"
        :initial-values="initialValues"
        @submit="onSubmit"
      >
        <div>
          <label class="mb-2 block text-sm text-slate-300">{{
            t('admin.programs')
          }}</label>
          <Field
            as="select"
            name="programId"
            :disabled="isEditing"
            class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="">{{ t('admin.selectProgram') }}</option>
            <option
              v-for="program in programs"
              :key="program.id"
              :value="program.id"
            >
              {{ locale === 'ar' ? program.nameAr : program.nameEn }}
            </option>
          </Field>
          <ErrorMessage
            name="programId"
            class="mt-2 block text-sm text-red-400"
          />
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.nameAr')
            }}</label>
            <Field
              name="nameAr"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
            <ErrorMessage
              name="nameAr"
              class="mt-2 block text-sm text-red-400"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.nameEn')
            }}</label>
            <Field
              name="nameEn"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
            <ErrorMessage
              name="nameEn"
              class="mt-2 block text-sm text-red-400"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.descriptionAr')
            }}</label>
            <Field
              as="textarea"
              name="descriptionAr"
              rows="4"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.descriptionEn')
            }}</label>
            <Field
              as="textarea"
              name="descriptionEn"
              rows="4"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
        </div>
        <div class="flex gap-3">
          <button
            class="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
            type="submit"
          >
            {{ t('admin.save') }}
          </button>
          <RouterLink
            class="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200"
            to="/admin/categories"
          >
            {{ t('admin.cancel') }}
          </RouterLink>
        </div>
      </Form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { adminService } from '@/shared/services/adminService';
import { useUIStore } from '@/shared/stores/ui';
import type { AdminProgram } from '@/shared/types/admin';

defineOptions({
  name: 'CategoryEditView',
});

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const formKey = ref(0);
const programs = ref<AdminProgram[]>([]);
const initialValues = ref({
  programId: '',
  nameAr: '',
  nameEn: '',
  descriptionAr: '',
  descriptionEn: '',
});
const isEditing = computed(() => typeof route.params.id === 'string');

const validationSchema = computed(() =>
  toTypedSchema(
    z.object({
      programId: z.string().trim().min(1),
      nameAr: z.string().trim().min(1),
      nameEn: z.string().trim().min(1),
      descriptionAr: z.string().trim().min(1),
      descriptionEn: z.string().trim().min(1),
    }),
  ),
);

onMounted(async () => {
  const programsResponse = await adminService.listAdminPrograms();
  programs.value = programsResponse.data;

  if (!isEditing.value) {
    return;
  }

  const category = await adminService.getAdminCategory(String(route.params.id));
  initialValues.value = {
    programId: category.programId,
    nameAr: category.nameAr,
    nameEn: category.nameEn,
    descriptionAr: category.descriptionAr,
    descriptionEn: category.descriptionEn,
  };
  formKey.value += 1;
});

const onSubmit = async (values: Record<string, unknown>) => {
  const program = programs.value.find(
    (entry) => entry.id === String(values.programId),
  );
  if (!program) {
    return;
  }

  const payload = {
    nameAr: String(values.nameAr ?? ''),
    nameEn: String(values.nameEn ?? ''),
    descriptionAr: String(values.descriptionAr ?? ''),
    descriptionEn: String(values.descriptionEn ?? ''),
  };

  if (isEditing.value) {
    await adminService.updateCategory(
      program.slug,
      String(route.params.id),
      payload,
    );
  } else {
    await adminService.createCategory(program.slug, payload);
  }

  await router.push('/admin/categories');
};
</script>
