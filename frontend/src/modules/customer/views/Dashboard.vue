<template>
  <section class="space-y-6">
    <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-brand-100">
      <p class="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">
        {{ t('dashboard.title') }}
      </p>
      <h1 class="mt-4 text-3xl font-semibold text-brand-900">
        {{ t('dashboard.greeting', { name: authStore.user?.fullName ?? '' }) }}
      </h1>
      <p class="mt-3 text-brand-700">
        {{ authStore.user?.companyName }}
      </p>
    </div>

    <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-brand-100">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-brand-900">
            {{ t('dashboard.bookingsTitle') }}
          </h2>
          <p class="mt-2 text-brand-700">
            {{ t('dashboard.bookingsDescription') }}
          </p>
        </div>
      </div>

      <div
        v-if="bookingsStore.bookings.length === 0"
        class="mt-6 rounded-[1.5rem] bg-brand-50/70 p-6 text-brand-700"
      >
        <p class="text-base font-medium text-brand-900">
          {{ t('dashboard.noBookings') }}
        </p>
        <RouterLink
          class="mt-4 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
          :to="localePrefix || '/'"
        >
          {{ t('dashboard.browseCourses') }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';
import { useBookingsStore } from '@/shared/stores/bookings';

defineOptions({
  name: 'CustomerDashboardView',
});

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const bookingsStore = useBookingsStore();
const localePrefix = computed(() =>
  route.params.locale === 'en' ? '/en' : '',
);

onMounted(async () => {
  await bookingsStore.fetchBookings();
});
</script>
