<template>
  <section class="mx-auto max-w-2xl px-6 py-16">
    <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-brand-100">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('auth.register') }}
      </p>
      <h1 class="mt-4 text-3xl font-semibold text-brand-900">
        {{ t('auth.registerTitle') }}
      </h1>
      <p class="mt-3 text-brand-700">
        {{ t('auth.registerDescription') }}
      </p>

      <Form
        class="mt-8 space-y-5"
        :validation-schema="validationSchema"
        @submit="onSubmit"
      >
        <div>
          <label
            class="mb-2 block text-sm font-medium text-brand-800"
            for="fullName"
          >
            {{ t('auth.fullName') }}
          </label>
          <Field
            id="fullName"
            name="fullName"
            class="w-full rounded-2xl border border-brand-200 px-4 py-3 outline-none transition focus:border-brand-500"
            type="text"
          />
          <ErrorMessage
            class="mt-2 block text-sm text-red-600"
            name="fullName"
          />
        </div>

        <div>
          <label
            class="mb-2 block text-sm font-medium text-brand-800"
            for="companyName"
          >
            {{ t('auth.companyName') }}
          </label>
          <Field
            id="companyName"
            name="companyName"
            class="w-full rounded-2xl border border-brand-200 px-4 py-3 outline-none transition focus:border-brand-500"
            type="text"
          />
          <ErrorMessage
            class="mt-2 block text-sm text-red-600"
            name="companyName"
          />
        </div>

        <div>
          <label
            class="mb-2 block text-sm font-medium text-brand-800"
            for="email"
          >
            {{ t('auth.email') }}
          </label>
          <Field
            id="email"
            name="email"
            class="w-full rounded-2xl border border-brand-200 px-4 py-3 outline-none transition focus:border-brand-500"
            type="email"
          />
          <ErrorMessage class="mt-2 block text-sm text-red-600" name="email" />
          <p v-if="emailTakenError" class="mt-2 text-sm text-red-600">
            {{ emailTakenError }}
          </p>
        </div>

        <div>
          <label
            class="mb-2 block text-sm font-medium text-brand-800"
            for="password"
          >
            {{ t('auth.password') }}
          </label>
          <Field
            id="password"
            name="password"
            class="w-full rounded-2xl border border-brand-200 px-4 py-3 outline-none transition focus:border-brand-500"
            type="password"
          />
          <ErrorMessage
            class="mt-2 block text-sm text-red-600"
            name="password"
          />
        </div>

        <button
          class="w-full rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-300"
          :disabled="isSubmitting"
          type="submit"
        >
          {{ t('auth.register') }}
        </button>
      </Form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';
import { authService } from '@/shared/services/authService';
import type { RegisterPayload } from '@/shared/types/auth';

defineOptions({
  name: 'CustomerRegisterView',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);
const emailTakenError = ref('');
const localePrefix = computed(() =>
  route.params.locale === 'en' ? '/en' : '',
);

const validationSchema = computed(() =>
  toTypedSchema(
    z.object({
      fullName: z.string().trim().min(2, t('auth.validation.fullName')),
      companyName: z.string().trim().min(2, t('auth.validation.companyName')),
      email: z.string().trim().email(t('auth.validation.email')),
      password: z.string().min(8, t('auth.validation.password')),
    }),
  ),
);

const onSubmit = async (values: Record<string, unknown>) => {
  isSubmitting.value = true;
  emailTakenError.value = '';
  const payload: RegisterPayload = {
    fullName: String(values.fullName ?? ''),
    companyName: String(values.companyName ?? ''),
    email: String(values.email ?? ''),
    password: String(values.password ?? ''),
  };

  try {
    const response = await authService.register(payload);
    authStore.setSession(response.accessToken, response.user);
    await router.push(`${localePrefix.value}/dashboard`);
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    if (status === 409) {
      emailTakenError.value = t('auth.emailTaken');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
