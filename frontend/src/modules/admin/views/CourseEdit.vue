<template>
  <section class="space-y-6">
    <h1 class="text-3xl font-semibold text-white">
      {{ isEditing ? t('admin.editCourse') : t('admin.createCourse') }}
    </h1>

    <div class="rounded-[1.5rem] border border-slate-800 bg-slate-900 p-6">
      <Form
        :key="formKey"
        class="space-y-5"
        :validation-schema="validationSchema"
        :initial-values="initialValues"
        @submit="onSubmit"
      >
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.categories')
            }}</label>
            <Field
              as="select"
              name="categoryId"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >
              <option value="">{{ t('admin.selectCategory') }}</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ locale === 'ar' ? category.nameAr : category.nameEn }}
              </option>
            </Field>
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">Slug</label>
            <Field
              name="slug"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.nameAr')
            }}</label>
            <Field
              name="nameAr"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
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
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('catalog.duration')
            }}</label>
            <Field
              name="durationHours"
              type="number"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('catalog.price')
            }}</label>
            <Field
              name="price"
              type="number"
              step="0.01"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.seoTitleAr')
            }}</label>
            <Field
              name="seoTitleAr"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.seoTitleEn')
            }}</label>
            <Field
              name="seoTitleEn"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.seoDescAr')
            }}</label>
            <Field
              as="textarea"
              name="seoDescAr"
              rows="3"
              class="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm text-slate-300">{{
              t('admin.seoDescEn')
            }}</label>
            <Field
              as="textarea"
              name="seoDescEn"
              rows="3"
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
            to="/admin/courses"
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
import { Form, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { adminService } from '@/shared/services/adminService';
import { useUIStore } from '@/shared/stores/ui';
import type { AdminCategory } from '@/shared/types/admin';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const formKey = ref(0);
const categories = ref<AdminCategory[]>([]);
const initialValues = ref({
  categoryId: '',
  slug: '',
  nameAr: '',
  nameEn: '',
  descriptionAr: '',
  descriptionEn: '',
  durationHours: 1,
  price: 0,
  currency: 'SAR',
  seoTitleAr: '',
  seoTitleEn: '',
  seoDescAr: '',
  seoDescEn: '',
});
const isEditing = computed(() => typeof route.params.id === 'string');

const validationSchema = computed(() =>
  toTypedSchema(
    z.object({
      categoryId: z.string().trim().min(1),
      slug: z
        .string()
        .trim()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      nameAr: z.string().trim().min(1),
      nameEn: z.string().trim().min(1),
      descriptionAr: z.string().trim().min(1),
      descriptionEn: z.string().trim().min(1),
      durationHours: z.coerce.number().int().positive(),
      price: z.coerce.number().nonnegative(),
      currency: z.string().trim().min(1),
      seoTitleAr: z.string().trim().min(1).max(60),
      seoTitleEn: z.string().trim().min(1).max(60),
      seoDescAr: z.string().trim().min(1).max(160),
      seoDescEn: z.string().trim().min(1).max(160),
    }),
  ),
);

onMounted(async () => {
  const categoriesResponse = await adminService.listAdminCategories();
  categories.value = categoriesResponse.data;

  if (!isEditing.value) {
    return;
  }

  const course = await adminService.getAdminCourse(String(route.params.id));
  initialValues.value = {
    categoryId: course.categoryId,
    slug: course.slug,
    nameAr: course.nameAr,
    nameEn: course.nameEn,
    descriptionAr: course.descriptionAr,
    descriptionEn: course.descriptionEn,
    durationHours: course.durationHours,
    price: Number(course.price),
    currency: course.currency,
    seoTitleAr: course.seoTitleAr,
    seoTitleEn: course.seoTitleEn,
    seoDescAr: course.seoDescAr,
    seoDescEn: course.seoDescEn,
  };
  formKey.value += 1;
});

const onSubmit = async (values: Record<string, unknown>) => {
  const payload = {
    categoryId: String(values.categoryId ?? ''),
    slug: String(values.slug ?? ''),
    nameAr: String(values.nameAr ?? ''),
    nameEn: String(values.nameEn ?? ''),
    descriptionAr: String(values.descriptionAr ?? ''),
    descriptionEn: String(values.descriptionEn ?? ''),
    durationHours: Number(values.durationHours ?? 1),
    price: Number(values.price ?? 0),
    currency: String(values.currency ?? 'SAR'),
    seoTitleAr: String(values.seoTitleAr ?? ''),
    seoTitleEn: String(values.seoTitleEn ?? ''),
    seoDescAr: String(values.seoDescAr ?? ''),
    seoDescEn: String(values.seoDescEn ?? ''),
  };

  if (isEditing.value) {
    await adminService.updateCourse(String(route.params.id), payload);
  } else {
    await adminService.createCourse(payload);
  }

  await router.push('/admin/courses');
};
</script>
