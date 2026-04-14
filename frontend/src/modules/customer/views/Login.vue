<template>
  <section class="mx-auto max-w-2xl px-6 py-16">
    <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-brand-100">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('auth.login') }}
      </p>
      <h1 class="mt-4 text-3xl font-semibold text-brand-900">
        {{ t('auth.loginTitle') }}
      </h1>
      <p class="mt-3 text-brand-700">
        {{ t('auth.loginDescription') }}
      </p>

      <Form
        class="mt-8 space-y-5"
        :validation-schema="validationSchema"
        @submit="onSubmit"
      >
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

        <p v-if="genericError" class="text-sm text-red-600">
          {{ genericError }}
        </p>

        <button
          class="w-full rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-300"
          :disabled="isSubmitting"
          type="submit"
        >
          {{ t('auth.login') }}
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
import type { LoginPayload } from '@/shared/types/auth';

defineOptions({
  name: 'CustomerLoginView',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);
const genericError = ref('');
const localePrefix = computed(() =>
  route.params.locale === 'en' ? '/en' : '',
);

const validationSchema = computed(() =>
  toTypedSchema(
    z.object({
      email: z.string().trim().email(t('auth.validation.email')),
      password: z.string().min(8, t('auth.validation.password')),
    }),
  ),
);

const onSubmit = async (values: Record<string, unknown>) => {
  isSubmitting.value = true;
  genericError.value = '';
  const payload: LoginPayload = {
    email: String(values.email ?? ''),
    password: String(values.password ?? ''),
  };

  try {
    const response = await authService.login(payload);
    authStore.setSession(response.accessToken, response.user);
    await router.push(`${localePrefix.value}/dashboard`);
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    if (status === 401) {
      genericError.value = t('auth.invalidCredentials');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
