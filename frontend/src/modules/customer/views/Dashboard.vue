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

      <div
        v-else
        class="mt-6 overflow-hidden rounded-[1.5rem] ring-1 ring-brand-100"
      >
        <table class="min-w-full divide-y divide-brand-100 text-sm">
          <thead class="bg-brand-50/80 text-brand-700">
            <tr>
              <th class="px-4 py-3 text-start font-semibold">
                {{ t('dashboard.reference') }}
              </th>
              <th class="px-4 py-3 text-start font-semibold">
                {{ t('dashboard.course') }}
              </th>
              <th class="px-4 py-3 text-start font-semibold">
                {{ t('dashboard.startDate') }}
              </th>
              <th class="px-4 py-3 text-start font-semibold">
                {{ t('dashboard.status') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-100 bg-white">
            <tr v-for="booking in bookingsStore.bookings" :key="booking.id">
              <td class="px-4 py-4 font-medium text-brand-900">
                {{ booking.reference }}
              </td>
              <td class="px-4 py-4 text-brand-700">
                {{
                  locale === 'ar' ? booking.courseNameAr : booking.courseNameEn
                }}
              </td>
              <td class="px-4 py-4 text-brand-700">
                {{ formatDate(booking.scheduleStartDate) }}
              </td>
              <td class="px-4 py-4">
                <span class="rounded-full bg-brand-50 px-3 py-1 text-brand-800">
                  {{ booking.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';
import { useBookingsStore } from '@/shared/stores/bookings';
import { useUIStore } from '@/shared/stores/ui';

defineOptions({
  name: 'CustomerDashboardView',
});

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const bookingsStore = useBookingsStore();
const uiStore = useUIStore();
const { locale } = storeToRefs(uiStore);
const localePrefix = computed(() =>
  route.params.locale === 'en' ? '/en' : '',
);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
  }).format(new Date(value));

onMounted(async () => {
  await bookingsStore.fetchBookings();
});
</script>
