<template>
  <section class="mx-auto max-w-xl px-6 py-20">
    <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-brand-100">
      <h1 class="text-3xl font-semibold text-brand-900">
        {{ t('admin.login') }}
      </h1>
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
            type="email"
            class="w-full rounded-2xl border border-brand-200 px-4 py-3 outline-none transition focus:border-brand-500"
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
            type="password"
            class="w-full rounded-2xl border border-brand-200 px-4 py-3 outline-none transition focus:border-brand-500"
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
          class="w-full rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand-300"
          :disabled="isSubmitting"
          type="submit"
        >
          {{ t('admin.login') }}
        </button>
      </Form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { authService } from '@/shared/services/authService';
import { useAuthStore } from '@/shared/stores/auth';
import type { LoginPayload } from '@/shared/types/auth';

defineOptions({
  name: 'AdminLoginView',
});

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);
const genericError = ref('');

const validationSchema = computed(() =>
  toTypedSchema(
    z.object({
      email: z.string().trim().email(t('auth.validation.email')),
      password: z.string().min(8, t('auth.validation.password')),
    }),
  ),
);

onMounted(async () => {
  if (authStore.role === 'ADMIN' || authStore.role === 'SUPER_ADMIN') {
    await router.replace('/admin/programs');
  }
});

const onSubmit = async (values: Record<string, unknown>) => {
  isSubmitting.value = true;
  genericError.value = '';

  const payload: LoginPayload = {
    email: String(values.email ?? ''),
    password: String(values.password ?? ''),
  };

  try {
    const response = await authService.login(payload);

    if (
      response.user.role !== 'ADMIN' &&
      response.user.role !== 'SUPER_ADMIN'
    ) {
      authStore.clearSession();
      try {
        await authService.logout();
      } catch {
        // Best-effort cleanup for an accidental non-admin login.
      }
      genericError.value = t('admin.errors.role');
      return;
    }

    authStore.setSession(response.accessToken, response.user);
    await router.push('/admin/programs');
  } catch {
    genericError.value = t('auth.invalidCredentials');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
